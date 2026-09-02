# TEMPLATES - create, manage, track, record

Every reusable asset (doc, Notion, email, deck, web) is a template with a lifecycle and ONE home.

## The register (one list)
Master register = a Notion "Templates" database (or a section of the master tracker) with a mirror. Each row:
Name, Type (docx / Notion / email / deck / web), Purpose, Status (Draft / Master / Deprecated), Location (hub
path or Notion link), Owner, Version, Last-reviewed, Linked skill (if any).

## Naming + states
- Naming: `TEMPLATE-<thing>` for doc masters; `TEMPLATE - <thing>` for Notion; row IDs Prefix-YYYY-###.
- States: Draft -> Master (canonical, in use) -> Deprecated (archived, reference-only). ONE Master per purpose.
- Never keep a rival copy; archive the old one and point to the Master.

## Homes
- Doc templates -> 01-current/templates/ (services agreement, NDA, invoice, rate card, proposal, timeline,
  cover letter, fill-in guide).
- Notion templates -> the template pages/DBs (ProjectOS, Unified Client Portal, Brand & Asset Hub + Vault,
  Meeting template row); tables are linked views of real masters, never static.
- Email/canned -> gmail/ + the Canned Email Response Library (Notion).

## Track + record
- New: add a register row, save the master to its home, mirror to Notion, log a manifest line + a Task to
  review it in 90 days.
- Change: edit the Master in place (git history is the version log); bump Version; update Last-reviewed.
- Quarterly: prune Deprecated, confirm each Master is current, retire duplicates.

## Templates still to build (seed these as Tasks)
Client onboarding packet, offboarding/closeout, case-study template, SOW variants by tier, monthly client
report, invoice + payment-reminder sequence, testimonial request, referral ask, discovery questionnaire,
kickoff agenda, weekly status update, meeting recap, proposal follow-up sequence.
