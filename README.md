# Receipt — What did your week really cost?

> The planet does not send invoices. So we printed one for you.

A satirical web experience for **UN SDG 12 — Responsible Consumption & Production**. Users log one week of their habits on seven sliders; the site prints a thermal-printer receipt showing the hidden environmental cost in water, carbon, and waste.

Built in 8 hours by **TECH SPERTS**.

---

## 🧾 Live Demo

[your-netlify-url-here].netlify.app

## 🎯 The Idea

You know what things cost in rupees. You don't know what they cost in water, carbon, and waste.

Most sustainability campaigns tell people to consume less without showing the real cost. The result is vague guilt and no behaviour change. **Receipt reframes consumption as a receipt** — the most familiar object people associate with cost. The format carries the meaning.

## ✨ Features

- **The Audit** — 7 sliders capture your week in 30 seconds
- **The Receipt** — Thermal-printer-style receipt animates line-by-line with real impact numbers
- **Report Card** — Letter grade from A to F with a one-line verdict
- **Compare Bar** — You vs India average, Global average, Low-impact goal
- **Return Items** — Personalised one-click swap suggestions for next week
- **The Pledge** — Pick one action for one week
- **City Multiplier** — Scale one action across your city's population
- **Hall of Receipts** — Browse Light, Average, Heavy weeks
- **Myth vs Fact** — 6 flip cards correcting climate misconceptions
- **Did You Know carousel** — rotating sourced facts
- **Impact Timeline** — one week → one year → one lifetime scaled view
- **FAQ** — expandable answers to common questions
- **Roadmap** — what we'd build next

## 🛠️ Tech Stack

- **HTML5** — semantic markup, accessible labels
- **CSS3** — custom properties, mobile-first, no framework
- **Vanilla JavaScript** — no build step, no bundler, no npm
- **GSAP** — line-by-line receipt reveal animation (loaded via CDN)
- **Google Fonts** — Space Grotesk, Inter, VT323

**Total bundle under 60KB** — because a site about reducing waste can't be heavy.

## 📊 Data Sources

Every number is cited. We invented nothing.

| Impact | Source |
|---|---|
| 1 cotton t-shirt → 2,700 L water | WWF Cotton Water Report |
| 1 kg beef → 15,415 L water, 27 kg CO₂ | FAO Water Footprint Network |
| 1 plastic bottle → 82 g CO₂ | UN Environment Programme |
| 1 online order → 1.17 kg packaging | UNEP Packaging Report |
| 1 hr HD streaming → 36 g CO₂ | IEA Digital Energy Report |
| 1 short-haul flight → 250 kg CO₂ | ICAO Carbon Calculator |
| 1 wasted meal → ~0.5 kg CO₂ + 300 L water | FAO Food Wastage Footprint |

## 🚀 Run Locally

No build step. Just open `index.html` in any browser.

```bash
# Option 1: direct open
open index.html

# Option 2: with live reload (requires Node)
npx serve .

# Option 3: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

## 🌐 Deploy

Drag the project folder into **[app.netlify.com/drop](https://app.netlify.com/drop)**. Live in 10 seconds. Done.

For a custom name, create a free account and change the site name in Netlify's Site Settings.

## 📁 Project Structure

```
receipt-sdg12/
├── index.html      # Full HTML markup
├── styles.css      # All styles with CSS variables
├── script.js       # Receipt logic, animations, interactivity
├── README.md       # You are here
├── LICENSE         # MIT
└── .gitignore
```

## 🎨 Design System

- **Palette:** near-black `#0a0a0a`, warm cream `#f4f1ea`, red `#ff3b1f`, muted gold `#d4a574`
- **Typography:** Space Grotesk (headings), Inter (body), VT323 (receipt)
- **Motion:** GSAP stagger for line reveal, CSS transitions for bars and cards
- **Voice:** confident, dry, slightly satirical — no lecturing

## 👥 Team — TECH SPERTS

A three-person studio for one weekend only.

- **[Your name]** — Lead, design, pitch
- **[Member 2]** — Frontend, animation
- **[Member 3]** — Data, logic, QA

## 🤖 Honest AI Use

We used AI to accelerate HTML and CSS scaffolding. The concept, data research, copywriting, and design decisions are ours. Every line of code is reviewed and understood by the team.

## 📜 License

MIT — see [LICENSE](LICENSE).

---

**SDG 12 is about responsible consumption. We think the first step is making the invisible visible.**

Built for the [YOUR HACKATHON NAME] hackathon, 2026.
