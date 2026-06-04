/** Open When Library — magical letters with page turns */

const OpenWhenLibrary = {
  getState: null,
  persist: null,
  completeLocation: null,
  activeBook: null,
  currentPage: 0,
  turning: false,
  _bound: false,

  init(getState, persist, completeLocation) {
    this.getState = getState;
    this.persist = persist;
    this.completeLocation = completeLocation;
    this.activeBook = null;
    this.currentPage = 0;

    this.renderShelf();
    this.bindControls();
    this.closeReader(false);
  },

  isBookOpened(id) {
    return this.getState().openWhen.booksOpened.includes(id);
  },

  renderShelf() {
    const shelf = document.getElementById("owl-shelf");
    if (!shelf) return;

    shelf.innerHTML = OPEN_WHEN_BOOKS.map((book) => {
      const opened = this.isBookOpened(book.id);
      return `
        <button type="button" class="owl-book-spine" data-book="${book.id}"
          style="--owl-spine:${book.spine};--owl-cover:${book.cover};--owl-accent:${book.accent}"
          aria-label="${book.title}">
          <span class="owl-book-spine__glow" aria-hidden="true"></span>
          <span class="owl-book-spine__emoji">${book.emoji}</span>
          <span class="owl-book-spine__title">${book.shortTitle}</span>
          ${opened ? '<span class="owl-book-spine__ribbon font-pixel">READ</span>' : ""}
        </button>`;
    }).join("");

    const n = this.getState().openWhen.booksOpened.length;
    const prog = document.getElementById("owl-shelf-progress");
    if (prog) prog.textContent = `${n} / ${OPEN_WHEN_BOOKS.length} letters opened`;
  },

  bindControls() {
    if (this._bound) return;
    this._bound = true;

    document.getElementById("owl-shelf")?.addEventListener("click", (e) => {
      const spine = e.target.closest(".owl-book-spine");
      if (spine) this.openBook(spine.dataset.book);
    });

    document.getElementById("owl-reader-close")?.addEventListener("click", () => {
      AudioEngine.playSfx("select");
      this.closeReader(true);
    });

    document.getElementById("owl-page-prev")?.addEventListener("click", () => {
      this.turnPage(-1);
    });

    document.getElementById("owl-page-next")?.addEventListener("click", () => {
      this.turnPage(1);
    });
  },

  openBook(id) {
    const book = OPEN_WHEN_BOOKS.find((b) => b.id === id);
    if (!book) return;

    const state = this.getState();
    if (!state.openWhen.booksOpened.includes(id)) {
      state.openWhen.booksOpened.push(id);
      this.persist();
      this.renderShelf();
      this.checkAllRead();
    }

    this.activeBook = book;
    this.currentPage = 0;
    AudioEngine.playSfx("success");

    const reader = document.getElementById("owl-reader");
    const title = document.getElementById("owl-reader-title");
    reader?.classList.add("owl-reader--open");
    reader?.setAttribute("aria-hidden", "false");
    document.getElementById("owl-library")?.classList.add("owl-library--dimmed");
    if (title) title.textContent = book.title;

    this.renderPage(false);
    this.updateNav();
  },

  closeReader(playSound) {
    if (playSound) AudioEngine.playSfx("select");
    this.activeBook = null;
    this.currentPage = 0;
    document.getElementById("owl-reader")?.classList.remove("owl-reader--open");
    document.getElementById("owl-reader")?.setAttribute("aria-hidden", "true");
    document.getElementById("owl-library")?.classList.remove("owl-library--dimmed");
  },

  renderPage(animate) {
    const layer = document.getElementById("owl-page");
    const book = this.activeBook;
    if (!layer || !book) return;

    const page = book.pages[this.currentPage];
    const html = this.buildPageHtml(page, book);

    if (!animate) {
      layer.innerHTML = html;
      layer.className = "owl-page";
      return;
    }

    layer.classList.add("owl-page--turn-out");
    setTimeout(() => {
      layer.innerHTML = html;
      layer.classList.remove("owl-page--turn-out");
      layer.classList.add("owl-page--turn-in");
      setTimeout(() => layer.classList.remove("owl-page--turn-in"), 520);
    }, 280);
  },

  buildPageHtml(page, book) {
    if (page.kind === "cover") {
      return `
        <div class="owl-page__cover" style="--owl-accent:${book.accent}">
          <p class="owl-page__flourish">${page.flourish}</p>
          <p class="owl-page__cover-line1">${page.line1}</p>
          <p class="owl-page__cover-line2 font-pixel">${page.line2}</p>
          <p class="owl-page__cover-emoji">${book.emoji}</p>
        </div>`;
    }
    if (page.kind === "close") {
      const paras = page.paragraphs.map((p) => `<p class="owl-page__p">${p}</p>`).join("");
      return `
        <div class="owl-page__letter owl-page__letter--close">
          ${paras}
          <p class="owl-page__signoff">${page.signOff}</p>
          <p class="owl-page__signature">${page.signature}</p>
          <p class="owl-page__hearts" aria-hidden="true">♥ ♥ ♥</p>
        </div>`;
    }
    const paras = page.paragraphs.map((p) => `<p class="owl-page__p">${p}</p>`).join("");
    return `<div class="owl-page__letter">${paras}</div>`;
  },

  turnPage(delta) {
    if (this.turning || !this.activeBook) return;
    const next = this.currentPage + delta;
    if (next < 0 || next >= this.activeBook.pages.length) return;

    this.turning = true;
    AudioEngine.playSfx("select");
    this.currentPage = next;
    this.renderPage(true);
    this.updateNav();

    setTimeout(() => {
      this.turning = false;
    }, 560);
  },

  updateNav() {
    const book = this.activeBook;
    if (!book) return;

    const prev = document.getElementById("owl-page-prev");
    const next = document.getElementById("owl-page-next");
    const indicator = document.getElementById("owl-page-indicator");

    if (prev) prev.disabled = this.currentPage <= 0;
    if (next) next.disabled = this.currentPage >= book.pages.length - 1;
    if (indicator) {
      indicator.textContent = `Page ${this.currentPage + 1} of ${book.pages.length}`;
    }
  },

  checkAllRead() {
    const state = this.getState();
    const all = OPEN_WHEN_BOOKS.every((b) => state.openWhen.booksOpened.includes(b.id));
    if (!all) return;

    if (!isCompleted(state, "open-when")) {
      this.completeLocation("open-when");
      this.showMissionComplete();
    }
  },

  showMissionComplete() {
    const toast = document.getElementById("owl-mission-toast");
    toast?.classList.add("owl-mission-toast--show");
    setTimeout(() => toast?.classList.remove("owl-mission-toast--show"), 4200);
  },

  destroy() {
    this.closeReader(false);
  },
};

window.OpenWhenLibrary = OpenWhenLibrary;
