# Opportunity Designed — Cowork Space PRD

**Product:** The Opportunity Designed Cowork workspace (the Claude/Cowork space Addie Morrow uses to run her consultancy).
**Owner:** Addie Morrow, Independent Business Consultant.
**Version:** 1.1 · 2026-08-10.
**Status:** Approved. (v1.1: "The Opportunity Blueprint" approved to go public; GitHub saving flow added as P0-8.)
**Related docs:** Space Instructions (`OpportunityDesigned_Cowork_Space_Instructions.md`), Master Brand & Cowork Reference v3, Marketing/SEO Cowork Guide, `CLAUDE.md` and `MASTER_FILES.md` in the file hub.

---

## Summary

Opportunity Designed is Addie Morrow's solo growth-strategy consultancy for consumer brands and the retailers who sell them. The business runs across a local file hub on her Mac, a live website, a Notion hub and client portal, and a set of connected tools (Notion, Netlify, Gmail, Calendar, booking, automations). This PRD defines the Cowork space as a product: a single, rule-governed workspace where any Claude session can pick up the business's brand system, marketing and SEO program, client delivery templates, and operating rules without Addie having to re-explain them. The measure of success is simple: a fresh session produces on-brand, on-rule work on the first try, and nothing gets published or duplicated by accident.

---

# PART 1 · PRODUCT REQUIREMENTS

## Problem Statement

Addie runs the entire business alone, and the knowledge that makes her work correct (brand voice, the corrected tagline and philosophy, pricing tiers, SEO strategy, sensitive legal holds, the canonical file locations) lived scattered across her Mac, Notion, prior chat threads, and her head. Every new Claude session started cold: it used stale branding (the retired "Strategy Studio"), invented numbers, wrote em dashes, saved files to the wrong place, or risked naming a party she is in active litigation with. The cost of not solving this is direct: rework, brand drift across public channels, duplicated files, and real legal and reputational exposure from a single wrong sentence going public.

## Goals

1. **First-try correctness.** A new session, given only the space, produces work that matches the current brand voice and facts without correction. Target: 90 percent of deliverables need no brand/fact fix on first pass.
2. **Zero accidental publishing.** No content reaches a public surface (site, listing, social, directory) without Addie's explicit review-and-approve. Target: 100 percent, no exceptions.
3. **One source of truth per fact.** Every canonical fact (tagline, contact, pricing, file paths) has exactly one authoritative home, and the space points to it. Target: no contradicting copies in active use.
4. **Faster turnaround.** Cut the time from "start a task" to "usable draft" by removing the re-briefing step. Target: 50 percent reduction in setup overhead per task.
5. **Safe file operations.** Files land in the correct hub location, nothing is deleted, and archives stay reference-only. Target: zero destructive incidents (no trashed pages, no lost masters).

## Non-Goals

1. **Not a public-facing product.** This space is Addie's internal operating environment, not a client login or a deliverable. Client-facing surfaces are the website and the Notion client portal, specced separately.
2. **Not a replacement for the local file hub or Notion.** The Mac `ClaudeProjects/` tree stays the source of truth and Notion stays the mirror. The space orchestrates them, it does not become them.
3. **Not autonomous publishing.** The space never submits forms, accepts terms, grants OAuth, or deploys on its own. Those stay with Addie by design, not as a temporary limitation.
4. **Not a paid-tooling environment.** No paid subscriptions or card-required trials are in scope. Free tiers only, always.
5. **Not a general-purpose assistant scope.** Personal, unrelated, or off-brand side tasks are out of scope for this space so its rules and context stay clean.

## Target Users

- **Primary — Addie (operator/owner).** Solo founder. Needs the space to hold context so she can hand off a task in one line and get correct, on-brand output. Non-technical-by-preference: she runs the one deploy command and handles logins, but wants Claude to drive drafting and file work.
- **Secondary — the Claude session (the "operator agent").** Each session is effectively a new team member who must onboard instantly from the space's instructions, rules, and reference files.
- **Future — a contractor or VA.** If Addie brings on help, they should be able to read the same space inputs and produce consistent work. The space should not assume only Addie ever reads it.

## User Stories

Grouped by job the space does.

