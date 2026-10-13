<div align="center">

# ✨ Wisdom Clicker 🍊

**A cozy idle game about a sleepy cat, a very persistent tangerine, and the slow accumulation of wisdom.**

*Press the button, youngin.*

### 🎮 [**Play it live → miendy.github.io/wisdom-clicker**](https://miendy.github.io/wisdom-clicker/)

[![Play Now](https://img.shields.io/badge/%E2%96%B6%20play-now-f0c24f?style=for-the-badge&labelColor=1b1830)](https://miendy.github.io/wisdom-clicker/)
[![Made with vanilla JS](https://img.shields.io/badge/made%20with-vanilla%20JS-e5577f?style=for-the-badge&labelColor=1b1830)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No build step](https://img.shields.io/badge/no%20build%20step-%E2%9C%A8-f08a24?style=for-the-badge&labelColor=1b1830)](https://miendy.github.io/wisdom-clicker/)

</div>

---

## 🌙 What is this

Somewhere between a sunbeam and a nap, there sits a cat who knows everything.

On his head balances a tangerine. It has not fallen in a hundred years.

You are standing in his sunbeam. He has noticed. He is, in his own words, *mostly* awake.

**Wisdom Clicker** is a slow-burn idle game in that tradition. You click a button, the cat says something wise or withering, and wisdom accrues. Spend it on upgrades. Buy enough and the cat will fight you for the tangerine. Win, and your wisdom doubles. Forever. Somewhere in the middle of all this, a small grey gremlin will text you riddles and try to steal your stuff.

It is a game about patience. It is not patient with you.

**👉 [Play it now, no download required.](https://miendy.github.io/wisdom-clicker/)**

---

## 🐾 What's in it

<table>
<tr>
<td width="50%" valign="top">

### 🍊 The Clicker
- **27 upgrades** across four tiers — common, rare, epic, legendary
- **Combo system** — click fast, climb the multiplier, watch it pop
- **Synergy upgrades** — certain boosts scale with each other
- **Golden Tangerines** — drift past, click for loot
- **Offline earnings** — cats keep working while you're away

</td>
<td width="50%" valign="top">

### ⚔️ The Fight
- **Boss battles** against the Tangerine Cat himself
- **Three boss forms** — default, ghost, and the Tangerine King
- **Two-phase fights** — dodge fruit, then sneak past a sleeping god
- **Permanent ×2 multiplier** per victory
- **Flawless victories** award a hidden achievement

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 😼 The Gremlin
- **Silly Cat** appears at milestones and demands a riddle
- Solve it → forced favor from the Wise Cat (×5 wisdom)
- Fail it → he takes most of your stash
- **Typo-tolerant** — two tries, Levenshtein forgives small mistakes
- **One upgrade branch** makes him harmless forever. He will sulk.

</td>
<td width="50%" valign="top">

### 🌟 The Tree
- **15 nodes** across six branches — sleep, luck, flow, pride, insight, gremlin
- **Permanent purchases** that survive every Transcend
- **Insight** earned from each prestige, never lost
- **Refundable** for 5 Insight if you change your mind
- **Locked nodes** stay hidden until you've Transcended enough times

</td>
</tr>
</table>

---

## 🎭 The Cast

| | |
|---|---|
| **The Wise Cat** 🍊 | Sleepy. Ancient. Balances a tangerine on his head. Calls you *youngin*. Will fight you for fruit. |
| **Silly Cat** 😼 | Small. Grey. Chaotic. Steals your wisdom via riddle games. Has a Pact he regrets signing. |
| **Hareld** 🐰 | Very loud. Arrives by falling through the ceiling. Speaks in capitals. Has never once been understood. |
| **Professor Mittens** 🎩 | Distinguished scholar. Certified pedagogue. Will smack you mid-sentence to make a point. |

---

## 🧠 Under the hood

No frameworks. No bundler. No `package.json` with 400 transitive dependencies. Just three files and a folder of cat pictures.

```
wisdom-clicker/
├── index.html      ← everything, one script tag, all systems
├── style.css       ← comic-book shadows, hand-drawn borders, chaos
├── wisdoms.txt     ← the cat's vocabulary (one line per quote)
└── img/
    ├── wisdom_cat.jpg
    ├── silly_cat.jpeg
    ├── mittens.jpeg
    └── hareld.jpg
```

### Systems that all talk to each other

- **Persistence** — `localStorage`, three keys (`save`, `achs`, `stats`), plus tutorial and story flags
- **Offline earnings** — recorded on `visibilitychange` and `beforeunload`, capped by your Sleep branch
- **Achievements** — 24 of them, each granting a small permanent buff
- **Audio** — procedural WebAudio, no samples. Boss themes, ambient drones, combo pitch scaling. Muteable.
- **Tutorial** — SVG-masked spotlight, walks you through each new mechanic the first time it appears
- **Story** — a full visual-novel engine with beats, branching choices, and cutscenes
- **Notifications** — iOS-style banners stacked in the corner, clickable, queue-aware

### The math

```
perClick = baseClickFlat × bossMult × boostMul × achMul × insightMul × comboMult
perSec   = baseSecFlat  × bossMult × boostMul × achMul × insightMul
```

Everything multiplies. Nothing is additive at the top. This is deliberate — it means every system you engage with makes every *other* system better.

---

## 🚀 Running it locally

```bash
# Option 1: just open it
open index.html

# Option 2: serve it properly (recommended — fetch() needs http)
python3 -m http.server 8000
# then visit http://localhost:8000
```

There is no step 3. There is no `npm install`. The cat does not have a package manager.

**Requirements:** a browser made after 2020. That's it.

---

## 🌐 Deployment

The game is hosted on **GitHub Pages** and lives at:

**→ [https://miendy.github.io/wisdom-clicker/](https://miendy.github.io/wisdom-clicker/)**

To deploy your own fork:

1. Fork or clone the repo
2. Push it to a GitHub repository named `wisdom-clicker` (or anything you like)
3. Go to **Settings → Pages**
4. Set source to **Deploy from a branch**, branch `main`, folder `/ (root)`
5. Wait a minute. The cat will appear.

No CI, no build, no workflow file. Static files in, static files out.

---

## 🌳 The Orchard (roadmap)

Things that might grow here eventually:

- [ ] More wisdom quotes. There can never be enough.
- [ ] A fourth boss form. The Tangerine Cat has cousins.
- [ ] Save export/import. For people who switch browsers.
- [ ] Seasonal events. The gremlin deserves a Halloween costume.
- [ ] A proper ending. Or not. Cats don't end.

---

## 💛 A note on the design

This is not a game about numbers going up. Well. It *is*. But it's also a game about a specific feeling: the feeling of being told *patience, youngin* by something that has been asleep for a century and is not impressed by you.

The numbers are a scaffold. The cat is the point.

If you play for ten minutes and close the tab smiling, it worked.

---

<div align="center">

**🍊 May your thumb stay strong and your tangerine stay on your head. 🍊**

*Wisdom is knowing when to stop clicking. You will not stop clicking.*

### [▶ Play Wisdom Clicker](https://miendy.github.io/wisdom-clicker/)

</div>
