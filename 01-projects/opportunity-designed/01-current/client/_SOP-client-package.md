# OD Client Package — Standard Operating Procedure

**Owner:** Addie · **Version:** 1.0 · **Effective:** 2026-08-03

The single source of truth for how every Opportunity Designed client proposal package is generated, filed, versioned, negotiated, and archived. This SOP is enforced by the `od-proposal` skill. Every action Claude takes in a client package workflow follows this doc.

Related: master templates at `../templates/proposal-package/` · font install status in `reference_od_fonts_installed` memory · voice rules in `feedback_voice_rules` · pricing anchors in `project_sx_collective` · legal protections locked in the proposal templates themselves.

---

## 1. Folder structure — one folder per client

Every client gets a dedicated folder at:
`ClaudeProjects/01-projects/opportunity-designed/01-current/client/[client-slug]/`

Where `[client-slug]` is lowercase-hyphenated (`sx-collective`, `acme-brands`, `outdoor-co`).

Inside each client folder:

```
[client-slug]/
├── 00-intake/
│   ├── intake-notes.md               ← call notes, source materials
│   ├── call-transcripts/
│   └── source-materials/             ← anything they sent (decks, financials, brand docs)
├── 01-proposal-package/
│   ├── current/                      ← the LATEST version of every doc, docx + pdf
│   ├── archive/                      ← every previous version, in dated subfolders
│   │   ├── v1.0-2026-08-04/
│   │   ├── v1.1-2026-08-06/
│   │   └── v2.0-2026-08-10/
│   └── _changelog.md                 ← running log of every version generated
├── 02-negotiation/
│   ├── client-comments/              ← their marked-up files, dated
│   ├── redlines/                     ← my responses back, versioned
│   ├── revisions-log.md              ← chronological "what changed and why"
│   └── decisions-log.md              ← agreed changes waiting to be applied
├── 03-signed/                        ← engagement letter, MSA, NDA, live Timeline & Scope
├── 04-project/                       ← in-flight work, working sessions, weekly updates
└── 05-close/                         ← retainer proposal, final walk-through, wrap notes
```

Only create the numbered folders as you reach that stage. A brand-new lead only needs `00-intake/` and `01-proposal-package/`. Don't pre-create empty stage folders.

---

## 2. Versioning rule — STRICT

Every generated file uses this filename pattern:

```
[client-slug]-[DocType]-v[Major].[Minor]-YYYY-MM-DD.docx
[client-slug]-[DocType]-v[Major].[Minor]-YYYY-MM-DD.pdf
```

Where:
- `DocType` = one of `Proposal`, `Cover-Letter`, `Timeline-and-Scope`, `Fill-In-Guide`
- `Major` (X.0) → structural change: tier count, price, scope structure, legal section, added/removed content block
- `Minor` (X.N) → wording polish, section rewrites within same structure, voice cleanup
- `YYYY-MM-DD` → the date the version was generated

Examples:
- `sx-collective-Proposal-v1.0-2026-08-04.docx` — first draft
- `sx-collective-Proposal-v1.1-2026-08-06.docx` — voice polish
- `sx-collective-Proposal-v2.0-2026-08-10.docx` — client asked to change Tier 2 duration
- `sx-collective-Cover-Letter-v2.0-2026-08-10.docx` — kept in sync when proposal bumps

**Sync rule:** when the proposal bumps to a new version, the cover letter and Timeline & Scope stay in sync with the same version tag on the same date, even if only the proposal was edited. This makes it obvious at a glance which files belong together.

---

## 3. Changelog — every version, every time

`01-proposal-package/_changelog.md` gets a new entry every time a version is generated:

```
# [Client Name] — proposal package changelog

## v2.0 · 2026-08-10
STRUCTURAL. Client asked to shorten Tier 2 from 60 to 90 days. Adjusted milestone dates in
Timeline & Scope accordingly. Prices unchanged.
Files: Proposal-v2.0, Cover-Letter-v2.0, Timeline-and-Scope-v2.0.

## v1.1 · 2026-08-06
Wording polish. Removed "elevate" and "seamless" from Why Me bullets. Tightened
track record paragraph.
Files: Proposal-v1.1, Cover-Letter-v1.1, Timeline-and-Scope-v1.1.

## v1.0 · 2026-08-04
Initial draft.
Files: Proposal-v1.0, Cover-Letter-v1.0, Timeline-and-Scope-v1.0, Fill-In-Guide-v1.0.
```

Newest at the top. One paragraph per version. If it's a structural change, lead with STRUCTURAL. If it's a client-triggered change, name which client comment set drove it.

---

