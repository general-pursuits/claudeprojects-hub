#!/usr/bin/env python3
"""
scrub.py - deterministic voice and AI-tell scrubber for Opportunity Designed.

Encodes the rules in house-style, opportunity-designed-copy, and Cowork Standing Rule 1
so they run for free instead of costing model tokens on every draft.

Usage:
    python3 scrub.py FILE [FILE ...]              check, report, exit 1 on hard failures
    python3 scrub.py --fix FILE                   apply mechanical fixes in place
    python3 scrub.py --mode resume FILE           relax marketing-copy-only rules
    python3 scrub.py --quiet FILE                 summary line only

Modes:
    field-note (default)  full strictness; marketing copy, so tell-avoidance wins
    resume                keeps ATS vocabulary (leverage, optimize, spearhead...)

Exit codes:
    0  no hard failures
    1  hard failures present
    2  bad invocation
"""

import argparse
import re
import sys
import unicodedata
from pathlib import Path

HARD, WARN, INFO, REVIEW = "HARD", "WARN", "INFO", "REVIEW"

# ---------------------------------------------------------------------------
# ENTITY POLICY (Addie's rule, 2026-08-24)
#
# Three tiers of named-entity risk. This is the highest-priority section in
# this file: a hit here outranks any style consideration.
#
#   BANNED      the name may not appear in any output, anywhere, ever.
#   LEGAL_SCRUB the name triggers a mandatory legal review pass before
#               anything ships. Factual employment history is allowed; the
#               risky categories below are not.
#   PROSPECT    unhired prospects and brands given strategy for no fee. The
#               name is replaced with a generic noun. Never named.
#
# NOT LEGAL ADVICE. This is a mechanical risk-reduction checklist. If a
# separation, severance, or consulting agreement carries a confidentiality or
# non-disparagement clause, that document governs and a lawyer should review
# anything that names the counterparty.
# ---------------------------------------------------------------------------

# Tier 1: never appears in output. Not a client, never was.
BANNED_ENTITIES = ["SX Collective", "SX Collective's", "SXC"]

# Tier 2: mandatory legal scrub on every mention.
LEGAL_SCRUB_ENTITIES = ["Backcountry", "Backcountry.com"]

# Tier 3: prospects and unpaid strategy recipients. Generalize, never name.
# "Mon Ami Jewelry" is excluded entirely per the od-case-study skill, which is
# stricter than generalizing. Both name forms are caught.
PROSPECT_ENTITIES = ["SkyCon", "SkyZone", "Mon Ami Jewelry", "Mon Ami"]

# Pairs that may not appear together, even when each name is separately allowed.
# Source: od-case-study, od-proposal, od-repurpose, od-delivery-kit skills.
# Norda is Tier 4 nameable and Salomon is a permitted vendor descriptor, but
# putting them in one context invites a competitive read neither party agreed to.
FORBIDDEN_PAIRS = [
    (re.compile(r"\bNorda\b", re.I), re.compile(r"\bSalomon\b", re.I),
     "Salomon in a Norda context",
     "these two are never referenced together; drop one"),
]

# Tier 4 (Addie, 2026-08-24): approved case-study brands. The NAME may be used,
# because naming it is what makes the proof land. Everything else still applies:
# these names stay in CLIENT_NAMES, so any quantity beside them is still a hard
# failure. Name yes, specifics no.
#
# Norda: small, private, and not publicly benchmarked, so the name carries
# credibility without exposing anything recoverable about their volume.
NAMED_CASE_STUDY = ["Norda"]

# Approved generic substitutes for Tier 1 and Tier 3.
GENERIC_SUBSTITUTES = [
    "a brand", "a retailer", "a startup", "a manufacturer",
    "a vendor", "a supplier", "a partner",
    "an outdoor brand", "a consumer brand",
    "a specialty retail startup",
]

# For the Tier 1 banned prospect specifically: "a specialty retailer" on its own
# reads as an established retailer and points at the former employer. Pair it
# with startup so the reader places it as a young company instead.
DISCOURAGED_SUBSTITUTES = {
    "a specialty retailer": "a specialty retail startup",
    "specialty retailer": "specialty retail startup",
}

BANNED_RX = re.compile(r"\b(" + "|".join(
    re.escape(n) for n in BANNED_ENTITIES) + r")\b", re.I)
