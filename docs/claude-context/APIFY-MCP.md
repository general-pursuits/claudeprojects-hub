# Apify MCP — setup and house rules

What it is: Apify's hosted MCP server at `https://mcp.apify.com/`, connected over native HTTP
transport. It gives a Claude session direct access to Apify Actors — scrapers for search, maps,
social, and web crawling — without leaving the chat.

## The config

Project-scoped MCP config lives in `.mcp.json` at the root of all three repos, so any session that
clones one picks it up. Claude Code reads it on session start and prompts for approval the first time.

```json
{
  "mcpServers": {
    "apify": {
      "type": "http",
      "url": "https://mcp.apify.com/"
    }
  }
}
```

To add it to a repo that does not have it yet, from that repo:

    claude mcp add apify "https://mcp.apify.com/" -t http -s project

Without `-s project` it lands in local config (`~/.claude.json`, that machine only) instead of a
committed `.mcp.json`.

Do NOT use the older `npx mcp-remote` stdio form. Native HTTP is the supported transport and does
not put a shell command in a committed file.

### Which Actors are available

The bare URL exposes Apify's own discovery tools, so a session can search the Actor store and call
any Actor on demand. Appending `?tools=actors,docs,<actor>,<actor>` to the URL instead preloads a
fixed set as first-class tools, which saves a discovery step. The Actors worth reaching for here:

| Actor | Use |
|---|---|
| `actors`, `docs` | Apify's own tool-discovery + docs tools |
| `apify/rag-web-browser` | fetch a page as clean text for research |
| `apify/website-content-crawler` | crawl a site's content (competitor pages, retailer sites) |
| `apify/web-scraper` | general-purpose scrape when the above are too blunt |
| `apify/google-search-scraper` | live SERP checks (real data for SEO claims) |
| `compass/google-maps-extractor`, `compass/crawler-google-places`, `lukaskrivka/google-maps-with-contact-details` | local business + retailer lookups, contact enrichment |
| `code_crafter/leads-finder`, `vdrmota/contact-info-scraper` | lead sourcing and contact details |
| `dev_fusion/Linkedin-Profile-Scraper`, `curious_coder/linkedin-jobs-scraper` | profile and job-posting research |
| `apify/instagram-scraper`, `-profile-`, `-post-`, `-reel-scraper` | brand + competitor social research |
| `clockworks/tiktok-scraper`, `clockworks/free-tiktok-scraper` | TikTok research (free variant first) |
| `streamers/youtube-scraper` | YouTube research |
| `apidojo/tweet-scraper` | X/Twitter research |
| `apify/facebook-posts-scraper`, `curious_coder/facebook-ads-library-scraper` | Facebook posts + competitor ad creative |

## Authentication — Addie does this, not Claude

The hosted server needs an Apify account. Until it is authorized, `claude mcp list` reports
`apify: ... - ! Needs authentication` and no Apify tools are callable. Two ways in:

1. **OAuth** — the default. Run `/mcp` in an interactive session, pick apify, and authorize in the
   browser. Per CORE-RULES, Claude never grants OAuth: Addie clicks through this once, on her Mac.
   It cannot work in a cloud or phone session, which has no browser.
2. **API token** — for headless and cloud sessions, pass the Apify token as an auth header when
   adding the server:

       claude mcp add apify "https://mcp.apify.com/" -t http -s project \
         -H 'Authorization: Bearer ${APIFY_TOKEN}'

   Single quotes matter. They write the literal `${APIFY_TOKEN}` into `.mcp.json`, which Claude Code
   expands from the environment at load time. Double quotes would expand it in the shell first and
   commit the live token into the repo.

Never paste the token into `.mcp.json`, a commit, or a chat. It is a credential; it lives in the
environment only.

## Cost — this is NOT a free tool

Apify Actors bill in compute units and most of these Actors are paid-per-result on top. The free
tier is a small monthly credit that a single broad crawl can burn through. So, per the free-tiers-only
rule in CORE-RULES:

- Cap every run. Set `maxItems` / `maxResults` / `maxPages` on the Actor input before running it.
- Start with the free variant where one exists (`clockworks/free-tiktok-scraper` before the paid one).
- Tell Addie the expected cost before any run that is larger than a spot check, and let her approve.
- Never leave a scheduled or recurring Actor run behind.

## What it is good for here

- **Lead sourcing** — Google Maps and contact-info Actors for brand and retailer prospect lists,
  feeding the same triage flow as `od-lead-triage`.
- **SEO evidence** — live SERP pulls via `apify/google-search-scraper`. CORE-RULES requires every
  stat be real and sourced; a live SERP counts, an estimate does not.
- **Competitor scans** — site crawls and Facebook Ads Library for positioning and ad creative.
- **Social research** — what comparable consultants and outdoor/consumer brands are posting.

Scraped output is raw third-party data. It is research input, never a public claim: anything that
ends up in site copy or a client deliverable still goes through the Proof Bank and the normal
output pipeline (voice-scrub, named-entity-check, verify-work).

## Legal boundary

Scrape public data only. No logged-in or gated content, no personal data beyond public business
contact details, and honor each platform's terms. If a task needs anything behind a login, stop and
ask Addie.

_Added 2026-08-29._
