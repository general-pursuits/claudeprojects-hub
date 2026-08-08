import { blankProject } from "../lib/dashboard";

export const sampleProject = (overrides = {}) => ({
  ...blankProject(1),
  name: "Growth Plan",
  client: "Acme Co",
  lead: "Addie",
  rag: "Amber",
  budget: 10000,
  spent: 4000,
  meetingDate: "2026-03-09",
  revision: "B",
  execSummary: 'Phase one, "on track"',
  talkingPoints: "Budget is healthy",
  tasks: [
    { id: 1, name: 'Draft "brief"', owner: "Addie", due: "2026-03-01", status: "Done" },
    { id: 2, name: "Client workshop", owner: "Sam", due: "2026-03-15", status: "In Progress" },
  ],
  milestones: [
    { name: "Kickoff", date: "2026-02-01", done: true },
    { name: "Launch", date: "2026-04-01", done: false },
  ],
  deliverables: [{ id: 1, name: "Strategy deck", status: "In Review", due: "2026-03-20" }],
  risks: [{ id: 1, flag: "Red", item: "Scope creep", owner: "Addie", mitigation: "Weekly check-in" }],
  decisions: [{ id: 1, date: "2026-02-10", decision: "Use phased rollout", madeBy: "Acme Co" }],
  openAsks: [{ id: 1, ask: "Send brand assets", askedOf: "Acme Co", dueBy: "2026-03-12", done: false }],
  ...overrides,
});

export const sampleConsultant = { name: "Addie", firm: "Opportunity Designed", logoDataUrl: "" };
