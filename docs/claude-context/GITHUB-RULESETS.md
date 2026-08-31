# GitHub rulesets for the general-pursuits repos

Written 2026-08-31. Designed around how you actually work: you push straight to `main`
(sync.sh on the Mac, cloud tasks pushing the hub, Netlify deploying the website from main).
So these rules block the things that lose work and do NOT require pull requests, which would
break your sync and deploy flow.

## What each ruleset does

Name: **protect-main**
Target: the default branch (`main`)
Enforcement: Active
Rules to turn ON:
- Restrict deletions  (nobody can delete main)
- Block force pushes  (no rewriting history over your work)
Rules to leave OFF:
- Require a pull request before merging  (would block sync.sh and the cloud tasks)
- Require status checks, require linear history, require signed commits  (not needed yet)
Bypass list: add **Repository admin** so your own direct pushes keep working.

Apply to all three repos in the org: claudeprojects-hub, opportunityDesigned-website, and
theBaddiePack-website.

## Option A — one command per repo (needs the gh CLI, run in your own terminal)

Install once if needed:  brew install gh   then:  gh auth login

Then for each repo:

    gh api -X POST repos/general-pursuits/claudeprojects-hub/rulesets \
      -H "Accept: application/vnd.github+json" \
      -f name='protect-main' -f target='branch' -f enforcement='active' \
      -F 'conditions[ref_name][include][]=~DEFAULT_BRANCH' \
      -F 'conditions[ref_name][exclude][]=' \
      -F 'rules[][type]=deletion' \
      -F 'rules[][type]=non_fast_forward' \
      -F 'bypass_actors[][actor_id]=5' \
      -F 'bypass_actors[][actor_type]=RepositoryRole' \
      -F 'bypass_actors[][bypass_mode]=always'

Repeat with `opportunityDesigned-website` and `theBaddiePack-website` in place of `claudeprojects-hub`.
(actor_id 5 = the Repository admin role.)

Verify:

    gh api repos/general-pursuits/claudeprojects-hub/rulesets

## Option B — the click path (about 60 seconds per repo)

1. Repo → Settings → Rules → Rulesets → New ruleset → New branch ruleset
2. Name: protect-main
3. Enforcement status: Active
4. Bypass list → Add bypass → Repository admin → Always
5. Target branches → Add target → Include default branch
6. Check: Restrict deletions, Block force pushes
7. Leave "Require a pull request before merging" unchecked
8. Create

## Why not more locked down

Requiring pull requests or status checks is the right call once someone else commits to these
repos, or once the website has a build step worth gating. Today a PR requirement would stop
sync.sh, the daily reconcile, and the Netlify deploy path, so it would cost more than it protects.

## After the transfer: check Netlify

The website repo moved from a personal account into the general-pursuits organization. Netlify
connects to GitHub through its GitHub App, and that installation is per-account, so a transferred
repo can lose its build link. Open the Netlify project's Build and deploy settings and confirm the
linked repository now reads general-pursuits/opportunityDesigned-website. If Netlify cannot see it,
install the Netlify GitHub App on the general-pursuits organization and grant it access to that
repo, then relink. Until that is confirmed, treat the auto-deploy as unproven: after the next
`sh publish.sh`, check that a new deploy actually starts.