**Onboarding a session**
- As the owner, I want any new session to already know the current brand voice, tagline, and philosophy so that I never have to correct "Strategy Studio" or the wrong tagline again.
- As the owner, I want the space to surface the sensitive legal holds before any content work so that no litigation-sensitive name or method is ever published.
- As a session, I want a single instructions file that tells me what the business is, what is true now, and the rules for acting, so that I can start correctly without asking.

**Producing on-brand work**
- As the owner, I want drafts written in my voice (plain sentences, no em dashes, banned words avoided) so that I can ship them with minimal editing.
- As the owner, I want every number in my content to be real and sourced so that I never publish an invented statistic.
- As the owner, I want visual work delivered as a reviewable mockup, mobile and web, before anything is finalized so that I approve the look first.

**Managing files safely**
- As the owner, I want files saved only to the canonical hub location so that I stop getting duplicate copies in iCloud and Downloads.
- As the owner, I want superseded files archived, never deleted, so that I can always recover a prior version.
- As a session, I want to know which file is the master so that I edit the right one instead of a stale copy.

**Marketing and SEO execution**
- As the owner, I want the space to follow the documented SEO strategy and keyword priorities so that content targets the right terms from the buyer's-side angle.
- As the owner, I want the space to draft listings and posts but pause for my approval before anything is submitted so that I stay in control of what goes public.
- As the owner, I want blockers (GBP verification, Bing postcard, business phone) tracked and nagged so that they do not stall.

**Client delivery**
- As the owner, I want a consistent project and client-portal structure (the Opportunity Blueprint phases) applied to every engagement so that delivery feels systematized.
- As the owner, I want brand and asset templates reused for each client so that I am not rebuilding structure per client.

## Requirements

### Must-Have (P0)

**P0-1 · Space instructions file loaded as project context.**
A single instructions document defines the business, current truth, strategy, and rules. Acceptance:
- Given a new session, when it begins any task, then the instructions and the canonical reference are in context before work starts.
- The file states the current brand (Opportunity Designed), retires "Strategy Studio," and carries the correct tagline "Opportunity doesn't appear. It's built."

**P0-2 · Voice and formatting rules enforced.**
Acceptance:
- No em dashes anywhere in Opportunity Designed materials.
- No emojis in written deliverables.
- Banned words avoided ("honest/honestly," "playbook" in public copy, "free" for the intro call, "gut check," absolute "never").
- Copy scanned against these rules before delivery.

**P0-3 · Real, sourced numbers only.**
Acceptance:
- Given any statistic, ranking, or volume, when it appears in a deliverable, then it is sourced (Semrush free tier, Search Console, live SERP, or a stated primary source) and never invented.
- Where the keyword brief and Semrush measured data conflict, the measured number wins.

**P0-4 · Human-in-the-loop for anything public or irreversible.**
Acceptance:
- The space never submits a form, accepts terms, grants OAuth, or deploys the site.
- Addie gets a review-and-approve pause before anything is published or submitted.
- Site deploys happen only via `sh publish.sh "message"` in `deploy-live/`, run by Addie.

**P0-5 · Safe file handling in the canonical hub.**
Acceptance:
- Files save only under `/Users/addie/ClaudeProjects/` (numbered top-level folders: `01-projects`, `02-apps`, `03-documents`, `04-archive`), never into Desktop/Documents/Downloads.
- Nothing is deleted; superseded files move to an `archive/` folder with a dated name.
- Only master files are edited; archives are reference-only.
- Never run git through the folder bridge.

**P0-6 · Sensitive holds respected.**
Acceptance:
- Backcountry is never named in an outcome or case-study claim (bare employer listing only); her methods are never published.
- Mon Ami Jewelry excluded entirely; no Salomon in the Norda context; no SkyCon attendee counts; Fubuki phrased as "first major US online retailer."
- No confidential performance metrics (sell-through, revenue, margin, units, growth) published.

**P0-7 · Canonical sources of truth referenced, not duplicated.**
Acceptance:
- Public-facing facts come from `BACKLINKS-KIT.md`; the site `llms.txt` matches it; SEO data lives in `SEO-COMPETITIVE-LANDSCAPE.md`.
- Public contact is always hello@opportunitydesigned.com, never a personal address.
- Local hub is source of truth; Notion mirrors it; both kept in sync.

