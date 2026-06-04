/** Random Love Machine — reward pools */

const LOVE_MACHINE_REEL_ICONS = ["💬", "💌", "🎟️", "😂", "🖼️", "❤️", "✨", "🎰"];

const LOVE_MACHINE_REWARDS = {
  compliment: {
    type: "compliment",
    label: "Compliment",
    emoji: "💬",
    color: "#f472b6",
    items: [
      "Your smile is my favorite plot twist.",
      "You make ordinary days feel like a celebration.",
      "The way you care about people is honestly inspiring.",
      "You're the calm in my chaos and I don't say that enough.",
      "Every version of you — sleepy, silly, serious — is my favorite.",
      /* ADD COMPLIMENTS — append more strings to this array */
    ],
  },
  loveNote: {
    type: "loveNote",
    label: "Love Note",
    emoji: "💌",
    color: "#c084fc",
    items: [
      "I still get butterflies when you text me first.",
      "Thank you for choosing me, again and again, on the hard days too.",
      "You are my home — not a place, a feeling I find in you.",
      "I fall in love with you in small moments: your laugh, your focus, your kindness.",
      /* ADD LOVE NOTES — append more strings to this array */
    ],
  },
  dateCoupon: {
    type: "dateCoupon",
    label: "Date Coupon",
    emoji: "🎟️",
    color: "#fbbf24",
    items: [
      "🎟️ Redeem: Your choice of movie + my undivided attention.",
      "🎟️ Redeem: Picnic date — I pack snacks, you pick the spot.",
      "🎟️ Redeem: Fancy coffee run and a long walk with no rush.",
      "🎟️ Redeem: Game night — winner gets a forehead kiss.",
      "🎟️ Redeem: Surprise dinner — dress code: comfortable and cute.",
    ],
  },
  funnyMemory: {
    type: "funnyMemory",
    label: "Funny Memory",
    emoji: "😂",
    color: "#4ade80",
    items: [
      "That time we laughed so hard we forgot what we were laughing about — peak us.",
      "Remember when we argued about where to eat and ended up loving the random place anyway?",
      "Your impression of [insert chaos here] — scientifically unhinged. 10/10.",
      "Every inside joke we have is a two-person language and I love being fluent in it.",
    ],
  },
  cuteImage: {
    type: "cuteImage",
    label: "Cute Image",
    emoji: "🖼️",
    color: "#93c5fd",
    items: [
      {
        caption: "ISHANK & SHREYA — a moment worth keeping forever 💕",
        src: "images/ishank-shreya-call.png",
      },
      { caption: "Placeholder — swap in your favorite photo!", src: null, emoji: "🥰" },
      /* ADD IMAGES — add { caption: "...", src: "images/your-photo.jpg" } objects */
    ],
  },
};

const LOVE_MACHINE_TYPES = [
  "compliment",
  "loveNote",
  "dateCoupon",
  "funnyMemory",
  "cuteImage",
];

window.LOVE_MACHINE_REEL_ICONS = LOVE_MACHINE_REEL_ICONS;
window.LOVE_MACHINE_REWARDS = LOVE_MACHINE_REWARDS;
window.LOVE_MACHINE_TYPES = LOVE_MACHINE_TYPES;
