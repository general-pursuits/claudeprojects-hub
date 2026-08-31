---
name: od-fit-call-prep
description: Prepare Addie for a booked Project Fit Call by researching the company and producing a one-screen pre-call brief. Use when Addie says "prep me for my Fit Call", "who am I talking to", "brief me before this call", "research [company] before we talk", or when a Cal.com booking needs preparation. For the daily unanswered-lead sweep and spam classification use od-lead-triage instead; for the post-call recap use od-call-recap.
---

# Project Fit Call prep

Walk into the call knowing more about their business than they expect. This skill covers preparation only.

Read `references/guardrails.md` first. Do not restate its rules.

## Scope boundary

This skill does not classify leads and does not sweep the inbox. `od-lead-triage` owns daily triage, real-versus-solicitation classification, and the follow-up drafts. `od-call-recap` owns what happens after the call. If the lead has not been triaged yet, run `od-lead-triage` first and start from its verdict.

## Inputs

The Cal.com booking, the Meetings row in Notion, the HubSpot contact, and the message they originally wrote. Their own phrasing is the highest-value input and should survive into the call.

## Research pass

Stop when the picture is clear.

1. The company website. What they sell, price band, lifecycle stage, who they say they serve.
2. Where they are sold. Retail footprint, DTC only, wholesale, marketplace, retailer partners named publicly.
3. The person. Title, tenure, what they own, whether they can sign.
4. Recent signal. Funding, launches, leadership changes, expansion, contraction, category news from the last twelve months.
5. Fit against the market definition: consumer brands and the companies that sell them. Broader than outdoor, run, and lifestyle. Do not narrow it.

## Output

One screen. Every company, person, and record named is a clickable link.

- **Who** — company, person, title, one line on what they do.
- **Why now** — the trigger that made them book.
- **The likely real problem** — what they asked for versus what is probably wrong. This is the differentiated part of the brief and the reason the call goes well.
- **Five questions** — specific to this company. Each should be unanswerable by a competitor who did no research.
- **Where this could land** — the Blueprint phase and a rough scope shape. No prices in the brief; pricing is a `client-deliverable` and `od-proposal-package` decision after the call.
- **Watch-outs** — signs of a bad fit, no budget, or a conflict with an existing client relationship.

## Handoff

Log the brief as a note on the HubSpot contact so the next session does not redo the research. After the call, hand to `od-call-recap`. If the call goes well, hand to `od-proposal-package`.
