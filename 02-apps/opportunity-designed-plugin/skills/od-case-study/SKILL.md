---
name: od-case-study
description: Turn a completed Opportunity Designed engagement into publishable proof. Use when Addie says "write a case study", "turn this engagement into proof", "add this to the work page", or after a client closeout when the results can be shown publicly.
---

# Opportunity Designed case study builder

Convert finished work into credibility without exposing client data.

## Gate before writing

Confirm all three, and stop if any fails:

1. The engagement is complete or at a publishable milestone.
2. The client has agreed to be named, or the study will run unnamed by category.
3. Nothing in the intended content violates the confidentiality rules in `references/guardrails.md`, and `named-entity-check` passes clean.

If naming permission is unclear, draft the unnamed version and flag the question for Addie.

## Structure

Keep it to one page.

1. **The situation.** Two or three sentences. Category, stage, what was stuck.
2. **What was missed.** The unrealized opportunity nobody had named. This is the hook and the differentiator.
3. **The work.** Which Blueprint phase or phases ran, and the artifacts produced. Concrete nouns.
4. **What changed.** Public facts only, stated flatly. A first, a placement, a launch, a category entry.
5. **In their words.** A client quote if one exists. Request one if it does not, via a Gmail draft that Addie sends herself.
6. **Call to action.** Book a 20-minute Project Fit Call. One CTA, no alternate path.

## Voice

Understate the result and let the fact carry it. Claims that need adjectives are usually claims that need better facts. Voice rules and the scrub step are in the guardrails below.

## Publishing

Follow the site workflow exactly.

- Draft into working-drafts, never into the live mirror.
- Show a visual mockup in both mobile and web views before anything is final.
- On approval, move to the live mirror and update the work or field-notes hub, sitemap.xml, llms.txt, and add related-reading cross-links on two or three existing pages.
- Include canonical, OG, and Twitter tags plus Article JSON-LD with an image. Title under 60 characters, meta description under 155.
- Addie runs the publish script. Sessions do not deploy.

## Guardrails

Read `references/guardrails.md` before producing anything. It carries the voice rules, confidentiality rules, pricing rules, channel rules, and brand constants, and it names which standalone skill owns each check.

Before output: run `named-entity-check` on anything naming a company or person, and `voice-scrub` on the prose. Do not reimplement either check here.
