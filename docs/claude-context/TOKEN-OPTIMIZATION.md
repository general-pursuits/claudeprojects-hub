# TOKEN OPTIMIZATION - do more with fewer tokens, no quality loss

How every session spends context well. This is the runtime companion to the Router in CORE-RULES.

## Principles
- Load on demand: read CORE always; pull a topic doc only when the Router names it. Never read the whole hub.
- Scope caps per task (from CORE): a lead brief = fact-base + that one lead; a content task = the SEO docs; a
  file fix = that file. Don't fetch the site to answer a scoped question.
- Model tiering: cheap/fast model for mechanical work (formatting, extraction, file moves, link checks,
  renames); the strong model for strategy, copy, and judgment. Say the intended tier at task start.
- Fan out reads, keep conclusions: anything that means reading MANY files or pages (audits, "find X across
  the site", research sweeps) goes to a subagent (Agent / Explore tool) that returns the CONCLUSION, not the
  file dumps. The main thread keeps only the answer. Biggest saver on research-heavy work.
- Batch independent tool calls in one turn (parallel) instead of one per round-trip.
- Don't re-read a file you just wrote. Cite paths, don't paste file contents back. Cap routine summaries.
  No "let me..." narration between tool calls.
- Edit, don't rewrite: str-replace over full-file rewrites; pointers over duplicated text.
- Stop conditions: if a search or loop fails 2-3 times, stop and ask; do not burn tokens retrying.

## Rough budget by task type
- Quick fact / small edit: no subagents, minimal reads, just do it.
- Brief / proposal / single page: one research subagent (if needed) + draft + pipeline.
- Audit / sweep / "check everything": subagents fan out and return conclusions; main thread synthesizes.
- Big multi-stage build: a workflow DAG (see ORCHESTRATION.md), only when scale warrants and Addie opted in.

## Where the savings already are
CORE (~6KB) loads every session instead of PROJECT-MEMORY (~23KB); the deep docs load only on demand. Keep it
that way: if a doc grows past a screen or two, split it and add a Router line rather than letting CORE bloat.