**P0-8 · GitHub saving flow (every output lands in the synced hub).**
The hub `/Users/addie/ClaudeProjects/` is a git clone of `github.com/general-pursuits/claudeprojects-hub` (branch `main`). Acceptance:
- Every master, reference, or record a session produces is saved into a tracked hub path (under `01-projects/`, `02-apps/`, `03-documents/`, or `docs/`), not left only in chat or a temp folder.
- Reference records are also mirrored to Notion; the local hub stays source of truth.
- The session never pushes through the folder bridge (it leaves a stale `index.lock`). Addie syncs by running `sh sync.sh "what changed"` in Terminal, which pulls-rebases, commits, and pushes to GitHub, so the work is current on phone and computer.
- Archives (`04-archive/`, `02-archive/`, `version-archive/`, `snapshots/`, `.remember/`) and `deploy-live/` are gitignored by design and stay Mac-local (the live site is its own repo).

### Nice-to-Have (P1)

**P1-1 · Recommended connectors enabled** (Notion, Netlify, Gmail, Google Calendar) so the space can read the hub, help draft deploys, manage the label taxonomy, and see booking context.
**P1-2 · Scheduled cadence** — a weekly marketing/SEO check and a monthly measurement routine that nag open blockers.
**P1-3 · Template reuse shortcuts** — quick paths to the ProjectOS, unified client portal, and brand/asset templates for spinning up a new client.
**P1-4 · Gmail 01–08 label taxonomy** applied consistently anywhere work is organized.

### Future Considerations (P2)

