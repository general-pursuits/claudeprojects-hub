# Current State

**Document ID:** `current-state`  
**Version:** `1.0.0`  
**Status:** Recovered from audit, awaiting owner confirmation  
**Repository:** `general-pursuits/opportunityDesigned-website`  
**Authoritative path:** `docs/CURRENT_STATE.md`  
**Last verified:** 2026-09-02

> Recovered by audit on 2026-09-02 from GitHub, Netlify and the Notion Repository Inventory.
> Lines marked TO BE DEFINED were never stated anywhere and need an owner decision.

## Current deployment

Domain opportunitydesigned.com, served by Netlify project opportunity-designed. Production branch main. Netlify Forms is enabled on this project only. Verified 2026-09-02: the Netlify project is NOT linked to this Git repository, so pushes here do not deploy. Whatever is live was published manually or by CLI. publish.sh lives in this repo; sync.sh lives in claudeprojects-hub.

## Known issues

- Netlify project shows Current repository: Not linked, so Git is not the deploy path
- Repository name uses camelCase while every other repo is lowercase
- Three stale branches (staging, backup/live-2026-08-29, claude/amp-issues-ferto0) are byte-identical to main and serve no purpose
- The paired DRAFTS repo contains only a README, so the documented drafts to live workflow has no working copy

## Active work

- Nothing in flight as of 2026-09-02

## Pending decisions

- Link this repo to the Netlify project, or formally adopt manual publishing as the standard
- Whether to rename the repo to all lowercase and accept the redirect cost
- Whether the DRAFTS repo is seeded from this repo or retired
