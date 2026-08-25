# Patch: opportunity-designed plugin, five skills

Apply to `~/ClaudeProjects/.../plugins/opportunity-designed/skills/`, or wherever
the plugin source lives before it syncs.

Each block below is an exact find and replace. The **FIND** text appears verbatim
in the current file. Replace it with the **REPLACE** text.

Ordered by risk. Patch 1 is the one that matters most.

---

## A note on the ban list naming what is banned

The Named Entity Policy says the Tier 1 name may not appear in "any output,
anywhere, ever." That rule governs **produced output**: the website, LinkedIn,
resumes, proposals, case studies, client documents, anything a third party reads.

It does not govern the **control files that enforce the ban**. `scrub.py` and
these skill files have to name what they are blocking in order to block it, the
same way a spam filter has to store the words it filters. Keep the name out of
everything the rule is meant to protect, and in the two places that do the
protecting.

---

## PATCH 1 — the shared confidentiality block

Applies to **od-case-study**, **od-proposal**, **od-repurpose**, and
**od-delivery-kit**. The current wording differs slightly in each file; all four
get the same replacement.

### od-case-study

**FIND**

```
## Confidentiality rules, non-negotiable

- No sell-through, revenue, margin, unit, or comp figures. These are client data and never go public in any form, including ranges and percentages derived from them.
- Proof is public fact: a first, a duration, a count, a placement, a named retailer where the relationship is already public, a category entered, a door count that the retailer itself publishes.
- Backcountry is never named in an outcome or case-study claim. It appears only in a brand-index list.
- Mon Ami Jewelry is excluded entirely.
- Salomon is not referenced in any Norda context.
- SkyCon attendee counts are not cited.
```

**REPLACE**

```
## Confidentiality and named entities

Governed by the Named Entity Policy in Notion. That page is canonical and
outranks this file. Run `scripts/scrub.py` before delivering anything: it
enforces all of this mechanically and exits non-zero on a violation, so this
section is a reference rather than something to hold in memory.

- **Never named, any surface.** SX Collective. Pitched, given strategy and brand
  access, did not hire. Replace with a generic noun. Do not use "a specialty
  retailer" on its own, since that reads as an established retailer and points
  at the former employer. Use "a specialty retail startup".
- **Never named.** SkyZone, SkyCon, Mon Ami Jewelry. Generalize to a brand, a
  retailer, a startup, a manufacturer, a vendor, a supplier, or a partner. Keep
  the descriptor broad enough that the brand is not identifiable by elimination:
  a narrow niche plus a region names a company as surely as naming it.
- **Legal scrub on every mention.** Backcountry. "Formerly Senior Buyer at
  Backcountry" and other plain employment history are permanently approved and
  need no review. Any other mention triggers the seven-question checklist and
  blocks until cleared. Nothing about internal systems, process, vendor terms,
  pricing mechanics, personnel, or disputes. No disparagement. No implied
  affiliation or endorsement. No marks or logos.
- **Nameable, and the name is the point.** Norda. Naming them is what makes the
  proof land, so use it. No numbers, no percentages, no sell-through, and no
  duration claims. "In under three years" is a hedged claim and gets cut.
- **Never in the same context.** Norda and Salomon. Each name is separately
  fine; together they invite a competitive read neither party agreed to.
- **Numbers.** No client figures, ever. No rounded or hedged numbers. Precise and
  publicly verifiable, or cut it. Qualitative descriptors about a company whose
  scale is already publicly evident are fine, and are the preferred substitute
  for a figure.
```

### od-proposal

**FIND**

```
## Confidentiality guardrails

- Never include client sell-through, revenue, margin, or unit figures in a proposal shown to a different client.
- Proof points are public facts only: firsts, durations, counts, placements, named retailers where the relationship is public.
- Backcountry is never named in an outcome or case-study claim. Mon Ami Jewelry is excluded from all work samples. Salomon is not referenced in any Norda context. Do not cite SkyCon attendee counts.
```

**REPLACE** with the same `## Confidentiality and named entities` block above,
plus this line appended:

```
- Client data never crosses engagements. A figure learned in one engagement does
  not appear in a proposal shown to anyone else, in any form, including a range
  or a derived percentage.
```

### od-repurpose

**FIND**

```
## Confidentiality

Public proof only: firsts, durations, counts, placements. No sell-through, revenue, margin, or unit figures. Backcountry is not named in outcome claims. Mon Ami Jewelry is excluded. No Salomon in a Norda context. No SkyCon attendee counts.
```

**REPLACE** with the same `## Confidentiality and named entities` block, plus:

```
- LinkedIn is the highest-exposure surface here. Run the scrub on the post text,
  the carousel copy, and the newsletter blurb separately, since each is
  published independently.
```

### od-delivery-kit

**FIND**

```
## Confidentiality

Client data stays with that client. Never carry sell-through, revenue, margin, or unit figures from one engagement into another client's artifact or into anything public. Backcountry is not named in outcome claims. Mon Ami Jewelry is excluded. No Salomon in a Norda context. No SkyCon attendee counts.
```

