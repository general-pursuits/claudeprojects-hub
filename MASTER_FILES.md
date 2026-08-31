# MASTER FILES — Authoritative Index

Last updated: 2026-07-29 (folder cleanup; see log at bottom).
Hub: `/Users/addie/ClaudeProjects` (canonical, local — NOT synced to iCloud). Current brand: **Opportunity Designed**.
Work only on the files below. Anything under any `archive/` folder is reference-only.

## Opportunity Designed (consulting business) — `Projects/opportunity-designed/current/`

All current masters live under `Projects/opportunity-designed/current/`. The sibling
`Projects/opportunity-designed/archive/` is reference-only.

Master templates — `Projects/opportunity-designed/current/templates/`:
- `MASTER-Services-Agreement.docx`
- `MUTUAL-NDA.docx`
- `INVOICE-Template.docx`
- `INTERNAL-Rate-Card.docx`
- `Discovery-Call-Guide.docx`
- `Client-Onboarding-Packet.docx`
- `TEMPLATE-Proposal.docx`
- `TEMPLATE-Timeline-and-Scope.docx`
- `TEMPLATE-Cover-Letter.docx`
- `TEMPLATE-Fill-In-Guide.docx`

Operations — `Projects/opportunity-designed/current/Inquiry Response/`:
- `opportunity-designed-inquiry-tracker.xlsx`
- `opportunity-designed-response-templates.md`
- `opportunity-designed-setup-guide.md`
- `opportunity-designed-apps-script.js`

Brand — `Projects/opportunity-designed/current/brand/`:
- `OpportunityDesigned_Brand_Marketing_Playbook.docx` (sole brand master)
  (the old `brand-voice-guidelines.md` companion is now in `Projects/opportunity-designed/archive/`)
- `logo/` — logo master: `opportunity-designed-logo.html` (lockup sheet) + transparent mark PNGs
  (`-mark-black`, `-mark-ochre`, `-mark-silver`, `-mark-lavender`). Stamp mark extracted from Addie's
  hand-pressed stamp photo; wordmark "OPPORTUNITY DESIGNED" + signature "Opportunity. Designed."

