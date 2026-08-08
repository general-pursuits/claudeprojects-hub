export const STATUS_OPTIONS = ["Not Started", "In Progress", "In Review", "Done", "Complete", "Planning"];
export const RAG_OPTIONS = ["Green", "Amber", "Red"];

// Tailwind classes (in-app)
export const STATUS_COLOR = {
  "Done": "bg-emerald-100 text-emerald-700", "Complete": "bg-emerald-100 text-emerald-700",
  "In Progress": "bg-blue-100 text-blue-700", "In Review": "bg-blue-100 text-blue-700",
  "Not Started": "bg-gray-100 text-gray-500", "Planning": "bg-amber-100 text-amber-700",
};
export const RAG_DOT = { Green: "bg-emerald-500", Amber: "bg-amber-400", Red: "bg-red-500" };
export const RAG_BADGE = {
  Green: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Amber: "text-amber-700 bg-amber-50 border-amber-200",
  Red: "text-red-700 bg-red-50 border-red-200",
};

// Hex palettes (PowerPoint / standalone HTML exports)
export const RAG_HEX = { Green: "10b981", Amber: "f59e0b", Red: "ef4444" };
export const RAG_BG = { Green: "#d1fae5", Amber: "#fef3c7", Red: "#fee2e2" };
export const RAG_TEXT = { Green: "#065f46", Amber: "#92400e", Red: "#991b1b" };
export const STATUS_BG = { "Done": "#d1fae5", "Complete": "#d1fae5", "In Progress": "#dbeafe", "In Review": "#dbeafe", "Not Started": "#f3f4f6", "Planning": "#fef3c7" };
export const STATUS_TEXT = { "Done": "#065f46", "Complete": "#065f46", "In Progress": "#1e40af", "In Review": "#1e40af", "Not Started": "#6b7280", "Planning": "#92400e" };

export const CONFIDENTIAL_LABEL = "⚠ Confidential — Not for Distribution";

// Shared thresholds for budget utilisation bars, in both Tailwind and hex form.
export const budgetBarClass = (p) => p > 90 ? "bg-red-500" : p > 70 ? "bg-amber-400" : "bg-emerald-500";
// Bare hex (no leading #) to match RAG_HEX, which pptxgenjs requires.
export const budgetBarHex = (p) => p > 90 ? "ef4444" : p > 70 ? "f59e0b" : "10b981";
