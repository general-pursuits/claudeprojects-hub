# Opportunity Designed — Project Memory (synced copy, 2026-08-08)

Source: Claude desktop project memory. Desktop sessions keep the live memory; this file is the
synced copy so phone/web sessions carry the same rules. If desktop memory and this file drift,
reconcile them (update both). Sections below = one per memory topic file. This is the DEEP store: the always-load layer is docs/claude-context/CORE-RULES.md; load sections here on demand per its Router. Settled decisions are in DECISIONS.md (do not re-ask).

---

## saving-flow (CANONICAL — read before saving ANYTHING)

The hub `/Users/addie/ClaudeProjects/` is a git clone of `github.com/general-pursuits/claudeprojects-hub` (main).
Every master, reference, or record a session produces MUST be saved into a tracked hub path (under
`01-projects/`, `02-apps/`, `03-documents/`, `docs/`, or `Projects/`) — never left only in chat or a temp
folder — and reference records also mirrored to Notion (local repo = source of truth). Then Addie runs
`sh sync.sh "what changed"` in her Terminal (pull-rebase, commit, push) so everything is current on phone and
computer. NEVER run git or push through the folder bridge (stale `index.lock` the bridge cannot delete; she
removes it in Terminal if present). Gitignored / Mac-local by design: `04-archive/`, `02-archive/`,
`version-archive/`, `snapshots/`, `.remember/`, `deploy-live/` (the live site is its own repo), node_modules,
.DS_Store. This applies to every session, skill, and automation: produce it, save it in the hub, remind Addie
to sync.

---

## website-workflow (CANONICAL — read before ANY website work)

### Single source of truth
Website files: `01-projects/opportunity-designed/01-current/website/` in the hub repo, EXCEPT
`deploy-live/` which is its own git repo → GitHub `general-pursuits/opportunityDesigned-website` (main) →
Netlify auto-builds (site id 773c8bf0-a668-4411-b7d2-966fe82785a7).
- Drafts ALWAYS land in `working-drafts/` first (field-notes drafts in its `field-notes/` subfolder); never public.
- `deploy-live/` = live public mirror. Only approved content moves here.
- Reference: `website/HOW-TO-DEPLOY.md` (also in Notion: "How to Deploy opportunitydesigned.com").

### Publish pipeline
Addie publishes by running `sh publish.sh "msg"` in deploy-live (her Terminal). Cloud sessions with
her PAT may commit/push to the site repo only with her explicit approval; one deploy per approval round.
Never use Netlify's "Fix with agent" button (once overwrote the site with stale content).

### Content flow for changes
1. Draft in working-drafts (session may render/screenshot mockups)
2. Show visual mockup (mobile + web, mobile-first), get Addie's approval — required before anything is final
3. Move approved file to deploy-live + update: field-notes.html hub, sitemap.xml, llms.txt, cross-links on 2-3 older articles
4. Publish (publish.sh / approved push)

