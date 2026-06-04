/** Memory Forest — enchanted forest quiz level */

const MemoryForest = {
  getState: null,
  persist: null,
  addHeart: null,
  addMemoryKey: null,
  completeLocation: null,
  activeOrb: null,
  selectedIndex: null,
  rewardTimer: null,

  init(getState, persist, addHeart, addMemoryKey, completeLocation) {
    this.getState = getState;
    this.persist = persist;
    this.addHeart = addHeart;
    this.addMemoryKey = addMemoryKey;
    this.completeLocation = completeLocation;
    this.activeOrb = null;
    this.selectedIndex = null;

    this.resetAmbient();
    this.spawnFireflies();
    this.spawnFog();
    this.bindControls();
    this.syncOrbs();
    this.updateProgress();

    const state = this.getState();
    const allDone = MEMORY_FOREST_ORBS.every((o) =>
      state.memoryForest.solvedOrbs.includes(o.id),
    );
    if (allDone && isCompleted(state, "memory-forest")) {
      /* already finished — no auto popup */
    }
  },

  resetAmbient() {
    const ff = document.getElementById("mf-fireflies");
    const fog = document.getElementById("mf-fog");
    if (ff) ff.innerHTML = "";
    if (fog) fog.innerHTML = "";
  },

  spawnFireflies() {
    const el = document.getElementById("mf-fireflies");
    if (!el) return;
    for (let i = 0; i < 24; i++) {
      const f = document.createElement("span");
      f.className = "mf-firefly";
      f.style.left = `${Math.random() * 100}%`;
      f.style.top = `${10 + Math.random() * 80}%`;
      f.style.animationDelay = `${Math.random() * 5}s`;
      f.style.animationDuration = `${2.5 + Math.random() * 3}s`;
      el.appendChild(f);
    }
  },

  spawnFog() {
    const el = document.getElementById("mf-fog");
    if (!el) return;
    for (let i = 1; i <= 4; i++) {
      const layer = document.createElement("div");
      layer.className = `mf-fog__layer mf-fog__layer--${i}`;
      el.appendChild(layer);
    }
  },

  bindControls() {
    if (this._controlsBound) return;
    this._controlsBound = true;

    document.getElementById("mf-quiz-orbs")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".mf-quiz-orb");
      if (!btn || btn.disabled || btn.classList.contains("mf-quiz-orb--done")) return;
      AudioEngine.playSfx("select");
      this.openQuiz(btn.dataset.orb);
    });

    const backdrop = document.getElementById("mf-quiz-backdrop");
    backdrop?.addEventListener("click", (e) => {
      if (e.target.id === "mf-quiz-backdrop") this.closeQuiz();
      if (e.target.closest("[data-mf-close]")) this.closeQuiz();
    });

    document.getElementById("mf-quiz-submit")?.addEventListener("click", () => {
      this.submitAnswer();
    });

    document.getElementById("mf-quiz-options")?.addEventListener("click", (e) => {
      const opt = e.target.closest("[data-option]");
      if (opt) this.selectOption(Number(opt.dataset.option));
    });

    document.getElementById("mf-complete-continue")?.addEventListener("click", () => {
      AudioEngine.playSfx("select");
      this.hideComplete();
      App.goToMap(false);
    });
  },

  isOrbSolved(id) {
    return this.getState().memoryForest.solvedOrbs.includes(id);
  },

  syncOrbs() {
    document.querySelectorAll(".mf-quiz-orb").forEach((btn) => {
      const solved = this.isOrbSolved(btn.dataset.orb);
      btn.classList.toggle("mf-quiz-orb--done", solved);
      btn.disabled = solved;
      const num = btn.querySelector(".mf-quiz-orb__num");
      if (num && solved) num.textContent = "✓";
    });
  },

  updateProgress() {
    const n = this.getState().memoryForest.solvedOrbs.length;
    const el = document.getElementById("mf-progress-text");
    if (el) el.textContent = String(n);
  },

  openQuiz(orbId) {
    const orb = MEMORY_FOREST_ORBS.find((o) => o.id === orbId);
    if (!orb || this.isOrbSolved(orbId)) return;

    this.activeOrb = orbId;
    this.selectedIndex = null;

    const heading = document.getElementById("mf-quiz-heading");
    const question = document.getElementById("mf-quiz-question");
    const options = document.getElementById("mf-quiz-options");
    const feedback = document.getElementById("mf-quiz-feedback");
    const submit = document.getElementById("mf-quiz-submit");

    if (heading) heading.textContent = orb.label;
    if (question) question.textContent = orb.question;
    if (feedback) {
      feedback.textContent = "";
      feedback.innerHTML = "";
      feedback.className = "mf-quiz-card__feedback";
    }
    if (submit) submit.disabled = false;

    if (options) {
      options.innerHTML = orb.options
        .map(
          (text, idx) => `
        <button type="button" class="mf-quiz-card__option" data-option="${idx}">
          <span class="mf-quiz-card__letter font-pixel">${String.fromCharCode(65 + idx)}</span>
          <span class="mf-quiz-card__answer">${text}</span>
        </button>`,
        )
        .join("");
    }

    const backdrop = document.getElementById("mf-quiz-backdrop");
    backdrop?.classList.add("is-open");
    backdrop?.setAttribute("aria-hidden", "false");
  },

  closeQuiz() {
    const backdrop = document.getElementById("mf-quiz-backdrop");
    backdrop?.classList.remove("is-open");
    backdrop?.setAttribute("aria-hidden", "true");
    this.activeOrb = null;
    this.selectedIndex = null;
  },

  selectOption(index) {
    this.selectedIndex = index;
    document.querySelectorAll(".mf-quiz-card__option").forEach((btn, i) => {
      btn.classList.toggle("mf-quiz-card__option--picked", i === index);
    });
    AudioEngine.playSfx("select");
  },

  submitAnswer() {
    const orb = MEMORY_FOREST_ORBS.find((o) => o.id === this.activeOrb);
    const feedback = document.getElementById("mf-quiz-feedback");
    const submit = document.getElementById("mf-quiz-submit");
    if (!orb || !feedback) return;

    if (this.selectedIndex == null) {
      feedback.textContent = "Pick one of the four options.";
      feedback.classList.add("mf-quiz-card__feedback--show");
      return;
    }

    const isCorrect =
      orb.allAnswersCorrect || this.selectedIndex === orb.correctIndex;

    if (!isCorrect) {
      feedback.textContent = "Try Again ❤️";
      feedback.className = "mf-quiz-card__feedback mf-quiz-card__feedback--wrong mf-quiz-card__feedback--show";
      AudioEngine.playSfx("select");
      document.querySelectorAll(".mf-quiz-card__option").forEach((btn) => {
        btn.classList.remove("mf-quiz-card__option--picked");
      });
      this.selectedIndex = null;
      return;
    }

    if (submit) submit.disabled = true;

    const state = this.getState();
    const firstTime = !state.memoryForest.solvedOrbs.includes(orb.id);
    const hearts = orb.heartsReward ?? 2;
    const keys = orb.keysReward ?? 1;

    if (firstTime) {
      state.memoryForest.solvedOrbs.push(orb.id);
      this.addHeart(hearts);
      this.addMemoryKey(keys);
      this.persist();
    }

    if (orb.winMessageHtml) {
      feedback.innerHTML = orb.winMessageHtml;
      feedback.className = "mf-quiz-card__feedback mf-quiz-card__feedback--golden mf-quiz-card__feedback--show";
    } else {
      feedback.textContent = `+${hearts} Hearts · +${keys} Memory Key`;
      feedback.className = "mf-quiz-card__feedback mf-quiz-card__feedback--win mf-quiz-card__feedback--show";
    }

    AudioEngine.playSfx("success");
    this.playSceneReward();

    const closeDelay = orb.winMessageHtml ? 4200 : 1600;
    if (this.rewardTimer) clearTimeout(this.rewardTimer);
    this.rewardTimer = setTimeout(() => {
      this.closeQuiz();
      this.syncOrbs();
      this.updateProgress();

      const allSolved = MEMORY_FOREST_ORBS.every((o) =>
        this.getState().memoryForest.solvedOrbs.includes(o.id),
      );

      if (allSolved) {
        if (!isCompleted(this.getState(), "memory-forest")) {
          this.completeLocation("memory-forest");
        }
        this.rewardTimer = setTimeout(() => this.showComplete(), 2200);
      }
    }, closeDelay);
  },

  playSceneReward() {
    const layer = document.getElementById("mf-scene-reward");
    if (!layer) return;
    layer.innerHTML = "";
    layer.setAttribute("aria-hidden", "false");
    layer.classList.add("mf-scene-reward--active");

    for (let i = 0; i < 14; i++) {
      const h = document.createElement("span");
      h.className = "mf-scene-reward__heart";
      h.textContent = "♥";
      h.style.left = `${35 + Math.random() * 30}%`;
      h.style.top = `${30 + Math.random() * 35}%`;
      h.style.animationDelay = `${i * 0.05}s`;
      layer.appendChild(h);
    }

    const keyWrap = document.createElement("div");
    keyWrap.className = "mf-scene-reward__key";
    keyWrap.innerHTML = `
      <div class="mf-golden-key mf-golden-key--small">
        <span class="mf-golden-key__bow"></span>
        <span class="mf-golden-key__shaft"></span>
        <span class="mf-golden-key__teeth"></span>
        <span class="mf-golden-key__shine"></span>
      </div>`;
    layer.appendChild(keyWrap);

    if (this.rewardTimer) clearTimeout(this.rewardTimer);
    this.rewardTimer = setTimeout(() => {
      layer.classList.remove("mf-scene-reward--active");
      layer.innerHTML = "";
      layer.setAttribute("aria-hidden", "true");
    }, 2000);
  },

  showComplete() {
    const overlay = document.getElementById("mf-complete");
    overlay?.classList.add("is-open");
    overlay?.setAttribute("aria-hidden", "false");
    AudioEngine.playSfx("success");
  },

  hideComplete() {
    document.getElementById("mf-complete")?.classList.remove("is-open");
    document.getElementById("mf-complete")?.setAttribute("aria-hidden", "true");
  },

  destroy() {
    if (this.rewardTimer) clearTimeout(this.rewardTimer);
    this.closeQuiz();
    this.hideComplete();
    const layer = document.getElementById("mf-scene-reward");
    if (layer) {
      layer.classList.remove("mf-scene-reward--active");
      layer.innerHTML = "";
    }
  },
};

window.MemoryForest = MemoryForest;