LEGAL_RX = re.compile(r"\b(" + "|".join(
    re.escape(n) for n in LEGAL_SCRUB_ENTITIES) + r")\b", re.I)
PROSPECT_RX = re.compile(r"\b(" + "|".join(
    re.escape(n) for n in PROSPECT_ENTITIES) + r")\b", re.I)
DISCOURAGED_RX = re.compile(
    r"\b(a\s+specialty retailer|the\s+specialty retailer)\b", re.I)

# ---------------------------------------------------------------------------
# Standing approval (Addie, 2026-08-24): factual employment history is always
# allowed. It is resume and LinkedIn content and is permanently public.
# The canonical approved phrasing is "formerly Senior Buyer at Backcountry".
# ---------------------------------------------------------------------------

# Exact phrasings that always pass, no review.
APPROVED_EMPLOYMENT = [
    "formerly senior buyer at backcountry",
    "former senior buyer at backcountry",
    "senior buyer at backcountry",
]

# Broader employment-history shapes that also pass:
#   title + at + employer            "Senior Buyer at Backcountry.com"
#   tenure + at + employer           "four years at Backcountry"
#   in-house at + employer list      "in-house at major retailers including Backcountry, ..."
EMPLOYMENT_OK = re.compile(
    r"("
    r"\b(senior buyer|buyer|director of purchasing|merchandiser|merchandising)\b"
    r"[^.]{0,40}\bat\s+Backcountry"
    r"|\b(years?|yrs?|tenure|in-house|in house)\b[^.]{0,60}\bat\b[^.]{0,60}Backcountry"
    r"|\b(including|such as|among them|across)\b[^.]{0,40}Backcountry"
    r")", re.I)


def is_approved_employment(sentence: str) -> bool:
    """True when a Backcountry mention is plain employment history."""
    low = sentence.lower()
    if any(p in low for p in APPROVED_EMPLOYMENT):
        return True
    return bool(EMPLOYMENT_OK.search(sentence))

# Categories that turn a mention into real exposure.
LEGAL_RISK_PATTERNS = [
    (re.compile(r"\b(confidential|proprietary|internal|trade secret|"
                r"non-public|behind the scenes|insider)\b", re.I),
     "confidentiality risk",
     "suggests non-public information about a former employer"),
    (re.compile(r"\b(dysfunctional|mismanaged|incompetent|toxic|chaotic|"
                r"a mess|broken|failing|negligent|reckless|shambles)\b", re.I),
     "disparagement risk",
     "may breach a non-disparagement clause; state facts, not judgments"),
    (re.compile(r"\b(partnered with|in partnership with|endorsed by|"
                r"on behalf of|represent\w*|official|authorized)\b", re.I),
     "implied-affiliation risk",
     "may imply a current relationship or endorsement that does not exist"),
    (re.compile(r"\b(lawsuit|litigation|settlement|dispute|deposition|"
                r"arbitration|counsel|claim against)\b", re.I),
     "litigation reference",
     "never reference a dispute involving a former employer in public copy"),
    (re.compile(r"®|™|\blogo\b|\btrademark\b", re.I),
     "trademark usage",
     "nominative reference is one thing; marks and logos are another"),
]

# ---------------------------------------------------------------------------
# Mechanical fixes: unambiguous, safe to auto-apply.
# ---------------------------------------------------------------------------

MECHANICAL = [
    # Cowork Standing Rule 1 + opportunity-designed-copy hard rule 1.
    # Em dash with surrounding spaces becomes a comma; tight em dash becomes a comma too.
    (re.compile(r"\s*—\s*"), ", ", "em dash to comma"),
    # Invisible and non-printing characters.
    (re.compile(r"[​‌‍⁠﻿]"), "", "zero-width character removed"),
    (re.compile(r" "), " ", "non-breaking space to space"),
    (re.compile(r"[‘’]"), "'", "smart apostrophe to straight"),
    (re.compile(r"[“”]"), '"', "smart quote to straight"),
    (re.compile(r"…"), "...", "ellipsis character to periods"),
    # Trailing whitespace.
    (re.compile(r"[ \t]+$", re.M), "", "trailing whitespace"),
]

# ---------------------------------------------------------------------------
# Flags: need human judgment, never auto-fixed.
# Each entry: (severity, compiled regex, label, note)
# ---------------------------------------------------------------------------

