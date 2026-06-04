/** Beach of Chaos — heart catcher arcade */

const BEACH_CHAOS_TARGET = 20;
const BEACH_CHAOS_TIME = 30;
const BEACH_ACHIEVEMENT = "HEART COLLECTOR ❤️";

const BeachChaos = {
  getState: null,
  persist: null,
  completeLocation: null,
  unlockAchievement: null,

  running: false,
  score: 0,
  timeLeft: BEACH_CHAOS_TIME,
  basketX: 0.5,
  items: [],
  lastSpawn: 0,
  rafId: null,
  timerId: null,
  startTime: 0,
  arena: null,
  basket: null,
  itemsLayer: null,
  _bound: false,

  init(getState, persist, completeLocation, unlockAchievement) {
    this.getState = getState;
    this.persist = persist;
    this.completeLocation = completeLocation;
    this.unlockAchievement = unlockAchievement;

    this.arena = document.getElementById("bc-arena");
    this.basket = document.getElementById("bc-basket");
    this.itemsLayer = document.getElementById("bc-items");

    this.bindControls();
    this.showIntro();
  },

  bindControls() {
    if (this._bound) return;
    this._bound = true;

    document.getElementById("bc-start-btn")?.addEventListener("click", () => {
      AudioEngine.playSfx("select");
      this.startGame();
    });

    document.getElementById("bc-retry-btn")?.addEventListener("click", () => {
      AudioEngine.playSfx("select");
      this.hideOverlays();
      this.startGame();
    });

    document.getElementById("bc-victory-continue")?.addEventListener("click", () => {
      AudioEngine.playSfx("select");
      this.destroy();
      App.goToMap(false);
    });

    const onMove = (clientX) => {
      if (!this.running || !this.arena) return;
      const rect = this.arena.getBoundingClientRect();
      this.basketX = Math.max(0.08, Math.min(0.92, (clientX - rect.left) / rect.width));
      this.renderBasket();
    };

    this.arena?.addEventListener("mousemove", (e) => onMove(e.clientX));
    this.arena?.addEventListener(
      "touchmove",
      (e) => {
        if (this.running) e.preventDefault();
        onMove(e.touches[0].clientX);
      },
      { passive: false },
    );

    window.addEventListener("keydown", (e) => {
      if (!this.running) return;
      if (e.key === "ArrowLeft" || e.key === "a") {
        this.basketX = Math.max(0.08, this.basketX - 0.04);
        this.renderBasket();
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        this.basketX = Math.min(0.92, this.basketX + 0.04);
        this.renderBasket();
      }
    });
  },

  showIntro() {
    this.hideOverlays();
    const intro = document.getElementById("bc-intro");
    intro?.classList.add("is-open");
    intro?.setAttribute("aria-hidden", "false");

    const cleared = isCompleted(this.getState(), "beach-chaos");
    const hint = document.getElementById("bc-intro-hint");
    if (hint) {
      hint.textContent = cleared
        ? "Mission cleared — play again for fun!"
        : `Catch ❤️ (+1) · Dodge 💔 (-1) · Reach ${BEACH_CHAOS_TARGET} pts in ${BEACH_CHAOS_TIME}s`;
    }
    this.updateHud(0, BEACH_CHAOS_TIME, BEACH_CHAOS_TARGET);
  },

  hideOverlays() {
    ["bc-intro", "bc-gameover", "bc-victory"].forEach((id) => {
      const el = document.getElementById(id);
      el?.classList.remove("is-open");
      el?.setAttribute("aria-hidden", "true");
    });
  },

  startGame() {
    this.hideOverlays();
    this.running = true;
    this.score = 0;
    this.timeLeft = BEACH_CHAOS_TIME;
    this.basketX = 0.5;
    this.items = [];
    this.lastSpawn = 0;
    this.startTime = performance.now();

    if (this.itemsLayer) this.itemsLayer.innerHTML = "";
    this.renderBasket();
    this.updateHud(0, BEACH_CHAOS_TIME, BEACH_CHAOS_TARGET);

    if (this.timerId) clearInterval(this.timerId);
    this.timerId = setInterval(() => {
      this.timeLeft -= 1;
      this.updateHud(this.score, this.timeLeft, Math.max(0, BEACH_CHAOS_TARGET - this.score));
      if (this.timeLeft <= 0) this.endGame(false);
    }, 1000);

    if (this.rafId) cancelAnimationFrame(this.rafId);
    const loop = (now) => {
      if (!this.running) return;
      this.tick(now);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  },

  getDifficulty(elapsedSec) {
    if (elapsedSec < 10) {
      return { spawnMs: 850, speed: 2.2, heartChance: 0.72 };
    }
    if (elapsedSec < 20) {
      return { spawnMs: 580, speed: 3.4, heartChance: 0.65 };
    }
    return { spawnMs: 380, speed: 4.8, heartChance: 0.6 };
  },

  tick(now) {
    const elapsed = (now - this.startTime) / 1000;
    const diff = this.getDifficulty(elapsed);
    const rect = this.arena?.getBoundingClientRect();
    if (!rect) return;

    if (now - this.lastSpawn > diff.spawnMs) {
      this.lastSpawn = now;
      this.spawnItem(diff.heartChance);
    }

    const basketW = 72;
    const basketLeft = this.basketX * rect.width - basketW / 2;
    const basketRight = basketLeft + basketW;
    const catchY = rect.height * 0.78;

    this.items = this.items.filter((item) => {
      item.y += diff.speed;
      item.el.style.top = `${item.y}px`;
      item.el.style.left = `${item.x}px`;

      const itemSize = 28;
      const caught =
        item.y >= catchY &&
        item.y <= catchY + 36 &&
        item.x + itemSize > basketLeft &&
        item.x < basketRight;

      if (caught) {
        if (item.type === "heart") {
          this.score += 1;
          AudioEngine.playSfx("success");
        } else {
          this.score = Math.max(0, this.score - 1);
          AudioEngine.playSfx("select");
        }
        this.flashScore(item.type === "heart");
        item.el.classList.add("bc-item--pop");
        setTimeout(() => item.el.remove(), 200);
        this.updateHud(this.score, this.timeLeft, Math.max(0, BEACH_CHAOS_TARGET - this.score));
        if (this.score >= BEACH_CHAOS_TARGET) {
          this.endGame(true);
        }
        return false;
      }

      if (item.y > rect.height + 20) {
        item.el.remove();
        return false;
      }
      return true;
    });
  },

  spawnItem(heartChance) {
    if (!this.itemsLayer || !this.arena) return;
    const rect = this.arena.getBoundingClientRect();
    const type = Math.random() < heartChance ? "heart" : "broken";
    const el = document.createElement("div");
    el.className = `bc-item bc-item--${type}`;
    el.textContent = type === "heart" ? "❤️" : "💔";
    const x = 20 + Math.random() * (rect.width - 48);
    el.style.left = `${x}px`;
    el.style.top = "-32px";
    this.itemsLayer.appendChild(el);
    this.items.push({ type, x, y: -32, el });
  },

  renderBasket() {
    if (!this.basket) return;
    this.basket.style.left = `${this.basketX * 100}%`;
  },

  flashScore(good) {
    const el = document.getElementById("bc-score");
    if (!el) return;
    el.classList.remove("bc-stat__value--up", "bc-stat__value--down");
    void el.offsetWidth;
    el.classList.add(good ? "bc-stat__value--up" : "bc-stat__value--down");
  },

  updateHud(score, timeLeft, remaining) {
    const scoreEl = document.getElementById("bc-score");
    const timerEl = document.getElementById("bc-timer");
    const targetEl = document.getElementById("bc-target");
    if (scoreEl) scoreEl.textContent = String(score);
    if (timerEl) timerEl.textContent = String(Math.max(0, timeLeft));
    if (targetEl) targetEl.textContent = String(remaining);
  },

  endGame(won) {
    if (!this.running) return;
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.timerId) clearInterval(this.timerId);
    this.items.forEach((i) => i.el.remove());
    this.items = [];

    if (won) {
      const state = this.getState();
      const firstClear = !isCompleted(state, "beach-chaos");

      this.unlockAchievement(BEACH_ACHIEVEMENT);

      if (firstClear) {
        this.completeLocation("beach-chaos");
      } else {
        this.persist();
      }

      const victory = document.getElementById("bc-victory");
      victory?.classList.add("is-open");
      victory?.setAttribute("aria-hidden", "false");
      AudioEngine.playSfx("success");
    } else {
      const go = document.getElementById("bc-gameover");
      go?.classList.add("is-open");
      go?.setAttribute("aria-hidden", "false");
      document.getElementById("bc-gameover-score").textContent = String(this.score);
    }
  },

  destroy() {
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.timerId) clearInterval(this.timerId);
    this.items.forEach((i) => i.el?.remove());
    this.items = [];
    this.hideOverlays();
  },
};

window.BeachChaos = BeachChaos;
window.BEACH_CHAOS_TARGET = BEACH_CHAOS_TARGET;
window.BEACH_ACHIEVEMENT = BEACH_ACHIEVEMENT;
