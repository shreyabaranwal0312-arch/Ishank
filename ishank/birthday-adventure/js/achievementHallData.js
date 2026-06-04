/** Achievement Hall — trophy definitions */

const ACHIEVEMENT_BADGES = [
  {
    id: "heart-collector",
    title: "Heart Collector",
    gameName: "HEART COLLECTOR ❤️",
    emoji: "❤️",
    description: "Catch 20 hearts at the Beach of Chaos without drowning in heartbreak.",
    getProgress(state) {
      const done = isCompleted(state, "beach-chaos");
      return { current: done ? 1 : 0, total: 1, pct: done ? 100 : 0 };
    },
    isUnlocked(state) {
      return (
        (state.achievementNames || []).includes("HEART COLLECTOR ❤️") ||
        isCompleted(state, "beach-chaos")
      );
    },
  },
  {
    id: "joke-survivor",
    title: "Joke Survivor",
    gameName: "JOKE SURVIVOR",
    emoji: "😂",
    description: "Survive every meme gate in the Inside Joke Dungeon.",
    getProgress(state) {
      const n = state.jokeDungeon?.solvedGates?.length || 0;
      const total = typeof JOKE_DUNGEON_GATES !== "undefined" ? JOKE_DUNGEON_GATES.length : 5;
      return { current: n, total, pct: Math.round((n / total) * 100) };
    },
    isUnlocked(state) {
      return (
        (state.achievementNames || []).includes("JOKE SURVIVOR") ||
        isCompleted(state, "joke-dungeon")
      );
    },
  },
  {
    id: "treasure-hunter",
    title: "Treasure Hunter",
    gameName: "SECRET CODE COMPLETE",
    emoji: "✨",
    description: "Find every hidden treasure in Secret Valley and complete the secret code.",
    getProgress(state) {
      const n = state.secretValley?.found?.length || 0;
      const total = typeof SECRET_VALLEY_TREASURES !== "undefined" ? SECRET_VALLEY_TREASURES.length : 4;
      return { current: n, total, pct: Math.round((n / total) * 100) };
    },
    isUnlocked(state) {
      return (
        (state.achievementNames || []).includes("SECRET CODE COMPLETE") ||
        isCompleted(state, "secret-valley")
      );
    },
  },
  {
    id: "birthday-champion",
    title: "Birthday Champion",
    gameName: "BIRTHDAY CHAMPION",
    emoji: "👑",
    description: "Open the Birthday Vault and claim the kingdom's greatest prize.",
    getProgress(state) {
      const main = LOCATIONS.filter((l) => l.id !== "birthday-vault");
      const done = main.filter((l) => isCompleted(state, l.id)).length;
      const vault = isCompleted(state, "birthday-vault") ? 1 : 0;
      const pct = Math.round(((done + vault) / (main.length + 1)) * 100);
      return { current: done + vault, total: main.length + 1, pct };
    },
    isUnlocked(state) {
      return (
        (state.achievementNames || []).includes("BIRTHDAY CHAMPION") ||
        isCompleted(state, "birthday-vault")
      );
    },
  },
];

window.ACHIEVEMENT_BADGES = ACHIEVEMENT_BADGES;