def _w(pattern, flags=re.I):
    """Word-boundary regex helper."""
    return re.compile(r"\b" + pattern + r"\b", flags)


BANNED = [
    # opportunity-designed-copy hard rules + Addie's standing voice rules.
    (HARD, _w(r"gut check"), "banned phrase", "banned in OD copy"),
    (HARD, _w(r"honest(ly)?"), "banned word", "banned in OD copy; state it plainly instead"),
    (HARD, _w(r"free"), "banned word", "banned in OD copy; say 'no charge' or restructure"),
    (HARD, _w(r"never"), "absolute never", "absolute 'never' is banned; soften or make specific"),
    (HARD, _w(r"opportunity units?"), "retired term", "AI-invented, declined on review; do not reintroduce"),
    (HARD, re.compile(r"—"), "em dash", "no em dashes anywhere; use comma, colon, or period"),
    # AI evangelism / positioning violations.
    (HARD, _w(r"AI-powered"), "AI evangelism", "AI is offered, never preached"),
]

# Tier 3 surface tells (house-style). Marketing copy only.
SURFACE_TELLS = [
    (WARN, _w(r"delve"), "AI tell", ""),
    (WARN, _w(r"tapestry"), "AI tell", ""),
    (WARN, _w(r"testament"), "AI tell", ""),
    (WARN, _w(r"realm"), "AI tell", ""),
    (WARN, _w(r"beacon"), "AI tell", ""),
    (WARN, _w(r"myriad"), "AI tell", ""),
    (WARN, re.compile(r"unlock the power of", re.I), "AI tell", ""),
    (WARN, re.compile(r"navigat\w+ the landscape", re.I), "AI tell", ""),
    (WARN, _w(r"in today's (fast[- ]paced|ever[- ]changing|competitive)"), "AI tell", "throat-clearing opener"),
    (WARN, _w(r"when it comes to"), "filler", "cut and start with the noun"),
    (WARN, _w(r"it (is|'?s) (important|worth|essential|critical|key)\s+(to|not\w*|men\w+)"),
     "filler", "state the thing directly"),
    (WARN, _w(r"at the end of the day"), "filler", ""),
    (WARN, _w(r"that being said"), "filler", ""),
    (WARN, _w(r"(moreover|furthermore|additionally)"), "connective tell", "usually deletable"),
    (WARN, _w(r"(crucial|vital|pivotal|paramount)"), "inflation", "usually overstates"),
    (WARN, _w(r"(seamless|robust|comprehensive|holistic)"), "consultant abstraction", ""),
    (WARN, _w(r"(synerg\w+|ideate|actionable insights?)"), "consultant abstraction", ""),
]

# Marketing-copy-only: house-style keeps these in resumes for ATS matching.
MARKETING_ONLY = [
    (WARN, _w(r"leverage"), "consultant abstraction", "fine on a resume, weak in a field note"),
    (WARN, _w(r"unlock"), "consultant abstraction", "fine on a resume, weak in a field note"),
    (WARN, _w(r"elevate"), "consultant abstraction", "fine on a resume, weak in a field note"),
]

# Tier 2 structural tells.
STRUCTURAL = [
    (WARN, re.compile(r"\b(is|are|was|were|'s|'re) not (just |only |merely )?"
                      r"[\w\s,'-]{2,45}?,\s*(it'?s|it is|they'?re|that'?s|they are)\b", re.I),
     "'not X, it's Y'", "house-style says cut on sight"),
    (WARN, re.compile(r"\b(so )?what does (this|that) mean\?", re.I),
     "self-posed question", "answer it without asking it"),
    (WARN, re.compile(r"\bthe (answer|question) is simple\b", re.I), "self-posed question", ""),
    (WARN, re.compile(r"^(in (conclusion|summary)|to sum up|in short)\b", re.I | re.M),
     "summary bow", "no closing restatement"),
]

# ---------------------------------------------------------------------------
# Numbers policy (Addie's rule, 2026-08-24)
#
#   1. Do not round. Any number that appears must be precise and publicly
#      verifiable. "roughly 40%" and "over 500 doors" are out; "47.3%" with a
#      public source is in.
#   2. Client metrics stay private, always. A number in the same sentence as a
#      client or employer name is a hard failure, since that is the leak.
#   3. Qualitative descriptors ARE allowed when the scale is already publicly
#      evident. "Salomon is a top partner with wide contribution to the
#      assortment" reveals nothing recoverable, because their shelf presence is
#      visible to anyone and their overall size makes the specific relationship
#      impossible to back into. These are deliberately NOT flagged.
#
# The test: could a reader use this to reconstruct a number they could not
# already infer from public information?
# ---------------------------------------------------------------------------

