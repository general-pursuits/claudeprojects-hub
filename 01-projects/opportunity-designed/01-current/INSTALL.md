# Install: 2026-08-24 build session

Seven files. Everything built on 2026-08-24 that does not already live in Notion.

Until these are in the hub repo they exist only as chat attachments, and the
Build Registry rows pointing at them are aspirational rather than true.

## One command

Unzip this archive so its `website/` and `docs/` folders land inside the
opportunity-designed project, then sync:

```bash
cd ~/ClaudeProjects/01-projects/opportunity-designed/01-current
unzip -o ~/Downloads/od-build-2026-08-24.zip -d .
cd ~/ClaudeProjects && sh sync.sh "2026-08-24 build: scrub.py, entity policy, locked field note template"
```

Verify it landed:

```bash
cd ~/ClaudeProjects && git ls-files | grep -E "scrub.py|field-note-template|field-notes.css"
```

Three paths should come back. If nothing does, the unzip went to the wrong
place.

## What each file is, and what to do with it

| File | Lands at | Then what |
|---|---|---|
| `website/scripts/scrub.py` | `.../website/scripts/` | Run before any publish. `python3 scripts/scrub.py <file>` |
| `website/scripts/extract-skeleton.py` | `.../website/scripts/` | Utility. Run when a cloud session needs a local file's structure |
| `website/scripts/numbers-policy.md` | `.../website/scripts/` | Reference. The written numbers rule |
| `website/templates/field-note-template.html` | `.../website/templates/` | The locked wrapper. Not a page, do not put it in deploy-live |
| `website/css/field-notes.css` | `.../website/css/` | **Needs a manual step, see below** |
| `docs/plugin-patch-2026-08-24.md` | `.../docs/` | Five find-and-replace patches for the plugin skills |
| `docs/field-note-voice-spec-v1.md` | `.../docs/` | Voice spec, still a draft pending your read |

## The one manual step

`field-notes.css` is a block to append, not a file the site loads on its own.

1. Append its contents to `deploy-live/css/index.css`
2. Delete the page-scoped `<style>` block from every existing field note in
   `deploy-live/field-notes/`
3. Bump the `?v=` cache-bust integer on the stylesheet link in every page
4. Publish

Until step 2 is done, each note's inline styles still win and the shared rules
do nothing. This is the change that makes "locked template" true rather than
aspirational: right now the article styles are copy-pasted per page and free to
drift.

## Smoke test after install

```bash
cd ~/ClaudeProjects/01-projects/opportunity-designed/01-current/website
python3 scripts/scrub.py deploy-live/field-notes/get-into-costco.html
```

Expect two em dash hard failures on the current live file, one in the short
answer and one in FAQ 04. That is the script working. `--fix` clears both.

## Not in this archive

Already filed, nothing to do:

- Named Entity Policy, Field Notes Pipeline, Build Registry rows, and the
  two-funnel pricing rule are in Notion
- Project memory is updated
- The Field Note Template Spec is a published artifact

Still outstanding:

- `llms.txt` needs the SkyCon line removed and the hedged duration claim cut
  from the Norda line, in both `page-build/` and `deploy-live/`
- The plugin patch has to be applied to the plugin source, not the synced copy
- `fact-base` has not been audited against the entity policy
