# Opportunity Designed

Engagement delivery and proof for Opportunity Designed. Three skills covering the work that no standalone skill owns, plus one shared guardrails reference.

## Skills

| Skill | What it does | Say something like |
|---|---|---|
| `od-fit-call-prep` | Researches a booked prospect and writes the one-screen pre-call brief | "prep me for my Fit Call" |
| `od-delivery-kit` | Map / Design / Build client artifacts to a consistent standard | "build the map for [client]" |
| `od-repurpose` | Field note becomes LinkedIn post, carousel, company variant, newsletter blurb | "repurpose this field note" |
| `od-case-study` | Finished engagement becomes publishable proof | "write a case study" |

## What this plugin deliberately does not do

These belong to standalone skills. The plugin defers to them rather than duplicating logic that would drift:

| Job | Skill that owns it |
|---|---|
| Proposal and SOW packages | `od-proposal-package` |
| Pricing shapes and floors | `client-deliverable` |
| Chasing a sent proposal | `od-proposal-followup` |
| Invoicing | `od-invoice` |
| Daily lead sweep and spam classification | `od-lead-triage` |
| Post-call recap | `od-call-recap` |
| Named entity policy | `named-entity-check` |
| Voice and AI-tell removal | `voice-scrub`, `addie-voice`, `house-style` |
| Website copy | `opportunity-designed-copy`, `od-website-standards` |
| Pre-publish gate | `od-content-gate` |

## Guardrails

`references/guardrails.md` is the single source for voice, confidentiality, pricing, channel, and brand rules, and it maps each check to the skill that owns it. Skills point to it instead of restating rules, so one edit updates all of them. The Notion Named Entity Policy page stays canonical for entity rules.

## Version history

- **0.3.0** — Removed `od-proposal` (superseded by `od-proposal-package`) and `od-lead-brief` (superseded by `od-lead-triage`). Added `od-fit-call-prep` for the call-preparation job neither covers. Extracted all duplicated rules into `references/guardrails.md`.
- **0.2.0** — Lead triage verdicts, SX Collective naming exclusion.
- **0.1.0** — Initial five skills.
