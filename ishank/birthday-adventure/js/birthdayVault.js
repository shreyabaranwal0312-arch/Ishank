/** Birthday Vault — final boss unlock sequence */

const BirthdayVault = {
  getState: null,
  persist: null,
  completeLocation: null,
  unlockAchievement: null,
  unlocking: false,
  _bound: false,

  init(getState, persist, completeLocation, unlockAchievement) {
    this.getState = getState;
    this.persist = persist;
    this.completeLocation = completeLocation;
    this.unlockAchievement = unlockAchievement;
    this.unlocking = false;

    this.renderRequirements();
    this.syncDoorState();
    this.bindControls();

    if (isCompleted(this.getState(), "birthday-vault")) {
      const status = document.getElementById("bv-status");
      if (status) status.textContent = "VAULT UNLOCKED";
      this.showSanctuaryEntry();
    }
  },

  showSanctuaryEntry() {
    const entry = document.getElementById("bv-sanctuary-entry");
    entry?.classList.add("is-visible");
    entry?.setAttribute("aria-hidden", "false");
  },

  renderRequirements() {
    const list = document.getElementById("bv-requirements");
    if (!list || typeof getVaultProgress !== "function") return;

    const p = getVaultProgress(this.getState());
    const rows = [
      { key: "hearts", label: "Hearts", icon: "❤️", ...p.hearts },
      { key: "keys", label: "Memory Keys", icon: "🗝", ...p.keys },
      { key: "code", label: "Secret Code Complete", icon: "📜", ...p.secretCode },
      { key: "areas", label: "All Areas Completed", icon: "🗺", ...p.areas },
    ];

    list.innerHTML = rows
      .map((r) => {
        const detail =
          r.key === "code"
            ? r.done
              ? r.display
              : r.display
            : `${r.current} / ${r.required}`;
        return `
        <li class="bv-req ${r.done ? "bv-req--done" : ""}">
          <span class="bv-req__icon">${r.icon}</span>
          <span class="bv-req__label">${r.label}</span>
          <span class="bv-req__value font-pixel">${detail}</span>
          <span class="bv-req__check">${r.done ? "✓" : "—"}</span>
        </li>`;
      })
      .join("");

    const btn = document.getElementById("bv-unlock-btn");
    const ready = canEnterVault(this.getState());
    if (btn) {
      btn.disabled = !ready || this.unlocking || isCompleted(this.getState(), "birthday-vault");
      btn.textContent = isCompleted(this.getState(), "birthday-vault")
        ? "VAULT OPENED"
        : ready
          ? "BEGIN UNLOCK SEQUENCE"
          : "REQUIREMENTS NOT MET";
    }
  },

  syncDoorState() {
    const door = document.getElementById("bv-vault");
    const done = isCompleted(this.getState(), "birthday-vault");
    door?.classList.toggle("bv-vault--open", done);
    door?.classList.remove("bv-vault--shaking", "bv-vault--unlocking");
  },

  bindControls() {
    if (this._bound) return;
    this._bound = true;

    document.getElementById("bv-unlock-btn")?.addEventListener("click", () => {
      if (canEnterVault(this.getState()) && !this.unlocking) {
        this.startUnlockSequence();
      }
    });

    document.getElementById("bv-enter-sanctuary")?.addEventListener("click", () => {
      AudioEngine.playSfx("select");
      if (typeof App !== "undefined") App.goToDreamSanctuary(true);
    });
  },

  startUnlockSequence() {
    if (this.unlocking || !canEnterVault(this.getState())) return;
    this.unlocking = true;

    const vault = document.getElementById("bv-vault");
    const status = document.getElementById("bv-status");
    const btn = document.getElementById("bv-unlock-btn");

    btn?.setAttribute("disabled", "true");
    vault?.classList.add("bv-vault--shaking");
    if (status) {
      status.textContent = "UNLOCKING...";
      status.classList.add("bv-status--active");
    }

    AudioEngine.playSfx("select");
    this.spawnParticles();

    setTimeout(() => {
      vault?.classList.remove("bv-vault--shaking");
      vault?.classList.add("bv-vault--unlocking");
      document.querySelectorAll(".bv-chain").forEach((c) => c.classList.add("bv-chain--break"));
      AudioEngine.playSfx("success");
    }, 1600);

    setTimeout(() => {
      vault?.classList.add("bv-vault--open");
      vault?.classList.remove("bv-vault--unlocking");
      if (status) status.textContent = "VAULT UNLOCKED";
      this.finishUnlock();
    }, 4200);
  },

  spawnParticles() {
    const el = document.getElementById("bv-particles");
    if (!el) return;
    el.innerHTML = "";
    for (let i = 0; i < 50; i++) {
      const p = document.createElement("span");
      p.className = "bv-particle";
      p.style.left = `${30 + Math.random() * 40}%`;
      p.style.top = `${20 + Math.random() * 50}%`;
      p.style.animationDelay = `${Math.random() * 1.5}s`;
      el.appendChild(p);
    }
  },

  finishUnlock() {
    const state = this.getState();

    if (!isCompleted(state, "birthday-vault")) {
      this.completeLocation("birthday-vault");
    }

    if (!(state.achievementNames || []).includes(BIRTHDAY_CHAMPION_NAME)) {
      this.unlockAchievement(BIRTHDAY_CHAMPION_NAME);
    }

    this.persist();
    this.renderRequirements();
    this.syncDoorState();
    this.unlocking = false;
    AudioEngine.playSfx("success");

    this.showSanctuaryEntry();

    setTimeout(() => {
      if (typeof App !== "undefined") App.goToDreamSanctuary(true);
    }, 2200);
  },

  destroy() {
    this.unlocking = false;
    document.getElementById("bv-vault")?.classList.remove(
      "bv-vault--shaking",
      "bv-vault--unlocking",
    );
    document.getElementById("bv-sanctuary-entry")?.classList.remove("is-visible");
  },
};

window.BirthdayVault = BirthdayVault;
