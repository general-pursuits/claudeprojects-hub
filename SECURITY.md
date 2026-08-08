# Security review — 2026-08-08

Scope: every code file in this repo (`02-apps/addie-dashboard`, `01-projects/jewelry/digital-gallery`,
`01-projects/jewelry/site`, the Google Apps Script automation, `templates/scripts`) plus the committed
`LLMmemorydata` chat exports. The repo is private on GitHub, which limits — but does not remove — the
impact of the credential findings below.

There is no server-side database code and no SQL anywhere in the repo, so there is no SQL injection
surface. All data access goes through the Supabase client libraries, which parameterise queries.

## Fixed in this change

| # | Severity | Issue | Fix |
|---|----------|-------|-----|
| 1 | Critical | `addie-dashboard` read the Anthropic key from `VITE_ANTHROPIC_API_KEY` and called `api.anthropic.com` from the browser with `anthropic-dangerous-direct-browser-access: true`. Vite inlines every `VITE_`-prefixed variable into the public JS bundle, so anyone who loaded the deployed dashboard could read the key out of the bundle and spend against the account. | AI calls now go to a Netlify function (`netlify/functions/anthropic.mjs`, routed at `/api/anthropic`) that reads a server-side `ANTHROPIC_API_KEY`, pins the model, and caps `max_tokens` and prompt length. |
| 2 | Critical | The public Apps Script inquiry endpoint interpolated raw form fields into two HTML emails and used the submitted address as `replyTo` and as the confirmation recipient. Because the endpoint accepts anonymous POSTs, anyone could inject arbitrary HTML/links into mail sent from the account, to an address of their choosing. | All fields are sanitised in `parseSubmission()` (control chars stripped, length-capped), HTML-escaped before templating, the address must pass `isValidEmail()` before being used as a recipient or `replyTo`, and confirmations are capped per hour so the endpoint can't be used as a mail relay. |
| 3 | High | `digital-gallery/src/App.js` hardcoded the Supabase project URL and publishable key in source. | Both now come from `REACT_APP_*` env vars; see `.env.example`. |
| 4 | High | The bid write was `update({current_bid}).neq('current_bid', 0)` — unscoped, so a single click rewrote **every** row in `auction_item`, and it accepted any client-computed value. | The update is scoped with `.eq('id', AUCTION_ITEM_ID)` and guarded with `.lt('current_bid', newBid)` so it can only ever raise a single lot's price, and the UI now renders the value the database returned. |
| 5 | High | A Netlify access token (a `netlify deploy --auth` / MCP proxy token) was pasted into `LLMmemorydata/conversations.json` and committed. | Replaced with `REDACTED-NETLIFY-ACCESS-TOKEN`. **The token is still in git history — revoke it in Netlify (User settings → Applications → Personal access tokens).** |
| 6 | Medium | Apps Script returned raw exception strings to the caller. | Response is now generic; details stay in the script log. |
| 7 | Medium | Form values were written to the tracker sheet unescaped, so a value beginning with `=` became a live formula (CSV/formula injection). | `sheetSafe()` prefixes such values with `'`. |
| 8 | Medium | Vulnerable dependencies in `addie-dashboard`: `vite`, `postcss`, `@babel/core`, `js-yaml`, `nanoid`, `brace-expansion`, `ws` (arbitrary file read, path traversal, DoS). | `npm audit fix` applied — 10 advisories down to 2 (see below). |

## Open items (need your decision)

- **Revoke and rotate the Netlify token** from finding 5. Redaction does not undo the exposure.
- **Supabase row-level security.** Both apps talk to Supabase with only an anon/publishable key and no
  authentication: `addie-dashboard` identifies the user by a random UUID it stores in `localStorage`, and
  the gallery writes bids straight from the browser. If RLS is off or permissive, anyone holding the key
  (it ships in the bundle by design) can read and overwrite every row in `dashboard_state`,
  `consultant_settings`, and `auction_item`. Confirm RLS is enabled with policies keyed to an
  authenticated user, or move writes behind a server function. The key itself is in
  `LLMmemorydata/conversations.json` too — anon keys are meant to be public, so that is only a problem if
  RLS is not in place.
- **`xlsx` (SheetJS) has no fixed version on npm** (prototype pollution + ReDoS). The dashboard parses
  user-supplied spreadsheets on import. Fix requires installing 0.20.x from `cdn.sheetjs.com` instead of
  npm, or dropping the import feature.
- **`pptxgenjs` → `image-size` DoS** only has a fix via a major downgrade; left as-is.
- **`digital-gallery` still reports 28 advisories**, all reachable only through `react-scripts@5.0.1`'s
  build/dev toolchain. Clearing them means migrating the app off `react-scripts` (e.g. to Vite, like the
  dashboard).
- The "shareable link" in the dashboard's share dialog is described as a read-only snapshot URL but is
  just the app URL; there is no access control on shared dashboards.

## Checked, no action needed

- **CORS**: no server code sets CORS headers; the Netlify function added here is same-origin only.
- **Debug endpoints**: none. No debug flags or admin routes exist in the repo.
- **`eval` / `document.write`**: none.
- **`innerHTML`** in `01-projects/jewelry/site/lot.html` is fed only by the visitor's own input in a
  static mockup with no backend (self-XSS only).
- **`templates/scripts/build_consultation_template.py`** runs no shell commands and takes no network
  input.
- No AWS keys, GitHub tokens, Google API keys, Slack tokens, or private keys anywhere in the repo.
