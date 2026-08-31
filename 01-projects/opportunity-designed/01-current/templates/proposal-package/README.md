# Proposal Package — master templates

**Owner:** Addie · **Locked:** 2026-08-03 · **Version:** template v1.0

Master template files for every Opportunity Designed client proposal package. These are the ONE source. Do not edit per client. Any change here is a template-level change and bumps `_template-changelog.md`.

## Files
- `build_proposal_template.js` → generates the 11-page Proposal
- `build_cover_letter_template.js` → generates the 1-page Cover Letter
- `build_timeline_template.js` → generates the 9-page Project Timeline & Scope
- `build_fillin_guide.js` → generates the 3-page Fill-In Guide (internal reference only, never sent to a client)

## Usage
```bash
node build_proposal_template.js       # writes TEMPLATE-Proposal.docx
node build_cover_letter_template.js   # writes TEMPLATE-Cover-Letter.docx
node build_timeline_template.js       # writes TEMPLATE-Timeline-and-Scope.docx
node build_fillin_guide.js            # writes TEMPLATE-Fill-In-Guide.docx
```

Requires `docx` npm package. To fill for a specific client, copy these files into a working directory first, then replace the `[BRACKETED]` placeholders per the fill-in guide, then run `node`. Never fill placeholders in these master files themselves.

## Brand settings baked in
- Fonts: Anton (headlines, all-caps) + Inter (body). Installed on Addie's Mac 2026-08-03; Word font embedding on.
- Colors: black & white / print-friendly palette.
  - INK #1A1A1A body text
  - PARCHMENT #EDEDED subtle shade
  - WARM_GRAY #707070 muted text
  - RULE #C8C8C8 hairlines
  - Dark backgrounds: #1A1A1A
- Headlines: all Anton headlines render `allCaps: true`.
- Wordmark: "OPPORTUNITY DESIGNED" (header + signoff blocks)
- Tagline (running footer): "Opportunity doesn't appear. It's built."
- Positioning line (end-of-doc signoff): "Growth strategy for consumer brands and the businesses that sell them."
- Contact block: "hello@opportunitydesigned.com · opportunitydesigned.com"

## Legal — never trim, never reword
- Proposal §08 Investment & Terms (all rows).
- Proposal §06 working-document disclaimer.
- Proposal §10 Acceptance language + signature blocks.
- Timeline & Scope cover disclaimer banner.
- Every reference to Master Services Agreement, mutual NDA, Separation Agreement.

## Workflow
Full standard operating procedure at `../../client/_SOP-client-package.md`.
Skill that triggers this workflow: `od-proposal` (updated 2026-08-03 with the full package generator).
