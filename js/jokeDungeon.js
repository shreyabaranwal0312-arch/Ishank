/** Inside Joke Dungeon — pixel corridors & meme quiz */

const JOKE_ACHIEVEMENT = "JOKE SURVIVOR";

const JokeDungeon = {
  getState: null,
  persist: null,
  completeLocation: null,
  unlockAchievement: null,
  activeGate: null,
  selectedIndex: null,
  closeTimer: null,
  _bound: false,

  init(getState, persist, completeLocation, unlockAchievement) {
    this.getState = getState;
    this.persist = persist;
    this.completeLocation = completeLocation;
    this.unlockAchievement = unlockAchievement;
    this.activeGate = null;
    this.selectedIndex = null;

    this.renderCorridor();
    this.bindControls();
    this.syncGates();
    this.updateProgress();
  },

  isGateSolved(id) {
    return this.getState().jokeDungeon.solvedGates.includes(id);
  },

  renderCorridor() {
    const gatesEl = document.getElementById("jd-gates");
    if (!gatesEl) return;

    gatesEl.innerHTML = JOKE_DUNGEON_GATES.map((gate, i) => `
      <button type="button" class="jd-gate" data-gate="${gate.id}" aria-label="${gate.label}">
        <span class="jd-gate__arch"></span>
        <span class="jd-gate__door"></span>
        <span class="jd-gate__num font-pixel">${i + 1}</span>
        <span class="jd-gate__label">${gate.label}</span>
      </button>
    `).join("");
  },

  bindControls() {
    if (this._bound) return;
    this._bound = true;

    document.getElementById("jd-gates")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".jd-gate");
      if (!btn || btn.disabled || btn.classList.contains("jd-gate--done")) return;
      AudioEngine.playSfx("select");
      this.openQuiz(btn.dataset.gate);
    });

    const backdrop = document.getElementById("jd-quiz-backdrop");
    backdrop?.addEventListener("click", (e) => {
      if (e.target.id === "jd-quiz-backdrop") this.closeQuiz();
      if (e.target.closest("[data-jd-close]")) this.closeQuiz();
    });

    document.getElementById("jd-quiz-submit")?.addEventListener("click", () => {
      this.submitAnswer();
    });

    document.getElementById("jd-quiz-options")?.addEventListener("click", (e) => {
      const opt = e.target.closest("[data-option]");
      if (opt) this.selectOption(Number(opt.dataset.option));
    });

    document.getElementById("jd-complete-continue")?.addEventListener("click", () => {
      AudioEngine.playSfx("select");
      this.hideComplete();
      App.goToMap(false);
    });

    document.getElementById("jd-fragment-continue")?.addEventListener("click", () => {
      AudioEngine.playSfx("select");
      this.hideFragment();
      this.showComplete();
    });
  },

  syncGates() {
    document.querySelectorAll(".jd-gate").forEach((btn) => {
      const solved = this.isGateSolved(btn.dataset.gate);
      btn.classList.toggle("jd-gate--done", solved);
      btn.disabled = solved;
      const num = btn.querySelector(".jd-gate__num");
      if (num && solved) num.textContent = "✓";
    });
  },

  updateProgress() {
    const n = this.getState().jokeDungeon.solvedGates.length;
    const total = JOKE_DUNGEON_GATES.length;
    const el = document.getElementById("jd-progress-text");
    if (el) el.textContent = `${n} / ${total}`;
  },

  openQuiz(gateId) {
    const gate = JOKE_DUNGEON_GATES.find((g) => g.id === gateId);
    if (!gate || this.isGateSolved(gateId)) return;

    this.activeGate = gateId;
    this.selectedIndex = null;

    const heading = document.getElementById("jd-quiz-heading");
    const question = document.getElementById("jd-quiz-question");
    const options = document.getElementById("jd-quiz-options");
    const feedback = document.getElementById("jd-quiz-feedback");
    const submit = document.getElementById("jd-quiz-submit");

    if (heading) heading.textContent = gate.label;
    if (question) question.textContent = gate.question;
    if (feedback) {
      feedback.textContent = "";
      feedback.className = "jd-quiz-card__feedback";
    }
    if (submit) submit.disabled = false;

    if (options) {
      options.innerHTML = gate.options
        .map(
          (text, idx) => `
        <button type="button" class="jd-quiz-card__option" data-option="${idx}">
          <span class="jd-quiz-card__letter font-pixel">${String.fromCharCode(65 + idx)}</span>
          <span class="jd-quiz-card__answer">${text}</span>
        </button>`,
        )
        .join("");
    }

    const backdrop = document.getElementById("jd-quiz-backdrop");
    backdrop?.classList.add("is-open");
    backdrop?.setAttribute("aria-hidden", "false");
  },

  closeQuiz() {
    const backdrop = document.getElementById("jd-quiz-backdrop");
    backdrop?.classList.remove("is-open");
    backdrop?.setAttribute("aria-hidden", "true");
    this.activeGate = null;
    this.selectedIndex = null;
  },

  selectOption(index) {
    this.selectedIndex = index;
    document.querySelectorAll(".jd-quiz-card__option").forEach((btn, i) => {
      btn.classList.toggle("jd-quiz-card__option--picked", i === index);
    });
    AudioEngine.playSfx("select");
  },

  submitAnswer() {
    const gate = JOKE_DUNGEON_GATES.find((g) => g.id === this.activeGate);
    const feedback = document.getElementById("jd-quiz-feedback");
    const submit = document.getElementById("jd-quiz-submit");
    if (!gate || !feedback) return;

    if (this.selectedIndex == null) {
      feedback.textContent = "Pick an answer — the dungeon is judging you.";
      feedback.classList.add("jd-quiz-card__feedback--show");
      return;
    }

    const isCorrect = this.selectedIndex === gate.correctIndex;

    if (!isCorrect) {
      const reaction =
        gate.wrongReactions?.[this.selectedIndex] || "Wrong answer. The meme gods shake their heads.";
      feedback.textContent = reaction.replace(/^✓\s*/, "");
      feedback.className =
        "jd-quiz-card__feedback jd-quiz-card__feedback--wrong jd-quiz-card__feedback--show";
      AudioEngine.playSfx("select");
      document.querySelectorAll(".jd-quiz-card__option").forEach((btn) => {
        btn.classList.remove("jd-quiz-card__option--picked");
      });
      this.selectedIndex = null;
      this.shakeDungeon();
      return;
    }

    if (submit) submit.disabled = true;

    const state = this.getState();
    const firstTime = !state.jokeDungeon.solvedGates.includes(gate.id);

    if (firstTime) {
      state.jokeDungeon.solvedGates.push(gate.id);
      this.persist();
    }

    const winMsg = gate.wrongReactions?.[gate.correctIndex]?.replace(/^✓\s*/, "") || "Gate cleared!";
    feedback.textContent = `${winMsg} · Progress saved`;
    feedback.className =
      "jd-quiz-card__feedback jd-quiz-card__feedback--win jd-quiz-card__feedback--show";
    AudioEngine.playSfx("success");
    this.flashTorch();

    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => {
      this.closeQuiz();
      this.syncGates();
      this.updateProgress();

      const allSolved = JOKE_DUNGEON_GATES.every((g) =>
        this.getState().jokeDungeon.solvedGates.includes(g.id),
      );

      if (allSolved) {
        this.finishDungeon();
      }
    }, 1400);
  },

  shakeDungeon() {
    const corridor = document.getElementById("jd-corridor");
    corridor?.classList.add("jd-corridor--shake");
    setTimeout(() => corridor?.classList.remove("jd-corridor--shake"), 450);
  },

  flashTorch() {
    document.querySelectorAll(".jd-torch").forEach((t) => {
      t.classList.add("jd-torch--flash");
      setTimeout(() => t.classList.remove("jd-torch--flash"), 600);
    });
  },

  finishDungeon() {
    this.unlockAchievement(JOKE_ACHIEVEMENT);

    const state = this.getState();
    if (!isCompleted(state, "joke-dungeon")) {
      this.completeLocation("joke-dungeon");
    } else {
      this.persist();
    }

    const loc = getLocation("joke-dungeon");
    const letter =
      loc?.rewards?.secretIndex != null
        ? SECRET_CODE_ANSWER[loc.rewards.secretIndex]
        : "V";

    const letterEl = document.getElementById("jd-fragment-letter");
    const codeEl = document.getElementById("jd-code-display");
    if (letterEl) letterEl.textContent = letter;
    if (codeEl) {
      codeEl.innerHTML = this.getState()
        .secretCode.map(
          (ch) =>
            `<span class="jd-code-slot ${ch !== "_" ? "jd-code-slot--lit" : ""}">${ch}</span>`,
        )
        .join("");
    }

    this.closeTimer = setTimeout(() => this.showFragment(), 400);
  },

  showFragment() {
    const overlay = document.getElementById("jd-fragment-reveal");
    overlay?.classList.add("is-open");
    overlay?.setAttribute("aria-hidden", "false");
    AudioEngine.playSfx("success");
  },

  hideFragment() {
    document.getElementById("jd-fragment-reveal")?.classList.remove("is-open");
    document.getElementById("jd-fragment-reveal")?.setAttribute("aria-hidden", "true");
  },

  showComplete() {
    const overlay = document.getElementById("jd-complete");
    overlay?.classList.add("is-open");
    overlay?.setAttribute("aria-hidden", "false");
    AudioEngine.playSfx("success");
  },

  hideComplete() {
    document.getElementById("jd-complete")?.classList.remove("is-open");
    document.getElementById("jd-complete")?.setAttribute("aria-hidden", "true");
  },

  destroy() {
    if (this.closeTimer) clearTimeout(this.closeTimer);
    this.closeQuiz();
    this.hideComplete();
    this.hideFragment();
  },
};

window.JokeDungeon = JokeDungeon;
