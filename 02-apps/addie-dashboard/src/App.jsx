import { useState, useRef, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  CheckCircle, Circle, Clock, DollarSign, TrendingUp, Plus, Trash2, Pencil,
  Check, X, Download, GripVertical, FileText, Settings, Eye, EyeOff,
  Share2, Link, Mail, FileDown, Copy, ExternalLink, RefreshCw, Save, Upload,
  Mic, AlertTriangle, Image, Building2, ChevronDown, Cloud, CloudOff
} from "lucide-react";
import PptxGenJS from "pptxgenjs";
import * as XLSX from "xlsx";
import { createClient } from "@supabase/supabase-js";

// ── SUPABASE ───────────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null;

// ── ERROR HELPERS ──────────────────────────────────────────────────────────────
// Every failure the user can act on must reach the UI. These helpers keep the
// message readable while preserving the original error for the console.
function errMsg(e) {
  if (!e) return "Unknown error";
  if (typeof e === "string") return e;
  return e.message || String(e);
}
function report(context, e) {
  console.error(`${context}:`, e);
  return `${context}: ${errMsg(e)}`;
}

// Stable anonymous user ID — persists in localStorage as identity only.
// Falls back to a session-only ID when storage is unavailable (private mode).
let storageBlockedReason = "";
function getUserId() {
  try {
    let id = localStorage.getItem("dashboard_user_id");
    if (!id) { id = crypto.randomUUID(); localStorage.setItem("dashboard_user_id", id); }
    return id;
  } catch (e) {
    storageBlockedReason = report("Browser storage unavailable — this session will not be remembered locally", e);
    return crypto.randomUUID();
  }
}
const USER_ID = getUserId();

async function loadFromSupabase() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("dashboard_state")
    .select("state")
    .eq("user_id", USER_ID)
    .maybeSingle(); // returns null instead of error when no row found
  if (error) throw new Error(error.message);
  return data?.state || null;
}

async function saveToSupabase(state) {
  if (!supabase) return;
  const { error } = await supabase
    .from("dashboard_state")
    .upsert({ user_id: USER_ID, state }, { onConflict: "user_id" });
  if (error) throw new Error(error.message);
}

async function loadConsultantFromSupabase() {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("consultant_settings")
    .select("settings")
    .eq("user_id", USER_ID)
    .maybeSingle(); // returns null instead of error when no row found
  if (error) throw new Error(error.message);
  return data?.settings || null;
}

async function saveConsultantToSupabase(settings) {
  if (!supabase) return;
  const { error } = await supabase
    .from("consultant_settings")
    .upsert({ user_id: USER_ID, settings }, { onConflict: "user_id" });
  if (error) throw new Error(error.message);
}

// ── CONSTANTS ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "consulting_dashboard_v3";
const SETTINGS_KEY = "consultant_settings_v1";

const DEFAULT_CONSULTANT = {
  name: "Addie", firm: "", logoDataUrl: "",
};

const blankProject = (id) => ({
  id, name: "New Project", client: "Client Name", lead: "Addie",
  status: "Planning", rag: "Green", budget: 0, spent: 0,
  startDate: "", endDate: "", meetingDate: "", revision: "",
  confidential: false, clientLogoDataUrl: "",
  notes: "", execSummary: "", talkingPoints: "",
  tasks: [], milestones: [], deliverables: [],
  risks: [], decisions: [], openAsks: [], meetings: [],
  budgetHistory: [],
});

const DEFAULT_PANELS = {
  execSummary: true, kpis: true, budget: true, milestones: true,
  notes: false, deliverables: true, risks: true, decisions: true,
  openAsks: true, meetings: true, tasks: true, talkingPoints: true,
};
const PANEL_LABELS = {
  execSummary: "Executive Summary", kpis: "KPI Cards", budget: "Budget Chart",
  milestones: "Milestones", notes: "Internal Notes (not shared)",
  deliverables: "Deliverables", risks: "Risk Log", decisions: "Decision Log",
  openAsks: "Open Asks from Client", meetings: "Meeting Log",
  tasks: "Task Table", talkingPoints: "Talking Points",
};
const STATUS_COLOR = {
  "Done": "bg-emerald-100 text-emerald-700", "Complete": "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700", "In Review": "bg-blue-100 text-blue-700",
  "Not Started": "bg-gray-100 text-gray-500", "Planning": "bg-amber-100 text-amber-700",
};
const STATUS_OPTIONS = ["Not Started", "In Progress", "In Review", "Done", "Complete", "Planning"];
const RAG_DOT = { Green: "bg-emerald-500", Amber: "bg-amber-400", Red: "bg-red-500" };
const RAG_BADGE = { Green: "text-emerald-700 bg-emerald-50 border-emerald-200", Amber: "text-amber-700 bg-amber-50 border-amber-200", Red: "text-red-700 bg-red-50 border-red-200" };
const pct = (a, b) => b === 0 ? 0 : Math.min(100, Math.round((a / b) * 100));
const nowStr = () => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
const todayISO = () => new Date().toISOString().slice(0, 10);

// ── PERSISTENCE ────────────────────────────────────────────────────────────────
// Reads tolerate corrupt/absent data (nothing the user can do about it beyond a
// reset) but writes throw so callers can tell the user their edit was not saved.
function loadState() {
  try { const s = localStorage.getItem(STORAGE_KEY); return s ? JSON.parse(s) : null; }
  catch (e) { console.error("Local dashboard cache unreadable, starting fresh:", e); return null; }
}
function saveState(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }
function loadConsultant() {
  try { const s = localStorage.getItem(SETTINGS_KEY); return s ? { ...DEFAULT_CONSULTANT, ...JSON.parse(s) } : DEFAULT_CONSULTANT; }
  catch (e) { console.error("Local branding cache unreadable, using defaults:", e); return DEFAULT_CONSULTANT; }
}
function saveConsultant(d) { localStorage.setItem(SETTINGS_KEY, JSON.stringify(d)); }

// Normalizes a loaded state blob; throws when it is not a usable dashboard.
function hydrateState(raw) {
  if (!raw || typeof raw !== "object") throw new Error("not a dashboard file");
  if (!Array.isArray(raw.projects) || raw.projects.length === 0) throw new Error("no projects found");
  return {
    ...raw,
    projects: raw.projects.map(p => ({ meetingDate: "", revision: "", confidential: false, clientLogoDataUrl: "", talkingPoints: "", ...p })),
  };
}

