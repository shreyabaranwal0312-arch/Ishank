/** Dream Sanctuary — floating hearts, gift box, magical love book */

const DreamSanctuary = {
  getState: null,
  persist: null,
  currentPage: 0,
  bookVisible: false,
  heartTimer: null,
  _bound: false,

  init(getState, persist) {
    this.getState = getState;
    this.persist = persist;
    this.currentPage = this.getState().dreamSanctuary?.pageIndex || 0;
    this.bookVisible = !!this.getState().dreamSanctuary?.giftOpened;

    this.bindControls();
    this.spawnHearts();
    this.syncScene();

    if (this.getState().musicOn) {
      AudioEngine.startSanctuaryMusic();
    }
  },

  bindControls() {
    if (this._bound) return;
    this._bound = true;

    document.getElementById("ds-gift")?.addEventListener("click", () => {
      if (!this.getState().dreamSanctuary?.giftOpened) this.openGift();
    });

    document.getElementById("ds-page-prev")?.addEventListener("click", () => {
      this.turnPage(-1);
    });

    document.getElementById("ds-page-next")?.addEventListener("click", () => {
      this.turnPage(1);
    });
  },

  spawnHearts() {
    const layer = document.getElementById("ds-hearts");
    if (!layer) return;
    layer.innerHTML = "";

    const glyphs = ["♥", "❤", "💗", "💕"];
    for (let i = 0; i < 28; i++) {
      const h = document.createElement("span");
      h.className = "ds-heart";
      h.textContent = glyphs[i % glyphs.length];
      h.style.left = `${Math.random() * 100}%`;
      h.style.setProperty("--ds-drift", `${-20 + Math.random() * 40}px`);
      h.style.setProperty("--ds-duration", `${12 + Math.random() * 14}s`);
      h.style.animationDelay = `${Math.random() * 10}s`;
      h.style.fontSize = `${0.85 + Math.random() * 1.4}rem`;
      h.style.opacity = `${0.15 + Math.random() * 0.35}`;
      layer.appendChild(h);
    }

    if (this.heartTimer) clearInterval(this.heartTimer);
    this.heartTimer = setInterval(() => {
      if (!document.getElementById("screen-dream-sanctuary")?.classList.contains("screen--active")) return;
      const h = document.createElement("span");
      h.className = "ds-heart ds-heart--spawn";
      h.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      h.style.left = `${Math.random() * 100}%`;
      h.style.setProperty("--ds-drift", `${-15 + Math.random() * 30}px`);
      h.style.setProperty("--ds-duration", `${14 + Math.random() * 10}s`);
      h.style.fontSize = `${0.9 + Math.random() * 1.2}rem`;
      h.style.opacity = `${0.2 + Math.random() * 0.3}`;
      layer.appendChild(h);
      setTimeout(() => h.remove(), 16000);
    }, 2200);
  },

  syncScene() {
    const state = this.getState();
    const opened = state.dreamSanctuary?.giftOpened;
    const stage = document.getElementById("ds-stage");
    const gift = document.getElementById("ds-gift");
    const book = document.getElementById("ds-book");

    stage?.classList.toggle("ds-stage--book", opened);
    gift?.classList.toggle("ds-gift--hidden", opened);
    gift?.setAttribute("aria-hidden", opened ? "true" : "false");

    if (opened) {
      book?.classList.add("ds-book--visible");
      book?.setAttribute("aria-hidden", "false");
      this.renderPage(false);
      this.updateNav();
    } else {
      book?.classList.remove("ds-book--visible");
      book?.setAttribute("aria-hidden", "true");
    }
  },

  openGift() {
    const state = this.getState();
    if (state.dreamSanctuary?.giftOpened) return;

    state.dreamSanctuary = state.dreamSanctuary || { giftOpened: false, pageIndex: 0 };
    state.dreamSanctuary.giftOpened = true;
    this.persist();

    const gift = document.getElementById("ds-gift");
    const burst = document.getElementById("ds-burst");
    gift?.classList.add("ds-gift--opening");
    burst?.classList.add("ds-burst--active");

    AudioEngine.playSfx("success");

    setTimeout(() => {
      gift?.classList.add("ds-gift--hidden");
      document.getElementById("ds-stage")?.classList.add("ds-stage--book");
      const book = document.getElementById("ds-book");
      book?.classList.add("ds-book--rising", "ds-book--visible");
      book?.setAttribute("aria-hidden", "false");
      this.bookVisible = true;
      this.currentPage = 0;
      state.dreamSanctuary.pageIndex = 0;
      this.persist();
      this.renderPage(false);
      this.updateNav();
      AudioEngine.playSfx("warp");

      setTimeout(() => {
        book?.classList.remove("ds-book--rising");
        burst?.classList.remove("ds-burst--active");
      }, 1200);
    }, 1400);
  },

  buildPageHtml(page) {
    if (page.kind === "cover") {
      return `
        <div class="ds-page ds-page--cover">
          <p class="ds-page__flourish">${page.flourish}</p>
          <p class="ds-page__cover-line1">${page.line1}</p>
          <p class="ds-page__cover-line2 font-pixel">${page.line2}</p>
          <p class="ds-page__cover-hearts" aria-hidden="true">♥ ♥ ♥</p>
        </div>`;
    }

    if (page.kind === "reason") {
      return `
        <div class="ds-page ds-page--reason">
          <p class="ds-page__label">${page.label}</p>
          <h3 class="ds-page__title font-pixel">${page.title}</h3>
          <p class="ds-page__text">${page.text}</p>
        </div>`;
    }

    if (page.kind === "memory") {
      return `
        <div class="ds-page ds-page--memory">
          <p class="ds-page__label">${page.label}</p>
          <h3 class="ds-page__title font-pixel">${page.title}</h3>
          <p class="ds-page__date">${page.date}</p>
          <p class="ds-page__text">${page.text}</p>
        </div>`;
    }

    if (page.kind === "photo") {
      const img = page.src
        ? `<img class="ds-page__photo-img" src="${page.src}" alt="${page.alt || page.caption}" />`
        : `<div class="ds-page__photo-placeholder" aria-label="Photo placeholder">
            <span class="ds-page__photo-icon">📷</span>
            <p>Your photo will appear here</p>
            <p class="ds-page__photo-hint">Add path in <code>dreamSanctuaryData.js</code></p>
          </div>`;
      return `
        <div class="ds-page ds-page--photo">
          <p class="ds-page__label">${page.label}</p>
          ${img}
          <p class="ds-page__caption">${page.caption}</p>
        </div>`;
    }

    if (page.kind === "close") {
      return `
        <div class="ds-page ds-page--close">
          <h3 class="ds-page__title font-pixel">${page.title}</h3>
          <p class="ds-page__text">${page.text}</p>
          <p class="ds-page__signoff">${page.signOff}</p>
          <p class="ds-page__signature">${page.signature}</p>
        </div>`;
    }

    return "";
  },

  renderPage(animate) {
    const layer = document.getElementById("ds-page");
    const pages = LOVE_BOOK.pages;
    const page = pages[this.currentPage];
    if (!layer || !page) return;

    const html = this.buildPageHtml(page);

    if (!animate) {
      layer.innerHTML = html;
      layer.className = "ds-page-layer";
      return;
    }

    layer.classList.add("ds-page-layer--out");
    setTimeout(() => {
      layer.innerHTML = html;
      layer.classList.remove("ds-page-layer--out");
      layer.classList.add("ds-page-layer--in");
      setTimeout(() => layer.classList.remove("ds-page-layer--in"), 600);
    }, 300);
  },

  turnPage(delta) {
    const pages = LOVE_BOOK.pages;
    const next = this.currentPage + delta;
    if (next < 0 || next >= pages.length) return;

    AudioEngine.playSfx("select");
    this.currentPage = next;
    const state = this.getState();
    state.dreamSanctuary = state.dreamSanctuary || { giftOpened: true, pageIndex: 0 };
    state.dreamSanctuary.pageIndex = next;
    this.persist();
    this.renderPage(true);
    this.updateNav();
  },

  updateNav() {
    const pages = LOVE_BOOK.pages;
    const prev = document.getElementById("ds-page-prev");
    const next = document.getElementById("ds-page-next");
    const indicator = document.getElementById("ds-page-indicator");

    if (prev) prev.disabled = this.currentPage <= 0;
    if (next) next.disabled = this.currentPage >= pages.length - 1;
    if (indicator) {
      indicator.textContent = `Page ${this.currentPage + 1} of ${pages.length}`;
    }
  },

  destroy() {
    if (this.heartTimer) {
      clearInterval(this.heartTimer);
      this.heartTimer = null;
    }
    AudioEngine.stopSanctuaryMusic();
    if (this.getState?.()?.musicOn) AudioEngine.startMusic();
    document.getElementById("ds-gift")?.classList.remove("ds-gift--opening", "ds-gift--hidden");
    document.getElementById("ds-burst")?.classList.remove("ds-burst--active");
    document.getElementById("ds-book")?.classList.remove("ds-book--rising", "ds-book--visible");
  },
};

window.DreamSanctuary = DreamSanctuary;