# Names whose co-occurrence with a number is a metric leak.
# Extend this list as the client roster grows.
CLIENT_NAMES = [
    "Backcountry", "New World Natural Brands", "Norda", "Salomon",
    "SkyCon", "Mon Ami", "SX Collective",
]
CLIENT_RX = re.compile(r"\b(" + "|".join(
    re.escape(n) for n in CLIENT_NAMES) + r")\b", re.I)

# Any quantity: percent, currency, or a bare number of 2+ digits.
QUANTITY_RX = re.compile(
    r"(\$\s?[\d,]+(?:\.\d+)?\s?(?:[KMB]|million|billion|thousand)?"
    r"|[\d,]+(?:\.\d+)?\s?%"
    r"|\b\d[\d,]{1,}(?:\.\d+)?\b)", re.I)

# Numbers written as words still count as numbers.
WORD_NUMBER = (r"one|two|three|four|five|six|seven|eight|nine|ten|eleven|"
               r"twelve|fifteen|twenty|thirty|forty|fifty|sixty|seventy|"
               r"eighty|ninety|hundred|thousand|million|billion|"
               r"a few|several|a handful|dozens|a dozen|half")

# Hedged numbers: rounded AND unsourced, the strongest single tell.
# Covers digits ("over 500") and words ("in under three years").
HEDGED_NUMBER = re.compile(
    r"\b(over|under|about|roughly|nearly|approximately|around|almost|"
    r"more than|less than|fewer than|upwards of|north of|some|within|in under|"
    r"in just|in only)\s+"
    r"(\$?\s?[\d,]+(?:\.\d+)?\s?(?:[KMB]|million|billion|thousand|%)?"
    r"|(?:" + WORD_NUMBER + r")\b)", re.I)

# Bare round percentages: multiples of 5 read as estimates unless sourced.
ROUND_PERCENT = re.compile(r"(?<![\d.])(\d*[05])\s?%")

# Round currency: clean magnitudes with no cents or precision.
ROUND_CURRENCY = re.compile(
    r"\$\s?([1-9]\d*)\s?(?:[KMB]\b|million|billion|thousand)", re.I)


# Years, ISO dates, and ordinary date phrasing are facts, not metrics.
YEARISH = re.compile(
    r"^(?:(?:19|20)\d{2}|\d{4}-\d{2}-\d{2}|\d{1,2})$")


def is_dateish(match, sentence):
    """True when a matched quantity is a year or date rather than a metric."""
    val = match.group(0).strip()
    if YEARISH.match(val):
        return True
    # "in 1996", "since 2019", "FY2024", "Q3 2025"
    start = max(0, match.start() - 12)
    lead = sentence[start:match.start()].lower()
    if re.search(r"\b(in|since|by|from|until|fy|q[1-4])\s*$", lead):
        return True
    return False


def sentences_of(text: str):
    """Split a prose line into sentences for co-occurrence checks."""
    return [s for s in re.split(r"(?<=[.!?;])\s+", text) if s.strip()]

HTML_SKIP_OPEN = re.compile(r"<\s*(script|style)\b", re.I)
HTML_SKIP_CLOSE = re.compile(r"<\s*/\s*(script|style)\s*>", re.I)
# Whole script/style element contained on a single line.
HTML_INLINE_BLOCK = re.compile(
    r"<\s*(script|style)\b[^>]*>.*?<\s*/\s*\1\s*>", re.I | re.S)
TAG = re.compile(r"<[^>]+>")


def visible_text(line: str) -> str:
    """Strip HTML so we flag prose, not markup, schema, CSS, or URLs."""
    line = HTML_INLINE_BLOCK.sub(" ", line)
    return TAG.sub(" ", line)


def iter_prose_lines(text: str, is_html: bool):
    """Yield (lineno, prose_text, raw_line), skipping script/style blocks."""
    skipping = False
    for i, raw in enumerate(text.splitlines(), start=1):
        if is_html:
            if skipping:
                if HTML_SKIP_CLOSE.search(raw):
                    skipping = False
                continue
            if HTML_SKIP_OPEN.search(raw) and not HTML_SKIP_CLOSE.search(raw):
                skipping = True
                continue
            yield i, visible_text(raw).strip(), raw
        else:
            yield i, raw.strip(), raw