// ── INLINE EDITORS ─────────────────────────────────────────────────────────────
function IT({ value, onSave, className = "", wide = false, placeholder = "Click to edit", dark = false }) {
  const [ed, setEd] = useState(false); const [v, setV] = useState(value);
  const commit = () => { onSave(v); setEd(false); };
  const cancel = () => { setV(value); setEd(false); };
  if (ed) return <span className="inline-flex items-center gap-1">
    <input autoFocus placeholder={placeholder}
      className={`border-b outline-none bg-transparent text-sm px-0.5 ${wide ? "w-56" : "w-36"} ${dark ? "border-gray-400 text-white placeholder-gray-500" : "border-blue-400 text-gray-800"}`}
      value={v} onChange={e => setV(e.target.value)}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }} />
    <Check className={`w-3.5 h-3.5 cursor-pointer shrink-0 ${dark ? "text-emerald-400" : "text-emerald-500"}`} onClick={commit} />
    <X className="w-3.5 h-3.5 text-gray-400 cursor-pointer shrink-0" onClick={cancel} />
  </span>;
  return <span className={`group inline-flex items-center gap-1 cursor-pointer ${className}`} onClick={() => setEd(true)}>
    {value || <span className={`italic text-sm ${dark ? "text-gray-500" : "text-gray-300"}`}>{placeholder}</span>}
    <Pencil className={`w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0 ${dark ? "text-gray-400" : "text-gray-300 group-hover:text-gray-400"}`} />
  </span>;
}
function IN({ value, onSave, prefix = "" }) {
  const [ed, setEd] = useState(false); const [v, setV] = useState(value);
  const commit = () => { const n = parseFloat(v); if (!isNaN(n)) onSave(n); setEd(false); };
  const cancel = () => { setV(value); setEd(false); };
  if (ed) return <span className="inline-flex items-center gap-1">
    <input autoFocus className="border-b border-blue-400 outline-none bg-transparent w-24 text-sm"
      value={v} onChange={e => setV(e.target.value)}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") cancel(); }} />
    <Check className="w-3.5 h-3.5 text-emerald-500 cursor-pointer" onClick={commit} />
    <X className="w-3.5 h-3.5 text-gray-400 cursor-pointer" onClick={cancel} />
  </span>;
  return <span className="group inline-flex items-center gap-1 cursor-pointer" onClick={() => setEd(true)}>
    {prefix}{value.toLocaleString()}<Pencil className="w-3 h-3 text-gray-300 group-hover:text-gray-400 opacity-0 group-hover:opacity-100" />
  </span>;
}
function IS({ value, options, onSave, colorMap }) {
  const [ed, setEd] = useState(false);
  if (ed) return <select autoFocus className="text-xs border border-gray-200 rounded px-1 py-0.5 bg-white"
    value={value} onChange={e => { onSave(e.target.value); setEd(false); }} onBlur={() => setEd(false)}>
    {options.map(o => <option key={o}>{o}</option>)}
  </select>;
  const cls = colorMap ? (colorMap[value] || "bg-gray-100 text-gray-500 border-gray-200") : (STATUS_COLOR[value] || "bg-gray-100 text-gray-500");
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer border ${cls}`} onClick={() => setEd(true)}>{value}</span>;
}
function TA({ value, onSave, rows = 3, placeholder = "Click to add..." }) {
  const [ed, setEd] = useState(false); const [v, setV] = useState(value);
  return ed
    ? <div>
        <textarea autoFocus rows={rows} placeholder={placeholder}
          className="w-full text-sm text-gray-700 border border-blue-200 rounded-lg p-3 outline-none resize-none focus:border-blue-400 font-sans"
          value={v} onChange={e => setV(e.target.value)} />
        <div className="flex gap-2 mt-1">
          <button onClick={() => { onSave(v); setEd(false); }} className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><Check className="w-3.5 h-3.5" />Save</button>
          <button onClick={() => { setV(value); setEd(false); }} className="flex items-center gap-1 text-xs text-gray-400"><X className="w-3.5 h-3.5" />Cancel</button>
        </div>
      </div>
    : <div className="group relative cursor-pointer" onClick={() => setEd(true)}>
        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap min-h-8">{value || <span className="text-gray-300 italic">{placeholder}</span>}</p>
        <Pencil className="w-3 h-3 text-gray-300 group-hover:text-gray-400 absolute top-0 right-0 opacity-0 group-hover:opacity-100" />
      </div>;
}

// ── UI PRIMITIVES ──────────────────────────────────────────────────────────────
function Card({ children, className = "" }) {
  return <div className={`bg-white rounded-xl border border-gray-200 shadow-sm p-5 print:shadow-none print:border-gray-300 ${className}`}>{children}</div>;
}
function SH({ title, onAdd, addLabel = "Add" }) {
  return <div className="flex items-center justify-between mb-3">
    <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
    {onAdd && <button onClick={onAdd} className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 print:hidden"><Plus className="w-3.5 h-3.5" />{addLabel}</button>}
  </div>;
}
function Empty({ label }) {
  return <div className="border-2 border-dashed border-gray-100 rounded-lg p-4 text-center text-xs text-gray-300">{label}</div>;
}
function BudgetBar({ spent, budget }) {
  const p = pct(spent, budget);
  const col = p > 90 ? "bg-red-500" : p > 70 ? "bg-amber-400" : "bg-emerald-500";
  const projected = budget > 0 ? Math.round(spent / Math.max(p, 1) * 100) : 0;
  return <div className="w-full">
    <div className="flex justify-between text-xs text-gray-500 mb-1"><span>${spent.toLocaleString()} spent</span><span>${budget.toLocaleString()} budget</span></div>
    <div className="w-full bg-gray-100 rounded-full h-2"><div className={`${col} h-2 rounded-full transition-all duration-300`} style={{ width: `${p}%` }} /></div>
    <div className="text-xs text-gray-400 mt-1">{p}% utilized{budget > 0 ? ` · projected finish: $${projected.toLocaleString()}` : ""}</div>
  </div>;
}

// ── LOGO UPLOADER ─────────────────────────────────────────────────────────────
const MAX_LOGO_BYTES = 1_000_000; // logos are inlined as data URLs into saved state

function LogoUploader({ logoDataUrl, onSave, onError, label = "Upload logo", compact = false }) {
  const inputRef = useRef();
  const [localErr, setLocalErr] = useState("");
  const fail = (msg) => { setLocalErr(msg); onError?.(msg); };
  const handleFile = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    e.target.value = "";
    setLocalErr("");
    if (!file.type.startsWith("image/")) { fail(`"${file.name}" is not an image.`); return; }
    if (file.size > MAX_LOGO_BYTES) { fail(`Logo is ${Math.round(file.size / 1000)} KB — use an image under ${MAX_LOGO_BYTES / 1000} KB so it can be saved.`); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      const result = ev.target?.result;
      if (typeof result === "string" && result) onSave(result);
      else fail(`Could not read "${file.name}".`);
    };
    reader.onerror = () => fail(report(`Could not read "${file.name}"`, reader.error));
    reader.readAsDataURL(file);
  };
  if (compact) return (
    <div className="flex items-center gap-2">
      {logoDataUrl
        ? <img src={logoDataUrl} alt="logo" className="h-8 max-w-24 object-contain rounded cursor-pointer" onClick={() => inputRef.current?.click()} title="Click to replace" />
        : <button onClick={() => inputRef.current?.click()} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 border border-dashed border-gray-200 rounded-lg px-2 py-1.5">
            <Image className="w-3.5 h-3.5" />{label}
          </button>}
      {logoDataUrl && <button onClick={() => onSave("")} className="text-xs text-gray-300 hover:text-red-400">✕</button>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      {localErr && <span className="text-xs text-red-500">{localErr}</span>}
    </div>
  );
  return <div className="flex items-start gap-3">
    {logoDataUrl
      ? <img src={logoDataUrl} alt="logo" className="h-12 max-w-36 object-contain rounded border border-gray-100 p-1" />
      : <div className="w-20 h-12 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 cursor-pointer hover:border-gray-300" onClick={() => inputRef.current?.click()}><Image className="w-5 h-5" /></div>}
    <div className="flex flex-col gap-1 mt-1">
      <button onClick={() => inputRef.current?.click()} className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"><Upload className="w-3 h-3" />{logoDataUrl ? "Replace" : "Upload"}</button>
      {logoDataUrl && <button onClick={() => onSave("")} className="text-xs text-gray-400 hover:text-red-400">Remove</button>}
      {localErr && <span className="text-xs text-red-500 max-w-48">{localErr}</span>}
    </div>
    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
  </div>;
}

// ── CONFIDENTIAL BANNER ───────────────────────────────────────────────────────
function ConfidentialBanner() {
  return <div className="w-full bg-red-600 text-white text-xs font-bold text-center py-1.5 tracking-widest uppercase print:py-1">
    ⚠ Confidential — Not for Distribution
  </div>;
}

// ── CONSULTANT SETTINGS MODAL ─────────────────────────────────────────────────
function ConsultantSettings({ consultant, onChange, onClose }) {
  const [local, setLocal] = useState({ ...consultant });
  const save = () => { onChange(local); onClose(); };
  const upd = (k, v) => setLocal(l => ({ ...l, [k]: v }));
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2"><Building2 className="w-4 h-4 text-gray-500" />Your Branding</h2>
        <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Your Name</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-300" value={local.name} onChange={e => upd("name", e.target.value)} placeholder="Addie" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">Firm / Company (optional)</label>
          <input className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-300" value={local.firm} onChange={e => upd("firm", e.target.value)} placeholder="Independent · Your Firm Name" />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1.5">Your Logo (appears in header)</label>
          <LogoUploader logoDataUrl={local.logoDataUrl} onSave={v => upd("logoDataUrl", v)} label="Upload your logo" />
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        <button onClick={save} className="flex-1 py-2 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700">Save</button>
        <button onClick={onClose} className="px-4 py-2 border border-gray-200 text-gray-600 text-sm rounded-lg hover:border-gray-400">Cancel</button>
      </div>
    </div>
  </div>;
}

// ── ANTHROPIC API ──────────────────────────────────────────────────────────────
const MISSING_KEY_MSG = "Set VITE_ANTHROPIC_API_KEY in Netlify environment variables to enable AI generation, or type notes manually.";

// Returns the assistant's text, throwing a specific error for every failure mode
// (missing key, HTTP/API error, empty completion) so callers can tell them apart.
async function askClaude({ system, prompt, maxTokens }) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error(MISSING_KEY_MSG);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, system, messages: [{ role: "user", content: prompt }] }),
  });
  const body = await res.text();
  let data;
  try { data = JSON.parse(body); }
  catch { throw new Error(`Anthropic API returned an unreadable response (HTTP ${res.status}).`); }
  if (!res.ok) throw new Error(data?.error?.message || `Anthropic API error (HTTP ${res.status}).`);
  const text = data.content?.find(b => b.type === "text")?.text?.trim();
  if (!text) throw new Error("Anthropic API returned no text.");
  return text;
}

// ── TALKING POINTS ─────────────────────────────────────────────────────────────
function TalkingPointsPanel({ proj, talkingPoints, onSave }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const generate = async () => {
    setLoading(true); setError("");
    const milDone = proj.milestones.filter(m => m.done).length;
    const openRisks = proj.risks.filter(r => r.flag !== "Green");
    const openAsks = proj.openAsks.filter(a => !a.done);
    try {
      const text = await askClaude({
        maxTokens: 700,
        system: "You are a consulting engagement manager. Generate concise, confident talking points for presenting a project status dashboard to a client. Return 4-5 bullet points as plain text, each starting with '•'. No headers, no markdown, no preamble.",
        prompt: `Generate talking points:\nProject: ${proj.name}\nClient: ${proj.client}\nRAG: ${proj.rag}\nSummary: ${proj.execSummary || "Not provided"}\nBudget: $${proj.spent.toLocaleString()} of $${proj.budget.toLocaleString()} (${pct(proj.spent, proj.budget)}%)\nMilestones: ${milDone}/${proj.milestones.length} complete\nOpen Risks: ${openRisks.map(r => r.item).join(", ") || "None"}\nOpen Asks: ${openAsks.map(a => a.ask).join(", ") || "None"}\nFocus: what's going well, what needs client attention, next steps, risks to flag.`,
      });
      onSave(text); // only overwrite existing notes when generation actually produced text
    } catch (e) {
      setError(e.message === MISSING_KEY_MSG ? MISSING_KEY_MSG : report("Could not generate talking points", e));
    } finally {
      setLoading(false);
    }
  };
  return <Card className="mb-6">
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2"><Mic className="w-4 h-4 text-blue-400" />Talking Points <span className="text-xs text-gray-400 font-normal">· speaker notes</span></h2>
      <button onClick={generate} disabled={loading} className={`print:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${loading ? "bg-gray-100 text-gray-400" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
        {loading ? "Generating…" : "✦ Generate with AI"}
      </button>
    </div>
    {error && <p className="text-xs text-amber-600 bg-amber-50 rounded-lg p-2 mb-3">{error}</p>}
    <TA value={talkingPoints} onSave={onSave} rows={5} placeholder="Click 'Generate with AI' or type your own speaker notes…" />
  </Card>;
}

// ── EXPORTS ────────────────────────────────────────────────────────────────────
function exportCSV(proj) {
  const q = s => `"${String(s || "").replace(/"/g, '""')}"`;
  const rows = [
    ["Project", proj.name], ["Client", proj.client], ["Lead", proj.lead],
    ["RAG", proj.rag], ["Meeting Date", proj.meetingDate], ["Revision", proj.revision],
    ["Confidential", proj.confidential ? "Yes" : "No"],
    ["Budget", proj.budget], ["Spent", proj.spent], ["Remaining", proj.budget - proj.spent], [],
    ["EXEC SUMMARY"], [q(proj.execSummary)], [],
    ["TALKING POINTS"], [q(proj.talkingPoints)], [],
    ["TASKS"], ["Task", "Owner", "Due", "Status"], ...proj.tasks.map(t => [q(t.name), t.owner, t.due, t.status]), [],
    ["MILESTONES"], ["Milestone", "Date", "Done"], ...proj.milestones.map(m => [q(m.name), m.date, m.done ? "Yes" : "No"]), [],
    ["DELIVERABLES"], ["Deliverable", "Status", "Due"], ...proj.deliverables.map(d => [q(d.name), d.status, d.due]), [],
    ["RISKS"], ["Flag", "Risk", "Owner", "Mitigation"], ...proj.risks.map(r => [r.flag, q(r.item), r.owner, q(r.mitigation)]), [],
    ["DECISIONS"], ["Date", "Decision", "Made By"], ...proj.decisions.map(d => [d.date, q(d.decision), d.madeBy]), [],
    ["OPEN ASKS"], ["Ask", "Asked Of", "Due By", "Done"], ...proj.openAsks.map(a => [q(a.ask), a.askedOf, a.dueBy, a.done ? "Yes" : "No"]),
  ];
  downloadBlob(new Blob([rows.map(r => r.join(",")).join("\n")], { type: "text/csv" }), `${proj.client.replace(/\s+/g, "_")}_${proj.name.replace(/\s+/g, "_")}.csv`);
}

