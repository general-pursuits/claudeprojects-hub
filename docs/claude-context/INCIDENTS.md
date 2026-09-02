# INCIDENTS - what broke, root cause, guardrail added

Append one entry when something breaks, so the same mistake is not repeated. Guardrails also live in
CORE-RULES.md "Danger list".

- Notion backend + 9 databases trashed. Cause: set `allow_deleting_content: true` on a replace_content.
  Guardrail: never set that flag; reference child pages with `<page url>` tags.
- ProjectOS template trashed mid-edit (cause unclear); restored from Trash. Guardrail: snapshot/duplicate
  before large Notion edits; avoid destructive flags.
- Live site once overwritten with stale content. Cause: Netlify "Fix with agent" button. Guardrail: never
  use it; roll back via Netlify Deploys.
- GA4 silently not loading pre-2026-07-29 (no gtag.js). Guardrail: after consent/analytics changes, verify
  gtag actually loads before calling it done.
