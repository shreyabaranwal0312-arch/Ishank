/** Mission: Birthday Adventure — world map locations */

const SECRET_CODE_ANSWER = "LOVE";
const MAX_MEMORY_KEYS = 4;
const VAULT_HEARTS_REQUIRED = 20;

const LOCATION_ORDER = [
  "hearthaven",
  "memory-forest",
  "beach-chaos",
  "pizza-kingdom",
  "joke-dungeon",
  "secret-valley",
  "open-when",
  "love-machine",
  "achievement-hall",
  "birthday-vault",
];

const LOCATIONS = [
  {
    id: "hearthaven",
    emoji: "🏡",
    name: "Hearthaven Cottage",
    tagline: "Your cozy home — made just for you.",
    unlockAfter: null,
    isHome: true,
    mapX: 50,
    mapY: 96,
    rewards: { hearts: 2, keys: 0, achievements: 0, secretIndex: null },
  },
  {
    id: "memory-forest",
    emoji: "🌳",
    name: "Memory Forest",
    tagline: "Dreamy forest of shared memories.",
    unlockAfter: "hearthaven",
    mapX: 48,
    mapY: 88,
    rewards: { hearts: 0, keys: 0, achievements: 0, secretIndex: 3 },
  },
  {
    id: "beach-chaos",
    emoji: "🏖",
    name: "Beach of Chaos",
    tagline: "Catch the love, dodge the heartbreak.",
    unlockAfter: "memory-forest",
    mapX: 72,
    mapY: 80,
    rewards: { hearts: 3, keys: 0, achievements: 0, secretIndex: null },
  },
  {
    id: "pizza-kingdom",
    emoji: "🍕",
    name: "Pizza Kingdom",
    tagline: "Match your favorites in a cheesy realm.",
    unlockAfter: "beach-chaos",
    mapX: 30,
    mapY: 70,
    rewards: { hearts: 2, keys: 0, achievements: 0, secretIndex: 1 },
  },
  {
    id: "joke-dungeon",
    emoji: "😂",
    name: "Inside Joke Dungeon",
    tagline: "Memes only you two understand.",
    unlockAfter: "pizza-kingdom",
    mapX: 55,
    mapY: 58,
    rewards: { hearts: 3, keys: 1, achievements: 1, secretIndex: 2 },
  },
  {
    id: "secret-valley",
    emoji: "✨",
    name: "Secret Valley",
    tagline: "Hidden-object hunt in a magical meadow.",
    unlockAfter: "joke-dungeon",
    mapX: 68,
    mapY: 40,
    rewards: { hearts: 2, keys: 1, achievements: 0, secretIndex: 0 },
  },
  {
    id: "open-when",
    emoji: "📚",
    name: "Open When Library",
    tagline: "Letters for every feeling.",
    unlockAfter: "secret-valley",
    mapX: 40,
    mapY: 30,
    rewards: { hearts: 2, keys: 0, achievements: 0, secretIndex: null },
  },
  {
    id: "love-machine",
    emoji: "🎰",
    name: "Random Love Machine",
    tagline: "Spin for surprise affection.",
    unlockAfter: "open-when",
    mapX: 62,
    mapY: 20,
    rewards: { hearts: 1, keys: 0, achievements: 0, secretIndex: null },
  },
  {
    id: "achievement-hall",
    emoji: "🏆",
    name: "Achievement Hall",
    tagline: "Trophies from your journey.",
    unlockAfter: "love-machine",
    mapX: 34,
    mapY: 12,
    rewards: { hearts: 0, keys: 0, achievements: 0, secretIndex: null },
  },
  {
    id: "birthday-vault",
    emoji: "🔒",
    name: "Birthday Vault",
    tagline: "The golden finale awaits.",
    unlockAfter: "achievement-hall",
    mapX: 50,
    mapY: 4,
    requiresVault: true,
    rewards: { hearts: 5, keys: 0, achievements: 1, secretIndex: null },
  },
];

function getLocation(id) {
  return LOCATIONS.find((l) => l.id === id);
}

function isCompleted(state, id) {
  return state.completedLocations.includes(id);
}

function isUnlocked(state, id) {
  const loc = getLocation(id);
  if (!loc) return false;
  if (isCompleted(state, id)) return true;
  if (loc.unlockAfter === null) return state.hasStarted;

  if (!isCompleted(state, loc.unlockAfter)) return false;

  if (loc.requiresVault) {
    return isCompleted(state, loc.unlockAfter) || isCompleted(state, id);
  }

  return true;
}

function getMainMissions() {
  return LOCATIONS.filter((l) => l.id !== "birthday-vault");
}

function getVaultProgress(state) {
  const main = getMainMissions();
  const areasDone = main.filter((l) => isCompleted(state, l.id)).length;
  const codeComplete = state.secretCode.every((ch) => ch !== "_");

  return {
    hearts: {
      current: state.hearts,
      required: VAULT_HEARTS_REQUIRED,
      done: state.hearts >= VAULT_HEARTS_REQUIRED,
    },
    keys: {
      current: state.memoryKeys,
      required: MAX_MEMORY_KEYS,
      done: state.memoryKeys >= MAX_MEMORY_KEYS,
    },
    secretCode: {
      display: state.secretCode.join(" "),
      done: codeComplete,
    },
    areas: {
      current: areasDone,
      required: main.length,
      done: areasDone >= main.length,
    },
  };
}

function canEnterVault(state) {
  const vault = getLocation("birthday-vault");
  if (!vault) return false;
  if (isCompleted(state, "birthday-vault")) return true;
  if (!isCompleted(state, vault.unlockAfter)) return false;

  const p = getVaultProgress(state);
  return p.hearts.done && p.keys.done && p.secretCode.done && p.areas.done;
}

window.LOCATIONS = LOCATIONS;
window.LOCATION_ORDER = LOCATION_ORDER;
window.SECRET_CODE_ANSWER = SECRET_CODE_ANSWER;
window.MAX_MEMORY_KEYS = MAX_MEMORY_KEYS;
window.VAULT_HEARTS_REQUIRED = VAULT_HEARTS_REQUIRED;
window.getMainMissions = getMainMissions;
window.getVaultProgress = getVaultProgress;
window.getLocation = getLocation;
window.isCompleted = isCompleted;
window.isUnlocked = isUnlocked;
window.canEnterVault = canEnterVault;
