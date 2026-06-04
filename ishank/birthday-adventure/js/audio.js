/** Web Audio — optional music drone + UI chimes */

const AudioEngine = {
  ctx: null,
  musicNode: null,
  sanctuaryNodes: null,
  musicOn: true,
  sfxOn: true,

  init(state) {
    this.musicOn = state.musicOn !== false;
    this.sfxOn = state.sfxOn !== false;
  },

  ensureCtx() {
    if (this.ctx) return this.ctx;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    this.ctx = new Ctx();
    return this.ctx;
  },

  resume() {
    const ctx = this.ensureCtx();
    if (ctx?.state === "suspended") ctx.resume();
  },

  setMusic(on) {
    this.musicOn = on;
    if (on) this.startMusic();
    else this.stopMusic();
  },

  setSfx(on) {
    this.sfxOn = on;
  },

  startMusic() {
    if (!this.musicOn) return;
    this.stopSanctuaryMusic();
    const ctx = this.ensureCtx();
    if (!ctx) return;
    this.stopMusic();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 110;
    gain.gain.value = 0.03;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    this.musicNode = osc;
  },

  stopMusic() {
    if (this.musicNode) {
      try {
        this.musicNode.stop();
      } catch {
        /* already stopped */
      }
      this.musicNode = null;
    }
  },

  /** Soft ambient pad — dream sanctuary */
  startSanctuaryMusic() {
    if (!this.musicOn) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    this.stopMusic();
    this.stopSanctuaryMusic();
    this.resume();

    const master = ctx.createGain();
    master.gain.value = 0.045;
    master.connect(ctx.destination);

    const freqs = [65.41, 82.41, 98.0, 130.81];
    const nodes = [];

    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = f;
      g.gain.value = 0.22 + (i === 0 ? 0.15 : 0);
      osc.connect(g);
      g.connect(master);
      osc.start();
      nodes.push(osc);
    });

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.value = 0.08;
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start();
    nodes.push(lfo);

    this.sanctuaryNodes = { oscillators: nodes, master };
  },

  stopSanctuaryMusic() {
    if (!this.sanctuaryNodes) return;
    this.sanctuaryNodes.oscillators.forEach((n) => {
      try {
        n.stop();
      } catch {
        /* already stopped */
      }
    });
    this.sanctuaryNodes = null;
  },

  playSfx(type) {
    if (!this.sfxOn) return;
    const ctx = this.ensureCtx();
    if (!ctx) return;
    this.resume();
    const t = ctx.currentTime;
    const freqs =
      type === "success"
        ? [523, 659, 784]
        : type === "warp"
          ? [220, 330, 440, 550]
          : type === "locked"
            ? [180, 140]
            : type === "select"
              ? [554, 659]
              : [440, 554];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.frequency.value = f;
      g.gain.setValueAtTime(0, t + i * 0.08);
      g.gain.linearRampToValueAtTime(0.08, t + i * 0.08 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.2);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.25);
    });
  },
};

window.AudioEngine = AudioEngine;
