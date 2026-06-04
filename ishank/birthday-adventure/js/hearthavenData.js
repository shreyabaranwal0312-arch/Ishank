/** Hearthaven Cottage — customize personal content */

const AGENT_NAME = "ISHANK";

/** Shown on every village tap (toast + often in modal) */
const HEARTHAVEN_TAP = {
  cottage: "The cottage door glows warmly — someone built this home just for you.",
  mailbox: "A wooden mailbox with a little red flag — letters from your adventures wait inside.",
  wall: "The notice board is strung with lights and polaroids — each photo holds a piece of your story.",
  bench: "A cozy bench faces the pond. Perfect for quiet moments together.",
  journal: "An outdoor desk: open journal, quill, map, and a mug still warm from care.",
  signpost: "A fantasy signpost points toward kingdoms beyond the village fence.",
  pond: "The pond shimmers at golden hour — lily pads, ducks, and gentle ripples.",
  fish: "You spot a fish shadow beneath the water — tap again for another surprise!",
  story: "A magical book rests on a pedestal: Our Story, waiting for your timeline.",
  duck: "Quack! The duck paddles over as if to say hello.",
  butterfly: "A butterfly drifts through the garden — beauty in something small.",
  mug: "The coffee mug is still warm. Made with love, like everything here.",
  "bench-lantern": "The lantern beside the bench glows soft amber — safe light for late walks.",
  "wall-photo-1": "This polaroid on the board is waiting for your first memory.",
  "wall-photo-2": "Another pin on the notice board — more stories will appear as you explore.",
  cat: null,
  "village-welcome": "Welcome home, Agent — every object here was placed with you in mind.",
};

const HEARTHAVEN_BRIEFING = [
  `Welcome home, Agent ${AGENT_NAME}.`,
  "You reached this cottage from the kingdom map — your cozy base on the quest.",
  "Explore every corner — some hide little surprises just for you.",
  "When you're ready, return to the map and continue toward Memory Forest.",
];

const HEARTHAVEN_LETTERS = [
  {
    id: "welcome",
    unlockAfter: null,
    from: "For you, always ♥",
    preview: "Welcome home…",
    lockedMessage: null,
    body: `Dear ${AGENT_NAME},\n\nThis whole world was built for one reason — to celebrate you.\n\nEvery cottage light, every path on the map, and every surprise along the way is a little piece of how much you mean to me.\n\nTake your time here. Explore, laugh, collect memories — and when you're ready, follow the road to your next adventure.\n\nWith all my love ♥`,
  },
  {
    id: "memory-forest",
    unlockAfter: "memory-forest",
    from: "Memory Forest",
    preview: "The trees remember...",
    lockedMessage: "This letter is still traveling from Memory Forest — complete that mission first.",
    body: "Every memory you unlocked glows a little brighter now.\n\n<!-- ADD LETTER CONTENT HERE -->",
  },
  {
    id: "beach-chaos",
    unlockAfter: "beach-chaos",
    from: "Beach of Chaos",
    preview: "Sandy footprints",
    lockedMessage: "Sandy footprints haven't arrived yet — visit Beach of Chaos first.",
    body: "Chaos, sand, and endless laughs.\n\n<!-- ADD LETTER CONTENT HERE -->",
  },
  {
    id: "birthday-vault",
    unlockAfter: "birthday-vault",
    from: "The Vault",
    preview: "You made it.",
    lockedMessage: "The final letter unlocks when you open the Birthday Vault.",
    body: "The final surprise is yours.\n\n<!-- ADD LETTER CONTENT HERE -->",
  },
];

