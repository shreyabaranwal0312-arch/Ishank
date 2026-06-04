/** Achievement Hall — grand RPG trophy room */

const BIRTHDAY_CHAMPION_NAME = "BIRTHDAY CHAMPION";

const AchievementHall = {
  getState: null,
  persist: null,
  completeLocation: null,
  unlockAchievement: null,
  _bound: false,
  celebrateTimer: null,

  init(getState, persist, completeLocation, unlockAchievement) {
    this.getState = getState;
    this.persist = persist;
    this.completeLocation = completeLocation;
    this.unlockAchievement = unlockAchievement;
    this.renderBadges();
    this.bindControls();
    this.checkHallComplete();
  },

  renderBadges() {
    const grid = document.getElementById("ah-badges");
    if (!grid) return;
    const state = this.getState();

    grid.innerHTML = ACHIEVEMENT_BADGES.map((badge) => {
      const unlocked = badge.isUnlocked(state);
      const prog = badge.getProgress(state);
      return `
        <article class="ah-badge ${unlocked ? "ah-badge--unlocked" : "ah-badge--locked"}"
          data-badge="${badge.id}"
          tabindex="0"
          aria-label="${badge.title}${unlocked ? " — earned" : " — locked"}">
          <div class="ah-badge__pedestal" aria-hidden="true"></div>
          <div class="ah-badge__trophy">
            <span class="ah-badge__emoji">${badge.emoji}</span>
            <span class="ah-badge__cup">🏆</span>
          </div>
          <h3 class="ah-badge__title font-pixel">${badge.title}</h3>
          <div class="ah-badge__progress">
            <div class="ah-badge__progress-track">
              <div class="ah-badge__progress-fill" style="width:${prog.pct}%"></div>
            </div>
            <span class="ah-badge__pct font-pixel">${prog.pct}%</span>
          </div>
          <p class="ah-badge__hint">${badge.description}</p>
          ${unlocked ? '<span class="ah-badge__earned font-pixel">EARNED</span>' : '<span class="ah-badge__lock" aria-hidden="true">🔒</span>'}
        </article>`;
    }).join("");
  },

  bindControls() {
    if (this._bound) return;
    this._bound = true;

    document.getElementById("ah-badges")?.addEventListener("click", (e) => {
      const card = e.target.closest(".ah-badge");
      if (!card) return;
      this.pulseBadge(card);
    });

    document.getElementById("ah-badges")?.addEventListener("mouseenter", (e) => {
      const card = e.target.closest(".ah-badge");
      if (card) card.classList.add("ah-badge--hover");
    }, true);

    document.getElementById("ah-badges")?.addEventListener("mouseleave", (e) => {
      const card = e.target.closest(".ah-badge");
      if (card) card.classList.remove("ah-badge--hover");
    }, true);
  },

  pulseBadge(card) {
    if (card.classList.contains("ah-badge--unlocked")) {
      card.classList.add("ah-badge--celebrate");
      AudioEngine.playSfx("success");
      setTimeout(() => card.classList.remove("ah-badge--celebrate"), 900);
    } else {
      AudioEngine.playSfx("select");
    }
  },

  checkHallComplete() {
    const state = this.getState();
    const core = ACHIEVEMENT_BADGES.filter((b) => b.id !== "birthday-champion");
    const allCore = core.every((b) => b.isUnlocked(state));

    if (allCore && !isCompleted(state, "achievement-hall")) {
      this.completeLocation("achievement-hall");
    }

    const allEarned = ACHIEVEMENT_BADGES.every((b) => b.isUnlocked(state));
    if (allEarned) this.playHallCelebration();
  },

  playHallCelebration() {
    const hall = document.getElementById("ah-hall");
    hall?.classList.add("ah-hall--celebrate");

    const burst = document.getElementById("ah-confetti");
    if (burst) {
      burst.innerHTML = "";
      for (let i = 0; i < 40; i++) {
        const p = document.createElement("span");
        p.className = "ah-confetti__piece";
        p.style.left = `${Math.random() * 100}%`;
        p.style.setProperty("--ah-hue", `${Math.random() * 360}`);
        burst.appendChild(p);
      }
      setTimeout(() => {
        burst.innerHTML = "";
      }, 2500);
    }

    if (this.celebrateTimer) clearTimeout(this.celebrateTimer);
    this.celebrateTimer = setTimeout(() => {
      hall?.classList.remove("ah-hall--celebrate");
    }, 3000);
  },

  destroy() {
    if (this.celebrateTimer) clearTimeout(this.celebrateTimer);
    document.getElementById("ah-hall")?.classList.remove("ah-hall--celebrate");
  },
};

window.AchievementHall = AchievementHall;
window.BIRTHDAY_CHAMPION_NAME = BIRTHDAY_CHAMPION_NAME;
