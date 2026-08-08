import { pct } from "./dashboard";

export function buildClientHTML(proj, updatedAt, consultant) {
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

export function buildShareURL(proj) {
  try { return `${window.location.href.split("?")[0]}?view=${btoa(encodeURIComponent(JSON.stringify({ ...proj, clientLogoDataUrl: "" })))}`; }
  catch { return window.location.href; }
}
