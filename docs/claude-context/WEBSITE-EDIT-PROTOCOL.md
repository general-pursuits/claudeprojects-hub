# WEBSITE EDIT PROTOCOL — concurrent edits, versioning, never overwrite

The live site source is its OWN git repo: github.com/general-pursuits/opportunityDesigned-website (branch main ->
Netlify auto-build). Multiple chats may edit at once. Git is both the version history and the safety net.
Follow this every time so nothing is overwritten and the site never reverts to an older version.

## The golden rules (in order)

1. PULL FIRST, ALWAYS. Before touching any site file: `git pull --rebase origin main`. Never edit a stale
   working copy. A chat that has been open a while MUST pull again before editing.
2. DRAFT then PROMOTE. New or changed content starts in `website/working-drafts/`. Only approved content
   moves into `deploy-live/`. Drafts never go live.
3. SMALL, ATOMIC COMMITS. One logical change per commit, clear message, push right after Addie approves.
   Do not sit on uncommitted edits while another chat is working the same repo.
4. NEVER FORCE-PUSH. If a push is rejected, `git pull --rebase`, resolve, push again. Force-push is what
   silently reverts other people's work. It is banned. No exceptions.
5. CONFLICT = RESOLVE, never overwrite. If two chats changed the same lines, keep BOTH intents. If you
   cannot tell which is right, STOP and ask Addie. Never blindly pick one side.
6. ONE DEPLOY PER APPROVAL ROUND. Addie deploys via `sh publish.sh "msg"` in deploy-live; Netlify builds.
   Roll back via Netlify -> Deploys -> older -> Publish. NEVER the "Fix with agent" button (it restores
   stale content).
7. CACHE STAMP. Any CSS / JS / font / image edit bumps the `?v=` stamp on ALL pages sharing that file;
   never reuse a same-day stamp.

## Coordinate parallel edits BEFORE they collide

- Before a multi-file or multi-page change, add a row to the EDIT REGISTER (below) and read it first. If an
  active row already touches the same files, coordinate or wait rather than editing in parallel.
- Prefer splitting work so chats touch DIFFERENT files. Same-file parallel edits must serialize; the
  pull-rebase discipline catches the rest.
- When several edits are pending at once, use the `od-website-change-merge` skill to reconcile them into one
  clean, current set before deploy, so no one's change is dropped.

## Edit register

Location: `deploy-live/EDIT-REGISTER.md` (create if missing). One row per active edit:

`START <YYYY-MM-DD HH:MM MT> | chat: <short id/topic> | files: <paths> | change: <summary> | status: drafting | awaiting-approval | deployed`

Update status as it moves; mark `deployed` (and the date) when live. This register is advisory coordination;
rules 1 and 4 are the hard guarantee. Keep it in the repo so every chat sees the same list after a pull.

## Deploy checklist (before publish.sh)

- Pulled latest, rebased clean, links/tests ok.
- For a new field note: the 5 publish points are hit (see DEFINITION-OF-DONE.md).
- Cache stamp bumped where a shared asset changed.
- Addie approved this round; mockup shown (mobile + web, mobile-first) for any visual change.
- After deploy: verify the live page, close the edit-register row, log the manifest line.

## Why this fixes the "reverting to older versions" problem

Reverts happen three ways: a chat commits on a stale base and force-pushes; a chat overwrites a conflict
instead of merging; or someone clicks Netlify "Fix with agent". Rule 1 (pull first) + Rule 4 (never
force-push) + Rule 5 (resolve, never overwrite) + Rule 6 (no Fix-with-agent) close all three. Git keeps
every version, so nothing is ever lost, and the newest APPROVED change always wins.
