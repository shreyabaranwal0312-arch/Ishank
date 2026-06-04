/** Hearthaven Cottage — explorable home village */

const Hearthaven = {
  getState: null,
  persist: null,
  addHeart: null,
  completeLocation: null,
  goToMap: null,
  catEl: null,
  catTimer: null,

  init(getState, persist, addHeart, completeLocation, goToMap) {
    this.getState = getState;
    this.persist = persist;
    this.addHeart = addHeart;
    this.completeLocation = completeLocation;
    this.goToMap = goToMap;

    this.spawnParticles();
    this.spawnFireflies();
    this.bindHotspots();
    this.bindBackMap();
    this.initCat();
    this.markFoundHotspots();
  },

  bindBackMap() {
    /* Back navigation handled centrally in App.bindScreens → transitionToMap */
  },

  tapMessage(action) {
    if (action === "cat") return null;
    if (action.startsWith("secret-")) {
      const id = action.replace("secret-", "");
      const secret = HEARTHAVEN_HIDDEN.find((s) => s.id === id);
      return secret?.message || "You found something special here.";
    }
    if (action.startsWith("flower-")) {
      const id = action.replace("flower-", "");
      const flower = HEARTHAVEN_FLOWERS.find((f) => f.id === id);
      return flower?.message || "A flower whispers a secret thought ❤️";
    }
    return HEARTHAVEN_TAP[action] || "This corner of Hearthaven has a story for you.";
  },

  showTap(action) {
    const msg = this.tapMessage(action);
    if (msg) this.toast(msg);
  },

  modalIntro(action) {
    const msg = this.tapMessage(action);
    return msg ? `<p class="hh-tap-intro">${msg}</p>` : "";
  },

  spawnParticles() {
    const el = document.getElementById("hh-particles");
    if (!el || el.childElementCount) return;
    for (let i = 0; i < 20; i++) {
      const p = document.createElement("span");
      p.className = "hh-particle";
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDelay = `${Math.random() * 5}s`;
      p.style.animationDuration = `${5 + Math.random() * 4}s`;
      el.appendChild(p);
    }
  },

  spawnFireflies() {
    const el = document.getElementById("hh-fireflies");
    if (!el || el.childElementCount) return;
    for (let i = 0; i < 12; i++) {
      const f = document.createElement("span");
      f.className = "hh-firefly";
      f.style.left = `${10 + Math.random() * 80}%`;
      f.style.top = `${20 + Math.random() * 60}%`;
      f.style.animationDelay = `${Math.random() * 3}s`;
      el.appendChild(f);
    }
  },

  bindHotspots() {
    document.querySelectorAll("[data-hh]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = el.dataset.hh;
        AudioEngine.playSfx("select");
        this.handleAction(action, el);
      });
    });

    const backdrop = document.getElementById("hh-modal-backdrop");
    backdrop?.addEventListener("click", (e) => {
      if (e.target.id === "hh-modal-backdrop") this.closeModal();
      if (e.target.closest("[data-hh-close]")) this.closeModal();
      if (e.target.closest("#hh-briefing-accept")) this.acceptBriefing();
      if (e.target.closest("#hh-signpost-go")) {
        this.closeModal();
        this.transitionToMap();
      }

      const lockedLetter = e.target.closest(".hh-envelope--locked");
      if (lockedLetter) {
        const letter = HEARTHAVEN_LETTERS.find((l) => l.id === lockedLetter.dataset.letter);
        this.toast(letter?.lockedMessage || "This letter unlocks after a future mission.");
        AudioEngine.playSfx("select");
        return;
      }

      const openLetter = e.target.closest(".hh-envelope--open");
      if (openLetter && !e.target.closest("#hh-briefing-accept")) {
        const letter = HEARTHAVEN_LETTERS.find((l) => l.id === openLetter.dataset.letter);
        const body = document.getElementById("hh-letter-body");
        if (letter && body) {
          body.hidden = false;
          body.innerHTML = `<p class="hh-letter-body__from font-pixel">From: ${letter.from}</p><p class="hh-letter-body__text">${letter.body.replace(/\n/g, "<br>")}</p>`;
          openLetter.classList.add("hh-envelope--reading");
          this.toast(`Reading a letter from ${letter.from}...`);
        }
        return;
      }

      const lockedPhoto = e.target.closest(".hh-polaroid--locked");
      if (lockedPhoto) {
        const photo = HEARTHAVEN_PHOTOS.find((p) => p.id === lockedPhoto.dataset.photo);
        this.toast(photo?.lockedMessage || "This memory is not ready yet.");
        AudioEngine.playSfx("select");
        return;
      }

      const openPhoto = e.target.closest(".hh-polaroid:not(.hh-polaroid--locked)");
      if (openPhoto) {
        const photo = HEARTHAVEN_PHOTOS.find((p) => p.id === openPhoto.dataset.photo);
        const viewer = document.getElementById("hh-photo-viewer");
        if (photo && viewer) {
          viewer.hidden = false;
          viewer.classList.add("hh-wall-viewer--pop");
          viewer.querySelector(".hh-wall-viewer__emoji").textContent = photo.emoji;
          viewer.querySelector(".hh-wall-viewer__caption").textContent = photo.caption;
          const textEl = viewer.querySelector(".hh-wall-viewer__text");
          if (textEl) {
            textEl.textContent = photo.memoryText || "";
            textEl.hidden = !photo.memoryText;
          }
          this.toast(photo.memoryText || photo.caption);
          setTimeout(() => viewer.classList.remove("hh-wall-viewer--pop"), 400);
        }
      }
    });
  },

  handleAction(action) {
    if (action.startsWith("secret-")) {
      this.discoverSecret(action.replace("secret-", ""));
      return;
    }

    if (action.startsWith("flower-")) {
      this.discoverFlower(action.replace("flower-", ""));
      return;
    }

    switch (action) {
      case "cottage":
        this.showTap(action);
        this.openBriefing();
        break;
      case "mailbox":
        this.showTap(action);
        this.openMailbox();
        break;
      case "wall":
      case "wall-photo-1":
      case "wall-photo-2":
        this.showTap(action === "wall" ? "wall" : action);
        this.openMemoryWall();
        break;
      case "bench":
      case "bench-lantern":
        this.showTap(action);
        this.openBench(action);
        break;
      case "journal":
      case "mug":
        this.showTap(action);
        if (action === "mug") this.openMug();
        else this.openJournal();
        break;
      case "signpost":
        this.showTap(action);
        this.openSignpost();
        break;
      case "pond":
        this.showTap("pond");
        this.pondSurprise("pond");
        break;
      case "fish":
        this.showTap("fish");
        this.pondSurprise("fish");
        break;
      case "duck":
        this.showTap("duck");
        this.pondSurprise("duck");
        break;
      case "butterfly":
        this.showTap("butterfly");
        this.toast("The butterfly circles you once, then lands on a rose.");
        break;
      case "cat":
        this.petCat();
        break;
      case "story":
        this.showTap(action);
        this.openStory();
        break;
      case "village-welcome":
        this.showTap(action);
        break;
      default:
        this.showTap(action);
        break;
    }
  },

  discoverSecret(id) {
    const state = this.getState();
    const secret = HEARTHAVEN_HIDDEN.find((s) => s.id === id);
    if (!secret) {
      this.toast("You found something special here.");
      return;
    }

    if (state.hearthaven.foundSecrets.includes(id)) {
      this.toast(secret.message);
      return;
    }

    state.hearthaven.foundSecrets.push(id);
    this.addHeart(1);
    this.persist();
    this.markFoundHotspots();
    this.burstHearts(secret.message);
    AudioEngine.playSfx("success");
  },

  discoverFlower(id) {
    const state = this.getState();
    const flower = HEARTHAVEN_FLOWERS.find((f) => f.id === id);
    const message = flower?.message || "You found a secret thought ❤️";

    if (!flower) {
      this.toast(message);
      return;
    }

    if (state.hearthaven.flowersFound.includes(id)) {
      this.toast(message);
      return;
    }

    state.hearthaven.flowersFound.push(id);
    this.toast(message);
    this.persist();
    AudioEngine.playSfx("success");
  },

  markFoundHotspots() {
    const found = this.getState().hearthaven.foundSecrets;
    document.querySelectorAll("[data-hh^='secret-']").forEach((el) => {
      const id = el.dataset.hh.replace("secret-", "");
      if (found.includes(id)) el.classList.add("hh-hotspot--found");
    });
  },

  openModal(title, html, extraClass = "") {
    const backdrop = document.getElementById("hh-modal-backdrop");
    const panel = document.getElementById("hh-modal-panel");
    if (!backdrop || !panel) return;
    document.getElementById("hh-modal-title").textContent = title;
    panel.innerHTML = html;
    backdrop.classList.add("is-open", extraClass);
    backdrop.setAttribute("aria-hidden", "false");
  },

  closeModal() {
    const backdrop = document.getElementById("hh-modal-backdrop");
    backdrop?.classList.remove("is-open", "hh-modal--briefing", "hh-modal--envelope");
    backdrop?.setAttribute("aria-hidden", "true");
    document.getElementById("hh-cottage")?.classList.remove("hh-cottage--open");
  },

  openBriefing() {
    const done = isCompleted(this.getState(), "hearthaven");
    const lines = HEARTHAVEN_BRIEFING.map((l) => `<p>${l}</p>`).join("");
    const btn = done
      ? `<p class="hh-modal__done font-pixel">✓ Briefing complete</p><button type="button" class="hh-btn font-pixel" data-hh-close>Close</button>`
      : `<button type="button" id="hh-briefing-accept" class="hh-btn hh-btn--primary font-pixel">Accept Mission ✓</button>`;

    document.getElementById("hh-cottage")?.classList.add("hh-cottage--open");
    this.openModal(
      "Mission Briefing",
      `${this.modalIntro("cottage")}<div class="hh-briefing">${lines}</div>${btn}`,
      "hh-modal--briefing",
    );
  },

  acceptBriefing() {
    if (!isCompleted(this.getState(), "hearthaven")) {
      this.completeLocation("hearthaven");
    }
    this.closeModal();
    this.toast("Mission accepted! The kingdom awaits ♥");
    AudioEngine.playSfx("success");
  },

  openMailbox() {
    const state = this.getState();
    const locked = [];
    const unlocked = [];

    HEARTHAVEN_LETTERS.forEach((letter) => {
      const open =
        letter.unlockAfter === null ||
        state.completedLocations.includes(letter.unlockAfter);
      const item = `
        <button type="button" class="hh-envelope ${open ? "hh-envelope--open" : "hh-envelope--locked"}" data-letter="${letter.id}">
          <span class="hh-envelope__seal">${open ? "💌" : "🔒"}</span>
          <span class="hh-envelope__from font-pixel">${letter.from}</span>
          <span class="hh-envelope__preview">${letter.preview}</span>
        </button>`;
      (open ? unlocked : locked).push(item);
    });

    const html = `
      ${this.modalIntro("mailbox")}
      <p class="hh-modal__hint">Tap any envelope — locked ones tell you how to unlock them.</p>
      <!-- ADD LETTER CONTENT HERE -->
      ${unlocked.length ? `<div class="hh-envelope-grid">${unlocked.join("")}</div>` : ""}
      ${locked.length ? `<p class="hh-modal__section font-pixel">Locked</p><div class="hh-envelope-grid hh-envelope-grid--locked">${locked.join("")}</div>` : ""}
      <div id="hh-letter-body" class="hh-letter-body" hidden></div>
      <button type="button" class="hh-btn font-pixel" data-hh-close>Close</button>
    `;

    this.openModal("Letter Collection", html, "hh-modal--envelope");
  },

  openMemoryWall() {
    const state = this.getState();
    const cards = HEARTHAVEN_PHOTOS.map((photo) => {
      const open =
        photo.unlockAfter === null ||
        state.completedLocations.includes(photo.unlockAfter);
      return `
        <button type="button" class="hh-polaroid ${open ? "" : "hh-polaroid--locked"}" data-photo="${photo.id}">
          <span class="hh-polaroid__frame">
            <!-- ADD PHOTO HERE -->
            <span class="hh-polaroid__emoji">${photo.emoji}</span>
          </span>
          <span class="hh-polaroid__caption font-pixel">${photo.caption}</span>
          <!-- ADD MEMORY TEXT HERE -->
        </button>`;
    }).join("");

    const html = `
      ${this.modalIntro("wall")}
      <p class="hh-modal__hint">Notice board — tap each polaroid for a memory or unlock hint.</p>
      <div class="hh-wall-viewer" id="hh-photo-viewer" hidden>
        <span class="hh-wall-viewer__emoji"></span>
        <p class="hh-wall-viewer__caption font-pixel"></p>
        <p class="hh-wall-viewer__text"></p>
        <!-- ADD MEMORY TEXT HERE -->
      </div>
      <div class="hh-polaroid-grid">${cards}</div>
      <button type="button" class="hh-btn font-pixel" data-hh-close>Close</button>
    `;

    this.openModal("Memory Wall — Notice Board", html);
  },

  openBench(action = "bench") {
    const msg =
      HEARTHAVEN_BENCH_MESSAGES[
        Math.floor(Math.random() * HEARTHAVEN_BENCH_MESSAGES.length)
      ];
    const html = `
      ${this.modalIntro(action)}
      <p class="hh-quiet">${msg}</p>
      <!-- ADD PERSONAL MESSAGE HERE -->
      <button type="button" class="hh-btn font-pixel" data-hh-close>Close</button>
    `;
    this.openModal("Quiet Moments — Bench", html);
  },

  openMug() {
    const html = `
      ${this.modalIntro("mug")}
      <p class="hh-quiet">Someone left this mug here so you'd always feel welcome. Take a sip of calm before the next quest.</p>
      <button type="button" class="hh-btn font-pixel" data-hh-close>Close</button>
    `;
    this.openModal("Warm Coffee", html);
  },

  openJournal() {
    const state = this.getState();
    const missions = LOCATIONS.filter((l) => !l.isHome);
    const done = missions.filter((l) => state.completedLocations.includes(l.id)).length;
    const pct = Math.round((done / missions.length) * 100);
    const current = missions.find(
      (l) => isUnlocked(state, l.id) && !isCompleted(state, l.id),
    );

    const rows = missions
      .map((l) => {
        const complete = state.completedLocations.includes(l.id);
        const locked = !isUnlocked(state, l.id);
        let status = "○";
        if (complete) status = "✓";
        else if (locked) status = "🔒";
        return `<li class="hh-quest__row ${complete ? "hh-quest__row--done" : ""} ${locked ? "hh-quest__row--locked" : ""}">
          <span>${status}</span><span>${l.emoji} ${l.name}</span>
        </li>`;
      })
      .join("");

    const html = `
      ${this.modalIntro("journal")}
      <p class="hh-quest__progress font-pixel">Progress: ${pct}%</p>
      <p class="hh-quest__current">Current: ${current ? `${current.emoji} ${current.name}` : "Explore the kingdom!"}</p>
      <ul class="hh-quest__list">${rows}</ul>
      <p class="hh-quest__meta">Hearts: ${state.hearts} · Keys: ${state.memoryKeys}/${MAX_MEMORY_KEYS} · Achievements: ${state.achievements}</p>
      <button type="button" class="hh-btn font-pixel" data-hh-close>Close</button>
    `;
    this.openModal("Quest Log — Journal", html);
  },

  openSignpost() {
    const dirs = SIGNPOST_DESTINATIONS.map(
      (d) => `<span class="hh-sign__dir">➡ ${d.emoji} ${d.name}</span>`,
    ).join("");
    const html = `
      ${this.modalIntro("signpost")}
      <p class="hh-modal__hint">The kingdom road awaits beyond the village.</p>
      <div class="hh-sign__list">${dirs}</div>
      <button type="button" id="hh-signpost-go" class="hh-btn hh-btn--primary font-pixel">Open World Map</button>
      <button type="button" class="hh-btn font-pixel" data-hh-close>Stay Home</button>
    `;
    this.openModal("Village Signpost", html);
  },

  openStory() {
    const html = `
      ${this.modalIntro("story")}
      <div class="hh-story-book">
        <p class="hh-story-book__glow">✨ Our Story ✨</p>
        <!-- ADD RELATIONSHIP TIMELINE HERE -->
        <p class="hh-modal__hint">Place your relationship milestones here — photos, dates, and captions.</p>
      </div>
      <button type="button" class="hh-btn font-pixel" data-hh-close>Close</button>
    `;
    this.openModal("Our Story", html);
    this.discoverStoryPedestal();
  },

  discoverStoryPedestal() {
    const state = this.getState();
    const id = "book-pedestal";
    if (state.hearthaven.foundSecrets.includes(id)) return;
    const secret = HEARTHAVEN_HIDDEN.find((s) => s.id === id);
    if (!secret) return;
    state.hearthaven.foundSecrets.push(id);
    this.addHeart(1);
    this.persist();
    setTimeout(() => this.toast(secret.message), 600);
    AudioEngine.playSfx("success");
  },

  pondSurprise(kind) {
    const pondMsgs = {
      pond: [
        "The water reflects the sunset like liquid gold.",
        "Gentle ripples circle the lily pads.",
        "You hear frogs humming a cozy evening song.",
      ],
      fish: HEARTHAVEN_POND_SURPRISES,
      duck: [
        "The duck quacks twice — that's duck for 'welcome home.'",
        "It offers you a feather of good luck (imaginary, but still cute).",
        "Paddle paddle — the duck races its own reflection.",
      ],
    };
    const pool = pondMsgs[kind] || HEARTHAVEN_POND_SURPRISES;
    const msg = pool[Math.floor(Math.random() * pool.length)];
    document.getElementById("hh-pond")?.classList.add("hh-pond--ripple");
    setTimeout(() => document.getElementById("hh-pond")?.classList.remove("hh-pond--ripple"), 800);
    this.toast(msg);
  },

  petCat() {
    const line =
      HEARTHAVEN_CAT_LINES[Math.floor(Math.random() * HEARTHAVEN_CAT_LINES.length)];
    this.burstHearts(line);
    const cat = document.getElementById("hh-cat");
    cat?.classList.add("hh-cat--happy");
    setTimeout(() => cat?.classList.remove("hh-cat--happy"), 600);
  },

  initCat() {
    this.catEl = document.getElementById("hh-cat");
    if (!this.catEl) return;
    let x = 45;
    let y = 62;
    this.catEl.style.left = `${x}%`;
    this.catEl.style.top = `${y}%`;

    if (this.catTimer) clearInterval(this.catTimer);
    this.catTimer = setInterval(() => {
      const moods = ["", "hh-cat--sleep", "hh-cat--stretch"];
      this.catEl.className = "hh-cat " + (moods[Math.floor(Math.random() * moods.length)]);
      x += (Math.random() - 0.5) * 8;
      y += (Math.random() - 0.5) * 6;
      x = Math.max(15, Math.min(80, x));
      y = Math.max(50, Math.min(75, y));
      this.catEl.style.left = `${x}%`;
      this.catEl.style.top = `${y}%`;
    }, 4500);
  },

  transitionToMap() {
    const screen = document.getElementById("screen-hearthaven");
    screen?.classList.add("hh-screen--zoom-out");
    AudioEngine.playSfx("warp");
    setTimeout(() => {
      screen?.classList.remove("hh-screen--zoom-out");
      this.goToMap(true);
    }, 700);
  },

  toast(msg) {
    let t = document.getElementById("hh-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "hh-toast";
      t.className = "hh-toast";
      document.getElementById("screen-hearthaven")?.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add("hh-toast--show");
    setTimeout(() => t.classList.remove("hh-toast--show"), 3500);
  },

  burstHearts(msg) {
    this.toast(msg);
    const scene = document.getElementById("hh-scene");
    if (!scene) return;
    for (let i = 0; i < 6; i++) {
      const h = document.createElement("span");
      h.className = "hh-burst-heart";
      h.textContent = "♥";
      h.style.left = `${40 + Math.random() * 20}%`;
      h.style.top = `${40 + Math.random() * 20}%`;
      scene.appendChild(h);
      setTimeout(() => h.remove(), 1000);
    }
  },

  destroy() {
    if (this.catTimer) clearInterval(this.catTimer);
    this.closeModal();
  },
};

window.Hearthaven = Hearthaven;
