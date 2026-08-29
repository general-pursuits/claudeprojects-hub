# Apify MCP — setup and house rules

What it is: Apify's hosted MCP server (`https://mcp.apify.com/`), reached through `npx mcp-remote`.
It gives a Claude session direct access to Apify Actors — scrapers for search, maps, social, and
web crawling — without leaving the chat.

## The config

Project-scoped MCP config lives in `.mcp.json` at the root of each repo. Claude Code reads it on
session start and prompts for approval the first time.

```json
{
  "mcpServers": {
    "apify": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://mcp.apify.com/?tools=actors,docs,<actor list>"
      ]
    }
  }
}
```

The `?tools=` list preloads a fixed set of Actors so the session sees them as callable tools
instead of having to search the Apify store first. Current list:

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

The hosted server needs an Apify account. Two ways in:

1. **OAuth** — the default. On first connect, `mcp-remote` opens a browser to authorize Apify.
   Per CORE-RULES, Claude never grants OAuth. Addie clicks through this once, on her machine.
   It does not work in a cloud/phone session with no browser.
2. **API token** — put the Apify token in the environment as `APIFY_TOKEN` and pass it as a
   header, which is what a headless or cloud session needs. Check Apify's current MCP docs for the
   exact header form before relying on it.

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
