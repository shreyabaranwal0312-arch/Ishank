/**
 * Dream Sanctuary — Magical Love Book pages
 * Edit reasons, memories, and photo paths below.
 * Photos: set `src` to your image path (e.g. "images/our-memory-1.jpg")
 */

const LOVE_BOOK = {
  title: "A Book of Us",
  subtitle: "Written in starlight, for Ishank",
  pages: [
    {
      kind: "cover",
      line1: "For You",
      line2: "With All My Love",
      flourish: "✦",
    },
    {
      kind: "reason",
      label: "A reason I love you",
      title: "The way you listen",
      text: "You hear the small things — not just my words, but the feeling behind them. That quiet attention makes me feel safe enough to be completely myself.",
    },
    {
      kind: "memory",
      label: "A memory",
      title: "The laugh that lit up the room",
      date: "One of our ordinary evenings",
      text: "We were doing nothing special, and you laughed at something silly I said. In that moment I thought: I want a lifetime of sounds like that.",
    },
    {
      kind: "photo",
      label: "A moment frozen in time",
      caption: "Quiet chai, your shoulder, my peace — an ordinary afternoon I never want to forget",
      src: "images/memory-chai-together.png",
      alt: "Us resting together at a chai cafe",
    },
    {
      kind: "reason",
      label: "A reason I love you",
      title: "Your stubborn kindness",
      text: "You show up for people even when it's inconvenient. You carry love like it's not heavy — and it inspires me to be softer with the world.",
    },
    {
      kind: "memory",
      label: "A memory",
      title: "Late-night talks",
      date: "When the world went quiet",
      text: "The hours stretched and we still had more to say. I fell asleep grateful — not for the day, but for the person on the other side of the screen.",
    },
    {
      kind: "photo",
      label: "A moment frozen in time",
      caption: "Heart balloons, mirror smiles, and you being perfectly, playfully you",
      src: "images/memory-heart-balloons.png",
      alt: "Mirror selfie with red heart balloons",
    },
    {
      kind: "reason",
      label: "A reason I love you",
      title: "You make ordinary sacred",
      text: "Coffee, walks, bad jokes, shared silence — you turn simple things into something I want to keep forever in my heart.",
    },
    {
      kind: "memory",
      label: "A memory",
      title: "When you said you were proud of me",
      date: "A day I almost forgot my worth",
      text: "You reminded me who I am. Not with a speech — just with honesty and warmth. I carry that sentence like a charm.",
    },
    {
      kind: "photo",
      label: "A moment frozen in time",
      caption: "Purple lights, your shoulder, my favorite place in the world — right beside you",
      src: "images/memory-purple-lights.png",
      alt: "Couple selfie in soft purple and blue light",
    },
    {
      kind: "close",
      title: "Always",
      text: "This book will keep growing — with new pages, new photos, new reasons. But this will never change: you are my favorite person, my home, my joy.",
      signOff: "Happy birthday, my love.",
      signature: "Forever yours ♥",
    },
  ],
};

window.LOVE_BOOK = LOVE_BOOK;
