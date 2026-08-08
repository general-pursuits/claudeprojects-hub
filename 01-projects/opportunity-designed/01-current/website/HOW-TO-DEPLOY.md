# How to Deploy opportunitydesigned.com

_Last updated: July 28, 2026_

## The one-command way (normal publishing)

1. Open Terminal
2. Run:

    cd ~/ClaudeProjects/Projects/opportunity-designed/01-current/website/deploy-live
    sh publish.sh "describe what changed"

3. Wait 1–2 minutes, then check https://opportunitydesigned.com (hard-refresh with Cmd+Shift+R if it looks stale)

That's the whole process. The script commits your changes, pushes them to GitHub, and Netlify automatically builds and publishes.

## How the pipeline works

- The website files live in: `~/ClaudeProjects/Projects/opportunity-designed/01-current/website/deploy-live`
- That folder is a git repository connected to GitHub: `github.com/adelitaodm/opportunity-designed`
- Netlify watches the `main` branch — every push automatically builds and publishes the live site
- Every publish is a git commit, so full version history lives in GitHub (view, compare, or restore any version)

## Checking on a deploy

- Deploy dashboard: https://app.netlify.com/projects/opportunity-designed/deploys
- The top entry shows the latest deploy; "Published" means it's live
- Each deploy has a permanent preview URL if you want to compare versions

## Rolling back to a previous version

1. Go to https://app.netlify.com/projects/opportunity-designed/deploys
2. Click the older deploy you want to restore
3. Click "Publish deploy" — the site instantly reverts, no rebuild needed

## A/B testing (when you're ready)

1. In Terminal, from the deploy-live folder:

    git checkout -b variant-b
    (make your changes)
    git add -A && git commit -m "variant b"
    git push origin variant-b
    git checkout main

2. In Netlify: Site configuration → Build & deploy → Branch deploys → add `variant-b`
3. Netlify gives the branch its own URL (variant-b--opportunity-designed.netlify.app)
4. Use Netlify's Split Testing to send a percentage of real visitors to each branch

## If something goes wrong

- **"Another git process seems to be running"** → delete the lock file it names, e.g. `rm .git/index.lock` (from inside the deploy-live folder), then rerun publish.sh
- **Push asks for login** → username is `adelitaodm`, password is your GitHub personal access token (Settings → Developer settings → Personal access tokens; needs the `repo` scope)
- **Deploy succeeded but site looks old** → hard-refresh (Cmd+Shift+R) or check in an incognito window first; it's almost always browser cache
- **Deploy failed in Netlify** → open the deploy log, scroll to the red error near the bottom, and share it with Claude
- **Never use Netlify's "Fix with agent" button** — it once pushed an outdated copy of the site over the repo. Fix issues from the deploy log instead.

## Working across multiple Claude chats

The files on your Mac are the single source of truth. Any Claude thread doing website work should read from and write to `working-drafts/` (drafts) and `deploy-live/` (live mirror) on your computer — never keep changes only in a chat's temporary workspace. This is recorded in the project memory, so new threads pick it up automatically; if one seems unaware, say "check the project memory for the website workflow."

## Do not

- Don't edit files directly in GitHub — edit in the deploy-live folder and publish with the script, or the folder and repo will drift apart
- Don't put private files in deploy-live — everything in that folder is published to the public website

## Publishing a new field note (checklist)

Every new article touches five places. Miss one and the article is live but invisible to search/AI or orphaned from the rest of the site.

**The easy way:** give Claude a draft or a topic, and ask it to follow this checklist. Review the mockup it sends, approve, then run publish.sh.

**Drafts first:** every work-in-progress page is saved in `~/ClaudeProjects/Projects/opportunity-designed/01-current/website/working-drafts/` (field-notes drafts in its `field-notes/` subfolder). Nothing in that folder is public. Only after approval does a draft move into `deploy-live` — so `working-drafts` always holds the most recent unpublished version, and `deploy-live` always mirrors exactly what's live.

1. **The article file** — `field-notes/your-slug.html`, built from the existing article template (copy the structure of an existing note):
   - Title tag under 60 characters; meta description under 155
   - Canonical URL, Open Graph and Twitter tags
   - JSON-LD `BlogPosting` or `Article` schema, including the `image` field
   - "Field notes" marked active in the nav
   - Two-part CTA after the article: `cta-band` ("Start the conversation") + the one-line Opportunity Review note (wrapped in TEMPORARY comments)
   - FAQ section (2+ questions) with matching FAQPage schema
   - "Related reading" links to 3–4 other field notes
   - Email signup in the footer (`.foot-subscribe`)
2. **The hub page** — add the article to the list on `field-notes.html`
3. **sitemap.xml** — add a `<url>` entry with today's date as lastmod
4. **llms.txt** — add the article to the "Field notes (articles)" list
5. **Cross-links** — add the new article to the "Related reading" list of 2–3 older articles (keeps every article at 3+ internal inbound links)

Then publish:

    sh publish.sh "new field note: <title>"

Verify at https://opportunitydesigned.com/field-notes/your-slug (hard-refresh).
