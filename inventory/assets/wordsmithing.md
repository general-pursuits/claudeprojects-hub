# Wordsmithing

**Document ID:** `wordsmithing`  
**Version:** `1.0.0`  
**Status:** Inventory only, no migration performed  
**Parent entity:** The General Pursuit  
**Authoritative path:** `claudeprojects-hub/inventory/`  
**Last verified:** 2026-09-02

## What it is

The layer that makes written output sound like Addie rather than like a model: voice rules, mechanical scrubbing, and house formatting applied before anything is sent, published or pasted.

**Category:** Writing  
**Status:** Live and in daily use

## Where it lives today

- Claude account skills: `logan-wordsmith`, `addie-voice`, `voice-scrub`, `house-style`, `opportunity-designed-copy`
- `voice-scrub/scripts/scrub.py`, the canonical scrubber
- ClaudeProjects `docs/claude-context/CONTENT-WORKSHOP.md`
- Hub commit c065e6d wired the canonical scrubber into CORE and content-workshop so the gates run in cloud runs and automations

## Current form

Account-level skills plus one Python script. Not in any repository except the scrubber wiring recorded in claudeprojects-hub.

## Evidence

Verified in the session skill list and in hub commit c065e6d

## Overlaps and conflicts

- Overlaps `named-entity-check` and `brand-guard`, which run adjacent gates
- `house-style` and the Cowork standing rule disagree on em dashes; the standing rule wins

## Migration target

Undecided. Candidate: business-os/standards/ for the rules, claudeprojects-hub for the scrubber code.

Candidate only. No migration has been performed.

## Open questions

- Is `logan-wordsmith` a persona or a wordsmithing engine? It is currently counted in both
- Where does the canonical scrubber live long term

