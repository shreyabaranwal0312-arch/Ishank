/** Random Love Machine — arcade slot room */

const LoveMachine = {
  getState: null,
  persist: null,
  completeLocation: null,
  spinning: false,
  spinTimer: null,
  _bound: false,

  init(getState, persist, completeLocation) {
    this.getState = getState;
    this.persist = persist;
    this.completeLocation = completeLocation;
    this.spinning = false;

    this.bindControls();
    this.resetReels();
    this.updateSpinCount();
  },

  bindControls() {
    if (this._bound) return;
    this._bound = true;

    document.getElementById("lm-spin-btn")?.addEventListener("click", () => {
      if (!this.spinning) this.startSpin();
    });

    document.getElementById("lm-reward-close")?.addEventListener("click", () => {
      AudioEngine.playSfx("select");
      this.hideReward();
    });
  },

  pickReward() {
    const type = LOVE_MACHINE_TYPES[Math.floor(Math.random() * LOVE_MACHINE_TYPES.length)];
    const pool = LOVE_MACHINE_REWARDS[type];
    const raw = pool.items[Math.floor(Math.random() * pool.items.length)];

    if (type === "cuteImage" && raw && typeof raw === "object") {
      return { ...pool, content: raw };
    }
    return { ...pool, content: String(raw) };
  },

  startSpin() {
    if (this.spinning) return;
    this.spinning = true;
    AudioEngine.playSfx("select");

    const btn = document.getElementById("lm-spin-btn");
    btn?.setAttribute("disabled", "true");
    btn?.classList.add("lm-spin-btn--active");

    const machine = document.getElementById("lm-machine");
    const screen = document.getElementById("lm-machine-screen");
    machine?.classList.add("lm-machine--spinning");
    screen?.classList.add("lm-machine__screen--spinning");

    const reward = this.pickReward();
    const targetIcon = reward.emoji;

    this.runReelAnimation(targetIcon, () => {
      this.finishSpin(reward);
    });
  },

  runReelAnimation(targetIcon, done) {
    const reels = document.querySelectorAll(".lm-reel__strip");
    const duration = 2400;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - t, 3);

      reels.forEach((strip, i) => {
        const offset = Math.floor(ease * 28 + i * 4 + Math.random() * 3);
        const icon = LOVE_MACHINE_REEL_ICONS[offset % LOVE_MACHINE_REEL_ICONS.length];
        strip.textContent = t > 0.88 && i === 1 ? targetIcon : icon;
      });

      if (t < 1) {
        requestAnimationFrame(tick);
      } else {
        reels.forEach((strip) => {
          strip.textContent = targetIcon;
        });
        done();
      }
    };

    requestAnimationFrame(tick);
  },

  resetReels() {
    document.querySelectorAll(".lm-reel__strip").forEach((strip, i) => {
      strip.textContent = LOVE_MACHINE_REEL_ICONS[i % LOVE_MACHINE_REEL_ICONS.length];
    });
  },

  finishSpin(reward) {
    const state = this.getState();
    state.loveMachine.spins += 1;
    const firstSpin = state.loveMachine.spins === 1;
    this.persist();

    if (firstSpin && !isCompleted(state, "love-machine")) {
      this.completeLocation("love-machine");
    }

    AudioEngine.playSfx("success");
    this.spawnFx();
    this.showReward(reward);
    this.updateSpinCount();

    const btn = document.getElementById("lm-spin-btn");
    btn?.removeAttribute("disabled");
    btn?.classList.remove("lm-spin-btn--active");

    const machine = document.getElementById("lm-machine");
    const screen = document.getElementById("lm-machine-screen");
    machine?.classList.remove("lm-machine--spinning");
    screen?.classList.remove("lm-machine__screen--spinning");
    this.spinning = false;
  },

  spawnFx() {
    const confetti = document.getElementById("lm-confetti");
    const sparkles = document.getElementById("lm-sparkles");
    if (confetti) {
      confetti.innerHTML = "";
      for (let i = 0; i < 48; i++) {
        const c = document.createElement("span");
        c.className = "lm-confetti__piece";
        c.style.left = `${Math.random() * 100}%`;
        c.style.setProperty("--lm-hue", `${Math.random() * 360}`);
        c.style.animationDelay = `${Math.random() * 0.4}s`;
        c.style.setProperty("--lm-dx", `${(Math.random() - 0.5) * 120}px`);
        confetti.appendChild(c);
      }
      setTimeout(() => {
        confetti.innerHTML = "";
      }, 2200);
    }
    if (sparkles) {
      sparkles.innerHTML = "";
      for (let i = 0; i < 20; i++) {
        const s = document.createElement("span");
        s.className = "lm-sparkle";
        s.style.left = `${20 + Math.random() * 60}%`;
        s.style.top = `${20 + Math.random() * 50}%`;
        sparkles.appendChild(s);
      }
      setTimeout(() => {
        sparkles.innerHTML = "";
      }, 1800);
    }
  },

  showReward(reward) {
    const popup = document.getElementById("lm-reward");
    const typeEl = document.getElementById("lm-reward-type");
    const body = document.getElementById("lm-reward-body");
    const imageWrap = document.getElementById("lm-reward-image");

    if (typeEl) {
      typeEl.textContent = `${reward.emoji} ${reward.label}`;
      typeEl.style.color = reward.color;
    }

    if (body) body.innerHTML = "";
    if (imageWrap) {
      imageWrap.innerHTML = "";
      imageWrap.hidden = true;
    }

    if (reward.type === "cuteImage" && typeof reward.content === "object") {
      const c = reward.content;
      if (body) {
        body.innerHTML = `<p class="lm-reward__text">${c.caption}</p>`;
      }
      if (imageWrap) {
        imageWrap.hidden = false;
        if (c.src) {
          imageWrap.innerHTML = `<img src="${c.src}" alt="${c.caption}" class="lm-reward__img" />`;
        } else {
          imageWrap.innerHTML = `
            <div class="lm-reward__img-placeholder">
              <span class="lm-reward__img-emoji">${c.emoji || "🖼️"}</span>
              <p class="lm-reward__img-hint font-pixel">ADD IMAGES in loveMachineData.js</p>
            </div>`;
        }
      }
    } else if (body) {
      body.innerHTML = `<p class="lm-reward__text">${reward.content}</p>`;
    }

    popup?.classList.add("is-open");
    popup?.setAttribute("aria-hidden", "false");
  },

  hideReward() {
    document.getElementById("lm-reward")?.classList.remove("is-open");
    document.getElementById("lm-reward")?.setAttribute("aria-hidden", "true");
  },

  updateSpinCount() {
    const el = document.getElementById("lm-spin-count");
    if (el) el.textContent = String(this.getState().loveMachine.spins);
  },

  destroy() {
    if (this.spinTimer) clearTimeout(this.spinTimer);
    this.hideReward();
    this.spinning = false;
    document.getElementById("lm-spin-btn")?.removeAttribute("disabled");
    document.getElementById("lm-machine")?.classList.remove("lm-machine--spinning");
    document.getElementById("lm-machine-screen")?.classList.remove("lm-machine__screen--spinning");
  },
};

window.LoveMachine = LoveMachine;
