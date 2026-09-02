# Claude Asset Inventory

**Document ID:** `claude-asset-inventory`  
**Version:** `1.0.0`  
**Status:** Inventory only, no migration performed  
**Parent entity:** The General Pursuit  
**Authoritative path:** `claudeprojects-hub/inventory/`  
**Last verified:** 2026-09-02

## Rule for this folder

Inventory only. Nothing in this folder migrates, moves, renames or deletes an asset.
Every `Migration target` line below is a candidate, not a decision. Do not act on one
without an explicit instruction.

## What counts as a Claude asset

A skill, framework, agent, persona, or body of logic that shapes how Claude works for
The General Pursuit. Assets are recorded wherever they actually live today, which is
often several places at once, including places outside Git.

## The eight assets

| Asset | Category | Status | Detail |
|---|---|---|---|
| Wordsmithing | Writing | Live and in daily use | `inventory/assets/wordsmithing.md` |
| SEOLLM | Search | Live, partially built | `inventory/assets/seollm.md` |
| Personas | Writing | Live, undocumented outside the skills themselves | `inventory/assets/personas.md` |
| Marketplace Agent | Agent | Named but not built | `inventory/assets/marketplace-agent.md` |
| Resume Agent | Agent | Skills live, repository empty | `inventory/assets/resume-agent.md` |
| Interview Agent | Agent | Named only, no artifact located | `inventory/assets/interview-agent.md` |
| LinkedIn Framework | Content | Skills live, hub repository unused | `inventory/assets/linkedin-framework.md` |
| Context Recovery Logic | System | Live and heavily used, but spread across four systems | `inventory/assets/context-recovery-logic.md` |

## Where assets currently live

Assets are spread across four systems. None of the eight lives in exactly one place.

| System | Holds |
|---|---|
| Claude account skills | Most of Wordsmithing, SEOLLM, Personas, Resume Agent, LinkedIn Framework |
| claudeprojects-hub | docs/claude-context/, the scrubber wiring, resume source files, archived marketplace work |
| general-pursuits/business-os | history/, governance/, standards/, registry/ |
| Notion | Build Registry, Output Issue Log, Repository Inventory, Stack Registry |

## Confidence

Every `Where it lives` line is verified against the session skill list, the GitHub
repositories, or the local ClaudeProjects tree, and the evidence is named in each
asset file. One asset, Interview Agent, could not be located at all; it is recorded
as named only.

## Open questions across the inventory

- Interview Agent has no located artifact. It may exist in a Claude Project or as a
  chat-only workflow that this audit could not see.
- `logan-wordsmith` counts as both a persona and a wordsmithing engine.
- `docs/claude-context/` in this repo and `business-os/governance/` both hold rules,
  and neither is marked authoritative.
- Three of the eight assets (Marketplace Agent, Resume Agent, Interview Agent) have
  named repositories or ambitions but little or no built artifact.