def sentence_rhythm(text: str, is_html: bool):
    """Uniform sentence length is invisible on screen and obvious aloud."""
    prose = " ".join(p for _, p, _ in iter_prose_lines(text, is_html))
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", prose) if s.strip()]
    lengths = [len(s.split()) for s in sentences if len(s.split()) > 2]
    if len(lengths) < 8:
        return None
    mean = sum(lengths) / len(lengths)
    variance = sum((n - mean) ** 2 for n in lengths) / len(lengths)
    stdev = variance ** 0.5
    shortest = min(lengths)
    return mean, stdev, shortest, len(lengths)


def check(path: Path, mode: str):
    text = path.read_text(encoding="utf-8", errors="replace")
    is_html = path.suffix.lower() in {".html", ".htm"}

    rules = list(BANNED) + list(STRUCTURAL) + list(SURFACE_TELLS)
    if mode == "field-note":
        rules += MARKETING_ONLY

    findings = []
    legal_scrub_needed = False

    for lineno, prose, raw in iter_prose_lines(text, is_html):
        if not prose.strip():
            continue

        # ---- ENTITY POLICY : runs first, outranks everything ----

        # Tier 1: banned outright.
        for m in BANNED_RX.finditer(prose):
            findings.append((
                HARD, lineno, "BANNED entity", m.group(0),
                "never appears in any output; replace with a generic noun "
                "(a brand, a retailer, a startup)"))

        # Tier 3: prospects must be generalized.
        for m in PROSPECT_RX.finditer(prose):
            findings.append((
                HARD, lineno, "prospect named", m.group(0),
                "unhired prospect; replace with a generic noun "
                "(a brand, a retailer, a vendor)"))

        # Pairs that may not co-occur, checked per sentence.
        for sent in sentences_of(prose):
            for rx_a, rx_b, label, note in FORBIDDEN_PAIRS:
                a, b = rx_a.search(sent), rx_b.search(sent)
                if a and b:
                    findings.append((
                        HARD, lineno, label,
                        f"{a.group(0)} + {b.group(0)}", note))

        # Substitute that points at the wrong company.
        for m in DISCOURAGED_RX.finditer(prose):
            findings.append((
                WARN, lineno, "misleading substitute", m.group(0).strip(),
                "reads as an established retailer and points at the former "
                "employer; use 'a specialty retail startup'"))

        # Tier 2: legal scrub trigger.
        for m in LEGAL_RX.finditer(prose):
            sent = next((s for s in sentences_of(prose)
                         if m.group(0).lower() in s.lower()), prose)
            if is_approved_employment(sent):
                continue  # standing approval: employment history, does not block
            legal_scrub_needed = True
            findings.append((
                REVIEW, lineno, "legal scrub trigger", m.group(0),
                "former employer named outside plain employment history"))
            for rx, label, note in LEGAL_RISK_PATTERNS:
                hit = rx.search(sent)
                if hit:
                    findings.append((
                        HARD, lineno, label, hit.group(0), note))
        for severity, rx, label, note in rules:
            for m in rx.finditer(prose):
                findings.append((severity, lineno, label, m.group(0).strip(), note))
        # --- numbers policy ---
        # 1. Client name + any quantity in the same sentence = metric leak.
        for sent in sentences_of(prose):
            name = CLIENT_RX.search(sent)
            if not name:
                continue
            for qty in QUANTITY_RX.finditer(sent):
                if is_dateish(qty, sent):
                    continue
                findings.append((
                    HARD, lineno, "client metric leak",
                    f"{name.group(0)} ... {qty.group(0).strip()}",
                    "client numbers stay private; use a qualitative descriptor instead"))
                break

        # 2. Hedged numbers are rounded and unsourced by construction.
        for m in HEDGED_NUMBER.finditer(prose):
            findings.append((HARD, lineno, "hedged number", m.group(0).strip(),
                             "do not round; give the precise public figure or cut it"))

        # 3. Round percentages and clean currency magnitudes.
        for m in ROUND_PERCENT.finditer(prose):
            findings.append((WARN, lineno, "round percentage", m.group(0),
                             "reads as an estimate; use the exact public figure"))
        for m in ROUND_CURRENCY.finditer(prose):
            findings.append((WARN, lineno, "round currency", m.group(0),
                             "reads as an estimate; use the exact public figure"))
        # Non-ASCII survivors worth a look.
        for ch in prose:
            if ord(ch) > 127 and unicodedata.category(ch) in {"Cf", "Zs"}:
                findings.append((WARN, lineno, "invisible unicode",
                                 f"U+{ord(ch):04X}", "run --fix"))
                break

    rhythm = sentence_rhythm(text, is_html)
    return findings, rhythm, legal_scrub_needed


