/** Secret Valley — premium meadow hidden-object hunt */

const SECRET_VALLEY_ACHIEVEMENT = "SECRET CODE COMPLETE";
const SECRET_VALLEY_CODE_INDEX = 0;

const SECRET_VALLEY_RUNES = ["ᚠ", "ᚢ", "ᚦ", "ᚨ"];

const SECRET_VALLEY_TREASURES = [
  {
    id: "heart",
    emoji: "❤️",
    name: "Heart",
    hint: "A warm glow hides among the blossoms by the falls",
    zone: "flowers-near-falls",
    fragmentOrder: 1,
    foundLine: "Another piece of the secret has been revealed.",
  },
  {
    id: "flower",
    emoji: "🌸",
    name: "Flower",
    hint: "One blossom in the wild patch shimmers differently",
    zone: "wildflower-patch",
    fragmentOrder: 2,
    foundLine: "The meadow shares another fragment of its memory.",
  },
  {
    id: "cat",
    emoji: "🐱",
    name: "Cat",
    hint: "Someone sleepy rests near the old stump",
    zone: "tree-stump",
    fragmentOrder: 3,
    foundLine: "A tiny guardian approves — progress grows.",
  },
  {
    id: "star",
    emoji: "⭐",
    name: "Star",
    hint: "A star dances in the mist above the glowing pool",
    zone: "waterfall-pool",
    fragmentOrder: 4,
    foundLine: "Starlight joins the code — the gate stirs.",
  },
];

const SECRET_VALLEY_HOTSPOTS = [
  {
    id: "butterfly",
    label: "Butterfly",
    top: "38%",
    left: "62%",
    message: "The butterfly whispers: \"Look where moonlight meets water.\"",
  },
  {
    id: "mushroom-a",
    label: "Glowing mushroom",
    top: "72%",
    left: "22%",
    message: "The mushroom releases a puff of silver spores. ✨",
    sparkle: true,
  },
  {
    id: "mushroom-b",
    label: "Tiny mushroom",
    top: "68%",
    left: "78%",
    message: "A fairy ring of mushrooms giggles softly.",
    sparkle: true,
  },
  {
    id: "pond",
    label: "Moonlit pond",
    top: "58%",
    left: "8%",
    message: "A fish leaps — splash! — and vanishes into the glow.",
    fish: true,
  },
  {
    id: "moon",
    label: "The moon",
    top: "6%",
    left: "72%",
    message: "\"Every secret valley is watched by someone who loves you.\" — the moon",
  },
  {
    id: "fireflies",
    label: "Fireflies",
    top: "45%",
    left: "28%",
    message: "Fireflies swirl into a tiny heart in the air.",
  },
  {
    id: "rock",
    label: "Mossy rock",
    top: "78%",
    left: "48%",
    message: "Under the rock: a carved heart and your initials, faded but real.",
  },
  {
    id: "willow",
    label: "Willow tree",
    top: "52%",
    left: "88%",
    message: "Leaves rustle: \"The cat knows where the star fell.\"",
  },
  {
    id: "lily",
    label: "Lily pads",
    top: "62%",
    left: "14%",
    message: "Ripples form the shape of a four-leaf clover.",
  },
  {
    id: "lantern",
    label: "Forest lantern",
    top: "64%",
    left: "58%",
    message: "The lantern flickers — a path to the wildflowers brightens.",
    sparkle: true,
  },
  {
    id: "gate-rune",
    label: "Gate rune",
    top: "42%",
    left: "50%",
    message: "The runes hum: \"Find all memories, and I shall open.\"",
  },
  {
    id: "path-stone",
    label: "Curved path",
    top: "82%",
    left: "35%",
    message: "Footprints in the dew lead toward the wildflower patch.",
  },
];

window.SECRET_VALLEY_ACHIEVEMENT = SECRET_VALLEY_ACHIEVEMENT;
window.SECRET_VALLEY_CODE_INDEX = SECRET_VALLEY_CODE_INDEX;
window.SECRET_VALLEY_RUNES = SECRET_VALLEY_RUNES;
window.SECRET_VALLEY_TREASURES = SECRET_VALLEY_TREASURES;
window.SECRET_VALLEY_HOTSPOTS = SECRET_VALLEY_HOTSPOTS;
