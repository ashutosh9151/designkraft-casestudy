# ReaLence Solutions — Professional Case-Study Portfolio

A polished, modern way for a digital agency to showcase its work.

This is **not** a basic portfolio. Every project is presented as a full case study with:

- Challenge
- Solution  
- Results + measurable metrics
- Features & technology stack
- Screenshot gallery
- Live site / demo links

Built to impress potential clients while remaining extremely easy for the agency to maintain.

---

## What’s included

| Feature | Description |
|---------|-------------|
| **Case-study modal** | Challenge → Solution → Results structure |
| **Metrics cards** | Conversion lifts, retention, speed, etc. shown upfront |
| **Powerful filters** | Industry + Service + Technology + Search |
| **Featured strip** | Highlight best projects at the top |
| **Deep linking** | Shareable URLs (`#project/project-id`) |
| **Prev / Next navigation** | Browse case studies with keyboard (← →) or buttons |
| **Gallery lightbox** | Click any screenshot to enlarge |
| **Hero stats** | Project count, industries, years covered |
| **Capabilities section** | Positions the agency professionally |
| **Approach / Process** | Discover → Design → Build → Launch |
| **Loading skeleton** | Smooth first load experience |
| **Fully responsive** | Works great on mobile |
| **Zero backend** | Pure static — host anywhere |
| **Easy updates** | Just edit `data/projects.json` |

---

## Folder structure

```
ReaLence Solutions/
├── index.html
├── css/styles.css
├── js/app.js
├── data/projects.json    ← edit this to add/update work
├── assets/               ← project screenshots
└── README.md
```

---

## Run locally

You must serve the folder (so the JSON can load):

```bash
cd ReaLence Solutions-upgraded
python -m http.server 8080
```

Then open: **http://localhost:8080**

---

## Add or update a project

Open `data/projects.json` and add an object:

```json
{
  "id": "unique-slug",
  "title": "Project title",
  "client": "Client name",
  "year": 2026,
  "industry": "E-commerce",
  "services": ["Web Design", "Development"],
  "technologies": ["Next.js", "TypeScript"],
  "shortDescription": "One-line card summary.",
  "challenge": "What problem did the client face?",
  "solution": "What did we do?",
  "results": "What changed? Prefer concrete outcomes.",
  "metrics": [
    { "value": "28%", "label": "Lower abandonment" },
    { "value": "62%", "label": "Faster load" }
  ],
  "features": ["Feature one", "Feature two"],
  "thumbnail": "assets/your-image.jpg",
  "gallery": [
    "assets/screen-1.jpg",
    "assets/screen-2.jpg"
  ],
  "liveUrl": "https://example.com",
  "liveDemo": null,
  "featured": true
}
```

- Set `"featured": true` to show in the top strip.
- `gallery` supports multiple screenshots (clickable lightbox).
- `metrics` are the numbers that make the work credible.
- Refresh the browser after saving.

---

## Host (no build step)

Upload the folder to any static host:

- Netlify
- Vercel
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront

---

## Design principles

1. **Outcome over aesthetics** — Every project tells a story with results.
2. **Scannable** — Metrics, filters, and short descriptions let visitors decide quickly.
3. **Professional, not flashy** — Dark, refined UI that feels premium.
4. **Maintainable** — One JSON file keeps content updates simple for the agency team.
5. **Shareable** — Deep links let you send a specific case study to a client.

---

## Keyboard shortcuts (inside case study)

- `Esc` — Close
- `←` — Previous project
- `→` — Next project
