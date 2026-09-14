# 字境 (Glyphbound)

Mobile-first PWA for Mandarin reading practice. Polytopia-compressed WoW loop: **quest → travel → fight → loot → turn-in**. Fun first — learning is reading Chinese to play.

## Play

```bash
cd /workspace/glyphbound
npm install
npm run dev
```

Open `http://localhost:3000` on a phone or narrow browser (~430px).

```bash
npm run build && npm start
```

Progress saves in `localStorage` (`glyphbound_save_v1`).

## Stack

- Next.js App Router + TypeScript + React + Tailwind
- Client-side state, data-driven JSON under `data/`
- Style B: low-poly CSS/SVG diorama (chunky pines, knight, wolves, golems)

## Data files

| File | Purpose |
|------|---------|
| `data/quests.json` | 8 quests (talk / kill / collect / deliver / trial) |
| `data/lexicon.json` | Tap-gloss: Simplified Chinese → pinyin + English |
| `data/skills.json` | 斩击, 格挡, 疗伤, 猛攻 |
| `data/nodes.json` | 林边 zone node map |
| `data/enemies.json` | Wolf, boar, bandit, golem, etc. |

## How to add a quest

1. Open `data/quests.json` and append an object:

```json
{
  "id": "q9_example",
  "title": "新任务标题",
  "type": "kill",
  "giver": "守卫",
  "giverNode": "outpost",
  "description": "简短中文说明。",
  "objectives": [
    { "type": "kill", "target": "灰狼", "enemyId": "wolf", "count": 3, "label": "杀死灰狼" }
  ],
  "turnInNode": "outpost",
  "turnInNpc": "守卫",
  "turnInDialogue": [
    { "speaker": "守卫", "text": "干得好！" }
  ],
  "rewards": { "xp": 50, "literacyXp": 25, "gold": 30, "items": [] },
  "unlocks": [],
  "requiredLevel": 5,
  "requires": ["q8_trial"]
}
```

2. Add any new Chinese phrases to `data/lexicon.json` so tap-gloss works.
3. If the quest unlocks from a previous one, put `"q9_example"` in that quest’s `unlocks` array (or set `requires`).
4. Restart / rebuild — quests load from JSON at build time.

### Objective types

- `talk` — speak with NPC (`target` = NPC name)
- `kill` — defeat enemies (`enemyId` must match `enemies.json`)
- `collect` — gather items (`itemId`; use `gatherNode` for herb nodes)
- `deliver` — carry `startItems` to `deliverNode` / turn-in NPC
- `trial` — literacy trial with limited peeks (`trial.maxPeeks`)

## Soft literacy reward

Tapping Chinese shows English + pinyin. Acting without peeking grants bonus 识字 XP and better loot tips. Trials limit peeks but never softlock.

## MVP content

- Zone: 新手村 / 林边 (13 nodes)
- Class: 剑客
- Skills: 斩击, 格挡 → unlock 疗伤 (Lv3), 猛攻 (Lv5)
- 8 quests ending in 识字试炼

## Out of scope

Multiplayer, voice, handwriting, LLM NPCs, full 3D engine.

## Deploy

- **Local:** `/workspace/glyphbound` — `npm run build` must pass
- **GitHub:** https://github.com/davidlinjiahao/glyphbound
- **Vercel:** https://glyphbound-align-2caebdf4.vercel.app (team `align-2caebdf4`)

If the URL redirects to Vercel SSO, disable **Deployment Protection → Vercel Authentication** on the project (requires team dashboard / MCP scope re-auth).
