# Procedure: Monthly brand audit

Once a month, check whether the brand has drifted anywhere and surface only what
actually needs uploading or updating. **Token-frugal by design**: fetch diffs,
skip anything unchanged, and write nothing when nothing changed.

## Cadence
Monthly. Scheduled task fires on the 1st; see the scheduled task named
"Monthly brand audit".

## Scope (four sources)
For each brand in `brands-registry.md` whose `status` is `building` or `live`:

1. **LLM history** — has the brand reference registered in `llm_sources.registered`
   fallen behind the current `brand-config.yml`? (new voice, colors, proof, offers)
2. **Website** — does the live/deploy-source copy still match the config and the
   Quick-Reference? (tagline, offers, mark meaning, contact, fonts)
3. **Social profiles** — bios, links, handles in `contact.social` still current
   and consistent with the site?
4. **File repository** — anything in `01-current/` newer than the last audit that
   hasn't been propagated (logo variants, exports, playbook edits)?

## Token discipline (hard rules)
- Read the **last audit line** first; only look at sources changed since then
  (compare mtimes / last-modified before fetching content).
- Fetch **diffs, not full documents**. No full re-reads of unchanged pages.
- If a source is unchanged, record "no change" and move on — do not analyze it.
- Batch all findings into one review; make no edits mid-scan.

## Update rule
- **Changes only.** If nothing drifted, log "no change" and stop. Ship nothing.
- If something drifted, list each item as: source, what's stale, the fix, and
  whether it's Auto / Both / You. Any website copy change waits for Addie's
  approval before it deploys.

## Logging (always, even on "no change")
Record the review in every tracker named in each brand's `audit.log_to`:
- append a dated line to `_brand-system/brands-registry.md` audit log, and
- update the brand's Notion Build Registry row.
Format: `YYYY-MM-DD | <brand> | <sources checked> | <changes found or "no change"> | <action>`
