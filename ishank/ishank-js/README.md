# Ishank

Fresh React + Vite starter with Firebase wired via `.env`.

## Setup

```bash
npm install
```

Firebase keys live in `.env` (gitignored). Template: `.env.example`.

```bash
npm run dev
```

## Firebase

- `src/firebase.js` — app + Firestore init
- `firebase/firestore.rules` — deploy with Firebase CLI when ready

```bash
firebase deploy --only firestore:rules
```