**REPLACE** with the same block, plus:

```
- Client data stays with that client. A figure learned in one engagement never
  enters another client's artifact. Inside a live engagement, that client's own
  figures are fine in their own deliverables; the rule is about crossing over
  and about anything public.
```

---

## PATCH 2 — od-lead-brief has no confidentiality section at all

Currently the only one of the five with no such section. It researches companies
and drafts replies, so it can surface a banned name from research.

**FIND**

```
## CRM hygiene
```

**REPLACE**

```
## Confidentiality and named entities

Governed by the Named Entity Policy in Notion. Research surfaces company names
freely; the brief and the reply draft are still output and still bound.

- The banned and prospect names may not appear in the reply draft. They may
  appear in the internal brief only where a conflict check requires it, flagged
  as internal.
- The **Watch-outs** line is where a conflict with a past engagement gets named.
  That is the correct place for it, and it stays internal.
- Never cite a figure about another client as social proof in a reply.
- Run `scripts/scrub.py` on the reply draft before creating the Gmail draft.

## CRM hygiene
```

---

## PATCH 3 — working-drafts is unreachable from cloud sessions

Three files point at a local Mac folder as the source of truth. Any scheduled or
cloud session is blind to it.

### od-case-study

**FIND**

```
- Draft into working-drafts, never into the live mirror.
- Show a visual mockup in both mobile and web views before anything is final.
```

**REPLACE**

```
- Draft into the Notion Field Notes Pipeline, as a row with the body on the
  page. Never into the live mirror.
- Do not build a visual mockup. The locked template fixes every element of the
  page, so review is prose only: Addie reads the words in Notion and moves Stage
  to Approved. A mockup is only needed if the template itself is changing.
```

### od-delivery-kit

**FIND**

```
Drafts live in the working-drafts folder for the engagement. Nothing moves to a client-shared location without Addie's approval. Save reference material locally on the Mac and mirror to Notion, treating the local file as the source of truth.
```

**REPLACE**

```
Drafts live in the engagement's Notion page. Nothing moves to a client-shared
location without Addie's approval. The cloud master for files is the
claudeprojects-hub repo, and the Mac is a synced working copy of it, so a file
saved only on the Mac is invisible to any cloud or scheduled session. Save to
the hub, not to the Mac alone.

Client deliverables are the exception to the prose-only rule: decks and
documents still get a reviewable mockup, mobile and web, because there is no
locked template for them.
```

### od-proposal

**FIND**

```
- Write the draft as a document in the working-drafts folder, not directly into any client-facing system.
```

**REPLACE**

```
- Write the draft into the engagement's Notion page, not directly into any
  client-facing system and not to the Mac alone.
```

---

## PATCH 4 — pricing architecture in od-proposal

The current line reads as one menu. It is two different funnels with different
economics, and presenting them as peers undersells the anchor work.

**FIND**

```
- Reference points already in market: the standard three-tier engagement structure sits at $6,000 / $9,500 / $15,000, and the Opportunity Review working session is $450. Adjust to the actual scope rather than defaulting to these.
```

**REPLACE**

```
- Two distinct funnels. Do not present them as tiers of one menu.

  **Anchor engagements.** The actual business. Ten or fewer clients at a time,
  built for longevity rather than volume. The three-tier structure sits at
  $6,000 / $9,500 / $15,000, with retainer shapes for continuing work. This is
  what a proposal is for. Adjust to the real scope rather than defaulting.

  **Opportunity Review, $450.** A deliberate traffic play, not a service tier.
  Hidden from the main site nav on purpose. It exists to build search momentum
  so anchor prospects can find her, and it suits the freelance-platform buyer.
  Never offer it to an anchor prospect and never let it anchor a proposal's
  pricing: a $450 reference point next to a $15,000 scope reframes the whole
  engagement downward.

- If a prospect arrived through the Opportunity Review and turns out to be
  anchor-shaped, price the anchor engagement on its own terms. The $450 already
  paid is a credit against it, not a discount signal.
```

---

## PATCH 5 — add the scrub step to all five

Each file needs an explicit run step, otherwise enforcement depends on the model
remembering. Append to the handoff or output section of each:

```
- Run `python3 scripts/scrub.py <file>` before delivering. A non-zero exit means
  a hard failure is present: fix it, do not explain around it. A legal scrub
  notice means a former employer is named outside approved employment history
  and the seven-question checklist has to be worked before anything ships.
```

---

## Not patched, flagged instead

**`opportunity-designed-copy`** instructs naming "formerly Senior Buyer at
Backcountry and Director of Purchasing at New World Natural Brands" as core
positioning. That exact phrasing is now permanently approved, so no change is
needed, but the file should gain a pointer to the Named Entity Policy so a future
session does not treat it as blanket permission to name the employer elsewhere.

**`fact-base`** may hold prospect names inside stored accomplishment bullets. It
is designed to feed claims into resumes and bios, which makes it the highest-risk
remaining store. It needs an audit against the four tiers, and I have not been
able to read it from a cloud session.
