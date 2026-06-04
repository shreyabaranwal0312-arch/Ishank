/** Memory Forest — quiz questions & answers */

const MEMORY_FOREST_ORBS = [
  {
    id: "orb-1",
    label: "First Date",
    question: "👕 What colours were we wearing on our first date?",
    options: [
      "Me: Pink, You: White",
      "Me: Black, You: Blue",
      "Me: Red, You: Black",
      "Me: White, You: Grey",
    ],
    correctIndex: 1,
    heartsReward: 2,
    keysReward: 1,
  },
  {
    id: "orb-2",
    label: "Together Always",
    question: "What's something I hope we never stop doing together?",
    options: [
      "Taking selfies everywhere",
      "Eating together ❤️",
      "Watching random reels",
      "Arguing over where to eat",
    ],
    correctIndex: 1,
    heartsReward: 2,
    keysReward: 1,
  },
  {
    id: "orb-3",
    label: "Our Bond",
    question: "What makes our relationship special?",
    options: [
      "We never have disagreements.",
      "We always know exactly what the other person is thinking.",
      "No matter what happens, we keep choosing each other at the end of the day. ❤️",
      "We like all the same things.",
    ],
    correctIndex: 2,
    heartsReward: 2,
    keysReward: 1,
  },
  {
    id: "orb-4",
    label: "Golden Memory",
    question: "What's the most special thing you've done for me?",
    options: [
      "Planned a trip to Chandigarh just so we could spend time together.",
      "Asked me to be your girlfriend and changed my life forever.",
      "Brought me food on my worst days when I needed comfort the most.",
      "Held me close and reassured me a thousand times when my anxiety got the best of me.",
    ],
    allAnswersCorrect: true,
    heartsReward: 4,
    keysReward: 1,
    winMessageHtml: `
      <p class="mf-golden-msg__line">✨ Correct... but not because there was one right answer.</p>
      <p class="mf-golden-msg__line">❤️ The truth is, every one of these moments means the world to me.</p>
      <p class="mf-golden-msg__quote">"You loved me in adventures, in celebrations, in difficult days, and in moments when I needed reassurance the most. How could I ever choose just one?"</p>
      <p class="mf-golden-msg__banner font-pixel">🌟 ALL ANSWERS CORRECT 🌟</p>
      <p class="mf-golden-msg__rewards">❤️ +4 Hearts · 🗝️ +1 Memory Key</p>
    `,
  },
];

window.MEMORY_FOREST_ORBS = MEMORY_FOREST_ORBS;