LEGAL_CHECKLIST = """
  LEGAL SCRUB REQUIRED : a former employer is named in this file.
  Work through these before publishing. Not legal advice.
    1. Is every statement factual, verifiable, and publicly sourced?
    2. Does anything reveal non-public process, systems, vendor terms,
       pricing, or personnel decisions?
    3. Would any sentence read as disparagement to a hostile reader?
    4. Does the copy imply a current relationship, endorsement, or authority
       to speak for them?
    5. Are marks, logos, and stylized names absent?
    6. Does a separation or severance agreement carry a confidentiality or
       non-disparagement clause covering this? That document governs.
    7. Could the point be made just as well without naming them at all?
       If yes, do that."""


def apply_fixes(path: Path):
    original = path.read_text(encoding="utf-8")
    text = original
    counts = {}
    for rx, repl, label in MECHANICAL:
        text, n = rx.subn(repl, text)
        if n:
            counts[label] = counts.get(label, 0) + n
    # Collapse any double spaces the em dash rule introduced mid-sentence.
    text, n = re.subn(r"(?<=\S)  +(?=\S)", " ", text)
    if n:
        counts["double space collapsed"] = n
    if text != original:
        path.write_text(text, encoding="utf-8")
    return counts


def main():
    ap = argparse.ArgumentParser(description="Opportunity Designed voice scrubber")
    ap.add_argument("files", nargs="+", type=Path)
    ap.add_argument("--fix", action="store_true", help="apply mechanical fixes in place")
    ap.add_argument("--mode", choices=["field-note", "resume"], default="field-note")
    ap.add_argument("--quiet", action="store_true", help="summary line only")
    args = ap.parse_args()

    total_mech = 0
    total_hard = 0
    total_warn = 0
    total_review = 0
    any_legal = False

    for path in args.files:
        if not path.exists():
            print(f"scrub: no such file: {path}", file=sys.stderr)
            return 2

        mech = {}
        if args.fix:
            mech = apply_fixes(path)
            total_mech += sum(mech.values())

        findings, rhythm, legal_needed = check(path, args.mode)
        hard = [f for f in findings if f[0] == HARD]
        warn = [f for f in findings if f[0] == WARN]
        review = [f for f in findings if f[0] == REVIEW]
        total_review += len(review)
        if legal_needed:
            any_legal = True
        total_hard += len(hard)
        total_warn += len(warn)

        if args.quiet:
            continue

        print(f"\n=== {path} ({args.mode}) ===")
        if mech:
            for label, n in sorted(mech.items()):
                print(f"  fixed   {n:>3}  {label}")
        if not findings:
            print("  clean")
        for severity, lineno, label, hit, note in sorted(findings, key=lambda f: (f[1], f[0])):
            tail = f"  ({note})" if note else ""
            print(f"  {severity:<5} {path.name}:{lineno}  {label}: \"{hit}\"{tail}")

        if rhythm:
            mean, stdev, shortest, n = rhythm
            print(f"\n  rhythm  {n} sentences, mean {mean:.1f} words, "
                  f"stdev {stdev:.1f}, shortest {shortest}")
            if stdev < 4.0:
                print("  WARN  uniform sentence length; vary hard, land a short one")
            if shortest > 6:
                print("  WARN  no short sentence anywhere; add one under 6 words")
        if legal_needed:
            print(LEGAL_CHECKLIST)

    tail = ", LEGAL SCRUB REQUIRED" if any_legal else ""
    print(f"\nscrubbed: {total_mech} mechanical, {total_hard} hard, "
          f"{total_warn} flags, {total_review} review{tail}")
    return 1 if (total_hard or any_legal) else 0


if __name__ == "__main__":
    sys.exit(main())
