# Cowork Instructions — Opportunity Designed: Marketing, SEO & AI Visibility

*Add this to project instructions. It tells any future session what this business is, what is true right now, what the strategy is, and the rules for acting on it. Last updated August 3, 2026 from live Semrush, Google Search Console, SERP research, and the Keyword & Search Strategy Brief (August 2026) — approved additions integrated.*

---

## The business, in three lines

Opportunity Designed (opportunitydesigned.com) is Addie Morrow's growth strategy consultancy for consumer brands and the retailers who sell them: retail buying, merchandising, category strategy, market access. Positioning: the former buyer selling buying-side strategy; nobody else ranking in this space has sat in the buyer's chair. Entry engagement is the $450 Opportunity Review; the ladder runs up through growth projects, operational buildouts, and advisory retainers.

## Sources of truth (read before writing anything)

The Backlinks Kit at `01-current/website/social-and-marketing/BACKLINKS-KIT.md` is canonical for all public-facing business facts, descriptions, boilerplate, official URLs, and Q&A wording. Use it verbatim; consistency across every listing and profile is the strategy. The live site's `llms.txt` (in `deploy-live/`, mirrored in `page-build/`) must always match the kit wherever they overlap. The SEO strategy and all real keyword data live in `social-and-marketing/SEO-COMPETITIVE-LANDSCAPE.md`. The public contact is always hello@opportunitydesigned.com, never a personal address.

## Standing rules for every session

Free tools only; no paid subscriptions or trials requiring a card. Every number must be real and sourced (Semrush free tier, Google Search Console, live SERPs); never invent volumes, rankings, or statistics. Claude drives forms and drafts, but the user personally handles logins, OAuth grants, terms acceptance, and gets a review-and-approve pause before anything is submitted or published. Site deploys go through `sh publish.sh "message"` in `deploy-live/` (commits and pushes; Netlify auto-builds) — never run git through the folder bridge (it leaves a stale index.lock the bridge cannot delete; if one exists, the user removes it in Terminal). New brand copy avoids em dashes. Her street address does not go on public listings unless she explicitly provides one; city-level (Salt Lake City) only.

## Current state (update this section as things change)

Live and done: Crunchbase company + founder profile (crunchbase.com/organization/opportunity-designed, logo still to add); llms.txt with full pages list and LLM question set; Google Business Profile exists with CID link but is NOT yet verified. In flight: Bing Places listing created, waiting on a postcard PIN to the listed address (enter it at bingplaces.com when it arrives; GBP weekly sync becomes available once GBP is verified); Clutch profile drafted through step 3 of 5 ($1,000+ minimum project, hourly N/A), parked until a business phone number and a public-usable address exist — finishing Clutch automatically creates The Manifest listing (no separate signup). Not started from the kit: Qwoted/Connectively press profiles, LinkedIn company launch post (copy ready in kit section 7), Silicon Slopes and local directories, podcast pitches.

## The SEO strategy (data-backed July 2026; keyword brief integrated August 2026)

The site is weeks old with near-zero authority; the strategy is long-tail and bottom-of-funnel first. The through-line for every piece of content, per the keyword brief: Addie was *the buyer*. Competing content is written from the brand's side ("how to pitch"); almost nobody owns the buyer's side ("here's how I actually decided yes or no"). Every asset answers from the buyer's chair.

Geography ruling (decided): this is a national play in content — build no city-targeted pages — but finish Google Business Profile verification and collect 3–5 reviews anyway, since the local pack is unclaimed and costs nothing. GBP is the only local investment.

Priority order:

