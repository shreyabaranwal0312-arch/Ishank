/** Pizza Kingdom — drag-and-drop matching */

const PizzaKingdom = {
  getState: null,
  persist: null,
  completeLocation: null,
  dragEl: null,
  dragAnswerId: null,
  pointerId: null,
  _bound: false,

  init(getState, persist, completeLocation) {
    this.getState = getState;
    this.persist = persist;
    this.completeLocation = completeLocation;
    this.renderBoard();
    this.bindControls();
    this.updateProgress();

    const state = this.getState();
    const allMatched = PIZZA_KINGDOM_MATCHES.every((m) =>
      state.pizzaKingdom?.matched?.includes(m.id),
    );
    if (allMatched && !isCompleted(state, "pizza-kingdom")) {
      this.finishKingdom();
    }
  },

  bindControls() {
    if (this._bound) return;
    this._bound = true;

    document.getElementById("pk-fragment-continue")?.addEventListener("click", () => {
      AudioEngine.playSfx("select");
      this.hideFragmentReveal();
      App.goToMap(false);
    });

    const pool = document.getElementById("pk-answers");
    pool?.addEventListener("pointerdown", (e) => this.onDragStart(e));
    window.addEventListener("pointermove", (e) => this.onDragMove(e));
    window.addEventListener("pointerup", (e) => this.onDragEnd(e));
    window.addEventListener("pointercancel", (e) => this.onDragEnd(e));
  },

  renderBoard() {
    const zones = document.getElementById("pk-zones");
    const answers = document.getElementById("pk-answers");
    if (!zones || !answers) return;

    const matched = this.getState().pizzaKingdom?.matched || [];

    zones.innerHTML = PIZZA_KINGDOM_MATCHES.map((m) => {
      const done = matched.includes(m.id);
      const filled = done
        ? `<span class="pk-zone__filled">${m.answerEmoji} ${m.answerLabel}</span>`
        : `<span class="pk-zone__hint">Drop here</span>`;
      return `
        <div class="pk-zone ${done ? "pk-zone--done" : ""}" data-category="${m.id}" data-accepts="${m.answerId}">
          <span class="pk-zone__emoji">${m.categoryEmoji}</span>
          <span class="pk-zone__label font-pixel">${m.category}</span>
          <div class="pk-zone__slot">${filled}</div>
        </div>`;
    }).join("");

    const usedAnswers = new Set(
      PIZZA_KINGDOM_MATCHES.filter((m) => matched.includes(m.id)).map((m) => m.answerId),
    );

    const visibleChips = PIZZA_ANSWER_CHIPS.filter((c) => {
      if (PIZZA_CORRECT_IDS.has(c.id)) return !usedAnswers.has(c.id);
      return true;
    });

    answers.innerHTML = this.shuffle(visibleChips)
      .map(
        (c) => `
      <div class="pk-chip" data-answer="${c.id}" draggable="false">
        <span class="pk-chip__emoji">${c.emoji}</span>
        <span class="pk-chip__label">${c.label}</span>
      </div>`,
      )
      .join("");
  },

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  updateProgress() {
    const matched = this.getState().pizzaKingdom?.matched || [];
    const el = document.getElementById("pk-progress");
    if (el) el.textContent = `${matched.length} / 4 Matches`;
  },

  onDragStart(e) {
    const chip = e.target.closest(".pk-chip");
    if (!chip || chip.classList.contains("pk-chip--dragging")) return;
    e.preventDefault();
    this.dragAnswerId = chip.dataset.answer;
    this.pointerId = e.pointerId;
    chip.setPointerCapture?.(e.pointerId);

    const ghost = chip.cloneNode(true);
    ghost.classList.add("pk-chip--ghost");
    ghost.id = "pk-drag-ghost";
    document.body.appendChild(ghost);
    this.dragEl = ghost;
    chip.classList.add("pk-chip--dragging");
    this.moveGhost(e.clientX, e.clientY);
    AudioEngine.playSfx("select");
  },

  onDragMove(e) {
    if (!this.dragEl || e.pointerId !== this.pointerId) return;
    this.moveGhost(e.clientX, e.clientY);
    const zone = this.zoneUnder(e.clientX, e.clientY);
    document.querySelectorAll(".pk-zone").forEach((z) => {
      z.classList.toggle("pk-zone--hover", zone && z === zone);
    });
  },

  onDragEnd(e) {
    if (!this.dragEl || e.pointerId !== this.pointerId) return;

    const chip = document.querySelector(`.pk-chip[data-answer="${this.dragAnswerId}"]`);
    chip?.classList.remove("pk-chip--dragging");
    chip?.releasePointerCapture?.(e.pointerId);

    const zone = this.zoneUnder(e.clientX, e.clientY);
    document.querySelectorAll(".pk-zone").forEach((z) => z.classList.remove("pk-zone--hover"));

    if (zone) {
      this.tryMatch(zone, this.dragAnswerId);
    }

    this.dragEl.remove();
    this.dragEl = null;
    this.dragAnswerId = null;
    this.pointerId = null;
  },

  moveGhost(x, y) {
    if (!this.dragEl) return;
    this.dragEl.style.left = `${x}px`;
    this.dragEl.style.top = `${y}px`;
  },

  zoneUnder(x, y) {
    const el = document.elementFromPoint(x, y);
    return el?.closest(".pk-zone:not(.pk-zone--done)");
  },

  tryMatch(zone, answerId) {
    const categoryId = zone.dataset.category;
    const accepts = zone.dataset.accepts;
    const match = PIZZA_KINGDOM_MATCHES.find((m) => m.id === categoryId);
    if (!match) return;

    if (answerId !== accepts) {
      this.toast("Try Again ❤️ — that's not the right match!");
      zone.classList.add("pk-zone--shake");
      setTimeout(() => zone.classList.remove("pk-zone--shake"), 500);
      AudioEngine.playSfx("select");
      return;
    }

    const state = this.getState();
    if (!state.pizzaKingdom) state.pizzaKingdom = { matched: [] };
    if (state.pizzaKingdom.matched.includes(categoryId)) return;

    state.pizzaKingdom.matched.push(categoryId);
    this.persist();

    zone.classList.add("pk-zone--done", "pk-zone--pop");
    this.showFragmentShard(match);
    AudioEngine.playSfx("success");

    this.renderBoard();
    this.updateProgress();

    const allDone = PIZZA_KINGDOM_MATCHES.every((m) =>
      state.pizzaKingdom.matched.includes(m.id),
    );

    if (allDone) {
      setTimeout(() => this.finishKingdom(), 1200);
    }
  },

  showFragmentShard(match) {
    const loc = getLocation("pizza-kingdom");
    const letter =
      loc?.rewards?.secretIndex != null
        ? SECRET_CODE_ANSWER[loc.rewards.secretIndex]
        : "O";

    const toast = document.getElementById("pk-toast");
    if (toast) {
      toast.innerHTML = `
        <p class="pk-toast__title">✨ Fragment shimmer!</p>
        <p class="pk-toast__text"><strong>${match.category}</strong> → ${match.answerLabel}</p>
        <p class="pk-toast__code">Code energy: <span class="pk-toast__letter">${letter}</span></p>`;
      toast.classList.add("pk-toast--show");
      setTimeout(() => toast.classList.remove("pk-toast--show"), 2800);
    }
  },

  finishKingdom() {
    const state = this.getState();
    const loc = getLocation("pizza-kingdom");
    const letter =
      loc?.rewards?.secretIndex != null
        ? SECRET_CODE_ANSWER[loc.rewards.secretIndex]
        : "O";

    if (!isCompleted(state, "pizza-kingdom")) {
      this.completeLocation("pizza-kingdom");
    } else {
      this.persist();
    }

    const fragment = document.getElementById("pk-fragment-letter");
    const code = document.getElementById("pk-code-display");
    if (fragment) fragment.textContent = letter;
    if (code) {
      code.innerHTML = state.secretCode
        .map(
          (ch) =>
            `<span class="pk-code-slot ${ch !== "_" ? "pk-code-slot--lit" : ""}">${ch}</span>`,
        )
        .join("");
    }

    const overlay = document.getElementById("pk-fragment-reveal");
    overlay?.classList.add("is-open");
    overlay?.setAttribute("aria-hidden", "false");
    AudioEngine.playSfx("success");
  },

  hideFragmentReveal() {
    const overlay = document.getElementById("pk-fragment-reveal");
    overlay?.classList.remove("is-open");
    overlay?.setAttribute("aria-hidden", "true");
  },

  toast(msg) {
    const el = document.getElementById("pk-toast");
    if (!el) return;
    el.innerHTML = `<p class="pk-toast__text">${msg}</p>`;
    el.classList.add("pk-toast--show");
    setTimeout(() => el.classList.remove("pk-toast--show"), 2500);
  },

  destroy() {
    this.hideFragmentReveal();
    if (this.dragEl) {
      this.dragEl.remove();
      this.dragEl = null;
    }
    document.getElementById("pk-toast")?.classList.remove("pk-toast--show");
  },
};

window.PizzaKingdom = PizzaKingdom;