### CTA hierarchy (2026-08-01, deployed sitewide)
Primary CTA everywhere = "Book a 20-minute Project Fit Call" (cal.com element-click embed, data-cal-* attrs;
loader in js/site.js). NO secondary "send a message" link. Nav button = "Book a call" → cal.com on all pages
(opportunity-review.html keeps its own "Book the review" campaign nav). About cta-band holds the Cal INLINE
embed (#my-cal-inline-project-fit-call, min-height:640px). Contact: fit-call button above form; form reframed
"Prefer to type it out?". Home hero kicker = "See what others miss".

### New field-note article requirements
Existing template structure; title <60 chars; meta <155; canonical/OG/Twitter; BlogPosting/Article JSON-LD incl.
image; nav "Field notes" active; cta-band with primary Fit Call button (data-cal-*, no send-a-message) + one-line
Opportunity Review note in TEMPORARY comments; FAQ (2+) with FAQPage schema; Related reading 3-4 links;
`.foot-subscribe` email signup in footer.
Publishing checklist (5 places or it's orphaned): (1) article file, (2) field-notes.html hub, (3) sitemap.xml with
today's lastmod, (4) llms.txt list, (5) cross-links from 2-3 older articles (every article ≥3 inbound internal links).

### Standing rules
- adelitamorrow@gmail.com NEVER business-facing; addie@ personal, hello@ public
- Never name Backcountry in outcome/case-study claims; Mon Ami Jewelry always excluded; no Salomon in
  Norda context; no SkyCon attendee counts
- Voice: avoid "gut check", "honest", absolute "never", "free"; NO em dashes in OD copy
- Always show a visual with every change; approval before publish; one deploy per approval round
- CACHE RULE: css/js edits ⇒ bump `?v=` stamp on ALL pages sharing that file; never reuse a same-day stamp
- Archive removed content word-for-word (version-archive/_to_delete on Mac) — never delete

---

## project: Website — FINISHED & LIVE (synced 2026-08-01)

Complete multi-page site live at opportunitydesigned.com. Pages: index, about, contact, terms, privacy, 404;
funnel: opportunity-review(+booked), project-fit-call-booked, thank-you; Field Notes hub + 10 articles
(retail-buying-consultant, get-into-costco, get-into-evo-and-rei, get-into-whole-foods, get-into-target,
get-into-ulta, performance-premium, category-newness, full-price, glossary). SEO plumbing: sitemap.xml (17 URLs),
llms.txt, robots.txt (allows AI crawlers), _headers, netlify.toml, site.webmanifest.
page-build/ + build_site.py are LEGACY — never run or treat as master. Rollback = Netlify → Deploys → older →
Publish deploy. Stale git lock → remove .git/index.lock, rerun. GA4 G-M1FVLM07Z1; GSC DNS-verified.
ENTITY LOOP CLOSED: Org sameAs live with all 5 profiles; all cross-link back.
Open (hers): backlink directory listings, Qwoted rhythm, podcast pitches, GBP video re-verification (failed once),
GBP pin shows southern CO not SLC (service-area quirk), Cal.com addie@ verify, signature file save-back,
testimonials banked (no Review schema yet).

---

## project: Cookie consent + analytics — DONE 2026-07-29

Silktide Consent Manager v2.0.1 self-hosted; US OPT-OUT model (her explicit choice): GA4 (G-M1FVLM07Z1) +
HubSpot (246790245) + LinkedIn Insight (556095600) load by default unless localStorage records rejection
(`stcm.consent.analytics`/`stcm.consent.marketing` === 'false'). Head snippet on all pages sets Consent Mode v2
defaults before anything loads. consent-init.js owns ALL tracker loading; onReject → guarded reload
(guard CRITICAL — unguarded = infinite reload loop). Conversion events preserved via `window.__odPageEvent`;
js/analytics.js is unreferenced legacy — do not re-add. Don't add trackers outside consent-init.
GA4 was silently broken pre-2026-07-29 (no gtag.js loaded) — expect step-change in data from that date.

---

## project: Website critique batch — LIVE 2026-07-21

Field Notes URL split (own URLs per note), email capture (Netlify form `field-notes-subscribe`), a11y CSS,
charcoal #2F2D2A bg sitewide, schema audit/fixes, cache-bust rule learned (see cache rule above).
**REJECTED: homepage "$450 OFF" sentence — do not re-propose.** Gated: testimonial pending sign-off;
quantified case metrics not allowed (see no-confidential-metrics).

---

## project: Framework codification — "The Opportunity Blueprint" (DECIDED, COPY LOCKED 2026-08-31)

NAME DECIDED and sub-decisions CLOSED (2026-08-31). "The Opportunity Blueprint" is public. Sequence:
Map -> Design -> Build, closing on the performance premium. "Opportunity units" was DECLINED after review
(AI-invented vocabulary; replaced with her own language: the Blueprint starts from the brand's core and
architects the unrealized opportunity around it, building a niche of the brand's own so the client leads
and others follow). It lives as a section on the About page for now; /approach later. The full locked copy,
including the three step paragraphs, the operational-discipline paragraph, and the closer, is in
website/SEO/FRAMEWORK-THREADING-PACK.md; use ONE verbatim wording everywhere (About, homepage, llms.txt
## Method, glossary, JSON-LD, directories, Qwoted bio, LinkedIn, Playbook). Standing copy rules from this
round: never promise a fixed deliverable in method copy (output varies by client), never map engagements to
tier formulas in public copy, and AI capability is offered rather than preached.

---

## reference: Off-site marketing & entity assets (2026-08-01 check)

GSC sitemap SUCCESS 17/17; all 10 field-notes pages in Google's live index. Crunchbase LIVE
(UUID b53ace80-4ad4-406d-9de4-f00f97523ba1); Qwoted LIVE (app.qwoted.com/sources/addie-morrow, 1-2 queries/week);
Bing Places PENDING POSTCARD; GBP verification FAILED (needs her video redo — HIGH VALUE); Silicon Slopes blocked;
remaining: Clutch, The Manifest. Podcast pitches ready: NRF (Gmail draft r1567194182587735849 — she flips From to
addie@ and sends), Modern Retail (guest form), DTC POD (LinkedIn DM to Blaine Bolus). LinkedIn guide-wave launch
post drafted, awaiting her approval (post from COMPANY page; habit: each new guide = 1 company post + 1 community
answer). LinkedIn graphics FINAL in images/social/LinkedIn/. MASTER TO-DO: Notion "Opportunity Designed —
Marketing & SEO To-Do List" (3af16634-2f47-81c7-943c-f48191e9b1c4) + website/social-and-marketing/TO-DO-LIST.md
(update BOTH).

---

## reference: Backlink & AI-visibility kit — canonical facts (v6)

CANONICAL = `website/social-and-marketing/BACKLINKS-KIT.md` (v6) + Notion mirror
(app.notion.com/p/3af166342f4781e4a665d3198b90d430). Do NOT overwrite v6 with the older uploaded v5.
Rule: every directory/press/AI-facing profile uses IDENTICAL name/description/links/contact; must match llms.txt +
schema verbatim. Public listing email = hello@opportunitydesigned.com (never personal).

Canonical fast facts (lift verbatim): Business: Opportunity Designed · Founder: Addie Morrow · Founded: 2026 ·
HQ: Salt Lake City, Utah, USA · Service area: United States, remote-first · Category: Growth strategy consultancy —
retail & consumer brands (CPG) · Experience: 10+ years in-house at major retailers; 35+ brands · National placements
(public proof): Ulta, Costco, Target, Whole Foods · Sectors: outdoor, footwear, beauty, wellness, Amazon-native ·
Coined term: "performance premium" · Public contact: hello@opportunitydesigned.com.
Tagline (≤10w): "Growth strategy for consumer brands and the businesses that sell them."
sameAs set (EXACT, everywhere): opportunitydesigned.com · /field-notes · linkedin.com/company/opportunity-designed ·
linkedin.com/in/addiemorrow/ · google.com/maps?cid=17178284747974895122 ·
facebook.com/profile.php?id=61592289538905 · instagram.com/opportunitydesigned/.
Placements + counts = PUBLIC facts, allowed. Never sell-through/revenue/margin figures. Don't name Backcountry.

---

## project: Brand & Business Context (MASTER)

Company: Opportunity Designed (rebranded from "Strategy Studio" June 2026). Domain opportunitydesigned.com.
Taglines: "Opportunity. Designed." · "Opportunity doesn't appear. It's built." Founder: Addie Morrow — site title
**Independent Business Consultant** (never "Founder" in bios/signatures). "The Studio" = internal methodology name.
MASTER FILE: `OpportunityDesigned_Brand_Marketing_Playbook.docx` in `01-current/brand identity/` — the ONE
document for everything brand and marketing (Part One = Brand Voice Guidelines; Part Two = Full Marketing Content).
Voice (updated 2026-07-25): warm, confident, benefit-led, first person, plain sentences one idea each; one word:
"Clear." NOT list: no buzzwords/AI-flavor, no em dashes, no absolutes, no free/honest/gut check. The old terse
"Berghain" voice moved to the JEWELRY brand (`01-projects/jewelry/Terse-Voice-Direction-Jewelry-Brand.docx`).
OFFER LADDER: (1) Project Fit Call (20-min intro; never "free") → (2) Opportunity Review ($450, 75-min session +
ranked written readout in 3 business days + one follow-up Q) → (3) defined growth project → (4) operational
buildout → (5) ongoing advisory.
FIVE PILLARS (The Studio): 1 Strategy · 2 Buying, Merchandising & Negotiations (deepest expertise) · 3 Operations ·
4 Market Access · 5 Events. Throughline: "Every engagement comes back to two things: finding where the margin is
and negotiating to keep more of it."
Background: Backcountry (Senior Buyer, footwear), New World Natural Brands (Director of Purchasing), ModCloth
(Buyer); BA Marketing Communications, Columbia College Chicago; Salt Lake City, remote by design.
Still open: founder story ("DRAFT (confirm)" in Playbook — needs her real version); press-release testimonial
FILL-IN (never fabricate); MSA/NDA attorney review before first client use.
SX Collective = first client (indie outdoor/run retail), tiers $6K/$9.5K/$15K — indie pricing floor reference.

---

## reference: Brand palette & fonts (refreshed 2026-08-03)

Colors: Charcoal #2F2D2A (dark ground) · Parchment #ECE7DD (light ground) · Ink on dark #EDEAE3 · Ink on light
#1A1714 · Violet #8E72C6 (THE accent) · Deep violet #6B4FA6 (hover) · Lavender #B49CE0 (eyebrows/labels only) ·
Warm gray #6B655B (muted). Never true black or true white. Violet is a single accent note, not a fill.
Type: Anton 400 (display, ALWAYS uppercase) + Inter 300–700 (body/UI; 300 long-form, 500–700 labels/buttons).
Avoid Title Case; all-caps or lowercase.
LIVE SITE fonts are fully SELF-HOSTED (@font-face → deploy-live/fonts/*.woff2). Never add a Google Fonts link to
site pages. For non-site mockups: Google Fonts full-package link (Anton + Inter variable).
Old mark/README.txt palette (Strategy-Studio era) is OUTDATED.
Logo picks: light bg → mark-black-transparent.png or mark-violet-on-parchment.png; dark bg →
mark-white-transparent.png or mark-violet-on-obsidian.png; vector master mark-cleaned-vector.svg.
Mark meaning: cloud (see what others miss) + inkblot (value what others overlook) + fingerprint (own what's
unmistakably yours). Stipple stamp mark (hanko-inspired), NOT the geometric S; stipple creates the gradient.
Photography: never posed, mid-motion, grainy, earned; industrial or wilderness; SLC/Wasatch fair game.
Visual reference brands: Satisfy Running, Berghain, gnuhr_studio, milerrunning (visual only; their terse voice
belongs to the jewelry brand).

---

## feedback: Voice rules — banned words & punctuation (ALL OD writing)

Banned: "gut check" · "honest/honestly" · absolute "never" (use conditional language; industry terms of art like
"never-out-of-stock replenishment program" OK) · "free" (the call is "a 20-minute diagnostic call") · "playbook"
(use "GTM"). BANNED PUNCTUATION: em dashes (—) anywhere in OD materials ("a dead giveaway for AI"). Rewrite
with periods, colons, or commas. Style: short, confident, plain sentences; one idea per sentence; contractions fine;
triple-item lists and compound flourishes read as AI to her — instant reject. Scan everything before delivery.

## feedback: Copy style

All copy: easy to understand + impactful in the fewest words/characters. Anchor to Playbook taglines:
"Opportunity. Designed." · "Lost in everyone else's noise. Found in who you are." · "Who you are is the strategy.
Where you go is by design." One brand, one system, across every channel and document.

## feedback: No confidential performance metrics public

Never publish sell-through %, revenue, margin, unit/growth figures — not even as placeholders (client/employer
data; legal exposure). Proof = facts not figures: firsts ("first major US online retailer to carry Fubuki"),
durations, public counts (10+ yrs, 35+ brands, 4 national placements), qualitative outcomes ("full price, MAP
intact"). Strongest future layer: testimonials/press quotes.

## feedback: Market definition — don't narrow it

Serve: "Consumer brands that are ready to grow, and the retailers and marketplaces that sell them." Positioning:
"Growth strategy for consumer brands and the businesses that sell them: sharper positioning, smarter buying,
categories you can own." Hero: "Own your category. Lead the pace." NOT just "outdoor/run/lifestyle" (that's SX
Collective's niche). Proof spans outdoor, footwear, beauty, wellness, Amazon-native (Baebody, Baetea), private
label (Sears/Kmart), Fubuki US entry, Norda/HOKA/Patagonia/TNF, Ulta/Costco/Target/Whole Foods/FabFitFun.
When in doubt, fetch opportunitydesigned.com rather than paraphrasing.

## feedback: Target audience (ICP)

Write for decision makers: (1) consumer-brand leaders, (2) startup founders, (3) sales reps working retail
access/assortment, (4) retailers. Sharpens who to attract; does NOT narrow the served market.

## feedback: SEO + LLM/AI SEO — heavy emphasis

Follow SEO best practices and actively improve site + all content incl. images (alt text, filenames). HEAVY
emphasis on LLM/AI-search (GEO/AEO): Q&A framing, definitional/glossary content, entity clarity + cross-linking,
citable structured facts. Proactively audit — don't wait to be asked.

## feedback: Proposals — deliverables not hours

Never commit "X days/week" or "Y hours/month". Price against deliverables and outcomes. Tier axes = scope depth,
deliverables, working sessions included. Availability language OK ("responsive within 1 business day"), hours not.

## project: Case-study bank — SENSITIVE (check before writing ANY OD content)

Active Backcountry litigation (fired, declined severance, no NDA). Backcountry stays in the site's roles row as a
bare factual employer listing ONLY — never in achievement/outcome claims; employer-internal details stay
unpublished even de-identified when identifying. PROPRIETARY IP: publish RESULTS of her methods, never the methods
(e.g. the "how many outfits does it go with?" test). No job titles in case studies; "for a leading outdoor
retailer" phrasing. "First MAJOR US online retailer" for Fubuki. Excluded always: Mon Ami Jewelry; no Salomon in
Norda context; no SkyCon attendee counts. Banked stories (Fubuki details, 7-store assortment rebuild, custom
colorway) stay unpublished until litigation resolves.

## project: SX Collective — first client

Indie outdoor/run retail concept; anti-influencer positioning; premium brand roster. Tiers $6,000/$9,500/$15,000;
pricing band = indie $5K–$15K zone, not PE-backed $15K–$50K. Tier 02 = Pillar 01 only; Tier 03 = three pillars at
strategy level, NOT embedded execution. Open discovery questions: COGS methodology, warehouse/logistics, margin
sensitivity ecomm vs store, fastest-ROI ecomm, store economics. "Hunter is super connected in data."

---

## Notion workspace (rebuild in progress 2026-08)

- REBUILD SPEC: 55+ active master DBs in folder "master project tracker- addie"
  (app.notion.com/p/3b1166342f47804cb870d1354dd3613a); everything registered in "OD - Master Links" (a69c6aff).
  Tracker engine adopted from marketplace Project Tracker (its Projects 8c8166 + Tasks b81166 have
  relations/rollups/formulas the API can't create). Final consolidations settled 2026-08-04 — never re-ask:
  Meetings 2 stores; KEEP BOTH Tasks + Task Board (privacy line); Social Content absorbs Content Calendar;
  SEO Content absorbs Field Notes Deploys; Resources absorbs Documents; ONE Revisions Log; ONE Asset Library.
- Governing framework: hub-and-spoke (Clients hub + Projects hub); rule of one (one master per concept — views not
  sibling DBs); naming (masters plain noun, TEMPLATE - prefix, OLD - DELETE ME -, row IDs Prefix-YYYY-###);
  required props everywhere: Status w/ Archived, Collaborators, hub relation, created time. Shared vocab verbatim:
  Stages Intake & Review/Map/Design/Build/Close & Advisory; tiers Fit Call/Opportunity Review/Growth Project/
  Buildout/Advisory; client lifecycle Lead/Onboarding/Active/Completed/Advisory; task statuses Backlog/On Deck/
  In Progress/In Review/On Hold/Done/Archived. Client = company; people First/Last/Role. Select options: no commas.
- Icon standards: NO emojis anywhere; basic Notion icons only, purple/gray; masters = database_purple; "playbook"
  banned → GTM.
- Template standards: ALWAYS embed File Drop form inline
  (mysterious-tailor-c90.notion.site/ca4088b37eec44c6a95aebedb7e71322?pvs=105); all tables = linked views of real
  master DBs, never static tables; tabs for sections.
- Notion API CAN: create DBs/rows/views + filters (relative me/today), edit form questions, embed dbs, move pages,
  icons/titles/props, content edits. CANNOT: edit existing schemas, rename options, create
  relations/rollups/formulas/status-type, native templates, new Forms, buttons, number formats, sorts, tabs,
  columns, block order. Use browser automation for those.
- AI Parameters DB (199b7828) mirrors these memory rules — when a rule changes, update both same day. Never copy
  sensitive case-bank names into Notion. Proof Bank (8cdb8512): Permission select gates publishing.
- Field Glossary (20f9027f) + weekly schema-sync scheduled task trig_019MS3joVDWMEPn8kFZiVBga (Mon 14:00 UTC).
- Edit Queue protocol v2 (BINDING for all document work): queue DB
  app.notion.com/p/dcdaf59431d04500bf6b181b53683d9b. Every delivered/changed doc → one "CLAUDE CHANGE" row per
  change (Status Applied, before/after snapshot) + one open "YOUR EDITS - [doc]" row. Untouched/Archived =
  approved; Declined = roll back. Batches: queue order, Critical first; ambiguity = Question Back, never guess.
  Touch nothing outside the queue; re-read the live doc before editing; queue = recovery record.

## Call recap workflow

Recaps → Meetings DB (a37390af...; ask where to file, else "UNFILED - [caller] - [date]"; weekday nag trigger
trig_01BeFNTbMRQ9ohbL6KAis928). ALWAYS create Gmail follow-up draft, NEVER send. Signatures: OD calls = addie@
signature; general/canned = hello@; personal = "Addie M." + 385-471-7867, no block. Exact transcript in page;
audio deleted ~30d unless "retain recording". HubSpot (246790245): log OD calls as call engagement on contact
(create contact if new); personal calls never logged. Calendar sync task trig_01ATF5bCsQ1aoLz1q5X1yewm daily 7am MT.

## Design & production

Always show visual mockups before finalizing anything visual — BOTH mobile and web views, mobile-first (majority
traffic).

## Operations, tools & accounts

- FREE PLANS ALWAYS: every tool free tier (Cal.com, Zapier 2-step Zaps only ≤100 tasks/mo, HubSpot free,
  Netlify batched deploys approval-first, Gmail aliases). Flag any paid feature and offer the free route first.
- AI model tiering: cheaper models for simple tasks; strongest for complex work.
- Reference docs: save into the hub repo AND mirror to Notion; local repo = source of truth. After saving, Addie runs `sh sync.sh "msg"` in Terminal to push (phone + computer). Never push via the folder bridge. Archives/deploy-live gitignored (Mac-local).
- EMAIL RULES: adelitamorrow@gmail.com NEVER business-facing (underlying login only). addie@ = personal human
  channel (lead replies, proposals, signature, 1:1). hello@ = front-door (public contact, generic inbound,
  company-voice/automated). Both forward via ImprovMX to Gmail.
- Gmail OD label taxonomy: 01 Leads · 02 Bookings · 03 Active Clients · 04 Proposals & Contracts · 05 Finance ·
  06 Approvals · 07 Completed · 08 System. Reuse this 01–08 taxonomy for related organizing.
- Email forwarding DONE (ImprovMX free; MX mx1/mx2.improvmx.com; SPF improvmx+google). Gmail send-as verified
  addie@ + hello@; personal Gmail stays default From; hello@ display name stays lowercase (her call). Filters:
  to:(opportunitydesigned.com) → OD label; subject "New website inquiry" → OD/01 Leads.
  Signatures FINAL (Accent Bar style): addie@ = no book-a-call link; hello@ = company voice. Still open: save
  signature files into gmail/signatures/.
- Automations: Zap #1 Netlify inquiry → auto-reply From addie@ "Addie Morrow", HTML body with embedded signature
  table (hand-typed copy — edits to the signature file must be re-applied in the Zap). Zap #2 Netlify → HubSpot
  contact. Zap #3 field-notes-subscribe → HubSpot (2-step). All 2-step free-tier-safe. Cal.com Project Fit Call
  (event 6358854): 20 min, Google Meet, Mon–Thu 10:30–3:00 MT, buffers 15/15, cap 3/day. Cal.com addie@
  verification STUCK on Cal.com's side (may need their support). Check project memory/automations before touching
  Cal.com/Zapier/HubSpot; after any change re-run an end-to-end test and delete the test contact.
- Booking: cal.com/opportunitydesigned/project-fit-call; Google Meet default; bookings on Google
  "opportunitydesigned" calendar; confirmed bookings → Gmail 02 Bookings.
- Social profiles (exact set): see Backlink kit section above.
- Fonts installed on her Mac (Anton + Inter, 2026-08-03; Word embeds fonts) — no font-install steps needed for
  .docx work; her Word→PDF export is the brand-perfect output.

## User profile — Addie Morrow

Independent Business Consultant (her chosen title). Outdoorsy: desert, trail running, skiing, summits; also club
culture (Berghain-level). Warm, social, genuine (@baddy.addie IG). Background: Senior/Lead Buyer Backcountry
(footwear), Director of Purchasing New World Natural Brands, Buyer Sears + ModCloth; BA Marketing Communications,
Columbia College Chicago. Deep retail/merchandising/buying expertise, NOT generalist consulting. "The consultant
who's actually been the buyer." Her personal authenticity IS the brand differentiator.

## Superseded / historical

- About + footer redesign WIP (2026-07-20): fully approved spec, shipped since — spec retained in desktop memory.
- Old Notion master map (pre-restart) is historical.
- project_memory_addendum_check.md = empty placeholder.
