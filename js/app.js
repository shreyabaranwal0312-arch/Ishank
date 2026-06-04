/** Mission: Birthday Adventure — main app */

const App = {
  state: null,

  init() {
    this.state = GameStorage.load();
    Hud.init();
    Hud.render(this.state);
    AudioEngine.init(this.state);
    this.bindAudioControls();
    this.bindScreens();

    if (this.state.hasStarted) {
      this.goToMap(false);
    } else {
      Intro.init(() => this.bindStart());
    }
  },

  bindAudioControls() {
    const musicBtn = document.getElementById("btn-music");
    const sfxBtn = document.getElementById("btn-sfx");

    musicBtn?.addEventListener("click", () => {
      AudioEngine.resume();
      this.state.musicOn = !this.state.musicOn;
      musicBtn.setAttribute("aria-pressed", String(this.state.musicOn));
      AudioEngine.setMusic(this.state.musicOn);
      this.persist();
    });

    sfxBtn?.addEventListener("click", () => {
      this.state.sfxOn = !this.state.sfxOn;
      sfxBtn.setAttribute("aria-pressed", String(this.state.sfxOn));
      AudioEngine.setSfx(this.state.sfxOn);
      this.persist();
    });

    musicBtn?.setAttribute("aria-pressed", String(this.state.musicOn));
    sfxBtn?.setAttribute("aria-pressed", String(this.state.sfxOn));
  },

  bindStart() {
    document.getElementById("btn-start")?.addEventListener("click", () => {
      AudioEngine.resume();
      AudioEngine.playSfx("select");
      Intro.playWarp(() => {
        this.state.hasStarted = true;
        this.persist();
        this.goToMap(true);
      });
    });
  },

  bindScreens() {
    if (this._backMapBound) return;
    this._backMapBound = true;

    document.getElementById("app")?.addEventListener("click", (e) => {
      const btn = e.target.closest("#btn-back-map, [id$='-back-map']");
      if (!btn || btn.disabled) return;

      AudioEngine.playSfx("select");
      const screenName = btn.closest(".screen")?.dataset?.screen;

      if (screenName === "hearthaven" && typeof Hearthaven !== "undefined") {
        Hearthaven.transitionToMap();
        return;
      }

      if (screenName === "beach-chaos" && typeof BeachChaos !== "undefined") {
        BeachChaos.destroy();
      }

      this.goToMap(false);
    });
  },

  destroyActiveScreens(skip) {
    if (skip !== "hearthaven") Hearthaven.destroy();
    MemoryForest.destroy();
    BeachChaos.destroy();
    PizzaKingdom.destroy();
    JokeDungeon.destroy();
    SecretValley.destroy();
    OpenWhenLibrary.destroy();
    LoveMachine.destroy();
    AchievementHall.destroy();
    BirthdayVault.destroy();
    DreamSanctuary.destroy();
  },

  goToHearthaven(animate) {
    this.destroyActiveScreens("hearthaven");
    this.showScreen("hearthaven");
    Hud.show();
    Hud.render(this.state);
    if (this.state.musicOn) AudioEngine.startMusic();

    Hearthaven.init(
      () => this.state,
      () => this.persist(),
      (n) => this.addHeart(n),
      (id) => this.completeLocation(id),
      (anim) => this.goToMap(anim),
    );

    if (animate) AudioEngine.playSfx("success");
  },

  goToMemoryForest(animate) {
    this.destroyActiveScreens();
    this.showScreen("memory-forest");
    Hud.show();
    Hud.render(this.state);
    if (this.state.musicOn) AudioEngine.startMusic();

    MemoryForest.init(
      () => this.state,
      () => this.persist(),
      (n) => this.addHeart(n),
      (n) => this.addMemoryKey(n),
      (id) => this.completeLocation(id),
    );

    if (animate) AudioEngine.playSfx("success");
  },

  goToBeachChaos(animate) {
    this.destroyActiveScreens();
    this.showScreen("beach-chaos");
    Hud.show();
    Hud.render(this.state);
    if (this.state.musicOn) AudioEngine.startMusic();

    BeachChaos.init(
      () => this.state,
      () => this.persist(),
      (id) => this.completeLocation(id),
      (name) => this.unlockAchievement(name),
    );

    if (animate) AudioEngine.playSfx("success");
  },

  goToPizzaKingdom(animate) {
    this.destroyActiveScreens();
    this.showScreen("pizza-kingdom");
    Hud.show();
    Hud.render(this.state);
    if (this.state.musicOn) AudioEngine.startMusic();

    PizzaKingdom.init(
      () => this.state,
      () => this.persist(),
      (id) => this.completeLocation(id),
    );

    if (animate) AudioEngine.playSfx("success");
  },

  goToJokeDungeon(animate) {
    this.destroyActiveScreens();
    this.showScreen("joke-dungeon");
    Hud.show();
    Hud.render(this.state);
    if (this.state.musicOn) AudioEngine.startMusic();

    JokeDungeon.init(
      () => this.state,
      () => this.persist(),
      (id) => this.completeLocation(id),
      (name) => this.unlockAchievement(name),
    );

    if (animate) AudioEngine.playSfx("success");
  },

  goToSecretValley(animate) {
    this.destroyActiveScreens();
    this.showScreen("secret-valley");
    Hud.show();
    Hud.render(this.state);
    if (this.state.musicOn) AudioEngine.startMusic();

    SecretValley.init(
      () => this.state,
      () => this.persist(),
      (id) => this.completeLocation(id),
      (name) => this.unlockAchievement(name),
    );

    if (animate) AudioEngine.playSfx("success");
  },

  goToOpenWhenLibrary(animate) {
    this.destroyActiveScreens();
    this.showScreen("open-when");
    Hud.show();
    Hud.render(this.state);
    if (this.state.musicOn) AudioEngine.startMusic();

    OpenWhenLibrary.init(
      () => this.state,
      () => this.persist(),
      (id) => this.completeLocation(id),
    );

    if (animate) AudioEngine.playSfx("success");
  },

  goToLoveMachine(animate) {
    this.destroyActiveScreens();
    this.showScreen("love-machine");
    Hud.show();
    Hud.render(this.state);
    if (this.state.musicOn) AudioEngine.startMusic();

    LoveMachine.init(
      () => this.state,
      () => this.persist(),
      (id) => this.completeLocation(id),
    );

    if (animate) AudioEngine.playSfx("success");
  },

  goToAchievementHall(animate) {
    this.destroyActiveScreens();
    this.showScreen("achievement-hall");
    Hud.show();
    Hud.render(this.state);
    if (this.state.musicOn) AudioEngine.startMusic();

    AchievementHall.init(
      () => this.state,
      () => this.persist(),
      (id) => this.completeLocation(id),
      (name) => this.unlockAchievement(name),
    );

    if (animate) AudioEngine.playSfx("success");
  },

  goToBirthdayVault(animate) {
    this.destroyActiveScreens();
    this.showScreen("birthday-vault");
    Hud.show();
    Hud.render(this.state);
    if (this.state.musicOn) AudioEngine.startMusic();

    BirthdayVault.init(
      () => this.state,
      () => this.persist(),
      (id) => this.completeLocation(id),
      (name) => this.unlockAchievement(name),
    );

    if (animate) AudioEngine.playSfx("success");
  },

  goToDreamSanctuary(animate) {
    this.destroyActiveScreens();
    this.showScreen("dream-sanctuary");
    Hud.hide();

    DreamSanctuary.init(() => this.state, () => this.persist());

    if (animate) AudioEngine.playSfx("success");
  },

  goToMap(animate) {
    this.destroyActiveScreens();
    this.showScreen("map");
    Hud.show();
    Hud.render(this.state);
    Hud.syncHeight();
    if (this.state.musicOn) AudioEngine.startMusic();

    MapScreen.init(
      () => this.state,
      (loc) => this.openLocation(loc),
    );

    if (animate) AudioEngine.playSfx("success");
  },

  showScreen(name) {
    document.body.classList.toggle("app--world-map", name === "map");
    document.querySelectorAll(".screen").forEach((s) => {
      s.classList.remove("screen--active", "screen--exit");
      if (s.dataset.screen === name) {
        s.classList.add("screen--active");
      } else if (s.classList.contains("screen--active")) {
        s.classList.add("screen--exit");
      }
    });
  },

  openLocation(loc) {
    if (loc.id === "hearthaven" || loc.isHome) {
      this.goToHearthaven(false);
      return;
    }

    if (loc.id === "memory-forest") {
      if (!isUnlocked(this.state, loc.id)) return;
      this.goToMemoryForest(false);
      return;
    }

    if (loc.id === "beach-chaos") {
      if (!isUnlocked(this.state, loc.id)) return;
      this.goToBeachChaos(false);
      return;
    }

    if (loc.id === "pizza-kingdom") {
      if (!isUnlocked(this.state, loc.id)) return;
      this.goToPizzaKingdom(false);
      return;
    }

    if (loc.id === "joke-dungeon") {
      if (!isUnlocked(this.state, loc.id)) return;
      this.goToJokeDungeon(false);
      return;
    }

    if (loc.id === "secret-valley") {
      if (!isUnlocked(this.state, loc.id)) return;
      this.goToSecretValley(false);
      return;
    }

    if (loc.id === "open-when") {
      if (!isUnlocked(this.state, loc.id)) return;
      this.goToOpenWhenLibrary(false);
      return;
    }

    if (loc.id === "love-machine") {
      if (!isUnlocked(this.state, loc.id)) return;
      this.goToLoveMachine(false);
      return;
    }

    if (loc.id === "achievement-hall") {
      if (!isUnlocked(this.state, loc.id)) return;
      this.goToAchievementHall(false);
      return;
    }

    if (loc.id === "birthday-vault") {
      if (!isUnlocked(this.state, loc.id)) return;
      this.goToBirthdayVault(false);
      return;
    }

    this.showScreen("location");
    MapScreen.hideTooltip?.();
    document.getElementById("location-title").textContent = `${loc.emoji} ${loc.name}`;
    document.getElementById("location-tagline").textContent = loc.tagline;
    const done = isCompleted(this.state, loc.id);
    document.getElementById("location-status").textContent = done
      ? "✓ Mission cleared — content coming soon"
      : "Mission build in progress — placeholders ready for your memories";
  },

  addHeart(amount) {
    if (amount <= 0) return;
    this.state.hearts += amount;
    this.persist();
  },

  addMemoryKey(amount) {
    if (amount <= 0) return;
    this.state.memoryKeys = Math.min(
      MAX_MEMORY_KEYS,
      this.state.memoryKeys + amount,
    );
    this.persist();
  },

  unlockAchievement(name) {
    if (!name) return;
    if (!this.state.achievementNames) this.state.achievementNames = [];
    if (!this.state.achievementNames.includes(name)) {
      this.state.achievementNames.push(name);
      this.state.achievements = this.state.achievementNames.length;
      this.persist();
    }
  },

  persist() {
    GameStorage.save(this.state);
    Hud.render(this.state);
  },

  completeLocation(id) {
    if (this.state.completedLocations.includes(id)) return;
    const loc = getLocation(id);
    if (!loc || !isUnlocked(this.state, id)) return;

    const r = loc.rewards || {};
    this.state.hearts += r.hearts || 0;
    this.state.memoryKeys = Math.min(
      MAX_MEMORY_KEYS,
      this.state.memoryKeys + (r.keys || 0),
    );

    if (r.achievements) {
      this.state.achievements += r.achievements;
    }

    if (r.secretIndex != null && SECRET_CODE_ANSWER[r.secretIndex]) {
      this.state.secretCode[r.secretIndex] = SECRET_CODE_ANSWER[r.secretIndex];
    }

    this.state.completedLocations.push(id);
    this.state.achievements = (this.state.achievementNames || []).length;
    this.persist();
    AudioEngine.playSfx("success");
  },
};

document.addEventListener("DOMContentLoaded", () => App.init());

window.App = App;
