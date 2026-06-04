/** Secret Valley — premium hidden-object meadow */

const SecretValley = {
  getState: null,
  persist: null,
  completeLocation: null,
  unlockAchievement: null,
  finishTimer: null,
  _bound: false,

  init(getState, persist, completeLocation, unlockAchievement) {
    this.getState = getState;
    this.persist = persist;
    this.completeLocation = completeLocation;
    this.unlockAchievement = unlockAchievement;

    document.body.classList.add("sv-active");
    this.renderTreasures();
    this.renderHotspots();
    this.bindControls();
    this.spawnAmbient();
    this.syncTreasures();
    this.syncGate();
    this.updateQuestLog();
    this.renderQuestRunes();
    this.renderQuestStones();

    const state = this.getState();
    if (
      SECRET_VALLEY_TREASURES.every((t) => state.secretValley.found.includes(t.id)) &&
      isCompleted(state, "secret-valley")
    ) {
      document.getElementById("sv-memory-gate")?.classList.add("sv-memory-gate--ready", "sv-memory-gate--open");
    }
  },

  isFound(id) {
    return this.getState().secretValley.found.includes(id);
  },

  hotspotDone(id) {
    return this.getState().secretValley.hotspotsClicked.includes(id);
  },

  renderTreasures() {
    const layer = document.getElementById("sv-treasures");
    if (!layer) return;

    layer.innerHTML = SECRET_VALLEY_TREASURES.map((t) => {
      const zoneClass = `sv-treasure-zone sv-treasure-zone--${t.zone}`;
      return `
      <div class="${zoneClass}" data-zone="${t.zone}">
        <button type="button" class="sv-treasure sv-treasure--${t.id}" data-treasure="${t.id}"
          aria-label="Search for ${t.name}">
          <span class="sv-treasure__shimmer" aria-hidden="true"></span>
          <span class="sv-treasure__object">${t.emoji}</span>
          <span class="sv-treasure__hint">${t.hint}</span>
        </button>
      </div>`;
    }).join("");
  },

  renderHotspots() {
    const layer = document.getElementById("sv-hotspots");
    if (!layer) return;

    layer.innerHTML = SECRET_VALLEY_HOTSPOTS.filter((h) => h.id !== "moon").map(
      (h) => `
      <button type="button" class="sv-hotspot sv-hotspot--${h.id}"
        data-hotspot="${h.id}"
        style="top:${h.top};left:${h.left}"
        aria-label="${h.label}"
        title="${h.label}">
        <span class="sv-hotspot__pulse" aria-hidden="true"></span>
      </button>`,
    ).join("");
  },

  spawnAmbient() {
    const fireflies = document.getElementById("sv-fireflies");
    const particles = document.getElementById("sv-particles");
    if (fireflies) {
      fireflies.innerHTML = "";
      for (let i = 0; i < 22; i++) {
        const f = document.createElement("span");
        f.className = "sv-firefly";
        f.style.left = `${8 + Math.random() * 84}%`;
        f.style.top = `${15 + Math.random() * 75}%`;
        f.style.animationDelay = `${Math.random() * 5}s`;
        f.style.animationDuration = `${3 + Math.random() * 4}s`;
        fireflies.appendChild(f);
      }
    }
    if (particles) {
      particles.innerHTML = "";
      for (let i = 0; i < 40; i++) {
        const p = document.createElement("span");
        p.className = "sv-particle";
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        p.style.animationDelay = `${Math.random() * 6}s`;
        p.style.animationDuration = `${2 + Math.random() * 4}s`;
        particles.appendChild(p);
      }
    }
  },

  bindControls() {
    if (this._bound) return;
    this._bound = true;

    document.getElementById("sv-treasures")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".sv-treasure");
      if (btn && !btn.disabled) this.collectTreasure(btn.dataset.treasure);
    });

    document.getElementById("sv-hotspots")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".sv-hotspot");
      if (btn) this.clickHotspot(btn.dataset.hotspot);
    });

    document.getElementById("sv-moon-hotspot")?.addEventListener("click", () => {
      this.clickHotspot("moon");
    });

    document.getElementById("sv-found-continue")?.addEventListener("click", () => {
      AudioEngine.playSfx("select");
      this.hideFoundPopup();
      const all = SECRET_VALLEY_TREASURES.every((t) => this.isFound(t.id));
      if (all) this.runCompletionSequence();
    });

    document.getElementById("sv-complete-continue")?.addEventListener("click", () => {
      AudioEngine.playSfx("select");
      this.hideComplete();
      App.goToMap(false);
    });
  },

  clickHotspot(id) {
    const def = SECRET_VALLEY_HOTSPOTS.find((h) => h.id === id);
    if (!def) return;

    const state = this.getState();
    const first = !this.hotspotDone(id);
    if (first) {
      state.secretValley.hotspotsClicked.push(id);
      this.persist();
    }

    AudioEngine.playSfx("select");
    this.showWhisper(def.message);

    const btn = document.querySelector(`[data-hotspot="${id}"]`);
    if (def.sparkle && btn) {
      btn.classList.add("sv-hotspot--sparked");
      const stage = document.getElementById("sv-stage");
      if (stage) {
        const sr = stage.getBoundingClientRect();
        const br = btn.getBoundingClientRect();
        this.spawnBurst(
          ((br.left + br.width / 2 - sr.left) / sr.width) * 100,
          ((br.top + br.height / 2 - sr.top) / sr.height) * 100,
          8,
        );
      }
    }
    if (def.fish) {
      document.getElementById("sv-fish")?.classList.add("sv-fish--jump");
      setTimeout(() => document.getElementById("sv-fish")?.classList.remove("sv-fish--jump"), 900);
    }
  },

  showWhisper(text) {
    const el = document.getElementById("sv-whisper");
    if (!el) return;
    el.textContent = text;
    el.classList.add("sv-whisper--show");
    clearTimeout(this._whisperTimer);
    this._whisperTimer = setTimeout(() => el.classList.remove("sv-whisper--show"), 3400);
  },

  syncTreasures() {
    document.querySelectorAll(".sv-treasure").forEach((btn) => {
      const found = this.isFound(btn.dataset.treasure);
      btn.disabled = found;
      btn.classList.toggle("sv-treasure--found", found);
      btn.closest(".sv-treasure-zone")?.classList.toggle("sv-treasure-zone--cleared", found);
    });
  },

  syncGate() {
    const gate = document.getElementById("sv-memory-gate");
    const all = SECRET_VALLEY_TREASURES.every((t) => this.isFound(t.id));
    gate?.classList.toggle("sv-memory-gate--ready", all);
    gate?.classList.toggle("sv-memory-gate--open", all && isCompleted(this.getState(), "secret-valley"));
  },

  updateQuestLog() {
    const list = document.getElementById("sv-quest-objects");
    if (!list) return;

    list.innerHTML = SECRET_VALLEY_TREASURES.map((t) => {
      const found = this.isFound(t.id);
      return `
        <li class="sv-quest-row ${found ? "sv-quest-row--done" : ""}">
          <span class="sv-quest-row__icon">${t.emoji}</span>
          <span class="sv-quest-row__name">${t.name}</span>
          <span class="sv-quest-row__mark">${found ? "✓" : "?"}</span>
        </li>`;
    }).join("");

    const n = this.getState().secretValley.found.length;
    const total = SECRET_VALLEY_TREASURES.length;
    const pct = Math.round((n / total) * 100);

    const bar = document.getElementById("sv-quest-bar-fill");
    const pctEl = document.getElementById("sv-quest-pct");
    if (bar) bar.style.width = `${pct}%`;
    if (pctEl) pctEl.textContent = `${pct}% Complete`;
  },

  renderQuestRunes() {
    const el = document.getElementById("sv-quest-runes");
    if (!el) return;
    const n = this.getState().secretValley.found.length;
    el.innerHTML = SECRET_VALLEY_RUNES.map((rune, i) => {
      const lit = i < n;
      return `<span class="sv-rune ${lit ? "sv-rune--lit" : ""}" title="Fragment ${i + 1}">${rune}</span>`;
    }).join("");
  },

  renderQuestStones() {
    const el = document.getElementById("sv-quest-stones");
    if (!el) return;
    el.innerHTML = this.getState()
      .secretCode.map(
        (ch, i) =>
          `<span class="sv-stone ${ch !== "_" ? "sv-stone--lit" : ""}" data-slot="${i}"><span class="sv-stone__glyph">${ch}</span></span>`,
      )
      .join("");
  },

  collectTreasure(id) {
    const def = SECRET_VALLEY_TREASURES.find((t) => t.id === id);
    if (!def || this.isFound(id)) return;

    const state = this.getState();
    state.secretValley.found.push(id);
    this.persist();

    AudioEngine.playSfx("success");
    this.syncTreasures();
    this.updateQuestLog();
    this.renderQuestRunes();
    this.renderQuestStones();
    Hud.render(state);

    const zone = document.querySelector(`[data-zone="${def.zone}"]`);
    const stage = document.getElementById("sv-stage");
    if (zone && stage) {
      const rect = zone.getBoundingClientRect();
      const sr = stage.getBoundingClientRect();
      this.spawnBurst(
        ((rect.left + rect.width / 2 - sr.left) / sr.width) * 100,
        ((rect.top + rect.height / 2 - sr.top) / sr.height) * 100,
        18,
      );
    }

    this.showFoundPopup(def);
    document.getElementById("sv-stage")?.classList.add("sv-stage--celebrate");
    setTimeout(() => document.getElementById("sv-stage")?.classList.remove("sv-stage--celebrate"), 700);
  },

  spawnBurst(xPercent, yPercent, count) {
    const layer = document.getElementById("sv-bursts");
    if (!layer) return;
    for (let i = 0; i < count; i++) {
      const b = document.createElement("span");
      b.className = "sv-burst";
      b.style.left = `${xPercent}%`;
      b.style.top = `${yPercent}%`;
      b.style.setProperty("--bx", `${(Math.random() - 0.5) * 80}px`);
      b.style.setProperty("--by", `${(Math.random() - 0.5) * 80}px`);
      layer.appendChild(b);
      setTimeout(() => b.remove(), 900);
    }
  },

  showFoundPopup(def) {
    const overlay = document.getElementById("sv-found-popup");
    const title = document.getElementById("sv-found-title");
    const sub = document.getElementById("sv-found-sub");
    const prog = document.getElementById("sv-found-progress");

    const n = this.getState().secretValley.found.length;
    const total = SECRET_VALLEY_TREASURES.length;

    if (title) title.textContent = `${def.emoji} ${def.name} Found!`;
    if (sub) sub.textContent = def.foundLine;
    if (prog) prog.textContent = `+1 Progress · ${n} / ${total}`;

    overlay?.classList.add("is-open");
    overlay?.setAttribute("aria-hidden", "false");
  },

  hideFoundPopup() {
    document.getElementById("sv-found-popup")?.classList.remove("is-open");
    document.getElementById("sv-found-popup")?.setAttribute("aria-hidden", "true");
  },

  runCompletionSequence() {
    const stage = document.getElementById("sv-stage");
    const gate = document.getElementById("sv-memory-gate");
    stage?.classList.add("sv-stage--finale");
    gate?.classList.add("sv-memory-gate--activating");

    AudioEngine.playSfx("success");
    this.spawnBurst(50, 42, 24);

    if (this.finishTimer) clearTimeout(this.finishTimer);
    this.finishTimer = setTimeout(() => {
      gate?.classList.add("sv-memory-gate--open");
      gate?.classList.remove("sv-memory-gate--activating");
      this.finishHunt();
    }, 2200);
  },

  finishHunt() {
    const state = this.getState();
    this.unlockAchievement(SECRET_VALLEY_ACHIEVEMENT);

    if (!isCompleted(state, "secret-valley")) {
      this.completeLocation("secret-valley");
    } else {
      this.persist();
    }

    this.syncGate();
    this.renderQuestStones();
    Hud.render(this.getState());

    if (this.finishTimer) clearTimeout(this.finishTimer);
    this.finishTimer = setTimeout(() => this.showComplete(), 600);
  },

  showComplete() {
    const letter = SECRET_CODE_ANSWER[SECRET_VALLEY_CODE_INDEX] || "L";
    const letterEl = document.getElementById("sv-complete-letter");
    const code = document.getElementById("sv-complete-stones");
    const frag = document.getElementById("sv-complete-fragment");

    if (letterEl) letterEl.textContent = letter;
    if (frag) frag.textContent = `New fragment: ${letter}`;
    if (code) {
      code.innerHTML = this.getState()
        .secretCode.map(
          (ch) =>
            `<span class="sv-stone sv-stone--lg ${ch !== "_" ? "sv-stone--lit" : ""}"><span class="sv-stone__glyph">${ch}</span></span>`,
        )
        .join("");
    }

    document.getElementById("sv-complete")?.classList.add("is-open");
    document.getElementById("sv-complete")?.setAttribute("aria-hidden", "false");
    AudioEngine.playSfx("success");
  },

  hideComplete() {
    document.getElementById("sv-complete")?.classList.remove("is-open");
    document.getElementById("sv-complete")?.setAttribute("aria-hidden", "true");
  },

  destroy() {
    document.body.classList.remove("sv-active");
    if (this.finishTimer) clearTimeout(this.finishTimer);
    if (this._whisperTimer) clearTimeout(this._whisperTimer);
    this.hideFoundPopup();
    this.hideComplete();
    document.getElementById("sv-stage")?.classList.remove("sv-stage--celebrate", "sv-stage--finale");
  },
};

window.SecretValley = SecretValley;