## 4. Archive-on-new-version — mechanical, not judgment

When a new version is generated:

1. Everything currently in `01-proposal-package/current/` moves to `01-proposal-package/archive/v[old-version]-[YYYY-MM-DD]/`.
2. New files land in `current/`.
3. Changelog gets the new entry.

The archive folder name uses the version that just left `current/`. The `current/` folder always holds exactly the latest version of every doc — docx + pdf pair per doc.

---

## 5. Negotiation tracking

When the client comments on a version:

1. Save their file to `02-negotiation/client-comments/` with filename:
   `[client-slug]-[DocType]-v[X.Y]-client-comments-YYYY-MM-DD.docx`
2. Append to `revisions-log.md`:
   ```
   ## 2026-08-06 · Client comments on Proposal v1.0
   Received marked-up docx from Jane. Comments:
   - Wanted Tier 2 to include more marketing support
   - Asked to change payment terms to Net 30 on final invoice
   - Wanted "brand roster" replaced with "supplier network"
   Actions taken → v1.1 addresses terminology; Tier 2 marketing scope escalated for v2.0 decision.
   ```
3. If some changes need Addie's decision before applying, log those in `decisions-log.md` and stop.
4. Once decisions are made, apply the change → bump the version → update the changelog → move current to archive.

`redlines/` holds my marked-up responses back to the client (dated docx files with tracked changes on).

---

## 6. Close-out — move the whole folder

When the client engagement ends, move the entire `[client-slug]/` folder to:
`ClaudeProjects/01-projects/opportunity-designed/01-current/client/_closed/[status]/[client-slug]/`

Statuses:
- `won/` — signed and completed
- `lost/` — didn't sign
- `paused/` — deferred, may come back
- `active/` — currently running (default parent stays at `client/[client-slug]/`)

Never delete a client folder. Move-only. Git history retains everything anyway per hub rule.

---

## 7. Google Drive mirror

Once Drive is connected, mirror the exact structure to:
`Google Drive/Opportunity Designed/03-Clients/[Active|Closed|Lost]/[Client Name]/`

Templates mirror to `Opportunity Designed/02-Templates/`.
Master agreements mirror to `Opportunity Designed/04-Master-Agreements/` (MSA, NDA, Separation Agreement, Retainer templates).

**Sync direction:** local ClaudeProjects hub is the source of truth per the cloud-migration rule. Drive is a mirror for client sharing and viewing on the go. Do not edit in Drive as the primary — edit in the hub, sync forward.

Drive is not yet connected in this session. When it is, run the `od-library-sync` skill to push the current structure over.

---

## 8. Working with the templates

Templates live at `../templates/proposal-package/`:
- `build_proposal_template.js` — proposal (11 pages)
- `build_cover_letter_template.js` — cover letter (1 page)
- `build_timeline_template.js` — Project Timeline & Scope (9 pages)
- `build_fillin_guide.js` — internal fill-in guide (3 pages, never sent to client)

To generate a client version:
1. Copy the 4 template `.js` files into a working directory.
2. Fill placeholders in code, or via find-and-replace across text strings.
3. `node build_*.js` produces the docx files.
4. Open each in Word on Addie's Mac (Anton + Inter installed) → export PDF.
5. File under `[client-slug]/01-proposal-package/current/` with the version-tagged filename.

Do NOT edit the templates in `../templates/proposal-package/` per client. That's the master — clean, versioned, and untouched. Any change to the master template itself bumps a `_template-changelog.md` entry there and applies to every future package build.

---

## 9. Brand and legal locks — reference only

Encoded in every version. Do not re-decide:

**Brand.** Anton headlines all-caps. Inter body. Black and white palette (INK #1A1A1A, PARCHMENT #EDEDED shade, WARM_GRAY #707070 muted, RULE #C8C8C8 hairlines). Font embedding on in Word.

**Legal — verbatim, never edited except for client name:**
- Proposal §08 Investment & Terms (all rows)
- Proposal §06 working-document disclaimer
- Proposal §10 Acceptance language + signature blocks
- Timeline & Scope cover disclaimer banner
- Every reference to MSA, mutual NDA, Separation Agreement

**Voice.** No em dashes / en dashes / double hyphens / prose semicolons. No banned phrases (see `feedback_voice_rules`). No confidential metrics (`feedback_no_confidential_metrics`). No Backcountry by name (`project_case_bank`). "Team conversations" not "stakeholder interviews."

**Pricing anchor.** Tier 1 $6K / Tier 2 $9.5K / Tier 3 $15K unless the client engagement genuinely justifies a different structure (get Addie's sign-off before quoting anything else).
