const Hud = {
  el: null,
  hearts: null,
  keys: null,
  achievements: null,
  achievementBadge: null,
  codeStones: null,

  init() {
    this.el = document.getElementById("hud");
    this.hearts = document.getElementById("hud-hearts");
    this.keys = document.getElementById("hud-keys");
    this.achievements = document.getElementById("hud-achievements");
    this.achievementBadge = document.getElementById("hud-achievement-badge");
    this.codeStones = document.getElementById("hud-code-stones");
  },

  show() {
    this.el?.classList.remove("hud--hidden");
  },

  hide() {
    this.el?.classList.add("hud--hidden");
  },

  renderCodeStones(secretCode) {
    if (!this.codeStones) return;
    this.codeStones.innerHTML = secretCode
      .map(
        (ch) =>
          `<span class="hud__stone ${ch !== "_" ? "hud__stone--lit" : ""}"><span class="hud__stone-glyph">${ch}</span></span>`,
      )
      .join("");
  },

  render(state) {
    if (!this.hearts) return;
    const names = state.achievementNames || [];
    this.hearts.textContent = String(state.hearts);
    this.keys.textContent = `${state.memoryKeys}/${MAX_MEMORY_KEYS}`;
    this.achievements.textContent = String(names.length);
    this.renderCodeStones(state.secretCode);

    if (this.achievementBadge) {
      const latest = names.length ? names[names.length - 1] : "";
      this.achievementBadge.textContent = latest;
      this.achievementBadge.hidden = !latest;
      this.el?.querySelector(".hud__stat--achieve")?.setAttribute(
        "title",
        names.length ? names.join("\n") : "Achievements",
      );
    }
  },
};

window.Hud = Hud;
