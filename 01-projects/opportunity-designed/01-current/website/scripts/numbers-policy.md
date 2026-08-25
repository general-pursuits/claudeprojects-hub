# Numbers and client confidentiality

Addie's rule, set 2026-08-24. Supersedes the looser "no client metrics" line in
`opportunity-designed-copy` and the fact-density guidance in the GEO playbook,
both of which this reconciles.

## The test

> Could a reader use this to reconstruct a number they could not already infer
> from public information?

If yes, cut it. If no, it can stay.

## Three rules

### 1. Do not round

Any number that appears must be precise and publicly verifiable. Rounding is
both an accuracy problem and the single strongest AI-writing tell.

| Out | In |
|---|---|
| roughly 40% | the exact published figure, with its source |
| over 500 doors | 517 doors, if that is public |
| nearly $2M | the filed figure |
| about 10,000 SKUs | the counted figure |

Hedging words are the giveaway: over, under, about, roughly, nearly,
approximately, around, almost, more than, less than, upwards of, north of.
A hedged number is rounded and unsourced by construction.

Round percentages (multiples of 5) and clean currency magnitudes ($50M, $2B)
read as estimates even when they are exact. If the real figure is genuinely
round, cite the source so the reader knows it is measured, not guessed.

### 2. Client numbers stay private, always

No sell-through, revenue, margin, unit, door count, or growth figure tied to a
client or employer. Not in field notes, not in case studies, not in a bio, not
on LinkedIn. A number in the same sentence as a client name is the leak, and it
is a hard failure regardless of how the sentence is framed.

Years, dates, and tenure are facts, not metrics, and are fine:
"Senior Buyer at Backcountry.com, 2022 to 2026" is allowed.

### 3. Qualitative descriptors are allowed when the scale is already public

This is the part that makes the writing possible. When a vendor's scale is
visible to anyone who looks, describing it qualitatively reveals nothing
recoverable.

**The worked example.** Salomon is obviously a major vendor for Backcountry
footwear: their presence across every category on the site says so, and they are
large enough in outdoor and fashion overall that no reader can back into what
that specific relationship is worth. So these are fine:

- "a huge vendor"
- "impactful"
- "a top partner"
- "wide contribution to the assortment"
- "punched above its weight for a brand of its size"

The descriptor works precisely because it is unquantified and the scale is
already evident. What makes it safe is that it adds no information a reader did
not already have.

**Where the line is.** A descriptor becomes a leak when it implies rank or share
that is not publicly visible: "our third-largest vendor," "roughly a fifth of
the category," "our highest-margin partner." Those are numbers in words.

## How this reconciles with fact density

The GEO playbook wants 3 or more verifiable facts per 500 words. That target
stands. The facts come from the public record, not the client record:

- Retailer program names and mechanics (Costco roadshow, Whole Foods Innerview,
  Ulta's brand accelerator and UB Marketplace)
- Published thresholds, filing figures, store and warehouse counts
- Case pack, pallet, freight, and logistics specifics
- Dates, durations, firsts, and placements
- Named public sources

Public facts, dense. Client facts, absent. Both at once.

## Enforcement

`scripts/scrub.py` checks all three:

| Check | Severity |
|---|---|
| Client name and a quantity in one sentence | HARD, blocks build |
| Hedged number (over, roughly, nearly, more than) | HARD, blocks build |
| Round percentage (multiple of 5) | flag, judgment call |
| Round currency magnitude ($50M) | flag, judgment call |

Years, ISO dates, and quantities following in / since / by / FY / Q1-Q4 are
excluded, so tenure and founding dates do not trip the client check.

The client name list lives in `CLIENT_NAMES` in the script. Extend it as the
roster grows. Current entries: Backcountry, New World Natural Brands, Norda,
Salomon, SkyCon, Mon Ami, SX Collective.