const HEARTHAVEN_PHOTOS = [
  {
    id: "p1",
    unlockAfter: null,
    caption: "Our beginning",
    emoji: "📷",
    memoryText: "The first pin on your notice board — add your photo here.",
    lockedMessage: null,
  },
  {
    id: "p2",
    unlockAfter: "hearthaven",
    caption: "Home sweet home",
    emoji: "🏡",
    memoryText: "You accepted the mission — this cottage is officially yours.",
    lockedMessage: "This memory unlocks after you accept the mission at the cottage.",
  },
  {
    id: "p3",
    unlockAfter: "memory-forest",
    caption: "Forest memories",
    emoji: "🌳",
    memoryText: "Trees and trails from Memory Forest will live here.",
    lockedMessage: "Complete Memory Forest to reveal this polaroid.",
  },
  {
    id: "p4",
    unlockAfter: "beach-chaos",
    caption: "Beach day",
    emoji: "🏖",
    memoryText: "Sun, sand, and chaos — beach memories go here.",
    lockedMessage: "Beach of Chaos holds this photo — adventure there first.",
  },
  {
    id: "p5",
    unlockAfter: "pizza-kingdom",
    caption: "Pizza night",
    emoji: "🍕",
    memoryText: "Cheesy kingdom victories belong on this pin.",
    lockedMessage: "Pizza Kingdom will unlock this slice of memory.",
  },
  {
    id: "p6",
    unlockAfter: "birthday-vault",
    caption: "The finale",
    emoji: "👑",
    memoryText: "The crown jewel memory — saved for the vault.",
    lockedMessage: "Only the Birthday Vault can unlock this final photo.",
  },
];

const HEARTHAVEN_BENCH_MESSAGES = [
  "Sit with me a while — you're exactly where you belong.",
  "Every adventure starts from a place called home.",
  "<!-- ADD PERSONAL MESSAGE HERE -->",
  "The pond reflects the sky, but you reflect my favorite kind of magic.",
];

const HEARTHAVEN_FLOWERS = [
  { id: "rose-1", message: "You found a secret thought ❤️ — you make ordinary days extraordinary." },
  { id: "lavender", message: "This lavender whispers: you are deeply loved." },
  { id: "sunflower", message: "Like you — always turning toward the light." },
  { id: "daisy", message: "A small bloom, a big feeling. That's us." },
];

const HEARTHAVEN_CAT_LINES = [
  "I think someone loves you.",
  "Meow.",
  "Today's a good day.",
  "The cottage is happy you're here.",
  "Purr... that means yes.",
];

const HEARTHAVEN_HIDDEN = [
  { id: "lantern-l", message: "A warm light just for you ✨" },
  { id: "lantern-r", message: "Every lantern here spells your name." },
  { id: "stone-1", message: "Wishing stone: may all your dreams feel this cozy." },
  { id: "star-patch", message: "You found a falling wish ⭐" },
  { id: "flower-pot", message: "Secret bloom: love grows here daily." },
  { id: "fence-heart", message: "Someone carved a heart on this fence..." },
  { id: "chimney", message: "The smoke carries hugs upward." },
  { id: "porch-step", message: "First step home is always the sweetest." },
  { id: "garden-gnome", message: "Tiny guardian says: you're treasured." },
  { id: "pond-lily", message: "Lily pad luck — +1 heart of happiness." },
  { id: "book-pedestal", message: "Our story is still being written." },
  { id: "bee", message: "Busy bee approves of your kindness 🐝" },
];

const HEARTHAVEN_POND_SURPRISES = [
  "A fish splashes — sending ripples of good luck!",
  "The duck quacks happily at you.",
  "Something glimmers beneath the water... it's love.",
];

const SIGNPOST_DESTINATIONS = [
  { emoji: "🌳", name: "Memory Forest" },
  { emoji: "🏖", name: "Beach of Chaos" },
  { emoji: "🍕", name: "Pizza Kingdom" },
];

window.AGENT_NAME = AGENT_NAME;
window.HEARTHAVEN_TAP = HEARTHAVEN_TAP;
window.HEARTHAVEN_BRIEFING = HEARTHAVEN_BRIEFING;
window.HEARTHAVEN_LETTERS = HEARTHAVEN_LETTERS;
window.HEARTHAVEN_PHOTOS = HEARTHAVEN_PHOTOS;
window.HEARTHAVEN_BENCH_MESSAGES = HEARTHAVEN_BENCH_MESSAGES;
window.HEARTHAVEN_FLOWERS = HEARTHAVEN_FLOWERS;
window.HEARTHAVEN_CAT_LINES = HEARTHAVEN_CAT_LINES;
window.HEARTHAVEN_HIDDEN = HEARTHAVEN_HIDDEN;
window.HEARTHAVEN_POND_SURPRISES = HEARTHAVEN_POND_SURPRISES;
window.SIGNPOST_DESTINATIONS = SIGNPOST_DESTINATIONS;
