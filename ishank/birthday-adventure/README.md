# Mission: Birthday Adventure ❤️

A story-driven pixel RPG for **Agent Ishank** — vanilla HTML, CSS, and JavaScript only. Runs locally in the browser (no build step, no React, no backend).

## Run

Open `index.html` in a browser, or:

```bash
npx serve .
# or
python -m http.server 8080
```

Then visit `http://localhost:8080`

## Included now

- **Intro** — classified terminal, typewriter briefing, START MISSION warp transition
- **Hearthaven Cottage** — full explorable home (cottage, mailbox, memory wall, garden, pond, cat, 11+ secrets, quest journal, signpost to map)
- **Memory Forest** — enchanted level with Memory Tree, 4 quiz orbs (+2 ♥ / +1 key each), heart burst & key reveal, completion screen
- **Beach of Chaos** — pixel arcade: catch ❤️ / dodge 💔 with basket, 20 pts in 30s, rising difficulty, **HEART COLLECTOR ❤️** achievement
- **Pizza Kingdom** — whimsical village + drag-and-drop matching, unlocks secret code letter **O**
- **World map** — 10 locations (Hearthaven first), unlock progression, illustrated landmarks, vault lock rules
- **RPG HUD** — hearts, keys, achievements, secret code
- **localStorage** auto-save
- **Music / SFX toggles** (Web Audio)
- **Placeholder blocks** on every location screen for photos, video, voice, letters, plans

## Customize

| File | What to edit |
|------|----------------|
| `js/intro.js` | Briefing lines |
| `js/locations.js` | Map order, rewards, unlock chain |
| `index.html` | Placeholder comments `<!-- ADD PHOTO HERE -->` etc. |

## Firebase

Firebase credentials remain in `../ishank-js/.env` if you add cloud save later. This game does not use Firebase yet.

## Reset save

Browser console: `localStorage.removeItem('mission-birthday-adventure-v1')`