1. Claim the positioning and entity. Homepage/About own "former retail buyer consultant" and buyer's-perspective retail strategy, with named retailers, 10+ years, and Person/Organization/Service schema. Everything compounds off this.
2. Publish the two flagship BOFU pieces: "Retail broker vs. consultant" (neutral comparison table: cost, incentives, when to use each) and "Why retail buyers say no" (ranked real reasons from the buyer's chair). Lowest competition, highest conversion, and the top AI-citation bait.
3. Ship the BOFU long-tail cluster: "how much does a retail consultant cost" (pricing-transparency page framed vs. broker commissions), "how to find a retail buyer consultant," "do I need a broker or a consultant," "is my product retail ready" built as a scorecard quiz whose result maps to the $450 Opportunity Review. Every piece ends on the Project Fit Call.
4. Quick measured-data wins alongside: MAP pricing page (measured 1,600/mo, KD 16 — largest measured prize), "how to become a costco vendor" + "costco vendor requirements" + "how to sell to Costco" phrasing added to the Costco guide, and a "retail merchandising consultant" service page (KD 6, and GSC shows Google already testing the site on merchandising queries).
5. Build the pillar "How to get your product into retail stores" linking all retailer guides both ways, then extend the series (Nordstrom, Dick's, Sephora, Trader Joe's) with channel-specific nuance per vertical: beauty (Ulta/Sephora submission portals, UB Marketplace, accelerator), grocery/natural (Whole Foods forager + Innerview), warehouse club (pallet/roadshow economics), mass (RangeMe/Target+ vs. buyer-direct). Retailer head terms are pillars, not sprints — months to rank.
6. Add the sales-leader cluster (brand-side NAMs, a second audience the guides don't yet target): "how to prepare for a line review," "retail buyer objections and how to handle them," "how retail buyers evaluate new brands," "joint business plan retail buyer."
7. Feed the glossary (terminology queries keep earning GSC impressions) and ship a linkable asset (retail-ready scorecard doubles as this).
8. "Retail buying consultant" (50/mo, KD 25, commercial intent) is the conversion page; "retail consultant" (590/mo, KD 26) the mid-term target. Bain/EY head terms are not targets.

Volume caution: the keyword brief's volumes are SERP-reasoned estimates; the Semrush-measured numbers in SEO-COMPETITIVE-LANDSCAPE.md take precedence wherever they conflict (e.g., "how to become a costco vendor" measured 90/mo, not the brief's 600–1,000). Validate new targets in Semrush free tier before investing.

Traffic to actively avoid (never target, use as negatives in any paid search): jobs, salary, "how to become a retail buyer," degree/course/resume/intern queries. Bare "how to get into retail" skews careers — always qualify with product/brand/vendor/wholesale/stores.

Named competitors to check against, not imitate: Retailbound (closest true competitor), Mr. Checkout (volume content), WeStock, Come Sell or High Water, Julee Ho Media. Content mills also on the brief's radar: Spocket, PartnerSlate, Repsly.

## Standing rulings from the July 29 AI-visibility audit (still in force)

One category label, verbatim everywhere: "growth strategy consultancy for consumer brands and retailers." The audit confirmed the site used three different labels; AI engines can't classify an entity that describes itself three ways. Any new page, profile, or bio uses this exact phrase. Numeric proof uses public facts only — firsts, durations, counts, named placements — never confidential client performance data (her rule, 2026-07-29). Concentrate content in two territories: the first big retail rollout (market access) and the category growth story (category strategy). Ignore share-of-voice comparisons against McKinsey/BCG/NielsenIQ — wrong benchmark; the winnable game is boutique-lane prompts. "Opportunity units" (an AI-invented phrase) was evaluated in FRAMEWORK-CODIFICATION.md — adopt only as a subordinate glossary term if at all; performance premium stays the flagship coined term.

For AI-visibility *tracking*, the competitor set is different from the SEO content competitors: Clarkston Consulting, The Partnering Group, Daymon, Advantage Solutions (or Acosta), with Circana as the reference giant (full rationale and the 15 tracked prompts in SEMRUSH-RETARGET.md). The feedback loop: any tracked prompt where a competitor is cited and Opportunity Designed isn't becomes the brief for the next guide or FAQ entry.

## AI-citation tactics (GEO/AEO)

FAQPage + Person + Organization + Service schema on every guide; lead every page with a 2–4 sentence extractable answer; publish original citable stats from Addie's experience ("in 10+ years buying, my top three reasons for a no were…") — primary-source data is what AI quotes; keep the founder bio string identical everywhere. Third-party signals outweigh your own site: pursue inclusion in "top retail consultants" roundups, genuine expert answers on Reddit (r/CPG, r/smallbusiness) and Quora under her name, and CPG podcasts/trade press (Startup CPG, Foodbevy). Define owned vocabulary — "performance premium," "Opportunity Review," "Project Fit Call" — as FAQ/glossary pages so AI attributes the terms to Opportunity Designed.

## Social playbook

LinkedIn is the primary channel by a wide margin (it's where hireable B2B decision-makers are). Headline is the lever, not hashtags — it should read like "Ex-retail buyer · I help CPG brands get on shelf at Ulta, Costco, Target." Post format: first-person buyer-POV text posts and carousels ("what makes me say no in 10 seconds," myth-busting slotting fees), keywords in the post body, 1–3 tight hashtags, soft Fit Call CTA. Instagram secondary (founder reach; Reels/carousels, keyword-first captions, 3–8 niche tags, link-in-bio to Fit Call). TikTok for reach ("I was a buyer at [retailer] — here's how to pitch me," keywords spoken in first 3 seconds); YouTube for evergreen high-intent explainers (8–15 min, literal long-tail titles). Platform per audience: sales leaders → LinkedIn decisively; founders → LinkedIn + IG + YouTube; early startups → TikTok/IG for reach, convert on LinkedIn/YouTube.

## Measurement routine (monthly, all free)

Search Console: impressions trend, new queries, anything reaching page 2 (positions 11–20) gets an internal-linking and title pass. Semrush free tier: one-time setup of a free project for opportunitydesigned.com with Site Audit and Position Tracking (track both keywords and AI prompt citations via the AI Visibility toolkit, within free limits); thereafter use the 10 free lookups/day to refresh the tracked keyword table in SEO-COMPETITIVE-LANDSCAPE.md — still unmeasured: "retail consultant salt lake city". AI visibility check: ask ChatGPT/Perplexity/Copilot the money prompts from the keyword brief ("who are the best retail distribution consultants for CPG brands," "should I hire a broker or a consultant to get into Target," "why did my product get rejected by a Costco buyer," "who can help me get on the shelf at Ulta/Costco/Whole Foods," "what is performance premium") — log whether Opportunity Designed is cited. Update the Current state section of this file whenever a listing goes live or a blocker clears.

## Blockers and open decisions to nag about

Blockers: the Bing postcard PIN (arrives ~early-to-mid August 2026); the business phone number (unblocks Clutch + The Manifest); GBP verification (unblocks local pack and Bing sync); the Crunchbase logo upload; Clutch client reviews (2–3) once the profile is live — reviews, not the listing, are what rank there. Quick free housekeeping possibly not yet done (from OFFSITE-EXECUTION-PACK.md): GSC resubmit sitemap + Request Indexing on the newer guide URLs, and Bing Webmaster Tools "Import from Google Search Console" (one click; feeds ChatGPT/Copilot indexing).

Framework decisions LOCKED (2026-08-03): the method is **The Opportunity Blueprint** (Map, Design, Build); "opportunity unit" adopted as a subordinate glossary term (performance premium stays the flagship); the framework lives as a section on About for now, graduating to /approach later. The citable definition and per-surface copy live in FRAMEWORK-THREADING-PACK.md — use that wording verbatim everywhere. Threading status: llms.txt Method section done (ships with next publish); still to apply: About page section + glossary entries + JSON-LD (needs preview + approval + publish), the one-liner on Crunchbase/LinkedIn/Qwoted/Clutch bios, the Backlinks Kit boilerplate update, and the Playbook note.

## Map of the SEO folder (who's canonical for what)

This guide is the master instructions file; SEO-COMPETITIVE-LANDSCAPE.md holds the measured keyword data and competitor analysis. Still-active reference docs: SEMRUSH-RETARGET.md (AI-tracking competitor set + 15 prompts), FRAMEWORK-CODIFICATION.md (pending decisions above), AI-VISIBILITY-ACTION-PLAN.md (audit response; its rulings are summarized in this guide), and the keyword brief PDF (BOFU strategy source; volumes superseded by measured data). Partially superseded: ANCHOR-GUIDES-BRIEFS.md — Whole Foods and Target guides are built and live; still open from it are the retail-readiness checklist guide (now merged with the approved scorecard-quiz idea) and the bench items (broker/data-provider/consultancy explainer — merge with the broker-vs-consultant flagship rather than writing twice — and the category-growth-story anchor). OFFSITE-EXECUTION-PACK.md is mostly executed history (Crunchbase live, Bing pending PIN, Clutch drafted); its "next tier" directory list and housekeeping items remain valid. BACKLINKS-KIT_5.md in this folder is an older copy — the canonical kit (v6, expanded Q&A) is at social-and-marketing/BACKLINKS-KIT.md.
