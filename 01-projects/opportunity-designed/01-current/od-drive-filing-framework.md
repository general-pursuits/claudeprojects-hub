# Opportunity Designed: Drive Filing & Publishing Framework
Adopted 2026-08-30. Applies to the "Opportunity Designed" folder in Google Drive.

## Core principle
The Mac is the single source of truth (`ClaudeProjects/01-projects/opportunity-designed/`, with `01-current` and `02-archive`). Google Drive is a distribution layer only: the small set of finished, linkable assets that Notion and other tools point at. Nothing is authored in Drive; files arrive as published copies from the Mac. Personal files never live under this folder, and business files never live outside it.

## Folder structure (top level of My Drive)
```
Opportunity Designed/
  00-admin/                  this framework + the link index
  01-brand/                  Playbook, font-embed-codes
    fonts/                   woff2 files (Anton, Inter 300-700, Space Grotesk 500)
    marks/                   logo PNGs/SVG, icons
  02-client-deliverables/    final PDFs/decks sent to clients; dated filenames
  03-templates/              proposal, invoice, deck templates
```

## Versioning rules
1. Update in place. A revised file replaces the old one under the same name and same Drive file ID, so every link keeps working and always serves the latest version. No version suffixes in filenames.
2. Drive keeps prior versions of a replaced file for 30 days (Manage versions) as a safety net; the Mac `02-archive` folder is the permanent history.
3. Exception: client deliverables are point-in-time records. Name them `YYYY-MM-DD_Client_Description.pdf` and never change them after sending.

## Workflow (every publish, same three steps)
1. Edit on the Mac in `01-current`.
2. Publish the finished file to the matching Drive folder (Claude does this in-session; drag-and-drop when solo). Replace, don't duplicate.
3. Links in Notion and the link index never change. New file = add a row to the link index.

## Naming
Match the Mac: lowercase-hyphenated where practical, no spaces in new filenames. Keep names identical between Mac and Drive so files pair up at a glance.

## Sharing & privacy
- Everything defaults to Restricted (only the owner opens links).
- Never use "Anyone with the link" or "Publish to web" on business files unless the file is already public by nature (e.g. website fonts).
- Link formats: open = the Drive viewUrl; direct download = `https://drive.google.com/uc?export=download&id=FILE_ID`.

## Link index
`00-admin/od-drive-link-index.md` lists every published file with its open and download links. Update it whenever a file is added.
