# Current State

**Document ID:** `current-state`  
**Version:** `1.0.0`  
**Status:** Recovered from audit, awaiting owner confirmation  
**Repository:** `general-pursuits/thebaddiepack-website`  
**Authoritative path:** `docs/CURRENT_STATE.md`  
**Last verified:** 2026-09-02

> Recovered by audit on 2026-09-02 from GitHub, Netlify and the Notion Repository Inventory.
> Lines marked TO BE DEFINED were never stated anywhere and need an owner decision.

## Current deployment

Domain thebaddiepack.com, served by Netlify project thebaddiepack. Verified 2026-09-02: the Netlify project is NOT linked to this repository. The live site does not come from this repo at all.

## Known issues

- The GitHub default branch is claude/github-repo-connection-52qc56, an agent working branch, not main. Production is effectively pointed at scratch work
- The repo holds only a scaffold: README.md and .gitignore on main, plus .claude/settings.json and .mcp.json on the agent branch. No site code
- thebaddiepack.com is live but its source exists nowhere in Git, so the site cannot be rebuilt if the Netlify deploy is lost
- A separate repo adelitaodm/theBaddiePackWebsite is referenced by two local clones but does not appear in the account repo list

## Active work

- Nothing in flight as of 2026-09-02

## Pending decisions

- Where the real site source lives and how it gets into this repo
- Whether adelitaodm/theBaddiePackWebsite still exists and holds the missing site