**P2-1 · Multi-operator readiness** — structure inputs so a contractor or VA can read them without Addie-specific assumptions.
**P2-2 · Public delivery framework name (APPROVED 2026-08-10).** "The Opportunity Blueprint" is approved to go public. Roll it out with one verbatim wording everywhere: framework page, homepage, `llms.txt` (## Method), glossary, JSON-LD, directories, Qwoted bio, LinkedIn, and the Playbook. Two sub-decisions remain before full rollout: opportunity-units Version A or B, and page location (About section vs a dedicated `/approach` page).
**P2-3 · Automation expansion** within free-tier limits (Zapier 2-step, 100 tasks/month) as volume grows.

## Success Metrics

**Leading indicators (days to weeks)**
- First-pass brand/fact correction rate: target under 10 percent of deliverables need a brand or fact fix.
- Rule-violation rate: zero em dashes, zero emojis, zero invented numbers in shipped work.
- Setup overhead per task: target 50 percent reduction versus re-briefing from scratch.
- Destructive-incident count: zero trashed pages or lost masters.

**Lagging indicators (weeks to months)**
- Brand consistency across public surfaces (site, listings, social, directories): no contradicting tagline, contact, or positioning.
- SEO progress against the documented priorities (page-2 queries moved up, listings live, GBP verified).
- Time reclaimed: hours per week Addie spends re-explaining context, trending toward zero.

**Measurement method:** spot-check shipped deliverables against the rule set; track blockers in the marketing to-do; review Search Console monthly (free). Evaluate at 2 weeks, 1 month, and 1 quarter.

## Open Questions

- **[RESOLVED 2026-08-10]** "The Opportunity Blueprint" is approved to go public. Remaining sub-decisions before full rollout: opportunity-units Version A or B, and page location (About vs `/approach`).
- **[Owner]** Which connectors do you want live in the space now versus later (Notion and Netlify seem clear; Gmail and Calendar optional)? (Non-blocking.)
- **[Owner]** Do you want a recurring scheduled task for the weekly SEO/marketing nag, and on what day/time? (Non-blocking.)
- **[Owner/Legal]** Any change to the Backcountry hold or other sensitive items since 2026-08-03? (Blocking before related content.)
- **[Owner]** Should the index docs (`CLAUDE.md`, `MASTER_FILES.md`) get a full path-reconciliation pass (current/ → 01-current/, fb marketplace / mood-of-mine references)? (Non-blocking.)

## Timeline Considerations

- **Now (live):** P0 rules are already in force via the Space Instructions and reference files; the numbered file hub and merged Projects folder are done.
- **Dependencies:** Cal.com addie@ verification is stuck (blocks reply-to setup); Google Business Profile re-verification failed and needs a redo (blocks local SEO); Bing postcard PIN and a business phone number are pending (unblock Bing, Clutch, The Manifest).
- **Phasing:** Phase 1 — lock the inputs (this doc plus the Space Instructions). Phase 2 — enable connectors and the weekly cadence. Phase 3 — multi-operator readiness and public framework name.

---

# PART 2 · COWORK SPACE INPUTS

Ready-to-paste configuration for setting up (or resetting) this space. Drop each block into the matching field in the Cowork/Claude project setup.

## A · Space name

```
Opportunity Designed — Business HQ
```

## B · Space description (short)

```
The operating hub for Opportunity Designed, Addie Morrow's growth-strategy consultancy
for consumer brands and the retailers who sell them. Runs the brand system, marketing
and SEO/AI-visibility program, client delivery templates, and the Notion portal, all
anchored to one canonical file hub on the Mac and a matching Notion hub. Positioning:
the former retail buyer selling buying-side strategy.
```

## C · Project instructions (paste into the space's instructions/custom-instructions field)

```
You are helping run Opportunity Designed (opportunitydesigned.com), Addie Morrow's solo
growth-strategy consultancy for consumer brands and the retailers who sell them.

WHO SHE IS
Addie Morrow, Independent Business Consultant. Ten-plus years in-house at major retailers
as a buyer and merchandiser. The whole differentiator: she has actually sat in the buyer's
chair, so recommendations reflect how a retailer really makes a yes-or-no decision.

BRAND (current — the "Strategy Studio" brand is RETIRED, never use it)
- Tagline: Opportunity doesn't appear. It's built.
- Kicker: See what others miss.
- Positioning: Growth strategy consulting for consumer brands and the businesses that sell
  them: smarter purchasing, sharper positioning, market access.
- Philosophy: opportunity architecture. Find the opportunities others miss and build the
  path to capture them. Architecting unconventional pathways to familiar goals.
- Offer ladder: 20-minute Project Fit Call (never call it "free") → $450 Opportunity Review
  → growth project → operational buildout → ongoing advisory.
- Public contact: hello@opportunitydesigned.com (never a personal address).

VOICE
Warm, confident, benefit-led, first person, plain sentences with one idea each.
No em dashes anywhere. No emojis in written work. Avoid: "honest/honestly," "playbook" in
public copy, "free" for the intro call, "gut check," absolute "never," AI-sounding filler,
triple-item flourishes. Scan every deliverable against these before sending.

STANDING RULES
- Free tools only; no paid plans or card-required trials. Flag any paid feature and offer
  the free route.
- Every number must be real and sourced (Semrush free tier, Search Console, live SERP, or a
  stated primary source). Never invent volumes, rankings, or stats. Measured data beats
  estimates.
- Addie handles all logins, OAuth grants, terms acceptance, form submissions, and site
  deploys. Always pause for her review-and-approve before anything is published or submitted.
- Site deploys only via `sh publish.sh "message"` in deploy-live/, run by Addie. Never run
  git through the folder bridge.
- Show a reviewable mockup (mobile and web, mobile-first) before finalizing anything visual.
- Deliverables, not hours. Never commit days/week or hours/month; price on scope and outcomes.

FILES + GITHUB SAVING FLOW
Save only under /Users/addie/ClaudeProjects/ (top-level: 01-projects, 02-apps, 03-documents,
04-archive). Never save to Desktop/Documents/Downloads. Never delete; move superseded files
to a dated archive/ folder. Edit only masters; archives are reference-only. Local hub is
source of truth; Notion mirrors it.
The hub is a git clone of github.com/general-pursuits/claudeprojects-hub (main). Save every output
into a tracked hub path (not just chat or a temp folder), then tell Addie to run
`sh sync.sh "what changed"` in Terminal to push it to GitHub, so it's current on phone and
computer. Never run git or push through the folder bridge (it leaves a stale index.lock).
Archives and deploy-live/ are gitignored and stay Mac-local by design.

SOURCES OF TRUTH
Public facts: BACKLINKS-KIT.md. SEO data: SEO-COMPETITIVE-LANDSCAPE.md. The site llms.txt
must match the kit. Brand master: OpportunityDesigned_Brand_Marketing_Playbook.docx.

SENSITIVE HOLDS (check before any content)
Active litigation with Backcountry: never name them in an outcome or case-study claim (bare
employer listing only) and never publish her methods. Exclude Mon Ami Jewelry entirely; no
Salomon in the Norda context; no SkyCon attendee counts; Fubuki is "first major US online
retailer." Never publish confidential performance metrics (sell-through, revenue, margin,
units, growth). City-level only (Salt Lake City); no street address unless she provides one.
```

## D · Standing rules (quick checklist, for pinning)

```
[ ] No em dashes. No emojis in writing.
[ ] Real, sourced numbers only.
[ ] Free tiers only; flag paid features.
[ ] Review-and-approve before anything public or submitted.
[ ] Save only in ClaudeProjects/ hub; never delete; edit masters only.
[ ] Save every output into the hub, then Addie runs `sh sync.sh "msg"` to push (never push via the bridge).
[ ] Deploy the site only via publish.sh in deploy-live/, run by Addie.
[ ] Mockups before finalizing visuals (mobile + web).
[ ] Respect sensitive holds (Backcountry, Mon Ami, Salomon/Norda, SkyCon, Fubuki).
[ ] Public contact = hello@opportunitydesigned.com.
```

## E · Recommended connectors to enable

```
- Notion        → the OD Brand & Asset Hub, client portal, and to-do lists live here.
- Netlify       → site hosting; helps prep deploys (Addie runs the deploy command).
- Gmail         → drafting + the 01–08 label taxonomy (01 Leads … 08 System).
- Google Calendar → the "opportunitydesigned" booking calendar / Fit Call context.
(All read/draft only; Addie approves any send, submit, or deploy.)
```

## F · File taxonomy (the hub)

```
ClaudeProjects/                          (local, NOT iCloud; source of truth)
├── 01-projects/
│   └── opportunity-designed/
│       ├── 01-current/   ← all masters: brand identity/, mark/, website/, templates/,
│       │                    automations/, client/, gmail/, website/social-and-marketing/
│       └── 02-archive/   ← old versions, reference-only, never edit
├── 02-apps/              ← addie-dashboard, my-plugin
├── 03-documents/         ← resume, etc.
├── 04-archive/           ← top-level reference archive
├── CLAUDE.md             ← read first: rules + where things live
└── MASTER_FILES.md       ← authoritative index of every master file

Gmail / work-organizing labels: 01 Leads · 02 Bookings · 03 Active Clients ·
04 Proposals & Contracts · 05 Finance · 06 Approvals · 07 Completed · 08 System
```

## G · Suggested scheduled tasks

```
1. Weekly marketing/SEO nag (e.g., Monday 9:00 MT):
   "Review the Opportunity Designed marketing to-do and SEO priorities. List what moved,
    what's blocked, and the single next action. Nag open blockers: GBP re-verification,
    Bing postcard PIN, business phone number. Do not publish or submit anything."

2. Monthly measurement routine (first business day):
   "Run the free measurement routine: Search Console impressions/new queries/page-2 movers;
    refresh the tracked keyword table in SEO-COMPETITIVE-LANDSCAPE.md (Semrush free tier);
    AI-visibility check on the money prompts. Summarize and update the Current State note.
    No paid tools; no publishing."
```

## H · Memory / context seed (if memory is enabled later)

```
Business: Opportunity Designed, growth-strategy consultancy (retail/CPG), founder Addie
Morrow, ex-retail buyer. Tagline: "Opportunity doesn't appear. It's built." Entry offer:
$450 Opportunity Review. Hub: /Users/addie/ClaudeProjects (numbered top-level folders).
Rules: no em dashes, no emojis, free tools only, real numbers only, human approves anything
public. Sensitive: Backcountry litigation hold. Public contact: hello@opportunitydesigned.com.
```

---

*End of PRD. Facts reflect the corrected brand reference (v3, 2026-08-03) and the live site.
Source of truth stays local (the Playbook and the file hub); update those first, then mirror.*