Website — `Projects/opportunity-designed/current/website/`:
- `index.html` — **MASTER, locked 2026-07-17** (redesigned layout approved by Addie; locked copy in
  `website/snapshots/2026-07-17_MASTER-index-locked/`; edit only on Addie's explicit request)
- `about.html` — **MASTER, locked 2026-07-17** (redesigned layout, mark triptych; locked copy in
  `website/snapshots/2026-07-17_MASTER-about-locked/`; edit only on Addie's explicit request)
- `contact.html` — **MASTER, locked 2026-07-17** (original page layout with footer matched to index/about;
  locked copy in `website/snapshots/2026-07-17_MASTER-contact-locked/`; edit only on Addie's explicit request)
- `images/` (logo, headshots, competitor logos, favicons)

## Clients — `Projects/opportunity-designed/current/clients/sx-collective/`  (newest = master)
- `SX-Collective-Proposal.docx` (2026-05-28)
- `SX-Collective-Timeline-and-Scope.docx` (2026-05-28)
- `SX-Collective-Cover-Letter.docx` (2026-05-28)
- `SX-Collective-Competitive-Analysis.docx` (2026-04-20)
- `SX-Collective-Separation-Agreement.docx`
- `current/clients/sx-collective/archive/` — 18 older/comment versions (reference-only)

## Facebook Marketplace app — `Projects/fb marketplace/marketplace-tracker/`
- Next.js + Prisma (git history + node_modules)

## Facebook Marketplace — `Projects/fb marketplace/`
- `FB Marketplace Pricing Advice.txt`
- `Product Listings and Inventory.txt`
- `facebook_marketplace_inventory (template).xlsx`

## Mood of Mine — `Projects/mood-of-mine/`
- `Addie's Business Plan - Merged.docx` — business plan (master)
- `site/homepage.html`, `site/collection-grid.html` — site mockups

## Apps — `02-apps/`
- `02-apps/addie-dashboard/` — React/Vite dashboard (run `npm install` to restore node_modules)
- `02-apps/my-plugin/` — Claude plugin

## Documents — `03-documents/`
- `resume/Addie_Morrow_Resume.docx`, `resume/Addie_Morrow_Resume.pdf`

---

## Archive (reference-only — never edit or treat as current)
- `Projects/opportunity-designed/archive/old-brand-strategy-studio/` — old Strategy Studio ops files, website, brand assets
- `Projects/opportunity-designed/archive/pre-rename-snapshot-2026-06-03/` — pre-rebrand copies of the files renamed Strategy Studio → Opportunity Designed
- `Projects/opportunity-designed/current/clients/sx-collective/archive/` — SX Collective version history (v2–v5 comment drafts, dated copies)
- `Projects/opportunity-designed/archive/temp-artifacts/` — stray build zips
- `04-archive/` (top level) — prior hub structures folded in (from ClaudeProjects, career-old, the-strategy-studio-old)

## Duplicate copies elsewhere (per "don't delete" — nothing removed)
The same content still exists in these locations; all of it is preserved here in the canonical hub:
- `/Users/addie/Documents/Claude` — full copy, but this is **iCloud-synced** (shows "in Drive"). Superseded by this hub.
- Desktop: `strategystudiotemplates`, `addie-dashboard`, `mood-of-mine`, `main`, `SX_Collective_Competitive_Analysis.docx`
- Downloads: SX-Collective copies
These can be moved to an archive folder or trashed whenever Addie chooses. To stop work showing in iCloud
Drive, either remove the `Documents/Claude` copy or disable iCloud "Desktop & Documents Folders" sync in
System Settings → Apple ID → iCloud → iCloud Drive → Options.


---

## 2026-07-29 · Folder cleanup — archived to `Projects/opportunity-designed/02-archive/2026-07-29_cleanup/`

Moved out of `01-current/` (reversible; nothing deleted):

- **website/page-build/** — retired build system (`build_site.py`, `assets_new.py`, `build_docx.js`). The site now deploys ONLY from `website/deploy-live/` (git → GitHub `general-pursuits/opportunityDesigned-website` → Netlify; see `website/HOW-TO-DEPLOY.md`). Unpublished drafts live in `website/working-drafts/`.
- **website/css, js, fonts, images (root duplicates)** — `deploy-live/` carries its own self-contained copies.
- **website/content-drafts, master-web-copy.docx** — superseded draft copy.
- **website/__pycache__, _deploy_tmp, _to_delete, ~$…docx lock files, Screenshot*.png** — temp/junk.
- **brand identity/BRAINSTORM EDITS …Playbook.docx** — scratch draft; the live master is `OpportunityDesigned_Brand_Marketing_Playbook.docx`.

Kept in `website/`: `deploy-live/` (live), `working-drafts/` (drafts), `SEO/`, `social-and-marketing/`, `snapshots/`, `version-archive/`, `HOW-TO-DEPLOY.md`, `VIEW THE SITE.html`.

NOTE: current masters now live under `01-current/` (numbered), not `current/` — the section text above predates that rename.


---

## 2026-08-03 · Top-level folder numbering + Projects/ merge

Top-level folders numbered so they sort in a fixed order in Finder: `01-projects/`, `02-apps/` (was `apps/`), `03-documents/` (was `documents/`), `04-archive/` (was `archive/`). Hidden `.remember/` left unnumbered on purpose (numbering it would break the remember system).

Merged the stray top-level `Projects/` folder into the canonical tree. Its two files — `SEO-COMPETITIVE-LANDSCAPE.md` and `COWORK-GUIDE-marketing-seo.md` — now live only in `01-projects/opportunity-designed/01-current/website/social-and-marketing/`. A concurrent session had written a newer (10.3KB, keyword-brief-integrated) `COWORK-GUIDE-marketing-seo.md` to the old path; that newer version is now canonical, and the older 6.3KB copy is preserved in `04-archive/_merged-Projects-2026-08-03/`. Emptied `Projects/` shells parked in `04-archive/_merged-Projects-2026-08-03/` and `-take2/`.

STILL STALE (pre-existing, not touched here): section paths above still say `Projects/opportunity-designed/current/` and `.../archive/`; reality is `01-projects/opportunity-designed/01-current/` and `.../02-archive/`. References to `fb marketplace/` and `mood-of-mine/` under projects also no longer match the live tree (only `jewelry/` and `opportunity-designed/` exist under `01-projects/`). Reconcile in a dedicated pass.
