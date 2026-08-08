# Claude — Single Source of Truth

**This folder (`/Users/addie/ClaudeProjects`) is the one and only hub for Addie's work.**
It lives at the home-folder root and is **NOT synced to iCloud Drive** (unlike Desktop/Documents/Downloads),
so work here stays local/private and does not show up under "iCloud Drive" in Finder.
Any Claude thread MUST read this file first and follow the rules below.

## ⚠️ Things every thread must know

1. **Current brand: "Opportunity Designed"** (opportunitydesigned.com).
   "Strategy Studio" / "The Strategy Studio" is the **OLD brand** — fully archived. Do not create
   new work under that name unless Addie explicitly asks.
2. **Save only here:** `/Users/addie/ClaudeProjects`.
   Deprecated locations (stale; nothing deleted): `/Users/addie/Documents/Claude` (iCloud-synced — this is
   why work used to show "in Drive"), `/Users/addie/CodeClaudeProjects`, and loose Desktop/Downloads folders.
   ⚠️ Do NOT save into Desktop/Documents/Downloads — those are synced to iCloud Drive and cause the
   "extra copies in Drive" problem. This folder avoids that.
3. **Never delete.** Move superseded files into an `archive/` folder. Nothing is ever deleted.

## The master-file rule

1. **Only work on the MASTER versions** in `MASTER_FILES.md`. They live under `01-projects/`, `02-apps/`,
   and `03-documents/`. They are the current, canonical, most-recent files.
2. **Every `archive/` folder is reference-only.** Never edit archived files or treat them as current.
3. To revise something, edit the **master in place**. To snapshot first, copy it into the nearest
   `archive/` with a dated name, then edit the master.
4. If you can't tell which file is the master, **ask** rather than guess.

## Where things live

```
ClaudeProjects/                  (/Users/addie/ClaudeProjects — local, NOT in iCloud)
├── 01-projects/
│   ├── opportunity-designed/   ← consulting business (Opportunity Designed brand)
│   │   ├── current/            ← ALL current masters live here
│   │   │   ├── templates/      ← MASTER templates: TEMPLATE-*, MASTER-Services-Agreement,
│   │   │   │                      MUTUAL-NDA, INVOICE, Rate-Card, Discovery-Call-Guide, Onboarding
│   │   │   ├── Inquiry Response/ ← ops: inquiry tracker, response templates, setup guide, apps script
│   │   │   ├── website/        ← MASTER brand website (index.html + images)
│   │   │   ├── brand/          ← brand playbook (.docx) — sole brand master
│   │   │   └── clients/sx-collective/  ← SX Collective deliverables (newest = master) + archive/
│   │   └── archive/            ← old-brand + version history + pre-rename snapshot (reference-only)
│   ├── fb marketplace/         ← MASTER Facebook Marketplace docs
│   │   └── marketplace-tracker/  ← Next.js app (git history)
│   └── mood-of-mine/           ← Mood of Mine business (business plan .docx + site/ mockups)
├── 02-apps/
│   ├── addie-dashboard/        ← React/Vite dashboard (run `npm install` to rebuild node_modules)
│   └── my-plugin/              ← Claude plugin
├── 03-documents/
│   └── resume/                 ← Addie's resume (docx + pdf)
├── 04-archive/                 ← top-level reference archive (old brand, prior hubs) — do not edit
├── CLAUDE.md                   ← this file
└── MASTER_FILES.md             ← authoritative index of every master file
```

See `MASTER_FILES.md` for the full list of master paths.

_Last consolidated: 2026-06-03. Brand: Strategy Studio → Opportunity Designed (name references in
client docs, rate card, tracker, website notes & apps-script updated; masters moved under `current/`).
Hub: /Users/addie/ClaudeProjects (canonical, local — NOT iCloud). Documents/Claude, CodeClaudeProjects,
and Desktop folders retired (not deleted)._
