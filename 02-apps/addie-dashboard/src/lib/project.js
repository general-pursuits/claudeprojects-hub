export const pct = (a, b) => b === 0 ? 0 : Math.min(100, Math.round((a / b) * 100));
export const nowStr = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const todayISO = () => new Date().toISOString().slice(0, 10);

const DONE_STATUSES = ["Done", "Complete"];

export const doneMilestones = (proj) => proj.milestones.filter(m => m.done).length;
export const openTasks = (proj) => proj.tasks.filter(t => !DONE_STATUSES.includes(t.status));
export const openAsks = (proj) => proj.openAsks.filter(a => !a.done);

export const blankProject = (id) => ({
  id, name: "New Project", client: "Client Name", lead: "Addie",
  status: "Planning", rag: "Green", budget: 0, spent: 0,
  startDate: "", endDate: "", meetingDate: "", revision: "",
  confidential: false, clientLogoDataUrl: "",
  notes: "", execSummary: "", talkingPoints: "",
  tasks: [], milestones: [], deliverables: [],
  risks: [], decisions: [], openAsks: [], meetings: [],
  budgetHistory: [],
});

const PROJECT_DEFAULTS = { meetingDate: "", revision: "", confidential: false, clientLogoDataUrl: "", talkingPoints: "" };

// Backfills fields added after a state snapshot was written (localStorage or cloud).
export const withProjectDefaults = (state) => ({
  ...state,
  projects: state.projects.map(p => ({ ...PROJECT_DEFAULTS, ...p })),
});

// "Addie · Firm Name" — the byline used in the header, footer and every export.
export const consultantCredit = (consultant) =>
  `${consultant.name}${consultant.firm ? " · " + consultant.firm : ""}`;

// "Meeting: … · Rev. v2" — omits whatever the project has not filled in.
export const projectMeta = (proj, extra = []) =>
  [proj.meetingDate && `Meeting: ${proj.meetingDate}`, proj.revision && `Rev. ${proj.revision}`, ...extra]
    .filter(Boolean).join("  ·  ");