// Downloads a blob and releases the object URL. Throws if the browser blocks it.
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  try {
    const a = Object.assign(document.createElement("a"), { href: url, download: filename });
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}

function exportExcel(proj) {
  const wb = XLSX.utils.book_new();
  const add = (name, data) => XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(data), name);
  add("Summary", [["Project", proj.name], ["Client", proj.client], ["Lead", proj.lead], ["RAG", proj.rag], ["Meeting Date", proj.meetingDate], ["Revision", proj.revision], ["Confidential", proj.confidential ? "Yes" : "No"], ["Budget", proj.budget], ["Spent", proj.spent], ["Remaining", proj.budget - proj.spent], [], ["Executive Summary"], [proj.execSummary], [], ["Talking Points"], [proj.talkingPoints]]);
  add("Tasks", [["Task", "Owner", "Due", "Status"], ...proj.tasks.map(t => [t.name, t.owner, t.due, t.status])]);
  add("Milestones", [["Milestone", "Date", "Done"], ...proj.milestones.map(m => [m.name, m.date, m.done ? "Yes" : "No"])]);
  add("Deliverables", [["Deliverable", "Status", "Due"], ...proj.deliverables.map(d => [d.name, d.status, d.due])]);
  add("Risks", [["Flag", "Risk", "Owner", "Mitigation"], ...proj.risks.map(r => [r.flag, r.item, r.owner, r.mitigation])]);
  add("Decisions", [["Date", "Decision", "Made By"], ...proj.decisions.map(d => [d.date, d.decision, d.madeBy])]);
  add("Open Asks", [["Ask", "Asked Of", "Due By", "Done"], ...proj.openAsks.map(a => [a.ask, a.askedOf, a.dueBy, a.done ? "Yes" : "No"])]);
  XLSX.writeFile(wb, `${proj.client.replace(/\s+/g, "_")}_${proj.name.replace(/\s+/g, "_")}.xlsx`);
}

async function exportPPT(proj, updatedAt, consultant) {
  const warnings = [];
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  const DARK = "1e2a3a", ACCENT = "3b82f6", LIGHT = "f8fafc", GRAY = "64748b", RED = "dc2626";
  const ragColor = { Green: "10b981", Amber: "f59e0b", Red: "ef4444" };
  const milDone = proj.milestones.filter(m => m.done).length;
  const budPct = pct(proj.spent, proj.budget);
  const yOff = proj.confidential ? 0.45 : 0;

  const confBar = (s) => {
    if (!proj.confidential) return;
    s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.35, fill: { color: RED }, line: { color: RED } });
    s.addText("CONFIDENTIAL — NOT FOR DISTRIBUTION", { x: 0, y: 0, w: "100%", h: 0.35, fontSize: 9, bold: true, color: "FFFFFF", align: "center" });
  };
  const footerBar = (s) => {
    s.addText(`${consultant.name}${consultant.firm ? " · " + consultant.firm : ""} · ${updatedAt}${proj.revision ? " · Rev. " + proj.revision : ""}`, { x: 0.5, y: 7.0, w: 12, h: 0.25, fontSize: 8, color: "9ca3af", align: "right" });
  };

  // Slide 1 — Cover
  let s = pptx.addSlide();
  s.background = { color: DARK };
  confBar(s);
  const addLogo = (slide, data, x, label) => {
    if (!data) return;
    try { slide.addImage({ data, x, y: 0.4 + yOff, w: 2, h: 0.7, sizing: { type: "contain", w: 2, h: 0.7 } }); }
    catch (e) { warnings.push(report(`${label} logo could not be embedded in the deck`, e)); }
  };
  addLogo(s, proj.clientLogoDataUrl, 10.5, "Client");
  addLogo(s, consultant.logoDataUrl, 0.5, "Your");
  s.addText(proj.name, { x: 0.5, y: 1.6 + yOff, w: 12, h: 1.1, fontSize: 34, bold: true, color: "FFFFFF" });
  s.addText(proj.client, { x: 0.5, y: 2.75 + yOff, w: 8, h: 0.4, fontSize: 16, color: "94a3b8" });
  const meta = [proj.meetingDate && `Meeting: ${proj.meetingDate}`, proj.revision && `Rev. ${proj.revision}`, `As of ${updatedAt}`].filter(Boolean).join("  ·  ");
  s.addText(meta, { x: 0.5, y: 3.2 + yOff, w: 12, h: 0.3, fontSize: 11, color: "475569" });
  s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 3.65 + yOff, w: 1.8, h: 0.38, fill: { color: ragColor[proj.rag] || "64748b" }, line: { color: "transparent" } });
  s.addText(proj.rag, { x: 0.5, y: 3.65 + yOff, w: 1.8, h: 0.38, fontSize: 12, bold: true, color: "FFFFFF", align: "center" });
  s.addText(proj.execSummary || "", { x: 0.5, y: 4.2 + yOff, w: 12, h: 1.2, fontSize: 13, color: "cbd5e1", wrap: true });
  footerBar(s);

  // Slide 2 — Talking Points
  if (proj.talkingPoints) {
    s = pptx.addSlide(); s.background = { color: LIGHT }; confBar(s);
    s.addText("Talking Points", { x: 0.5, y: 0.35 + yOff, w: 12, h: 0.5, fontSize: 22, bold: true, color: DARK });
    s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 0.95 + yOff, w: 0.06, h: 5, fill: { color: ACCENT }, line: { color: "transparent" } });
    s.addText(proj.talkingPoints, { x: 0.7, y: 0.95 + yOff, w: 11.8, h: 5, fontSize: 13, color: "374151", wrap: true, valign: "top" });
    footerBar(s);
  }

  // Slide 3 — KPIs
  s = pptx.addSlide(); s.background = { color: LIGHT }; confBar(s);
  s.addText("Project Snapshot", { x: 0.5, y: 0.35 + yOff, w: 12, h: 0.5, fontSize: 22, bold: true, color: DARK });
  [{ label: "Budget", val: `$${proj.budget.toLocaleString()}`, sub: `$${proj.spent.toLocaleString()} spent` }, { label: "Remaining", val: `$${(proj.budget - proj.spent).toLocaleString()}`, sub: `${100 - budPct}% left` }, { label: "Milestones", val: `${milDone}/${proj.milestones.length}`, sub: `${pct(milDone, proj.milestones.length)}% done` }, { label: "Open Tasks", val: String(proj.tasks.filter(t => t.status !== "Done" && t.status !== "Complete").length), sub: `of ${proj.tasks.length}` }].forEach((k, i) => {
    const x = 0.4 + i * 3.15;
    s.addShape(pptx.ShapeType.rect, { x, y: 1.1 + yOff, w: 2.9, h: 1.5, fill: { color: "FFFFFF" }, line: { color: "e2e8f0", pt: 1 } });
    s.addText(k.label, { x, y: 1.2 + yOff, w: 2.9, h: 0.3, fontSize: 10, color: GRAY, align: "center" });
    s.addText(k.val, { x, y: 1.5 + yOff, w: 2.9, h: 0.7, fontSize: 28, bold: true, color: DARK, align: "center" });
    s.addText(k.sub, { x, y: 2.2 + yOff, w: 2.9, h: 0.28, fontSize: 10, color: GRAY, align: "center" });
  });
  s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.9 + yOff, w: 12, h: 0.28, fill: { color: "e2e8f0" }, line: { color: "e2e8f0" } });
  if (budPct > 0) s.addShape(pptx.ShapeType.rect, { x: 0.5, y: 2.9 + yOff, w: Math.max(0.1, 12 * budPct / 100), h: 0.28, fill: { color: budPct > 90 ? "ef4444" : budPct > 70 ? "f59e0b" : "10b981" }, line: { color: "transparent" } });
  s.addText(`Budget: ${budPct}% utilized  ·  $${proj.spent.toLocaleString()} of $${proj.budget.toLocaleString()}`, { x: 0.5, y: 3.25 + yOff, w: 12, h: 0.25, fontSize: 10, color: GRAY });
  footerBar(s);

  // Slide 4 — Milestones + Deliverables
  s = pptx.addSlide(); s.background = { color: LIGHT }; confBar(s);
  s.addText("Milestones & Deliverables", { x: 0.5, y: 0.35 + yOff, w: 12, h: 0.5, fontSize: 22, bold: true, color: DARK });
  proj.milestones.slice(0, 8).forEach((m, i) => {
    const y = 1.05 + yOff + i * 0.45;
    s.addShape(pptx.ShapeType.ellipse, { x: 0.5, y: y + 0.06, w: 0.22, h: 0.22, fill: { color: m.done ? "10b981" : "e2e8f0" }, line: { color: m.done ? "10b981" : "cbd5e1" } });
    s.addText(`${m.name}${m.date ? "  ·  " + m.date : ""}`, { x: 0.85, y, w: 5.5, h: 0.35, fontSize: 11, color: m.done ? GRAY : DARK, strike: m.done });
  });
  if (proj.deliverables.length) {
    s.addText("Deliverables", { x: 7, y: 0.95 + yOff, w: 5.5, h: 0.35, fontSize: 13, bold: true, color: DARK });
    proj.deliverables.slice(0, 8).forEach((d, i) => {
      s.addText(d.name, { x: 7, y: 1.4 + yOff + i * 0.45, w: 3.5, h: 0.35, fontSize: 11, color: DARK });
      s.addText(d.status, { x: 10.6, y: 1.4 + yOff + i * 0.45, w: 1.8, h: 0.3, fontSize: 10, color: GRAY, align: "right" });
    });
  }
  footerBar(s);

  // Slide 5 — Risks + Open Asks
  if (proj.risks.length || proj.openAsks.filter(a => !a.done).length) {
    s = pptx.addSlide(); s.background = { color: LIGHT }; confBar(s);
    s.addText("Risks & Open Asks", { x: 0.5, y: 0.35 + yOff, w: 12, h: 0.5, fontSize: 22, bold: true, color: DARK });
    proj.risks.slice(0, 5).forEach((r, i) => {
      const y = 1.05 + yOff + i * 0.72;
      s.addShape(pptx.ShapeType.rect, { x: 0.5, y, w: 0.65, h: 0.28, fill: { color: ragColor[r.flag] || "64748b" }, line: { color: "transparent" } });
      s.addText(r.flag, { x: 0.5, y, w: 0.65, h: 0.28, fontSize: 9, bold: true, color: "FFFFFF", align: "center" });
      s.addText(r.item, { x: 1.3, y, w: 5, h: 0.28, fontSize: 11, color: DARK });
      s.addText(`Mitigation: ${r.mitigation}`, { x: 1.3, y: y + 0.3, w: 5, h: 0.26, fontSize: 9, color: GRAY });
    });
    const oa = proj.openAsks.filter(a => !a.done);
    if (oa.length) {
      s.addText("Open Asks from Client", { x: 7, y: 0.95 + yOff, w: 5.5, h: 0.35, fontSize: 13, bold: true, color: DARK });
      oa.slice(0, 5).forEach((a, i) => {
        s.addText(`• ${a.ask}`, { x: 7, y: 1.4 + yOff + i * 0.56, w: 5.5, h: 0.3, fontSize: 11, color: DARK });
        s.addText(`${a.askedOf}${a.dueBy ? "  ·  Due " + a.dueBy : ""}`, { x: 7, y: 1.72 + yOff + i * 0.56, w: 5.5, h: 0.24, fontSize: 9, color: GRAY });
      });
    }
    footerBar(s);
  }

  // Slide 6 — Decision Log
  if (proj.decisions.length) {
    s = pptx.addSlide(); s.background = { color: LIGHT }; confBar(s);
    s.addText("Decision Log", { x: 0.5, y: 0.35 + yOff, w: 12, h: 0.5, fontSize: 22, bold: true, color: DARK });
    proj.decisions.slice(0, 8).forEach((d, i) => {
      const y = 1.05 + yOff + i * 0.65;
      s.addText(d.date, { x: 0.5, y, w: 1.5, h: 0.28, fontSize: 10, color: GRAY });
      s.addText(d.decision, { x: 2.2, y, w: 8, h: 0.28, fontSize: 11, color: DARK });
      s.addText(`— ${d.madeBy}`, { x: 2.2, y: y + 0.3, w: 8, h: 0.24, fontSize: 9, color: GRAY });
    });
    footerBar(s);
  }

  await pptx.writeFile({ fileName: `${proj.client.replace(/\s+/g, "_")}_${proj.name.replace(/\s+/g, "_")}_status.pptx` });
  return warnings;
}

