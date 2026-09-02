# SEOLLM

**Document ID:** `seollm`  
**Version:** `1.0.0`  
**Status:** Inventory only, no migration performed  
**Parent entity:** The General Pursuit  
**Authoritative path:** `claudeprojects-hub/inventory/`  
**Last verified:** 2026-09-02

## What it is

Search and AI-visibility work: keyword research, on-page SEO, and tracking how the brand surfaces inside LLM answers rather than only in classic search results.

**Category:** Search  
**Status:** Live, partially built

## Where it lives today

- Claude account skills: `od-keyword-research`, `od-ai-visibility-tracker`
- `searchfit-seo` plugin skills (seo-audit, keyword-clustering, ai-visibility, schema-markup, content-brief and others)
- `general-pursuits/opportunityDesigned-website` ships `llms.txt`, `robots.txt` and `sitemap.xml`, the on-site half of this asset

## Current form

Account-level skills plus an installed plugin, plus three files in the production website repo.

## Evidence

Verified in the session skill list and in the opportunityDesigned-website file tree

## Overlaps and conflicts

- `od-ai-visibility-tracker` overlaps the `searchfit-seo:ai-visibility` plugin skill
- `od-keyword-research` overlaps `searchfit-seo:keyword-clustering`

## Migration target

Undecided. Candidate: business-os/knowledge/ for method, website repo for the served files.

Candidate only. No migration has been performed.

## Open questions

- Whether the custom OD skills or the searchfit-seo plugin is authoritative where they overlap
- Whether llms.txt is generated or hand-maintained

