# Opportunity Designed guardrails

Single source for every rule the plugin's skills obey. Load this once per task. Do not restate these rules inside a skill file, and do not reimplement any check that a named skill already owns.

## Delegate, do not duplicate

| Concern | Owner | When |
|---|---|---|
| Named entity policy | `named-entity-check` | Before any output that names a company or person |
| AI tells and voice | `voice-scrub` | On every prose deliverable before it leaves |
| Personal tone and register | `addie-voice` | Layered under project content rules |
| Website copy rules | `opportunity-designed-copy` | Any site-facing copy |
| Pricing shapes and floors | `client-deliverable` | Any scoping or pricing decision |
| Credential and proof claims | `fact-base` | Any claim about past work |
| Prose mechanics | `house-style` | Any long-form writing |
| Pre-publish gate | `od-content-gate` | Before publishing to the site |

The Notion "Named Entity Policy (Standing Rule)" page is canonical for entity rules, and `scripts/scrub.py` is the enforcement mechanism of record. If this file and the policy ever disagree, the policy wins. Flag the drift rather than picking one.

## Rules this plugin owns

**Voice.** No em dashes. Avoid "gut check", "honest", "free", and absolute "never". Clear and impactful in the fewest characters. AI capability is offered where it helps, never preached. No emojis in client-facing work. The word "playbook" is banned.

**Confidentiality.** No client sell-through, revenue, margin, unit, or comp figures in anything shown to another client or published, including ranges derived from them. Proof is public fact only: firsts, durations, counts, placements, categories entered, retailers where the relationship is already public.

**Scope and pricing.** Price on scope and outcome. Never quote hours, days per week, or retainer hours. Never publish a formula mapping deliverables to a tier. Defer to `client-deliverable` for the actual structures and floors.

**Channels.** addie@opportunitydesigned.com is the personal and lead-facing channel. hello@opportunitydesigned.com is the front door and company voice. adelitamorrow@gmail.com is never business-facing.

**Calls to action.** One only: book a 20-minute Project Fit Call. No secondary "send a message" path.

**Handoff.** Emails are drafted, never sent. Drafts land in working-drafts, never in a client-shared or live location. Visuals get a reviewable mockup in both mobile and web views before anything is final, designed mobile-first. Addie approves before anything publishes, and she runs the deploy.

**Review style.** When she reacts to draft copy, offer batched multiple-choice rewrites rather than revising one line at a time. Her verbal description of what a line should do is usually better copy than any generated option.

## Brand constants

Charcoal #2F2D2A and parchment #ECE7DD grounds. Ink #EDEAE3 and #1A1714. Violet #8E72C6, hover #6B4FA6, lavender #B49CE0, gray #6B655B. Anton for display, Inter for text. Icons in the basic set, purple and gray.

The Opportunity Blueprint is Map, Design, Build. Copy is locked in the framework threading pack. Do not restate a phase in new words, and do not attach a fixed deliverable list to a phase in client-facing method copy.
