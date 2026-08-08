# DIY Website Build Map — Free-Tier Auction Site

A plan for building your jewelry gallery + auction site yourself, using free tools. Goal: keep fixed costs near zero, pay only for a domain name and per-sale card fees until you grow.

---

## The stack at a glance

| Piece | Tool (recommended) | What it does | Cost | Who does it |
|---|---|---|---|---|
| Domain name | Cloudflare Registrar or Namecheap | Your web address (e.g. moodofmine.com) | ~$10–12/year | You buy it once |
| The website (gallery) | Astro or plain HTML/CSS, hosted on **Cloudflare Pages** / Netlify / Vercel | The pages people see — gallery, piece detail, about | **Free** | You build + deploy |
| Auction engine | **Supabase** | Database of bids, collector logins, *live* bid updates, the "place bid / close auction" logic | **Free** tier | You configure + write logic |
| Payments | **Stripe** | Charges the winning bidder | **Free** monthly; ~2.9% + 30¢ per sale | You connect |
| Emails | **Resend** | "You've been outbid" / "You won" notifications | **Free** (3,000/mo) | You connect |
| Photo storage | Supabase Storage | Holds your product photos | **Free** (1 GB) | Included with Supabase |

**Bottom line:** ~$1/month (just the domain, spread out), plus card fees per sale — until you outgrow the free tiers.

---

## How the pieces fit together

1. A collector visits your **website** (hosted free on Cloudflare Pages).
2. They make an account and place a bid → that bid is saved in **Supabase**.
3. Supabase instantly pushes the new high bid to everyone watching that auction (this is the "live" feeling).
4. When the timer ends, a Supabase function closes the auction and picks the highest bidder.
5. The winner gets a **Stripe** checkout link to pay; everyone else gets a "thanks for bidding" note via **Resend**.
6. You pack and ship — same as your existing plan (USPS First Class).

Supabase is the key tool here: one free account gives you the database, the collector logins, the live updates, *and* the behind-the-scenes logic. It replaces the paid auction app.

---

## What you build vs. what's just provided

**Provided for free (you just sign up and connect):** hosting, the database itself, the login system, payment processing, email sending. You don't build any of this — you wire them together.

**You build (the custom part):**

- The gallery and piece-detail pages (the look — black-and-white, minimal, very doable with simple HTML/CSS)
- The "Place Bid" button and the rule that a bid must beat the current price by your increment (e.g. +$15)
- The countdown timer and the auction-close logic
- Handing the winner off to Stripe
- A simple admin step for *you* to add new pieces and start a capsule drop

This custom part is the real work — it's genuine (if beginner-friendly) coding. It's where I can help most.

---

## Setup, in phases

**Phase 1 — Accounts (an afternoon, free):** Buy the domain. Create free accounts: Cloudflare, Supabase, Stripe, Resend.

**Phase 2 — The gallery site (the design phase):** Build the static pages and the look. Deploy to Cloudflare Pages and point your domain at it. At this stage you have a live, on-brand website with no auctions yet.

**Phase 3 — The auction engine (the hard part):** Set up the Supabase tables (pieces, bids, users), the live bid updates, and the place-bid / close-auction logic. Test with fake bids.

**Phase 4 — Payments + emails:** Connect Stripe so the winner can pay, and Resend for outbid/win notices.

**Phase 5 — Test a full fake auction, then launch your first capsule.**

---

## Honest cost + effort summary

**Money:** ~$10–12/year for the domain, $0/month for everything else, ~2.9% + 30¢ taken from each sale. If you ever outgrow Supabase's free tier (a lot of traffic), the next step up is about $25/month — but you won't hit that early on.

**Effort/skill:** This is the trade-off. You're saving ~$45–55/month versus Shopify by doing the building yourself. It assumes you're willing to learn some basics — using a code editor, following setup steps, copy-pasting and adjusting code. It's beginner-doable but not a one-click setup. Budget a few weeks of part-time effort (faster with my help generating the code), versus a few hours to configure a paid Shopify app.

---

## A cheaper-still starting point (validate first)

You don't have to build the whole engine to test demand — which is exactly the "proof of concept" goal in your business plan:

- Run your first capsule as a **manual auction**: post pieces on Instagram, take bids in the comments or DMs.
- Charge the winner with a **free Stripe payment link**.
- Total cost: **$0**.

This proves people will bid before you invest weeks in building. If the demand is there, build the real site in parallel.

---

## Recommended path

1. **Now:** Run one manual Instagram auction (~$0) to confirm demand.
2. **In parallel:** Buy the domain and build the gallery site (Phase 1–2).
3. **Then:** Add the Supabase auction engine (Phase 3+) once demand is proven.

I can help with the build itself — generating the page code, setting up the Supabase logic, and walking you through each account setup step by step.
