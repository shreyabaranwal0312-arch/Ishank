const INTRO_LINES = [
  "Agent ISHANK,",
  "",
  "A highly secured Birthday Vault has been locked.",
  "",
  "Only one person can unlock it.",
  "",
  "You.",
  "",
  "Complete missions.",
  "Collect Memory Keys.",
  "Discover hidden clues.",
  "Unlock your final birthday reward.",
];

const Intro = {
  particlesEl: null,
  lines: [],
  lineIndex: 0,
  charIndex: 0,
  onReady: null,

  init(onReady) {
    this.onReady = onReady;
    this.particlesEl = document.getElementById("intro-particles");
    this.lines = [...document.querySelectorAll("#intro-terminal .intro__line")];
    this.spawnParticles();
    setTimeout(() => this.typeNext(), 800);
  },

  spawnParticles() {
    if (!this.particlesEl) return;
    for (let i = 0; i < 24; i++) {
      const p = document.createElement("span");
      p.className = "intro__particle";
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 4}s`;
      p.style.animationDuration = `${4 + Math.random() * 4}s`;
      this.particlesEl.appendChild(p);
    }
  },

  typeNext() {
    if (this.lineIndex >= INTRO_LINES.length) {
      this.finishTyping();
      return;
    }

    const text = INTRO_LINES[this.lineIndex];
    const el = this.lines[this.lineIndex];
    if (!el) {
      this.lineIndex++;
      this.charIndex = 0;
      this.typeNext();
      return;
    }

    el.classList.add("is-typing");

    if (this.charIndex < text.length) {
      el.textContent = text.slice(0, this.charIndex + 1);
      this.charIndex++;
      setTimeout(() => this.typeNext(), text[this.charIndex - 1] === "," ? 120 : 38);
      return;
    }

    el.classList.remove("is-typing");
    el.classList.add("is-done");
    this.lineIndex++;
    this.charIndex = 0;
    setTimeout(() => this.typeNext(), text === "" ? 80 : 280);
  },

  finishTyping() {
    const cta = document.getElementById("intro-cta");
    if (cta) cta.hidden = false;
    this.onReady?.();
  },

  playWarp(onDone) {
    const intro = document.querySelector(".intro");
    const overlay = document.getElementById("warp-overlay");
    intro?.classList.add("intro--warp");
    overlay?.classList.add("is-active");
    AudioEngine.playSfx("warp");

    setTimeout(() => {
      overlay?.classList.remove("is-active");
      onDone?.();
    }, 1200);
  },
};

window.Intro = Intro;
window.INTRO_LINES = INTRO_LINES;
