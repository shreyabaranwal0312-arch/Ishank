/** Inside Joke Dungeon — meme quiz gates */

const JOKE_DUNGEON_GATES = [
  {
    id: "gate-1",
    label: "Gate of Denial",
    sign: "🚧 MOOD DETECTOR AHEAD",
    question: 'When I say "I\'m fine" — what does that actually mean?',
    options: [
      "I'm fine",
      "I'm hungry",
      "Read my mind",
      "You are in danger",
    ],
    correctIndex: 3,
    wrongReactions: [
      "The dungeon laughs. That was the trap answer. Nobody is ever just fine.",
      "Close! Hunger is real — but this gate wanted the nuclear option.",
      "If only. The crystal ball is in the shop. Try again, brave soul.",
      "✓ The torches flicker green. You speak fluent relationship.",
    ],
  },
  {
    id: "gate-2",
    label: "Party Exit Protocol",
    sign: "🎉 LEAVING SOON™",
    question: 'When I say "we should leave the party," I usually mean:',
    options: [
      "Let's go right now",
      "Give me 20 more minutes",
      "I'm having the time of my life",
      "I forgot my jacket on purpose",
    ],
    correctIndex: 1,
    wrongReactions: [
      "A goblin whispers: 'That's what you WISH you meant.'",
      "✓ Correct. The meme spirits nod solemnly.",
      "The DJ drops a sad trombone. Not this timeline.",
      "Suspicious. Very suspicious. Try again.",
    ],
  },
  {
    id: "gate-3",
    label: "Thumb Oracle",
    sign: "👍 TEXT DECODER",
    question: "If I send a single 👍 in a text, I probably mean:",
    options: [
      "Amazing idea, 10/10",
      "I'm mad but too tired to type a paragraph",
      "Pizza confirmed",
      "Let's elope",
    ],
    correctIndex: 1,
    wrongReactions: [
      "Too wholesome for this dungeon. The 👍 is rarely that pure.",
      "✓ You decoded the passive-aggressive thumb. Legend.",
      "Wrong wing of the dungeon — that's the Pizza Kingdom door.",
      "Romantic, but incorrect. The gate demands truth.",
    ],
  },
  {
    id: "gate-4",
    label: "The Nothing Chamber",
    sign: "😐 'NOTHING' ZONE",
    question: 'When I say "nothing" — what am I usually thinking?',
    options: [
      "Literally nothing, zen mode",
      "Everything. You've done something.",
      "Snack inventory check",
      "Let's rewatch that one show",
    ],
    correctIndex: 1,
    wrongReactions: [
      "A pixel skull appears: 'Cap.' Try again.",
      "✓ The walls exhale. You passed the Nothing Trial.",
      "Valid vibe, wrong gate. Hunger is universal though.",
      "Close energy — but 'nothing' is never nothing.",
    ],
  },
  {
    id: "gate-5",
    label: "Dinner Denial Vault",
    sign: "🍽️ 'NOT HUNGRY' LAB",
    question: '"I\'m not hungry" at dinner usually means:',
    options: [
      "I will not eat a single crumb",
      "I will eat half your plate",
      "Salad is my whole personality now",
      "I'm cooking for you instead",
    ],
    correctIndex: 1,
    wrongReactions: [
      "The dungeon serves you an empty plate labeled 'Lies.'",
      "✓ Half your fries: gone. Gate unlocked.",
      "A lettuce goblin is offended. Wrong answer.",
      "Sweet, but this gate is about shared food crimes.",
    ],
  },
];

window.JOKE_DUNGEON_GATES = JOKE_DUNGEON_GATES;
