const STORAGE_KEY = "mission-birthday-adventure-v1";

const DEFAULT_STATE = {
  hearts: 0,
  memoryKeys: 0,
  achievements: 0,
  achievementNames: [],
  secretCode: ["_", "_", "_", "_"],
  completedLocations: [],
  hasStarted: false,
  musicOn: true,
  sfxOn: true,
  hearthaven: {
    foundSecrets: [],
    flowersFound: [],
  },
  memoryForest: {
    solvedOrbs: [],
  },
  pizzaKingdom: {
    matched: [],
  },
  jokeDungeon: {
    solvedGates: [],
  },
  secretValley: {
    found: [],
    hotspotsClicked: [],
  },
  openWhen: {
    booksOpened: [],
  },
  loveMachine: {
    spins: 0,
  },
  dreamSanctuary: {
    giftOpened: false,
    pageIndex: 0,
  },
};

const GameStorage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_STATE };
      const data = { ...DEFAULT_STATE, ...JSON.parse(raw) };
      data.hearthaven = { ...DEFAULT_STATE.hearthaven, ...(data.hearthaven || {}) };
      data.memoryForest = { ...DEFAULT_STATE.memoryForest, ...(data.memoryForest || {}) };
      data.pizzaKingdom = { ...DEFAULT_STATE.pizzaKingdom, ...(data.pizzaKingdom || {}) };
      data.jokeDungeon = { ...DEFAULT_STATE.jokeDungeon, ...(data.jokeDungeon || {}) };
      data.secretValley = { ...DEFAULT_STATE.secretValley, ...(data.secretValley || {}) };
      data.openWhen = { ...DEFAULT_STATE.openWhen, ...(data.openWhen || {}) };
      data.loveMachine = { ...DEFAULT_STATE.loveMachine, ...(data.loveMachine || {}) };
      data.dreamSanctuary = { ...DEFAULT_STATE.dreamSanctuary, ...(data.dreamSanctuary || {}) };
      if (!Array.isArray(data.achievementNames)) data.achievementNames = [];
      data.achievements = data.achievementNames.length;
      return data;
    } catch {
      return { ...DEFAULT_STATE };
    }
  },

  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save game:", e);
    }
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
  },
};

window.GameStorage = GameStorage;
window.DEFAULT_STATE = DEFAULT_STATE;
