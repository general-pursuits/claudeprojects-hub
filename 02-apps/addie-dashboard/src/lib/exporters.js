export const exportFileName = (proj, suffix) =>
  `${proj.client.replace(/\s+/g, "_")}_${proj.name.replace(/\s+/g, "_")}${suffix}`;

export function buildCSVRows(proj) {
  const q = s => `"${String(s || "").replace(/"/g, '""')}"`;
  return [
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
}

export const csvText = rows => rows.map(r => r.join(",")).join("\n");

export function buildExcelSheets(proj) {
  return {
    Summary: [["Project", proj.name], ["Client", proj.client], ["Lead", proj.lead], ["RAG", proj.rag], ["Meeting Date", proj.meetingDate], ["Revision", proj.revision], ["Confidential", proj.confidential ? "Yes" : "No"], ["Budget", proj.budget], ["Spent", proj.spent], ["Remaining", proj.budget - proj.spent], [], ["Executive Summary"], [proj.execSummary], [], ["Talking Points"], [proj.talkingPoints]],
    Tasks: [["Task", "Owner", "Due", "Status"], ...proj.tasks.map(t => [t.name, t.owner, t.due, t.status])],
    Milestones: [["Milestone", "Date", "Done"], ...proj.milestones.map(m => [m.name, m.date, m.done ? "Yes" : "No"])],
    Deliverables: [["Deliverable", "Status", "Due"], ...proj.deliverables.map(d => [d.name, d.status, d.due])],
    Risks: [["Flag", "Risk", "Owner", "Mitigation"], ...proj.risks.map(r => [r.flag, r.item, r.owner, r.mitigation])],
    Decisions: [["Date", "Decision", "Made By"], ...proj.decisions.map(d => [d.date, d.decision, d.madeBy])],
    "Open Asks": [["Ask", "Asked Of", "Due By", "Done"], ...proj.openAsks.map(a => [a.ask, a.askedOf, a.dueBy, a.done ? "Yes" : "No"])],
  };
}
