# GitHub rulesets for the general-pursuits repos

Updated 2026-08-31 after the org move. Designed around how you actually work: you push straight to
`main` (sync.sh on the Mac, cloud tasks pushing the hub, Netlify deploying the website from main).
These rules block the things that lose work and do NOT require pull requests, which would break
your sync and deploy flow.

## Step 1 — authenticate the gh CLI (one time)

The earlier commands failed only because gh was never signed in. Run:

    gh auth login

Choose: GitHub.com, HTTPS, "Login with a web browser". Paste the one-time code it shows into the
browser window it opens. You will need admin rights on the general-pursuits org, which you have as
the owner. Nothing needs to be shared with anyone.

Confirm it worked:

    gh auth status

## Step 2 — create the ruleset on all three repos

Copy this whole block into Terminal. It loops over the three repos and prints the result for each.

    for R in claudeprojects-hub opportunityDesigned-website theBaddiePack-website; do
      echo "== $R"
      gh api -X POST "repos/general-pursuits/$R/rulesets" --input - <<'JSON'
    {
      "name": "protect-main",
      "target": "branch",
      "enforcement": "active",
      "bypass_actors": [
        { "actor_id": 5, "actor_type": "RepositoryRole", "bypass_mode": "always" }
      ],
      "conditions": { "ref_name": { "include": ["~DEFAULT_BRANCH"], "exclude": [] } },
      "rules": [ { "type": "deletion" }, { "type": "non_fast_forward" } ]
    }
    JSON
    done

What it sets: **Restrict deletions** and **Block force pushes** on the default branch, with the
**Repository admin** role (actor_id 5) allowed to bypass so your own direct pushes keep working.

Verify:

    for R in claudeprojects-hub opportunityDesigned-website theBaddiePack-website; do
      echo "== $R"; gh api "repos/general-pursuits/$R/rulesets" --jq '.[].name'
    done

## If you would rather click than type

1. Repo → Settings → Rules → Rulesets → New ruleset → New branch ruleset
2. Name: protect-main
3. Enforcement status: Active
4. Bypass list → Add bypass → Repository admin → Always
5. Target branches → Add target → Include default branch
6. Check: Restrict deletions, Block force pushes
7. Leave "Require a pull request before merging" unchecked
8. Create

## Why not more locked down

Requiring pull requests or status checks is right once someone else commits to these repos, or once
the website has a build step worth gating. Today a PR requirement would stop sync.sh, the daily
reconcile, and the Netlify deploy path, so it would cost more than it protects.

## After the transfer: check Netlify

The website repo moved from a personal account into the organization. Netlify connects to GitHub
through its GitHub App, and that installation is per-account, so a transferred repo can lose its
build link. Open the Netlify project's Build and deploy settings and confirm the linked repository
now reads general-pursuits/opportunityDesigned-website. If Netlify cannot see it, install the
Netlify GitHub App on the general-pursuits organization, grant it access to that repo, then relink.
Until that is confirmed, treat the auto-deploy as unproven: after the next `sh publish.sh`, check
that a new deploy actually starts.

## The Dependabot alerts on the hub

The push showed 50 alerts (31 high). They come from three committed lockfiles, not from anything
that runs in production:

- `01-projects/jewelry/digital-gallery/package-lock.json` (~640 KB)
- `02-apps/addie-dashboard/package-lock.json` (~120 KB)
- a stub `package-lock.json` at the repo root with no packages in it

The hub is a private file store, so nothing here is internet-facing and no one else can open a pull
request against it. Treat these as maintenance, not an incident. When you next work on either app,
run `npm audit fix` in that app's folder and commit the updated lockfile. The root stub lockfile is
noise and can be deleted. If the alert count is distracting in the meantime, Settings → Advanced
Security → Dependabot alerts can be turned off for this repo.
