# Claude — Single Source of Truth (CLOUD MASTER)

**This GitHub repo is the one and only hub for Addie's work.** It replaced the Mac-only hub
(`/Users/addie/ClaudeProjects`) on 2026-08-08 so every Claude session — phone, web, desktop —
works on the same masters in real time. The Mac folder is now a local MIRROR of this repo,
not the master. The original Mac-era rules file is kept as `CLAUDE-original-mac.md`.

## ⚠️ Things every thread must know

1. **Current brand: "Opportunity Designed"** (opportunitydesigned.com).
   "Strategy Studio" / "The Strategy Studio" is the OLD brand — fully archived. Do not create
   new work under that name unless Addie explicitly asks.
2. **Work only in this repo.** Clone it, edit masters in place, commit and push every approved
   change back to `main`. A session-local copy that never gets pushed does not count as saved.
3. **Never delete.** Move superseded files into an `archive/` (or `02-archive/`) folder path,
   or rely on git history. Nothing is ever deleted.
4. **Archives are reference-only.** `04-archive/`, `02-archive/`, `version-archive/`, and
   `snapshots/` folders stay on Addie's Mac and are NOT in this repo. Never recreate them here.
5. **Read `docs/claude-context/CORE-RULES.md` FIRST, every session.** It is the tiny always-load
   layer: non-negotiables, danger list, saving flow, output pipeline, tracking manifest, and a Router.
   Load `PROJECT-MEMORY.md` and other deep docs ONLY when the Router says the task needs them.
   Settled decisions are in `DECISIONS.md` (do not re-ask). Desktop sessions also have live project
   memory; these files are the synced copy for phone/web sessions.

## The master-file rule

1. Only work on the MASTER versions indexed in `MASTER_FILES.md`.
2. To revise something, edit the master in place, commit, push. Git history is the snapshot.
3. If you can't tell which file is the master, ask rather than guess.

## Website source lives in SEPARATE repos

The live site source is **NOT here**. `01-projects/opportunity-designed/01-current/website/deploy-live/`
lives in its own repo: **github.com/general-pursuits/opportunityDesigned-website** (main → Netlify auto-deploy,
site id 773c8bf0-a668-4411-b7d2-966fe82785a7). Clone that repo for site work; drafts still start in
`website/working-drafts/` here. Publish flow and rules: `docs/claude-context/PROJECT-MEMORY.md`
(website-workflow section) + `website/HOW-TO-DEPLOY.md`.

**The Baddie Pack** site has its own repo too: **github.com/general-pursuits/theBaddiePack-website**
(private). It was empty until 2026-08-29 and now holds a scaffold only — no site built yet.
Brand, service model, safety rules, and the approved website brief stay here in
`Projects/the-baddie-pack/01-current/`; only site code goes in that repo.

Three repos total, all on the same account:

| Repo | Holds |
|---|---|
| `claudeprojects-hub` | this hub — all masters, briefs, standing rules |
| `opportunity-designed` | opportunitydesigned.com live site source |
| `theBaddiePack-website` | The Baddie Pack site source (scaffold stage) |

## Where things live

```
(repo root)
├── 01-projects/
│   ├── opportunity-designed/01-current/   ← ALL current OD masters
│   │   ├── brand identity/   ← OpportunityDesigned_Brand_Marketing_Playbook.docx (brand master)
│   │   ├── mark/             ← logo mark library (mark-cleaned-vector.svg = vector master)
│   │   ├── website/          ← SEO, working-drafts, social-and-marketing (deploy-live = separate repo)
│   │   ├── templates/        ← MASTER templates: agreements, NDA, invoice, rate card, proposals
│   │   ├── client/           ← client deliverables (sx-collective etc.)
│   │   ├── automations/, gmail/, headshots/, output/, operations/, industry logos/
│   ├── jewelry/              ← jewelry brand (terse voice) + digital-gallery app
├── 02-apps/                  ← addie-dashboard (React/Vite), my-plugin
├── 03-documents/resume/      ← Addie's resume
├── Projects/                 ← the-baddie-pack/ (dog-walking project) + misc session outputs
├── docs/claude-context/      ← PROJECT-MEMORY.md (all standing rules) — READ FIRST
├── CLAUDE.md                 ← this file
└── MASTER_FILES.md           ← authoritative index of every master file
```

## Session workflow (every cloud session)

1. `git clone https://github.com/<owner>/<repo>.git` (or `git pull` if already cloned this session)
2. Read this file + `docs/claude-context/CORE-RULES.md` (load deeper docs on demand per its Router)
3. Edit masters in place; get Addie's approval per the standing rules
4. `git add -A && git commit -m "what changed" && git push`
5. If push is rejected, `git pull --rebase` then push. Never force-push.

On Addie's Mac, `/Users/addie/ClaudeProjects` itself is the local clone of this repo:
pull before working locally, push after. The one-command way is `sh sync.sh "what changed"`
(pull-rebase, commit, push) so it lands on phone and computer. Mirror reference records to Notion too
(the repo stays source of truth). Never push through the folder bridge (stale `index.lock`).

_Migrated to cloud: 2026-08-08. Mac hub retired as master (kept as local mirror + archive home)._
