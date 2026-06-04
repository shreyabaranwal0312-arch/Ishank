/** Handcrafted kingdom map — landmarks, roads, ambient life */

const LANDMARK_ART = {
  hearthaven: `
    <span class="landmark__hh-roof"></span>
    <span class="landmark__hh-body"></span>
    <span class="landmark__hh-window landmark__hh-window--l"></span>
    <span class="landmark__hh-window landmark__hh-window--r"></span>
    <span class="landmark__hh-door"></span>
    <span class="landmark__hh-smoke"></span>
    <span class="landmark__hh-heart">♥</span>
    <span class="landmark__hh-garden"></span>
  `,
  "memory-forest": `
    <span class="landmark__tree-crown"></span>
    <span class="landmark__tree-trunk"></span>
    <span class="landmark__lantern landmark__lantern--1"></span>
    <span class="landmark__lantern landmark__lantern--2"></span>
    <span class="landmark__lantern landmark__lantern--3"></span>
    <span class="landmark__firefly" style="top:40%;left:60%"></span>
    <span class="landmark__firefly" style="top:55%;left:25%;animation-delay:1s"></span>
  `,
  "beach-chaos": `
    <span class="landmark__ocean"></span>
    <span class="landmark__sand"></span>
    <span class="landmark__umbrella landmark__umbrella--1"></span>
    <span class="landmark__umbrella landmark__umbrella--2"></span>
    <span class="landmark__palm"></span>
  `,
  "pizza-kingdom": `
    <span class="landmark__castle-roof"></span>
    <span class="landmark__castle-base"></span>
    <span class="landmark__pizza-door">🍕</span>
    <span class="landmark__cheese-river"></span>
    <span class="landmark__house landmark__house--l"></span>
    <span class="landmark__house landmark__house--r"></span>
  `,
  "joke-dungeon": `
    <span class="landmark__banner landmark__banner--l"></span>
    <span class="landmark__banner landmark__banner--r"></span>
    <span class="landmark__dungeon-body"></span>
    <span class="landmark__dungeon-door"></span>
    <span class="landmark__sign">⚠️</span>
  `,
  "secret-valley": `
    <span class="landmark__meadow-patch"></span>
    <span class="landmark__mini-fall"></span>
    <span class="landmark__sparkle-dot" style="top:25%;left:55%"></span>
    <span class="landmark__sparkle-dot" style="top:40%;left:70%;animation-delay:0.5s"></span>
    <span class="landmark__sparkle-dot" style="top:20%;left:35%;animation-delay:1s"></span>
  `,
  "open-when": `
    <span class="landmark__lib-roof"></span>
    <span class="landmark__lib-building"></span>
    <span class="landmark__book landmark__book--1">📖</span>
    <span class="landmark__book landmark__book--2">📕</span>
  `,
  "love-machine": `
    <span class="landmark__neon"></span>
    <span class="landmark__arcade"></span>
    <span class="landmark__screen">♥</span>
  `,
  "achievement-hall": `
    <span class="landmark__trophy-big">🏆</span>
    <span class="landmark__hall"></span>
    <span class="landmark__hall-columns"></span>
  `,
  "birthday-vault": `
    <span class="landmark__vault-crown">👑</span>
    <span class="landmark__vault-tower landmark__vault-tower--l"></span>
    <span class="landmark__vault-tower landmark__vault-tower--r"></span>
    <span class="landmark__vault-center"></span>
    <span class="landmark__vault-door">🔒</span>
  `,
};

