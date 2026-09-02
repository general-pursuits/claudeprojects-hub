# Context Recovery Logic

**Document ID:** `context-recovery-logic`  
**Version:** `1.0.0`  
**Status:** Inventory only, no migration performed  
**Parent entity:** The General Pursuit  
**Authoritative path:** `claudeprojects-hub/inventory/`  
**Last verified:** 2026-09-02

## What it is

How a new session, or a person returning after a gap, recovers what a project is, where it stands and what happens next without re-reading history.

**Category:** System  
**Status:** Live and heavily used, but spread across four systems

## Where it lives today

- `ClaudeProjects/docs/claude-context/`: CORE-RULES.md, PROJECT-MEMORY.md, DECISIONS.md, TASK-TRACKING.md, ORCHESTRATION.md, APPROVALS.md, DEFINITION-OF-DONE.md, INCIDENTS.md, TEMPLATES.md, TOKEN-OPTIMIZATION.md, WEBSITE-EDIT-PROTOCOL.md, GITHUB-RULESETS.md, BUSINESS-OPS-BACKLOG.md, CONTENT-WORKSHOP.md
- `general-pursuits/business-os`: history/, governance/, standards/, registry/
- Claude account skills: `stack-context`, `fact-base`, `check-open-items`, `import-memory`, `verify-and-learn`
- New as of 2026-09-02: docs/ context packs generated for all 19 repositories, staged at ClaudeProjects/_context-packs/
- Notion: Build Registry, Output Issue Log, Repository Inventory, Stack Registry

## Current form

The most distributed asset on this list. Fourteen markdown files in the hub, a whole repository, five account skills, four Notion databases, and 57 newly generated repo docs.

## Evidence

Verified on disk, in business-os, in the session skill list and in Notion

## Overlaps and conflicts

- docs/claude-context/ in the hub and business-os/governance/ both hold rules; which is authoritative is undefined
- The new per-repo docs/ packs overlap docs/claude-context/PROJECT-MEMORY.md

## Migration target

Undecided. Candidate: business-os as the single home, with per-repo docs/ pointing back to it.

Candidate only. No migration has been performed.

## Open questions

- Is docs/claude-context/ in the hub or business-os/governance/ authoritative
- Do the new per-repo docs/ packs replace PROJECT-MEMORY.md or sit under it

