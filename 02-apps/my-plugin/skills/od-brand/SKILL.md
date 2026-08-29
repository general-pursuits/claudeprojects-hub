---
name: od-brand
description: Opportunity Designed brand reference — colors, typography, voice, and visual direction. Use whenever producing any branded output for Opportunity Designed (web copy, decks, social graphics, proposals, emails) to stay on-brand without re-deriving the rules each time.
---

# od-brand — Opportunity Designed brand reference

Canonical source: `01-projects/opportunity-designed/01-current/brand identity/OpportunityDesigned_Brand_Marketing_Playbook.docx`
(the Playbook and the live site CSS at opportunitydesigned.com are the tiebreaker if this file
ever disagrees with them). Mirrored from `_brand-system/examples/brand-config-opportunity-designed.yml`
and the Notion "Brand Quick-Reference" page. Last reconciled: 2026-08-29.

## Identity

- Name: Opportunity Designed — opportunitydesigned.com
- Tagline: "Opportunity. Designed." / Operative line: "Opportunity doesn't appear. It's built."
- Founder: Addie Morrow, Independent Business Consultant, Salt Lake City (remote)
- What it does: growth strategy consulting for consumer brands and the businesses that sell
  them — smarter purchasing, sharper positioning, market access. Operator first, consultant second.
- Pillars: Strategy · Buying, Merchandising & Negotiations · Operations · Market Access · Events

## Color system (verified against live site CSS `:root` and Notion, 2026-08-29 — all match)

Ground: never true black or true white.

| Name | Hex | Use |
|---|---|---|
| Charcoal (bg) | `#2F2D2A` | Dark-section background — default canvas |
| Parchment (paper) | `#ECE7DD` | Light-section background |
| Ink (on dark) | `#EDEAE3` | Primary text on charcoal — warm off-white |
| Ink Dark (on light) | `#1A1714` | Primary text on parchment — warm near-black |
| Violet (accent) | `#8E72C6` | The one color note — links, hovers, active states |
| Deep Violet | `#6B4FA6` | Hover / emphasis state for the accent |
| Lavender | `#B49CE0` | Eyebrows, small-caps labels, light accent |
| Muted Gray | `#6B655B` | Secondary / de-emphasized text |

## Typography

Two typefaces only, both free on Google Fonts:

- **Display / Headlines:** Anton, weight 400, always uppercase — condensed, industrial. Used
  for H1s, section numerals, and every headline on the site.
- **Body / UI:** Inter, weights 300–700 — 300 for long-form body copy, 500–700 for labels,
  buttons, emphasis. 600 semibold + wide letter-spacing for eyebrows/section labels.
- All-caps or lowercase — avoid default Title Case.

CSS variables used sitewide: `--disp:'Anton',Impact,sans-serif;` `--sans:'Inter',system-ui,sans-serif;`

**Known exception — do not treat as brand-approved:** the live site also loads
`Space Grotesk` weight 500 (`space-grotesk-latin-500-normal.woff2`) and uses it on exactly one
element: `.hero-line2` on the homepage (`index.css`), the small uppercase tracked line under
the hero headline. It is not declared in the brand-config YAML, not mentioned in the Notion
Quick-Reference's own "two typefaces only" prose, and not used on any other page (about,
contact, opportunity-review). Treat this as an undocumented one-off, not a third brand
typeface — flag it before reusing that pattern elsewhere or bring it back in line with Anton/Inter.

Self-hosted font files live in the site repo at `deploy-live/fonts/` and mirror to
`01-current/brand identity/fonts/` on the local hub. Google Fonts fallback (for tools/mockups
outside the site) is the Anton + full Inter variable family — see the Playbook for the embed link.

## Voice

- One word: Clear. Register: warm and confident — a senior operator talking straight to a
  founder. Plain sentences, one idea each. Benefit-led, first person. Contractions fine.
- Words to own: own your category, lead the pace, built, de-risk, architecting, category,
  performance premium, market access.
- Banned: "free" (describe the no-cost call without the word), "honest", "gut check", absolutes
  ("never"/"always"), em dashes in body text.
- Do: lead with the outcome, then how you get there; name what a thing does, plainly.
- Don't: buzzwords, hype, triple-item filler lists.
- Reference brands for tone: Satisfy Running, milerrunning.

## Logo marks

Stipple-gradient stamp mark (inspired by a hand-pressed hanko) — a fingerprint/thumb-swipe
shape where stipple density creates the gradient; no outlines or rim. Master set in
`01-current/mark/` — black, obsidian, violet, silver, lavender, ochre, parchment, white
variants, plus vector master `mark-cleaned-vector.svg` and favicon/app-icon sizes (32/64/180/512px).

Quick picks: LinkedIn profile → `icon-512-black-on-white.png`; light-bg slide/email signature →
`mark-black-transparent.png`; dark-bg slide → `mark-white-transparent.png`; social light bg →
`mark-violet-on-parchment.png`; social dark bg → `mark-violet-on-obsidian.png`.

## Photography direction

Never posed — mid-motion, from behind, or intimate detail. Grainy, unfiltered, earned. Light
vs. dark contrast, not styling. No safe middle ground — industrial space or open wilderness
(Salt Lake City and the Wasatch are fair game). Reference: Satisfy Running, Berghain,
gnuhr_studio, milerrunning.

## Offer ladder (for consistent pricing language)

1. Project Fit Call — no-cost, 20-minute intro (never call it "free")
2. Opportunity Review — $450, 75-min working session + ranked written readout in 3 business
   days + one follow-up question
3. Defined growth project — scoped, priced on scope not hours
4. Operational buildout — scoped
5. Ongoing advisory — retainer

## Contact

- Public/front door: hello@opportunitydesigned.com
- Founder: addie@opportunitydesigned.com
- Never public: adelitamorrow@gmail.com (login/ops only)

## Sources reconciled here (2026-08-29)

- `_brand-system/examples/brand-config-opportunity-designed.yml` (repo)
- Notion "Opportunity Designed — Brand Quick-Reference" (id 3a4166342f47814aa0ebcda370b751a5)
- Live site CSS: `01-current/website/deploy-live/css/index.css` `:root` block and `@font-face` rules

All 8 hex values matched exactly across all three sources — no corrections needed. The only
discrepancy found was the undocumented Space Grotesk usage noted above.
