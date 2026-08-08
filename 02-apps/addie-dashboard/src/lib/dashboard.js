// ── CONSTANTS ──────────────────────────────────────────────────────────────────
export const STORAGE_KEY = "consulting_dashboard_v3";
export const SETTINGS_KEY = "consultant_settings_v1";

export const DEFAULT_CONSULTANT = {
  name: "Addie", firm: "", logoDataUrl: "",
};

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

// Fills in fields added after a project was last saved.
export const migrateProject = (p) => ({ ...blankProject(p.id), ...p });

export const DEFAULT_PANELS = {
  execSummary: true, kpis: true, budget: true, milestones: true,
  notes: false, deliverables: true, risks: true, decisions: true,
  openAsks: true, meetings: true, tasks: true, talkingPoints: true,
};
export const PANEL_LABELS = {
  execSummary: "Executive Summary", kpis: "KPI Cards", budget: "Budget Chart",
  milestones: "Milestones", notes: "Internal Notes (not shared)",
  deliverables: "Deliverables", risks: "Risk Log", decisions: "Decision Log",
  openAsks: "Open Asks from Client", meetings: "Meeting Log",
  tasks: "Task Table", talkingPoints: "Talking Points",
};
export const STATUS_COLOR = {
  "Done": "bg-emerald-100 text-emerald-700", "Complete": "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700", "In Review": "bg-blue-100 text-blue-700",
  "Not Started": "bg-gray-100 text-gray-500", "Planning": "bg-amber-100 text-amber-700",
};
export const STATUS_OPTIONS = ["Not Started", "In Progress", "In Review", "Done", "Complete", "Planning"];
export const RAG_DOT = { Green: "bg-emerald-500", Amber: "bg-amber-400", Red: "bg-red-500" };
export const RAG_BADGE = { Green: "text-emerald-700 bg-emerald-50 border-emerald-200", Amber: "text-amber-700 bg-amber-50 border-amber-200", Red: "text-red-700 bg-red-50 border-red-200" };
export const pct = (a, b) => b === 0 ? 0 : Math.min(100, Math.round((a / b) * 100));
export const nowStr = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
export const todayISO = () => new Date().toISOString().slice(0, 10);

// ── PERSISTENCE ────────────────────────────────────────────────────────────────
export function loadState() { try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null; } catch { return null; } }
export function saveState(d) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch { /* storage unavailable */ } }
export function loadConsultant() { try { const s = localStorage.getItem(SETTINGS_KEY); return s ? { ...DEFAULT_CONSULTANT, ...JSON.parse(s) } : DEFAULT_CONSULTANT; } catch { return DEFAULT_CONSULTANT; } }
export function saveConsultant(d) { try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(d)); } catch { /* storage unavailable */ } }