function buildClientHTML(proj, updatedAt, consultant) {
  const ragBg = { Green: "#d1fae5", Amber: "#fef3c7", Red: "#fee2e2" };
  const ragTxt = { Green: "#065f46", Amber: "#92400e", Red: "#991b1b" };
  const scBg = { "Done": "#d1fae5", "Complete": "#d1fae5", "In Progress": "#dbeafe", "In Review": "#dbeafe", "Not Started": "#f3f4f6", "Planning": "#fef3c7" };
  const scTxt = { "Done": "#065f46", "Complete": "#065f46", "In Progress": "#1e40af", "In Review": "#1e40af", "Not Started": "#6b7280", "Planning": "#92400e" };
  const badge = v => `<span style="background:${scBg[v]||"#f3f4f6"};color:${scTxt[v]||"#6b7280"};padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600">${v}</span>`;
  const p = pct(proj.spent, proj.budget);
  const barCol = p > 90 ? "#ef4444" : p > 70 ? "#f59e0b" : "#10b981";
  const milDone = proj.milestones.filter(m => m.done).length;
  const confBanner = proj.confidential ? `<div style="background:#dc2626;color:#fff;text-align:center;padding:8px 0;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase">⚠ Confidential — Not for Distribution</div>` : "";
  const meta = [proj.meetingDate && `Meeting: ${proj.meetingDate}`, proj.revision && `Rev. ${proj.revision}`].filter(Boolean).join("  ·  ");
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${proj.name} — ${proj.client}${proj.confidential?" [CONFIDENTIAL]":""}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'Inter',system-ui,sans-serif;background:#f1f5f9;color:#111827}
.topbar{background:#1e2a3a;padding:14px 32px;display:flex;align-items:center;justify-content:space-between}
.topbar-left{display:flex;align-items:center;gap:12px}.topbar-left img{height:36px;max-width:110px;object-fit:contain}
.topbar-title{color:#fff;font-size:14px;font-weight:600}.topbar-sub{color:#64748b;font-size:11px;margin-top:1px}
.topbar-right img{height:32px;max-width:90px;object-fit:contain}
.wrap{max-width:900px;margin:0 auto;padding:32px 24px}
.header{background:#fff;border-radius:16px;border:1px solid #e2e8f0;padding:28px 32px;margin-bottom:24px;box-shadow:0 1px 3px rgba(0,0,0,.06)}
.hrow{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px}
.header h1{font-size:22px;font-weight:700;color:#0f172a}.sub{font-size:13px;color:#64748b;margin-top:4px}
.rag{display:inline-block;padding:4px 14px;border-radius:999px;font-size:12px;font-weight:700;margin-top:12px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:24px}
.grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}
.card{background:#fff;border-radius:12px;border:1px solid #e2e8f0;padding:20px;box-shadow:0 1px 2px rgba(0,0,0,.04)}
.card h2{font-size:13px;font-weight:600;color:#374151;margin-bottom:12px}
.kpi-val{font-size:26px;font-weight:700;color:#0f172a}.kpi-sub{font-size:11px;color:#94a3b8;margin-top:2px}
table{width:100%;border-collapse:collapse;font-size:13px}th{text-align:left;font-size:11px;color:#94a3b8;font-weight:500;padding-bottom:8px;border-bottom:1px solid #f1f5f9}
td{padding:8px 0;border-bottom:1px solid #f8fafc;color:#374151;vertical-align:top}
.ms-row{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px}
.ms-dot{width:16px;height:16px;border-radius:50%;border:2px solid #d1d5db;margin-top:2px;flex-shrink:0}.ms-done{background:#10b981;border-color:#10b981}
.row{padding:8px 0;border-bottom:1px solid #f8fafc}
.tp{background:#f8fafc;border-left:3px solid #3b82f6;padding:14px 18px;border-radius:0 8px 8px 0;font-size:13px;color:#374151;line-height:1.9;white-space:pre-wrap}
.footer{text-align:center;font-size:11px;color:#cbd5e1;margin-top:40px;padding-bottom:24px}
@media(max-width:640px){.grid4{grid-template-columns:1fr 1fr}.grid2{grid-template-columns:1fr}.topbar{padding:10px 16px}}
</style></head><body>
${confBanner}
<div class="topbar">
  <div class="topbar-left">
    ${consultant.logoDataUrl ? `<img src="${consultant.logoDataUrl}" alt="logo" />` : ""}
    <div><div class="topbar-title">${consultant.name}${consultant.firm ? " · " + consultant.firm : ""}</div><div class="topbar-sub">Project Status Report</div></div>
  </div>
  ${proj.clientLogoDataUrl ? `<div class="topbar-right"><img src="${proj.clientLogoDataUrl}" alt="client logo" /></div>` : ""}
</div>
<div class="wrap">
<div class="header">
  <div class="hrow">
    <div><h1>${proj.name}</h1><div class="sub">${proj.client} · Lead: ${proj.lead}${meta ? " · " + meta : ""} · As of ${updatedAt}</div>
    <span class="rag" style="background:${ragBg[proj.rag]||"#f3f4f6"};color:${ragTxt[proj.rag]||"#374151"}">${proj.rag}</span></div>
  </div>
  <div style="margin-top:16px;font-size:13px;color:#4b5563;line-height:1.7">${proj.execSummary || "<em style='color:#d1d5db'>No summary provided.</em>"}</div>
</div>
${proj.talkingPoints ? `<div class="card" style="margin-bottom:24px"><h2>🎙 Talking Points</h2><div class="tp">${proj.talkingPoints}</div></div>` : ""}
<div class="grid4">
  <div class="card"><div style="font-size:11px;color:#64748b;font-weight:500;margin-bottom:6px">Budget Remaining</div><div class="kpi-val">$${(proj.budget-proj.spent).toLocaleString()}</div><div class="kpi-sub">${100-p}% left</div></div>
  <div class="card"><div style="font-size:11px;color:#64748b;font-weight:500;margin-bottom:6px">Budget Used</div><div class="kpi-val">$${proj.spent.toLocaleString()}</div><div class="kpi-sub">of $${proj.budget.toLocaleString()}</div></div>
  <div class="card"><div style="font-size:11px;color:#64748b;font-weight:500;margin-bottom:6px">Milestones</div><div class="kpi-val">${milDone}/${proj.milestones.length}</div><div class="kpi-sub">${pct(milDone,proj.milestones.length)}% complete</div></div>
  <div class="card"><div style="font-size:11px;color:#64748b;font-weight:500;margin-bottom:6px">Open Tasks</div><div class="kpi-val">${proj.tasks.filter(t=>t.status!=="Done"&&t.status!=="Complete").length}</div><div class="kpi-sub">${proj.tasks.length} total</div></div>
</div>
${proj.budget>0?`<div style="margin-bottom:24px"><div style="font-size:11px;color:#64748b;font-weight:500;margin-bottom:8px">Budget: $${proj.spent.toLocaleString()} of $${proj.budget.toLocaleString()} (${p}%)</div><div style="background:#f1f5f9;border-radius:999px;height:8px"><div style="background:${barCol};height:8px;border-radius:999px;width:${p}%"></div></div></div>`:""}
<div class="grid2">
  <div class="card"><h2>Milestones</h2>${proj.milestones.length?proj.milestones.map(m=>`<div class="ms-row"><div class="ms-dot${m.done?" ms-done":""}"></div><div><div style="font-size:13px;color:${m.done?"#9ca3af":"#374151"};${m.done?"text-decoration:line-through":""}">${m.name}</div><div style="font-size:11px;color:#9ca3af">${m.date}</div></div></div>`).join(""):`<div style="border:2px dashed #f1f5f9;border-radius:8px;padding:16px;text-align:center;font-size:12px;color:#d1d5db">No milestones added</div>`}</div>
  <div class="card"><h2>Deliverables</h2>${proj.deliverables.length?`<table><thead><tr><th>Output</th><th>Due</th><th>Status</th></tr></thead><tbody>${proj.deliverables.map(d=>`<tr><td>${d.name}</td><td style="color:#64748b">${d.due}</td><td>${badge(d.status)}</td></tr>`).join("")}</tbody></table>`:`<div style="border:2px dashed #f1f5f9;border-radius:8px;padding:16px;text-align:center;font-size:12px;color:#d1d5db">No deliverables added</div>`}</div>
</div>
<div class="grid2">
  <div class="card"><h2>Risk Log</h2>${proj.risks.length?proj.risks.map(r=>`<div class="row"><div style="display:flex;align-items:center;gap:8px;margin-bottom:4px"><span style="background:${ragBg[r.flag]||"#f3f4f6"};color:${ragTxt[r.flag]||"#374151"};padding:1px 8px;border-radius:999px;font-size:11px;font-weight:600">${r.flag}</span><span style="font-size:13px;color:#374151">${r.item}</span></div><div style="font-size:11px;color:#94a3b8">Owner: ${r.owner}${r.mitigation?" · "+r.mitigation:""}</div></div>`).join(""):`<div style="border:2px dashed #f1f5f9;border-radius:8px;padding:16px;text-align:center;font-size:12px;color:#d1d5db">No risks logged</div>`}</div>
  <div class="card"><h2>Open Asks from Client</h2>${proj.openAsks.length?proj.openAsks.map(a=>`<div class="row" style="display:flex;align-items:flex-start;gap:8px"><div style="width:14px;height:14px;border-radius:50%;background:${a.done?"#10b981":"#e2e8f0"};margin-top:2px;flex-shrink:0"></div><div><div style="font-size:13px;color:${a.done?"#94a3b8":"#374151"};${a.done?"text-decoration:line-through":""}">${a.ask}</div><div style="font-size:11px;color:#94a3b8">${a.askedOf}${a.dueBy?" · Due "+a.dueBy:""}</div></div></div>`).join(""):`<div style="border:2px dashed #f1f5f9;border-radius:8px;padding:16px;text-align:center;font-size:12px;color:#d1d5db">No open asks</div>`}</div>
</div>
${proj.decisions.length?`<div class="card" style="margin-bottom:24px"><h2>Decision Log</h2><table><thead><tr><th>Date</th><th>Decision</th><th>Made By</th></tr></thead><tbody>${proj.decisions.map(d=>`<tr><td style="color:#64748b;white-space:nowrap;width:100px">${d.date}</td><td>${d.decision}</td><td style="color:#64748b">${d.madeBy}</td></tr>`).join("")}</tbody></table></div>`:""}
<div class="footer">Prepared by ${consultant.name}${consultant.firm?" · "+consultant.firm:""} · ${proj.client}${proj.revision?" · Rev. "+proj.revision:""} · ${updatedAt}${proj.confidential?" · CONFIDENTIAL":""}</div>
</div>${confBanner}</body></html>`;
}

// Throws rather than falling back to the bare page URL — a link that silently
// carries no project data looks fine but shows the client nothing.
function buildShareURL(proj) {
  return `${window.location.href.split("?")[0]}?view=${btoa(encodeURIComponent(JSON.stringify({ ...proj, clientLogoDataUrl: "" })))}`;
}

// ── SHARE MODAL ────────────────────────────────────────────────────────────────
function ShareModal({ proj, updatedAt, consultant, onClose }) {
  const [copied, setCopied] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");

  let shareURL = "";
  let shareURLError = "";
  try { shareURL = buildShareURL(proj); }
  catch (e) { shareURLError = report("Could not build a share link for this project", e); }

  const copyLink = async () => {
    setError("");
    try {
      if (!shareURL) throw new Error(shareURLError);
      if (!navigator.clipboard) throw new Error("This browser blocks clipboard access — select the link and copy it manually.");
      await navigator.clipboard.writeText(shareURL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setError(report("Could not copy the link", e));
    }
  };

  const downloadHTML = () => {
    setError("");
    try {
      const html = buildClientHTML(proj, updatedAt, consultant);
      downloadBlob(new Blob([html], { type: "text/html" }), `${proj.client.replace(/\s+/g,"_")}_${proj.name.replace(/\s+/g,"_")}_status.html`);
    } catch (e) {
      setError(report("HTML download failed", e));
    }
  };

  const openGmail = (subject, body) => {
    const win = window.open(`https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(emailTo)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`, "_blank");
    if (!win) throw new Error("Gmail did not open — allow pop-ups for this site and try again.");
  };

  const sendEmail = async () => {
    if (!emailTo.trim()) return;
    setSending(true); setError(""); setWarning("");
    const linkLine = shareURL ? "\n\nFull dashboard: " + shareURL : "";
    let subject = `${proj.name} — Status Update`;
    let body = proj.execSummary || "";
    try {
      const text = await askClaude({
        maxTokens: 600,
        system: "Draft a concise professional project status email. Return ONLY JSON with keys: subject, body. No markdown.",
        prompt: `Status email. Project: ${proj.name}. Client: ${proj.client}. RAG: ${proj.rag}. Summary: ${proj.execSummary}. Milestones: ${proj.milestones.filter(m=>m.done).length}/${proj.milestones.length}. Budget: $${proj.spent}/$${proj.budget}. Under 150 words. Sign off as ${consultant.name}.`,
      });
      try {
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        subject = parsed.subject || subject;
        body = parsed.body || text;
      } catch (e) {
        // The model answered but not as JSON — usable, so keep the text and say so.
        body = text;
        setWarning(report("AI draft was not valid JSON, using its raw text", e));
      }
    } catch (e) {
      // Drafting is optional; fall back to the exec summary but tell the user why.
      setWarning(e.message === MISSING_KEY_MSG ? `${MISSING_KEY_MSG} Opened Gmail with your executive summary instead.` : report("AI draft failed — opened Gmail with your executive summary instead", e));
    }
    try {
      openGmail(subject, body + linkLine);
      setEmailSent(true);
    } catch (e) {
      setError(report("Could not open Gmail", e));
    }
    setSending(false);
  };
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
      <div className="flex items-center justify-between mb-4"><div className="flex items-center gap-2"><Share2 className="w-5 h-5 text-gray-600" /><h2 className="text-base font-semibold text-gray-800">Share with Client</h2></div><button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button></div>
      <div className="text-sm font-semibold text-gray-800 mb-0.5">{proj.name} — {proj.client}</div>
      <div className="text-xs text-gray-400 mb-3">{updatedAt}{proj.revision ? ` · Rev. ${proj.revision}` : ""}</div>
      {proj.confidential && <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg mb-3 text-xs text-red-700 font-medium"><AlertTriangle className="w-3.5 h-3.5" />Confidential — watermark on all exports</div>}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4 text-xs text-amber-700">Internal Notes are excluded. Review Risk Log before sharing.</div>
      {(error || shareURLError) && <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-3 text-xs text-red-700">{error || shareURLError}</div>}
      {warning && <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-3 text-xs text-amber-700">{warning}</div>}
      {[
        { icon: <Link className="w-4 h-4 text-blue-500" />, title: "Shareable Link", desc: "Read-only snapshot URL.", action: <div className="flex gap-2"><input readOnly value={shareURL} placeholder="Unavailable" className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 truncate" /><button onClick={copyLink} disabled={!shareURL} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium shrink-0 disabled:opacity-50 ${copied ? "bg-emerald-500 text-white" : "bg-gray-800 text-white hover:bg-gray-700"}`}>{copied ? <><Check className="w-3.5 h-3.5" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy</>}</button></div> },
        { icon: <Mail className="w-4 h-4 text-purple-500" />, title: "Send via Gmail", desc: "AI-drafts a status email.", action: <div className="flex gap-2"><input value={emailTo} onChange={e => setEmailTo(e.target.value)} placeholder="client@email.com" className="flex-1 text-xs border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-blue-300" /><button onClick={sendEmail} disabled={sending || !emailTo.trim()} className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium shrink-0 ${emailSent ? "bg-emerald-500 text-white" : sending ? "bg-gray-200 text-gray-400" : "bg-purple-600 text-white hover:bg-purple-700"} disabled:opacity-50`}>{emailSent ? "Opened" : sending ? "Drafting…" : <><ExternalLink className="w-3.5 h-3.5" />Gmail</>}</button></div> },
        { icon: <FileDown className="w-4 h-4 text-emerald-500" />, title: "HTML File", desc: "Standalone, opens in any browser. Safe to attach.", action: <button onClick={downloadHTML} className="flex items-center gap-2 w-full justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"><Download className="w-3.5 h-3.5" />Download HTML</button> },
      ].map((s, i) => <div key={i} className="border border-gray-200 rounded-xl p-4 mb-3 last:mb-0">
        <div className="flex items-center gap-2 mb-1">{s.icon}<span className="text-sm font-medium text-gray-700">{s.title}</span></div>
        <p className="text-xs text-gray-400 mb-3">{s.desc}</p>
        {s.action}
      </div>)}
    </div>
  </div>;
}

// ── PANEL SETTINGS ─────────────────────────────────────────────────────────────
function PanelSettings({ panels, onChange }) {
  const [open, setOpen] = useState(false);
  return <div className="relative">
    <button onClick={() => setOpen(o => !o)} className="flex items-center gap-1.5 px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 text-white text-sm rounded-lg hover:bg-opacity-20 transition-colors">
      <Eye className="w-4 h-4" /> Panels <ChevronDown className="w-3 h-3" />
    </button>
    {open && <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 w-72">
      <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Toggle Panels</p>
      <div className="space-y-2">
        {Object.entries(PANEL_LABELS).map(([key, label]) => <label key={key} className="flex items-center gap-2 cursor-pointer group">
          <input type="checkbox" checked={panels[key]} onChange={e => onChange(key, e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700">{label}</span>
          {panels[key] ? <Eye className="w-3.5 h-3.5 text-gray-300 ml-auto" /> : <EyeOff className="w-3.5 h-3.5 text-gray-300 ml-auto" />}
        </label>)}
      </div>
      <button onClick={() => setOpen(false)} className="mt-3 w-full text-xs text-gray-400 text-center py-1">Done</button>
    </div>}
  </div>;
}

// ── DRAG TABLE ─────────────────────────────────────────────────────────────────
function DragTable({ tasks, onUpdate, onDelete, onAdd, onReorder }) {
  const dragIdx = useRef(null); const [dragOver, setDragOver] = useState(null);
  const start = (e, i) => { dragIdx.current = i; };
  const over = (e, i) => { e.preventDefault(); setDragOver(i); };
  const drop = (e, i) => { e.preventDefault(); if (dragIdx.current !== null && dragIdx.current !== i) { const r = [...tasks]; const [m] = r.splice(dragIdx.current, 1); r.splice(i, 0, m); onReorder(r); } dragIdx.current = null; setDragOver(null); };
  return <Card>
    <SH title={<>Tasks <span className="text-xs text-gray-400 font-normal ml-1">· drag to reorder</span></>} onAdd={onAdd} addLabel="Add task" />
    {tasks.length === 0 ? <Empty label="No tasks yet — click Add task to start" /> :
    <div className="overflow-x-auto"><table className="w-full text-sm">
      <thead><tr className="text-left text-xs text-gray-400 border-b border-gray-100"><th className="pb-2 w-5" /><th className="pb-2 font-medium">Task</th><th className="pb-2 font-medium">Owner</th><th className="pb-2 font-medium">Due</th><th className="pb-2 font-medium">Status</th><th className="pb-2 w-5" /></tr></thead>
      <tbody>{tasks.map((t, i) => <tr key={t.id} draggable onDragStart={e => start(e, i)} onDragOver={e => over(e, i)} onDrop={e => drop(e, i)} onDragEnd={() => { dragIdx.current = null; setDragOver(null); }} className={`border-b border-gray-50 last:border-0 group transition-colors ${dragOver === i ? "bg-blue-50" : ""}`}>
        <td className="py-2.5"><GripVertical className="w-3.5 h-3.5 text-gray-300 cursor-grab group-hover:text-gray-400" /></td>
        <td className="py-2.5"><IT value={t.name} onSave={v => onUpdate(t.id,"name",v)} wide /></td>
        <td className="py-2.5 text-gray-500"><IT value={t.owner} onSave={v => onUpdate(t.id,"owner",v)} /></td>
        <td className="py-2.5 text-gray-500"><IT value={t.due} onSave={v => onUpdate(t.id,"due",v)} placeholder="YYYY-MM-DD" /></td>
        <td className="py-2.5"><IS value={t.status} options={STATUS_OPTIONS} onSave={v => onUpdate(t.id,"status",v)} /></td>
        <td className="py-2.5 text-right"><button onClick={() => onDelete(t.id)} className="opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" /></button></td>
      </tr>)}</tbody>
    </table></div>}
  </Card>;
}

// ── MAIN ───────────────────────────────────────────────────────────────────────
const INIT_STATE = { dashTitle: "Project Dashboard", projects: [blankProject(1)], updatedAt: nowStr() };

export default function App() {
  const [state, setState] = useState(() => {
    const saved = loadState();
    if (!saved) return INIT_STATE;
    try { return hydrateState(saved); }
    catch (e) { console.error("Saved dashboard was unusable, starting from a blank project:", e); return INIT_STATE; }
  });
  const [consultant, setConsultant] = useState(loadConsultant);
  const [activeId, setActiveId] = useState(state.projects[0]?.id || 1);
  const [panels, setPanels] = useState(DEFAULT_PANELS);
  const [showShare, setShowShare] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [importErr, setImportErr] = useState("");
  // Persistence and action failures the user needs to know about
  const [localErr, setLocalErr] = useState(storageBlockedReason);
  const [cloudErr, setCloudErr] = useState("");
  const [actionErr, setActionErr] = useState("");
  const [actionWarn, setActionWarn] = useState("");
  const lastStateRef = useRef(state);

  // Load from Supabase on mount — overrides localStorage if cloud data exists
  useEffect(() => {
    loadFromSupabase()
      .then(cloudState => {
        if (!cloudState) return;
        const hydrated = hydrateState(cloudState);
        setState(hydrated);
        setActiveId(hydrated.projects[0].id);
        try { saveState(hydrated); } // localStorage cache
        catch (e) { setLocalErr(report("Could not cache the cloud dashboard locally", e)); }
      })
      .catch(e => setCloudErr(report("Could not load your cloud dashboard — showing the copy saved in this browser", e)));
    loadConsultantFromSupabase()
      .then(s => {
        if (!s) return;
        setConsultant(s);
        try { saveConsultant(s); }
        catch (e) { setLocalErr(report("Could not cache your branding locally", e)); }
      })
      .catch(e => setCloudErr(report("Could not load your cloud branding settings", e)));
  }, []);

  const { dashTitle, projects, updatedAt } = state;
  const proj = projects.find(p => p.id === activeId) || projects[0];

  // Update browser tab title
  useEffect(() => {
    document.title = proj ? `${proj.name} — ${proj.client}` : "Project Dashboard";
  }, [proj?.name, proj?.client]);

  const persist = (u) => {
    lastStateRef.current = u;
    try { saveState(u); setLocalErr(""); } // localStorage cache
    catch (e) { setLocalErr(report("Could not save to this browser — export a JSON backup", e)); }
    saveToSupabase(u) // cloud save
      .then(() => setCloudErr(""))
      .catch(e => setCloudErr(report("Cloud sync failed — changes are only in this browser", e)));
  };
  const retrySync = () => persist(lastStateRef.current);
  const touch = (ns) => {
    const u = { ...ns, updatedAt: nowStr() };
    setState(u);
    persist(u);
    setSaved(true); setTimeout(() => setSaved(false), 1500);
  };
  const setProjects = ps => touch({ ...state, projects: ps });
  const up = (field, value) => setProjects(projects.map(p => p.id === activeId ? { ...p, [field]: value } : p));
  const addProject = () => { const id = Date.now(); touch({ ...state, projects: [...projects, blankProject(id)] }); setActiveId(id); };
  const removeProject = id => { if (projects.length === 1) return; const ps = projects.filter(p => p.id !== id); touch({ ...state, projects: ps }); setActiveId(ps[0].id); };

  const updTask = (tid,f,v) => up("tasks", proj.tasks.map(t => t.id===tid ? {...t,[f]:v} : t));
  const updMile = (i,f,v) => up("milestones", proj.milestones.map((m,idx) => idx===i ? {...m,[f]:v} : m));
  const updDeliv = (tid,f,v) => up("deliverables", proj.deliverables.map(d => d.id===tid ? {...d,[f]:v} : d));
  const updRisk = (tid,f,v) => up("risks", proj.risks.map(r => r.id===tid ? {...r,[f]:v} : r));
  const updDec = (tid,f,v) => up("decisions", proj.decisions.map(d => d.id===tid ? {...d,[f]:v} : d));
  const updAsk = (tid,f,v) => up("openAsks", proj.openAsks.map(a => a.id===tid ? {...a,[f]:v} : a));
  const updMeet = (tid,f,v) => up("meetings", proj.meetings.map(m => m.id===tid ? {...m,[f]:v} : m));

  // Wraps an export so a failure is shown instead of dying in the console
  const runExport = async (label, fn) => {
    setActionErr(""); setActionWarn(""); setShowExport(false);
    try {
      const warnings = await fn();
      if (Array.isArray(warnings) && warnings.length) setActionWarn(warnings.join(" · "));
    } catch (e) {
      setActionErr(report(`${label} export failed`, e));
    }
  };
  const exportJSON = () => downloadBlob(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }), "dashboard_backup.json");
  const importJSON = e => {
    const file = e.target.files?.[0]; if (!file) return;
    e.target.value = "";
    setImportErr("");
    const r = new FileReader();
    r.onload = ev => {
      try {
        const imported = hydrateState(JSON.parse(ev.target.result));
        touch(imported);
        setActiveId(imported.projects[0].id);
        setShowExport(false);
      } catch (err) {
        setImportErr(report(`Could not import "${file.name}"`, err));
      }
    };
    r.onerror = () => setImportErr(report(`Could not read "${file.name}"`, r.error));
    r.readAsText(file);
  };

  const saveBranding = (c) => {
    setConsultant(c);
    try { saveConsultant(c); setLocalErr(""); }
    catch (e) { setLocalErr(report("Could not save your branding to this browser", e)); }
    saveConsultantToSupabase(c)
      .then(() => setCloudErr(""))
      .catch(e => setCloudErr(report("Branding did not reach the cloud — it is only in this browser", e)));
  };

  const milDone = proj.milestones.filter(m => m.done).length;
  const milPct = pct(milDone, proj.milestones.length);
  const budPct = pct(proj.spent, proj.budget);

  return (
    <div className="min-h-screen bg-slate-100 font-sans print:bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', system-ui, sans-serif; }
        @media print {
          .print\\:hidden { display: none !important; }
          .topbar-actions { display: none !important; }
          body { background: white; }
          .card { box-shadow: none; border: 1px solid #e2e8f0; }
        }
      `}</style>

      {showSettings && <ConsultantSettings consultant={consultant} onChange={saveBranding} onClose={() => setShowSettings(false)} />}
      {showShare && <ShareModal proj={proj} updatedAt={updatedAt} consultant={consultant} onClose={() => setShowShare(false)} />}

      {/* Confidential banner */}
      {proj.confidential && <ConfidentialBanner />}

      {/* Failure banners — never let a save, sync or export fail quietly */}
      {(cloudErr || localErr || actionErr || actionWarn) && <div className="print:hidden px-6 py-2 space-y-1">
        {localErr && <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span className="flex-1">{localErr}</span>
          <button onClick={() => setLocalErr("")} className="shrink-0"><X className="w-3.5 h-3.5" /></button>
        </div>}
        {cloudErr && <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-3 py-2">
          <CloudOff className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span className="flex-1">{cloudErr}</span>
          <button onClick={retrySync} className="shrink-0 font-medium underline">Retry</button>
          <button onClick={() => setCloudErr("")} className="shrink-0"><X className="w-3.5 h-3.5" /></button>
        </div>}
        {actionErr && <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span className="flex-1">{actionErr}</span>
          <button onClick={() => setActionErr("")} className="shrink-0"><X className="w-3.5 h-3.5" /></button>
        </div>}
        {actionWarn && <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" /><span className="flex-1">{actionWarn}</span>
          <button onClick={() => setActionWarn("")} className="shrink-0"><X className="w-3.5 h-3.5" /></button>
        </div>}
      </div>}

      {/* Top navigation bar */}
      <div className="bg-slate-800 text-white px-6 py-3 print:hidden sticky top-0 z-40 shadow-lg">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Left: logo + name */}
          <div className="flex items-center gap-3 min-w-0">
            {consultant.logoDataUrl
              ? <img src={consultant.logoDataUrl} alt="logo" className="h-8 max-w-24 object-contain rounded opacity-90" />
              : <div className="w-7 h-7 bg-white bg-opacity-10 rounded-lg flex items-center justify-center"><Building2 className="w-4 h-4 text-white opacity-60" /></div>}
            <div className="min-w-0">
              <IT value={dashTitle} onSave={v => touch({ ...state, dashTitle: v })} className="text-sm font-semibold text-white" placeholder="Dashboard Title" dark />
              <div className="text-xs text-slate-400 mt-0.5 hidden sm:flex items-center gap-2">
                <span>{consultant.name}{consultant.firm ? ` · ${consultant.firm}` : ""}</span>
                {supabase && !cloudErr
                  ? <span className="flex items-center gap-1 text-emerald-400"><Cloud className="w-3 h-3" />Cloud sync on</span>
                  : <span className="flex items-center gap-1 text-slate-500"><CloudOff className="w-3 h-3" />Local only</span>}
                {saved && !localErr && !cloudErr && <span className="text-emerald-400 flex items-center gap-0.5"><Check className="w-3 h-3" />Saved</span>}
                {(localErr || cloudErr) && <span className="text-red-400 flex items-center gap-0.5"><AlertTriangle className="w-3 h-3" />Not saved</span>}
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="topbar-actions flex items-center gap-2 flex-wrap">
            <PanelSettings panels={panels} onChange={(k,v) => setPanels(p => ({...p,[k]:v}))} />

            {/* Export dropdown */}
            <div className="relative">
              <button onClick={() => setShowExport(o => !o)} className="flex items-center gap-1.5 px-3 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 text-white text-sm rounded-lg hover:bg-opacity-20 transition-colors">
                <Download className="w-4 h-4" /> Export <ChevronDown className="w-3 h-3" />
              </button>
              {showExport && <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-4 w-52">
                <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Export</p>
                <div className="space-y-0.5">
                  {[
                    { label: "CSV", color: "text-gray-400", fn: () => runExport("CSV", () => exportCSV(proj)) },
                    { label: "Excel (.xlsx)", color: "text-emerald-500", fn: () => runExport("Excel", () => exportExcel(proj)) },
                    { label: "PowerPoint (.pptx)", color: "text-orange-500", fn: () => runExport("PowerPoint", () => exportPPT(proj, updatedAt, consultant)) },
                    { label: "PDF (print)", color: "text-red-400", fn: () => runExport("PDF", () => window.print()) },
                  ].map((x, i) => <button key={i} onClick={x.fn} className="flex items-center gap-2 w-full text-sm text-gray-700 hover:bg-gray-50 rounded-lg px-2 py-1.5">
                    <FileText className={`w-3.5 h-3.5 ${x.color}`} />{x.label}
                  </button>)}
                  <hr className="my-2 border-gray-100" />
                  <button onClick={() => runExport("JSON backup", exportJSON)} className="flex items-center gap-2 w-full text-sm text-gray-700 hover:bg-gray-50 rounded-lg px-2 py-1.5"><Save className="w-3.5 h-3.5 text-gray-400" />Backup (JSON)</button>
                  <label className="flex items-center gap-2 w-full text-sm text-gray-700 hover:bg-gray-50 rounded-lg px-2 py-1.5 cursor-pointer"><Upload className="w-3.5 h-3.5 text-gray-400" />Import backup<input type="file" accept=".json" className="hidden" onChange={importJSON} /></label>
                  <button onClick={() => { if (window.confirm("Reset all data?")) { touch(INIT_STATE); setActiveId(INIT_STATE.projects[0].id); setShowExport(false); } }} className="flex items-center gap-2 w-full text-sm text-red-400 hover:bg-red-50 rounded-lg px-2 py-1.5"><RefreshCw className="w-3.5 h-3.5" />Reset all</button>
                </div>
                {importErr && <p className="text-xs text-red-500 mt-2">{importErr}</p>}
              </div>}
            </div>

            <button onClick={() => setShowShare(true)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-lg transition-colors shadow-sm">
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button onClick={() => setShowSettings(true)} className="p-2 bg-white bg-opacity-10 border border-white border-opacity-20 text-white rounded-lg hover:bg-opacity-20 transition-colors" title="Your branding">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Project tabs bar */}
      <div className="bg-slate-700 px-6 py-2 print:hidden border-b border-slate-600">
        <div className="flex gap-2 items-center flex-wrap">
          {projects.map(p => (
            <div key={p.id} className={`flex items-center gap-0.5 rounded-lg transition-all ${activeId===p.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-600"}`}>
              <button onClick={() => setActiveId(p.id)} className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium">
                <span className={`w-2 h-2 rounded-full shrink-0 ${RAG_DOT[p.rag]||"bg-gray-400"}`} />
                <IT value={p.name} onSave={v => setProjects(projects.map(x => x.id===p.id ? {...x,name:v} : x))} className={activeId===p.id ? "text-slate-800" : "text-slate-300"} dark={activeId!==p.id} />
                {p.confidential && <AlertTriangle className={`w-3 h-3 shrink-0 ${activeId===p.id ? "text-red-500" : "text-red-400"}`} />}
              </button>
              {projects.length > 1 && <button onClick={() => removeProject(p.id)} className={`pr-2 ${activeId===p.id ? "text-slate-400 hover:text-red-500" : "text-slate-500 hover:text-red-400"}`}><X className="w-3 h-3" /></button>}
            </div>
          ))}
          <button onClick={addProject} className="flex items-center gap-1 px-3 py-1.5 text-xs text-slate-400 hover:text-white border border-dashed border-slate-600 hover:border-slate-400 rounded-lg transition-colors">
            <Plus className="w-3.5 h-3.5" /> New project
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-6 print:p-4 print:max-w-none">

        {/* Project header row */}
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <IS value={proj.rag} options={["Green","Amber","Red"]} onSave={v => up("rag",v)} colorMap={RAG_BADGE} />
              <IT value={proj.name} onSave={v => up("name",v)} className="text-xl font-bold text-slate-800" wide placeholder="Project name" />
              {proj.confidential && <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 border border-red-200 rounded-full text-xs font-semibold text-red-600"><AlertTriangle className="w-3 h-3" />Confidential</span>}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
              <span>Client: <IT value={proj.client} onSave={v => up("client",v)} className="text-gray-700 font-medium" placeholder="Client name" /></span>
              <span>Lead: <IT value={proj.lead} onSave={v => up("lead",v)} className="text-gray-700" /></span>
              <span>Start: <IT value={proj.startDate} onSave={v => up("startDate",v)} className="text-gray-700" placeholder="YYYY-MM-DD" /></span>
              <span>End: <IT value={proj.endDate} onSave={v => up("endDate",v)} className="text-gray-700" placeholder="YYYY-MM-DD" /></span>
              <span>Meeting: <IT value={proj.meetingDate} onSave={v => up("meetingDate",v)} className="text-gray-700" placeholder="YYYY-MM-DD" /></span>
              <span>Rev: <IT value={proj.revision} onSave={v => up("revision",v)} className="text-gray-700" placeholder="v1" /></span>
            </div>
          </div>

          {/* Client logo + confidential toggle */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="text-xs text-gray-400 mb-1.5">Client Logo</div>
              <LogoUploader logoDataUrl={proj.clientLogoDataUrl} onSave={v => up("clientLogoDataUrl",v)} onError={setActionErr} label="Add logo" compact />
            </div>
            <label className="flex items-center gap-1.5 cursor-pointer print:hidden">
              <input type="checkbox" checked={proj.confidential} onChange={e => up("confidential",e.target.checked)} className="rounded" />
              <span className="text-xs font-medium text-red-500 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />Confidential</span>
            </label>
          </div>
        </div>

        {/* Exec Summary */}
        {panels.execSummary && <Card className="mb-6">
          <SH title="Executive Summary" />
          <TA value={proj.execSummary} onSave={v => up("execSummary",v)} rows={3} placeholder="2–3 sentence status summary for the client…" />
        </Card>}

        {/* KPIs */}
        {panels.kpis && <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Budget Remaining", val: <IN value={proj.budget-proj.spent} prefix="$" onSave={v => up("spent",proj.budget-v)} />, sub: `${100-budPct}% left`, icon: <DollarSign className="w-5 h-5 text-emerald-500" />, hi: budPct>90 },
            { label: "Budget Used", val: <IN value={proj.spent} prefix="$" onSave={v => up("spent",v)} />, sub: <>of <IN value={proj.budget} prefix="$" onSave={v => up("budget",v)} /></>, icon: <TrendingUp className="w-5 h-5 text-blue-500" /> },
            { label: "Milestones", val: `${milDone} / ${proj.milestones.length}`, sub: `${milPct}% complete`, icon: <CheckCircle className="w-5 h-5 text-purple-500" /> },
            { label: "Open Tasks", val: proj.tasks.filter(t=>t.status!=="Done"&&t.status!=="Complete").length, sub: `${proj.tasks.length} total`, icon: <Clock className="w-5 h-5 text-amber-500" /> },
          ].map((k,i) => <div key={i} className={`bg-white rounded-xl border ${k.hi?"border-red-300":"border-gray-200"} p-4 shadow-sm`}>
            <div className="flex items-center justify-between mb-2"><span className="text-xs text-gray-500 font-medium">{k.label}</span>{k.icon}</div>
            <div className="text-2xl font-bold text-slate-800">{k.val}</div>
            <div className="text-xs text-gray-400 mt-0.5">{k.sub}</div>
          </div>)}
        </div>}

        {/* Budget + Milestones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {panels.budget && <Card>
            <SH title="Budget: Planned vs. Actual" />
            {proj.budgetHistory.length===0 ? <Empty label="No budget history — add monthly data to see chart" /> :
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={proj.budgetHistory} barCategoryGap="30%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{fontSize:11,fill:"#94a3b8"}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize:11,fill:"#94a3b8"}} tickFormatter={v=>`$${(v/1000).toFixed(0)}k`} axisLine={false} tickLine={false} />
                  <Tooltip formatter={v=>`$${v.toLocaleString()}`} contentStyle={{borderRadius:"8px",border:"1px solid #e2e8f0",fontSize:"12px"}} />
                  <Legend wrapperStyle={{fontSize:11}} />
                  <Bar dataKey="planned" name="Planned" fill="#e2e8f0" radius={[4,4,0,0]} />
                  <Bar dataKey="actual" name="Actual" fill="#3b82f6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>}
            <div className="mt-4"><BudgetBar spent={proj.spent} budget={proj.budget} /></div>
          </Card>}
          {panels.milestones && <Card>
            <SH title="Milestones" onAdd={() => up("milestones",[...proj.milestones,{name:"New milestone",date:"",done:false,variance:0}])} />
            {proj.milestones.length>0 && <><p className="text-xs text-gray-400 mb-2">{milPct}% complete · {proj.milestones.length-milDone} remaining</p><div className="w-full bg-gray-100 rounded-full h-1.5 mb-4"><div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{width:`${milPct}%`}} /></div></>}
            {proj.milestones.length===0 ? <Empty label="No milestones yet — click Add to start" /> :
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {proj.milestones.map((m,i) => <div key={i} className="flex items-start gap-2 group">
                <button onClick={() => updMile(i,"done",!m.done)} className="mt-0.5 shrink-0">
                  {m.done ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-gray-300 hover:text-gray-400" />}
                </button>
                <div className="flex-1 min-w-0">
                  <IT value={m.name} onSave={v => updMile(i,"name",v)} className={`text-sm ${m.done?"line-through text-gray-400":"text-gray-700"}`} wide />
                  <IT value={m.date} onSave={v => updMile(i,"date",v)} className="text-xs text-gray-400" placeholder="YYYY-MM-DD" />
                </div>
                <button onClick={() => up("milestones",proj.milestones.filter((_,idx)=>idx!==i))} className="opacity-0 group-hover:opacity-100 print:hidden"><Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" /></button>
              </div>)}
            </div>}
          </Card>}
        </div>

        {/* Talking Points */}
        {panels.talkingPoints && <TalkingPointsPanel proj={proj} talkingPoints={proj.talkingPoints||""} onSave={v => up("talkingPoints",v)} />}

        {/* Internal Notes */}
        {panels.notes && <Card className="mb-6">
          <SH title={<><FileText className="w-4 h-4 text-gray-400 inline mr-1.5" />Internal Notes <span className="text-xs text-amber-500 font-normal">(not shared with client)</span></>} />
          <TA value={proj.notes} onSave={v => up("notes",v)} rows={3} placeholder="Internal context, open questions, vendor notes…" />
        </Card>}

        {/* Deliverables + Risks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {panels.deliverables && <Card>
            <SH title="Deliverables" onAdd={() => up("deliverables",[...proj.deliverables,{id:Date.now(),name:"New deliverable",status:"Not Started",due:""}])} />
            {proj.deliverables.length===0 ? <Empty label="No deliverables yet" /> :
              <table className="w-full text-sm">
                <thead><tr className="text-xs text-gray-400 border-b border-gray-100 text-left"><th className="pb-2 font-medium">Output</th><th className="pb-2 font-medium">Due</th><th className="pb-2 font-medium">Status</th><th className="pb-2 w-5 print:hidden" /></tr></thead>
                <tbody>{proj.deliverables.map(d => <tr key={d.id} className="border-b border-gray-50 last:border-0 group">
                  <td className="py-2.5"><IT value={d.name} onSave={v=>updDeliv(d.id,"name",v)} wide /></td>
                  <td className="py-2.5 text-gray-500"><IT value={d.due} onSave={v=>updDeliv(d.id,"due",v)} placeholder="YYYY-MM-DD" /></td>
                  <td className="py-2.5"><IS value={d.status} options={STATUS_OPTIONS} onSave={v=>updDeliv(d.id,"status",v)} /></td>
                  <td className="py-2.5 text-right print:hidden"><button onClick={()=>up("deliverables",proj.deliverables.filter(x=>x.id!==d.id))} className="opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" /></button></td>
                </tr>)}</tbody>
              </table>}
          </Card>}
          {panels.risks && <Card>
            <SH title="Risk Log" onAdd={() => up("risks",[...proj.risks,{id:Date.now(),flag:"Amber",item:"New risk",owner:"TBD",mitigation:""}])} />
            {proj.risks.length===0 ? <Empty label="No risks logged" /> :
              <div className="space-y-3">{proj.risks.map(r => <div key={r.id} className="flex gap-2 group">
                <IS value={r.flag} options={["Green","Amber","Red"]} onSave={v=>updRisk(r.id,"flag",v)} colorMap={RAG_BADGE} />
                <div className="flex-1 min-w-0">
                  <IT value={r.item} onSave={v=>updRisk(r.id,"item",v)} className="text-sm text-gray-700" wide />
                  <div className="text-xs text-gray-400 mt-0.5">Owner: <IT value={r.owner} onSave={v=>updRisk(r.id,"owner",v)} className="text-gray-400" /></div>
                  <div className="text-xs text-gray-400">Mitigation: <IT value={r.mitigation} onSave={v=>updRisk(r.id,"mitigation",v)} className="text-gray-400" wide /></div>
                </div>
                <button onClick={()=>up("risks",proj.risks.filter(x=>x.id!==r.id))} className="opacity-0 group-hover:opacity-100 print:hidden shrink-0"><Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" /></button>
              </div>)}</div>}
          </Card>}
        </div>

        {/* Decisions + Open Asks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {panels.decisions && <Card>
            <SH title="Decision Log" onAdd={() => up("decisions",[...proj.decisions,{id:Date.now(),date:todayISO(),decision:"New decision",madeBy:proj.lead}])} />
            {proj.decisions.length===0 ? <Empty label="No decisions logged" /> :
              <div className="space-y-2">{proj.decisions.map(d => <div key={d.id} className="flex gap-2 group border-b border-gray-50 pb-2 last:border-0">
                <div className="flex-1 min-w-0">
                  <IT value={d.decision} onSave={v=>updDec(d.id,"decision",v)} className="text-sm text-gray-700" wide />
                  <div className="text-xs text-gray-400 mt-0.5"><IT value={d.date} onSave={v=>updDec(d.id,"date",v)} className="text-gray-400" /> · <IT value={d.madeBy} onSave={v=>updDec(d.id,"madeBy",v)} className="text-gray-400" /></div>
                </div>
                <button onClick={()=>up("decisions",proj.decisions.filter(x=>x.id!==d.id))} className="opacity-0 group-hover:opacity-100 print:hidden shrink-0"><Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" /></button>
              </div>)}</div>}
          </Card>}
          {panels.openAsks && <Card>
            <SH title="Open Asks from Client" onAdd={() => up("openAsks",[...proj.openAsks,{id:Date.now(),ask:"New ask",askedOf:"Client",dueBy:"",done:false}])} />
            {proj.openAsks.length===0 ? <Empty label="No open asks" /> :
              <div className="space-y-2">{proj.openAsks.map(a => <div key={a.id} className="flex items-start gap-2 group border-b border-gray-50 pb-2 last:border-0">
                <button onClick={()=>updAsk(a.id,"done",!a.done)} className="mt-0.5 shrink-0">
                  {a.done ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-gray-300 hover:text-gray-400" />}
                </button>
                <div className="flex-1 min-w-0">
                  <IT value={a.ask} onSave={v=>updAsk(a.id,"ask",v)} className={`text-sm ${a.done?"line-through text-gray-400":"text-gray-700"}`} wide />
                  <div className="text-xs text-gray-400 mt-0.5">Asked of: <IT value={a.askedOf} onSave={v=>updAsk(a.id,"askedOf",v)} className="text-gray-400" /> · Due: <IT value={a.dueBy} onSave={v=>updAsk(a.id,"dueBy",v)} className="text-gray-400" placeholder="YYYY-MM-DD" /></div>
                </div>
                <button onClick={()=>up("openAsks",proj.openAsks.filter(x=>x.id!==a.id))} className="opacity-0 group-hover:opacity-100 print:hidden shrink-0"><Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" /></button>
              </div>)}</div>}
          </Card>}
        </div>

        {/* Meeting Log */}
        {panels.meetings && <Card className="mb-6">
          <SH title="Meeting Log" onAdd={() => up("meetings",[...proj.meetings,{id:Date.now(),date:todayISO(),attendees:`${proj.lead}, Client`,summary:""}])} />
          {proj.meetings.length===0 ? <Empty label="No meetings logged" /> :
            <table className="w-full text-sm">
              <thead><tr className="text-xs text-gray-400 border-b border-gray-100 text-left"><th className="pb-2 w-24">Date</th><th className="pb-2 w-40">Attendees</th><th className="pb-2">Summary</th><th className="pb-2 w-5 print:hidden" /></tr></thead>
              <tbody>{proj.meetings.map(m => <tr key={m.id} className="border-b border-gray-50 last:border-0 group">
                <td className="py-2.5 text-gray-500 align-top"><IT value={m.date} onSave={v=>updMeet(m.id,"date",v)} /></td>
                <td className="py-2.5 text-gray-500 align-top"><IT value={m.attendees} onSave={v=>updMeet(m.id,"attendees",v)} wide /></td>
                <td className="py-2.5 text-gray-700 align-top"><IT value={m.summary} onSave={v=>updMeet(m.id,"summary",v)} wide /></td>
                <td className="py-2.5 align-top text-right print:hidden"><button onClick={()=>up("meetings",proj.meetings.filter(x=>x.id!==m.id))} className="opacity-0 group-hover:opacity-100"><Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" /></button></td>
              </tr>)}</tbody>
            </table>}
        </Card>}

        {/* Tasks */}
        {panels.tasks && <DragTable
          tasks={proj.tasks}
          onUpdate={updTask}
          onDelete={tid => up("tasks",proj.tasks.filter(t=>t.id!==tid))}
          onAdd={() => up("tasks",[...proj.tasks,{id:Date.now(),name:"New task",status:"Not Started",owner:proj.lead,due:""}])}
          onReorder={r => up("tasks",r)}
        />}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-xs text-gray-400 print:mt-4">
          Prepared by {consultant.name}{consultant.firm ? ` · ${consultant.firm}` : ""} · {proj.client}{proj.revision ? ` · Rev. ${proj.revision}` : ""} · {updatedAt}
        </div>
      </div>
    </div>
  );
}