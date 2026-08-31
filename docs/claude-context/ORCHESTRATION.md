# ORCHESTRATION — parallel work, agent graph, knowledge graph, decision batching

How a big ask becomes many pieces done at once, with Addie pulled in only when a decision truly needs her.

## The work is a graph (DAG)
- Decompose each request into NODES (discrete sub-tasks) with dependency EDGES. Independent nodes run in
  PARALLEL; dependent nodes wait for their inputs.
- Node types: research/read (fan out, return conclusions), draft/build (do it), review (voice-scrub / holds /
  verify -> quality gates), approval (Addie -> a human gate), publish/save.
- Execute: independent research/read nodes -> parallel subagents (Agent / Explore tool), each returns only its
  conclusion. Large multi-stage builds -> the Workflow tool (a scripted DAG of agents), but only when scale
  warrants it and Addie has opted in.

## The knowledge graph is the routing brain
- Entities: Clients, Projects, Tasks, Deliverables, Templates, Proof-Bank claims, Decisions, Content/Pages,
  Blockers. Relations: Client has Projects; Project has Tasks + Deliverables; Deliverable uses Templates +
  Proof; Content targets Keywords; Decisions constrain everything.
- The canonical homes in CORE are the graph's nodes; the Notion hub-and-spoke (Clients hub + Projects hub with
  relations/rollups) is the live graph. Routing = traverse it: a task on Client X first pulls X's projects,
  open tasks, proof, and prior decisions, so nothing is done in isolation or re-derived.

## Decision batching (managing the prompts back to Addie)
- Collect all the decisions a job needs and present them in ONE batch (AskUserQuestion, concrete options + a
  recommendation), not a trickle. Trivial/defaultable choices are defaulted with the assumption stated; only
  genuine forks reach her.
- While waiting on her, other independent nodes keep running. Approval is a gate on one branch, not a stop on
  the whole graph.
- Every answer becomes a Decision node (DECISIONS.md) so it is never re-asked.

## The loop
Plan the DAG -> run independent nodes in parallel (subagents) -> gate at review nodes -> batch approvals to
Addie -> on yes: publish/save + sync -> log Tasks + Decisions -> next wave.