const MapScreen = {
  container: null,
  tooltip: null,
  viewport: null,
  ambientDone: false,

  init(getState, onSelect) {
    this.container = document.getElementById("map-locations");
    this.tooltip = document.getElementById("map-tooltip");
    this.viewport = document.getElementById("map-viewport");
    this.getState = getState;
    this.onSelect = onSelect;

    if (!this.ambientDone) {
      this.spawnAmbient();
      this.ambientDone = true;
    }

    this.render();
    this.drawRoads();
    this.resetScroll();
  },

  resetScroll() {
    if (!this.viewport) return;
    this.viewport.scrollTop = 0;
  },

  spawnAmbient() {
    const heartsEl = document.getElementById("kingdom-hearts");
    const sparklesEl = document.getElementById("kingdom-sparkles");

    if (heartsEl) {
      for (let i = 0; i < 14; i++) {
        const h = document.createElement("span");
        h.className = "kingdom__heart-float";
        h.textContent = "♥";
        h.style.left = `${5 + Math.random() * 90}%`;
        h.style.top = `${20 + Math.random() * 70}%`;
        h.style.animationDelay = `${Math.random() * 6}s`;
        h.style.animationDuration = `${6 + Math.random() * 4}s`;
        heartsEl.appendChild(h);
      }
    }

    if (sparklesEl) {
      for (let i = 0; i < 30; i++) {
        const s = document.createElement("span");
        s.className = "kingdom__sparkle";
        s.style.left = `${Math.random() * 100}%`;
        s.style.top = `${Math.random() * 100}%`;
        s.style.animationDelay = `${Math.random() * 3}s`;
        sparklesEl.appendChild(s);
      }
    }
  },

  getPathLocations() {
    return [...LOCATIONS].sort((a, b) => b.mapY - a.mapY);
  },

  buildSmoothPath(points) {
    if (points.length < 2) return "";
    let d = `M ${points[0].mapX} ${points[0].mapY}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cx = (prev.mapX + curr.mapX) / 2;
      const cy = (prev.mapY + curr.mapY) / 2;
      d += ` Q ${cx} ${cy} ${curr.mapX} ${curr.mapY}`;
    }
    return d;
  },

  drawRoads() {
    const points = this.getPathLocations();
    const d = this.buildSmoothPath(points);

    const base = document.getElementById("map-road-base");
    const cobble = document.getElementById("map-road-cobble");
    const glow = document.getElementById("map-road-glow");
    if (base) base.setAttribute("d", d);
    if (cobble) cobble.setAttribute("d", d);
    if (glow) glow.setAttribute("d", d);

    const signs = document.getElementById("map-signposts");
    if (signs) {
      signs.innerHTML = "";
      points.forEach((loc, i) => {
        if (i === 0) return;
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("transform", `translate(${loc.mapX - 1.2} ${loc.mapY - 2})`);
        g.innerHTML = `
          <rect class="kingdom__signpost" x="0" y="0" width="0.35" height="1.8" rx="0.05"/>
          <rect class="kingdom__signpost-board" x="-0.5" y="-0.6" width="1.4" height="0.55" rx="0.08"/>
        `;
        signs.appendChild(g);
      });
    }
  },

  render() {
    const state = this.getState();
    if (!this.container) return;
    this.container.innerHTML = "";

    const sorted = this.getPathLocations();

    sorted.forEach((loc) => {
      const unlocked = isUnlocked(state, loc.id);
      const done = isCompleted(state, loc.id);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = `landmark landmark--${loc.id}`;
      if (done) btn.classList.add("landmark--done");
      if (!unlocked) btn.classList.add("landmark--locked");

      btn.style.left = `${loc.mapX}%`;
      btn.style.top = `${loc.mapY}%`;
      btn.disabled = !unlocked;
      btn.dataset.id = loc.id;
      btn.setAttribute("aria-label", loc.name);

      const art = LANDMARK_ART[loc.id] || `<span>${loc.emoji}</span>`;
      btn.innerHTML = `
        <div class="landmark__art">${art}</div>
        <span class="landmark__label">${loc.name}</span>
        <span class="landmark__marker" aria-hidden="true"></span>
      `;

      btn.addEventListener("mouseenter", () => this.showTooltip(loc, state));
      btn.addEventListener("focus", () => this.showTooltip(loc, state));
      btn.addEventListener("mouseleave", () => this.hideTooltip());
      btn.addEventListener("blur", () => this.hideTooltip());
      btn.addEventListener("click", () => {
        if (!unlocked) {
          AudioEngine.playSfx("locked");
          return;
        }
        AudioEngine.playSfx("select");
        this.onSelect(loc);
      });

      this.container.appendChild(btn);
    });
  },

  showTooltip(loc, state) {
    if (!this.tooltip) return;
    const unlocked = isUnlocked(state, loc.id);
    const done = isCompleted(state, loc.id);
    let status = "🔒 Locked — complete earlier areas";
    if (done) status = "✓ Completed";
    else if (unlocked) status = "▶ Ready to explore";

    if (loc.id === "birthday-vault" && unlocked && !canEnterVault(state)) {
      const p = getVaultProgress(state);
      const missing = [];
      if (!p.hearts.done) missing.push(`${p.hearts.current}/${p.hearts.required} hearts`);
      if (!p.keys.done) missing.push(`${p.keys.current}/${p.keys.required} keys`);
      if (!p.secretCode.done) missing.push("secret code");
      if (!p.areas.done) missing.push(`${p.areas.current}/${p.areas.required} areas`);
      status = `🔒 Need: ${missing.join(" · ")}`;
    }

    this.tooltip.hidden = false;
    this.tooltip.innerHTML = `
      <p class="map-tooltip__name font-pixel">${loc.emoji} ${loc.name}</p>
      <p class="map-tooltip__tag">${loc.tagline}</p>
      <p class="map-tooltip__status font-pixel">${status}</p>
    `;
  },

  hideTooltip() {
    if (this.tooltip) this.tooltip.hidden = true;
  },
};

window.MapScreen = MapScreen;
