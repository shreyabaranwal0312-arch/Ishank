/** Pizza Kingdom — categories (correct pairs) */

const PIZZA_KINGDOM_MATCHES = [
  {
    id: "food",
    category: "Food",
    categoryEmoji: "🍽",
    answerId: "pizza",
    answerLabel: "Pizza",
    answerEmoji: "🍕",
  },
  {
    id: "color",
    category: "Color",
    categoryEmoji: "🎨",
    answerId: "green",
    answerLabel: "Green",
    answerEmoji: "🟢",
  },
  {
    id: "drink",
    category: "Drink",
    categoryEmoji: "☕",
    answerId: "coffee",
    answerLabel: "Coffee",
    answerEmoji: "☕",
  },
  {
    id: "movie",
    category: "Movie",
    categoryEmoji: "🎬",
    answerId: "looking-for-alaska",
    answerLabel: "Looking for Alaska",
    answerEmoji: "📖",
  },
];

/** All draggable chips — includes decoys to guess from */
const PIZZA_ANSWER_CHIPS = [
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "green", label: "Green", emoji: "🟢" },
  { id: "coffee", label: "Coffee", emoji: "☕" },
  { id: "looking-for-alaska", label: "Looking for Alaska", emoji: "📖" },
  { id: "burger", label: "Burger", emoji: "🍔" },
  { id: "pasta", label: "Pasta", emoji: "🍝" },
  { id: "sushi", label: "Sushi", emoji: "🍣" },
  { id: "tacos", label: "Tacos", emoji: "🌮" },
  { id: "red", label: "Red", emoji: "🔴" },
  { id: "blue", label: "Blue", emoji: "🔵" },
  { id: "purple", label: "Purple", emoji: "🟣" },
  { id: "yellow", label: "Yellow", emoji: "🟡" },
  { id: "tea", label: "Tea", emoji: "🫖" },
  { id: "cola", label: "Cola", emoji: "🥤" },
  { id: "juice", label: "Juice", emoji: "🧃" },
  { id: "hot-chocolate", label: "Hot Chocolate", emoji: "🍫" },
  { id: "fault-in-stars", label: "The Fault in Our Stars", emoji: "⭐" },
  { id: "harry-potter", label: "Harry Potter", emoji: "⚡" },
  { id: "frozen", label: "Frozen", emoji: "❄️" },
  { id: "pride-prejudice", label: "Pride & Prejudice", emoji: "📚" },
];

const PIZZA_CORRECT_IDS = new Set(
  PIZZA_KINGDOM_MATCHES.map((m) => m.answerId),
);

window.PIZZA_KINGDOM_MATCHES = PIZZA_KINGDOM_MATCHES;
window.PIZZA_ANSWER_CHIPS = PIZZA_ANSWER_CHIPS;
window.PIZZA_CORRECT_IDS = PIZZA_CORRECT_IDS;
