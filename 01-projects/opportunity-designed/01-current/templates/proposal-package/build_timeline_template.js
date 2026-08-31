const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, TabStopType,
  HeadingLevel, BorderStyle, WidthType, ShadingType, VerticalAlign,
  PageNumber, PageBreak
} = require('docx');

// ============ GRAYSCALE TOKENS ============
// Black & white, print-friendly
const INK       = "1A1A1A";
const CHARCOAL  = "1A1A1A";
const PARCHMENT = "EDEDED";
const WARM_GRAY = "707070";
const VIOLET    = "404040";
const LAVENDER  = "404040";
const RULE      = "C8C8C8";
const OBSIDIAN  = INK;
const SAND      = PARCHMENT;
const DUSK      = WARM_GRAY;
const ACCENT    = VIOLET;
const HEADLINE  = "Anton";
const BODY      = "Inter";

// helpers
const p = (text, opts = {}) => new Paragraph({
  spacing: { before: opts.before ?? 60, after: opts.after ?? 60, line: 300 },
  alignment: opts.align ?? AlignmentType.LEFT,
  children: [new TextRun({
    text, font: opts.font ?? BODY, size: opts.size ?? 20,
    color: opts.color ?? OBSIDIAN, bold: opts.bold ?? false,
    italics: opts.italics ?? false,
  })],
});
const eyebrow = (text) => new Paragraph({
  spacing: { before: 240, after: 80 },
  children: [new TextRun({ text, font: BODY, size: 16, color: LAVENDER, bold: true, allCaps: true, characterSpacing: 80 })],
});
const h1 = (text) => new Paragraph({
  spacing: { before: 120, after: 240 },
  children: [new TextRun({ text, font: HEADLINE, size: 56, bold: true, allCaps: true, color: OBSIDIAN })],
});
const h3 = (text) => new Paragraph({
  spacing: { before: 220, after: 80 },
  children: [new TextRun({ text, font: HEADLINE, size: 26, bold: true, allCaps: true, color: OBSIDIAN })],
});
const small = (text, color) => new Paragraph({
  spacing: { before: 0, after: 60, line: 280 },
  children: [new TextRun({ text, font: BODY, size: 18, color: color ?? DUSK })],
});
const bullet = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { before: 30, after: 30, line: 280 },
  children: [new TextRun({ text, font: BODY, size: 20, color: OBSIDIAN })],
});
const pull = (text) => new Paragraph({
  spacing: { before: 200, after: 200, line: 320 },
  border: { left: { style: BorderStyle.SINGLE, size: 18, color: VIOLET, space: 16 } },
  indent: { left: 240 },
  children: [new TextRun({ text, font: BODY, size: 22, italics: true, color: INK })],
});
const spacer = (h = 120) => new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun({ text: "" })] });
const rule = () => new Paragraph({
  spacing: { before: 80, after: 80 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 1 } },
  children: [new TextRun({ text: "" })],
});
const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: RULE };
const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const cell = (children, opts = {}) => new TableCell({
  borders: allBorders,
  width: { size: opts.width, type: WidthType.DXA },
  shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR, color: "auto" } : undefined,
  margins: { top: 140, bottom: 140, left: 160, right: 160 },
  verticalAlign: VerticalAlign.TOP,
  children,
});

const numbering = {
  config: [
    { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "·", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] },
    { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 240 } } } }] },
  ],
};

const doc = new Document({
  creator: "Opportunity Designed",
  title: "Project Timeline & Scope: [CLIENT COMPANY]",
  styles: { default: { document: { run: { font: BODY, size: 20, color: OBSIDIAN } } } },
  numbering,
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
      children: [
        new TextRun({ text: "OPPORTUNITY DESIGNED", font: HEADLINE, size: 16, bold: true, color: OBSIDIAN, characterSpacing: 100 }),
        new TextRun({ text: "\tTimeline & Scope · [CLIENT COMPANY]", font: BODY, size: 16, color: DUSK }),
      ],
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
      children: [
        new TextRun({ text: "Companion to signed engagement letter.", font: BODY, size: 16, italics: true, color: DUSK }),
        new TextRun({ text: "\t", font: BODY, size: 16 }),
        new TextRun({ text: "Page ", font: BODY, size: 16, color: DUSK }),
        new TextRun({ children: [PageNumber.CURRENT], font: BODY, size: 16, color: DUSK }),
        new TextRun({ text: " / ", font: BODY, size: 16, color: DUSK }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: BODY, size: 16, color: DUSK }),
      ],
    })] }) },
    children: [
      // ============ COVER ============
      spacer(1000),
      new Paragraph({ spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "COMPANION DOCUMENT  ·  WORKING DOCUMENT", font: BODY, size: 18, color: OBSIDIAN, bold: true, allCaps: true, characterSpacing: 100 })] }),
      new Paragraph({ spacing: { before: 120, after: 80 },
        children: [new TextRun({ text: "Prepared for [CLIENT COMPANY]", font: BODY, size: 20, color: DUSK })] }),
      new Paragraph({ spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "Project Timeline & Scope", font: HEADLINE, size: 68, bold: true, allCaps: true, color: OBSIDIAN })] }),
      spacer(120),
      p("This document accompanies the signed engagement letter and covers the weekly phases, working session cadence, deliverable milestones, and dependencies for the project. Each tier runs on its own length (30, 60, or 90 days), and the structure below scales to the tier selected in the engagement letter. Dates are anchored to the confirmed kickoff, and the document is updated together during the engagement if inputs, data, or priorities change.",
        { after: 160, italics: true, color: DUSK, size: 22 }),

      // ============ DISCLAIMER BANNER ============
      new Paragraph({
        spacing: { before: 160, after: 160, line: 300 },
        border: {
          top:    { style: BorderStyle.SINGLE, size: 6, color: OBSIDIAN, space: 12 },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: OBSIDIAN, space: 12 },
        },
        children: [
          new TextRun({ text: "Important. ", font: BODY, size: 18, bold: true, color: OBSIDIAN }),
          new TextRun({ text: "This is a working document, not a contract. It is illustrative of the work produced during the engagement and evolves as Consultant and Client learn more together. Specific formats, granularity, quantities, styles, brands, timelines, and metrics referenced in this document are subject to change based on the data available, input from the people involved, and priorities that emerge during the engagement. This document does not modify or expand the commercial terms in the signed proposal or the Master Services Agreement. Neither party is legally bound to any specific content, format, quantity, or outcome described here. The proposal and the signed engagement letter govern the engagement; this document supports it.", font: BODY, size: 18, color: OBSIDIAN, italics: true }),
        ],
      }),
      spacer(400),
      rule(),
      new Paragraph({ spacing: { before: 200, after: 80 },
        tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
        children: [
          new TextRun({ text: "Confirmed kickoff date", font: BODY, size: 18, color: DUSK }),
          new TextRun({ text: "\tWeek of  ____________________", font: BODY, size: 20, color: OBSIDIAN, bold: true }),
        ] }),
      new Paragraph({ spacing: { before: 40, after: 80 },
        tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
        children: [
          new TextRun({ text: "Final walk-through date", font: BODY, size: 18, color: DUSK }),
          new TextRun({ text: "\t30, 60, or 90 days from kickoff (varies by tier)", font: BODY, size: 20, color: OBSIDIAN, bold: true }),
        ] }),
      new Paragraph({ spacing: { before: 40, after: 80 },
        tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
        children: [
          new TextRun({ text: "Selected tier", font: BODY, size: 18, color: DUSK }),
          new TextRun({ text: "\t____________________________________", font: BODY, size: 20, color: OBSIDIAN, bold: true }),
        ] }),
      new Paragraph({ children: [new PageBreak()] }),

      // ============ ENGAGEMENT SHAPE ============
      eyebrow("01 · Engagement Shape"),
      h1("The project arc."),
      p("The engagement moves through four phases plus a final walk-through, with structured working sessions built in to test thinking against the data before it becomes a deliverable. The phase shape is the same across tiers. What scales is the length of each phase and the depth of the work, both of which match the tier selected in the engagement letter.", { after: 160 }),

      h3("Workflow at a glance"),
      p("Phases shown proportionally. Each phase scales to the project length of the tier selected. Tier 01: roughly one week per phase. Tier 02: roughly two weeks per phase. Tier 03: roughly three weeks per phase. Calendar dates are confirmed at engagement letter signature.", { after: 80, italics: true, color: DUSK, size: 18 }),

      (function ganttTable() {
        // 9360 total: label col 2160, then 5 phase cols at 1440 each
        const colW = [2160, 1440, 1440, 1440, 1440, 1440];
        const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: RULE };
        const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
        const c = (children, opts={}) => new TableCell({
          borders: allBorders,
          width: { size: opts.width, type: WidthType.DXA },
          shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR, color: "auto" } : undefined,
          margins: { top: 120, bottom: 120, left: 100, right: 100 },
          verticalAlign: VerticalAlign.CENTER,
          children,
        });
        const head = (text) => new Paragraph({
          spacing: { before: 40, after: 40 },
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text, font: HEADLINE, size: 15, bold: true, color: PARCHMENT, allCaps: true, characterSpacing: 40 })],
        });
        const labelCell = (text) => new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [new TextRun({ text, font: BODY, size: 15, color: OBSIDIAN, bold: true })],
        });
        const barCell = (state, w) => {
          // state: 0 = empty, 1 = active work (light gray), 2 = milestone (black)
          const fill = state === 2 ? OBSIDIAN : (state === 1 ? "B8B8B8" : undefined);
          return c([new Paragraph({ children: [new TextRun({ text: " ", font: BODY, size: 15 })] })], { width: w, fill });
        };
        const row = (label, bars) => new TableRow({
          children: [
            c([labelCell(label)], { width: colW[0], fill: SAND }),
            ...bars.map((b, i) => barCell(b, colW[i + 1])),
          ],
        });
        return new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: colW,
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                c([head("Phase")],    { width: colW[0], fill: OBSIDIAN }),
                c([head("Phase 1")],  { width: colW[1], fill: OBSIDIAN }),
                c([head("Phase 2")],  { width: colW[2], fill: OBSIDIAN }),
                c([head("Phase 3")],  { width: colW[3], fill: OBSIDIAN }),
                c([head("Phase 4")],  { width: colW[4], fill: OBSIDIAN }),
                c([head("Walk-through")], { width: colW[5], fill: OBSIDIAN }),
              ],
            }),
            // 0 = empty, 1 = active (light gray), 2 = milestone (black)
            row("Kickoff",            [2, 0, 0, 0, 0]),
            row("Discovery",          [1, 1, 0, 0, 0]),
            row("Diagnosis",          [0, 1, 1, 0, 0]),
            row("Build the plan",     [0, 0, 1, 1, 0]),
            row("Working sessions",   [0, 1, 1, 1, 0]),
            row("Final deliverables", [0, 0, 0, 1, 1]),
            row("Final walk-through", [0, 0, 0, 0, 2]),
          ],
        });
      })(),

      spacer(100),
      p("Light bars mark active work. Black bars mark the kickoff and the final walk-through milestones.", { italics: true, color: DUSK, size: 16, after: 240 }),

      h3("Phases by tier"),
      p("The four phases below sit at the same proportional spots in every project. What changes is the length of each phase. Tier 01 compresses each phase to roughly one week. Tier 02 runs each phase across roughly two weeks. Tier 03 stretches each phase across roughly three weeks. Specific week numbers are agreed at engagement letter signature based on the kickoff date.", { after: 160, italics: true, color: DUSK, size: 18 }),

      (function weekTable() {
        const colW = [1700, 2200, 5460];
        const headerFill = OBSIDIAN;
        const head = (text) => new Paragraph({ spacing: { before: 60, after: 60 },
          children: [new TextRun({ text, font: HEADLINE, size: 18, bold: true, color: PARCHMENT, allCaps: true, characterSpacing: 60 })] });
        const txt = (text, opts={}) => new Paragraph({ spacing: { before: 30, after: 30, line: 260 },
          children: [new TextRun({ text, font: BODY, size: 17, color: opts.color ?? OBSIDIAN, bold: opts.bold ?? false })] });
        const phaseRow = (phaseLabel, weeksLabel, title, body) => new TableRow({ children: [
          cell([txt(phaseLabel, { bold: true, color: OBSIDIAN }), txt(weeksLabel, { color: DUSK })], { width: colW[0], fill: SAND }),
          cell([txt(title, { bold: true })], { width: colW[1] }),
          cell([txt(body)], { width: colW[2] }),
        ] });
        return new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: colW,
          rows: [
            new TableRow({ tableHeader: true, children: [
              cell([head("Phase / weeks")], { width: colW[0], fill: headerFill }),
              cell([head("Theme")], { width: colW[1], fill: headerFill }),
              cell([head("What happens")], { width: colW[2], fill: headerFill }),
            ] }),
            phaseRow("Phase 1",
              "T1: Wk 01  ·  T2: Wks 01–02  ·  T3: Wks 01–03",
              "Discovery & alignment",
              "Kickoff call. Team conversations with 2 to 5 people on the client side. Document review of [CLIENT MATERIALS — e.g. current brand roster, financials, and any existing concept thinking]. Confirm success metrics and decision rights for the engagement."),
            phaseRow("Phase 2",
              "T1: Wk 02  ·  T2: Wks 03–04  ·  T3: Wks 04–06",
              "Diagnosis & framing",
              "Assortment audit, competitive scan of adjacent retail concepts, margin and unit economics review on representative products. Working Session 1 with the client to align on findings before any recommendations are committed."),
            phaseRow("Phase 3",
              "T1: Wk 03  ·  T2: Wks 05–06  ·  T3: Wks 07–09",
              "Build the plan",
              "Pull findings together into the Pillar 01 framework (all tiers). Tier 03 also develops the Pillar 02 and Pillar 03 plans. Working Session 2 to check the strategy with the client (Tiers 02 and 03)."),
            phaseRow("Phase 4",
              "T1: Wk 04  ·  T2: Wks 07–08  ·  T3: Wks 10–12",
              "Land the plan",
              "Final deliverables packaged. Pre-read of final deliverables shared. Client review window opens on deliverable delivery and closes five business days later per Deliverable Acceptance terms. Training handoff begins for the day to day owner."),
            phaseRow("Walk-through",
              "T1: Wk 05  ·  T2: Wk 09  ·  T3: Wk 13",
              "Final walk-through",
              "Final walk-through delivered, decisions captured, and next steps framed. Final invoice issued. Training handoff wraps so the team can continue execution after the engagement closes."),
          ],
        });
      })(),

      spacer(200),
      h3("Working session cadence"),
      p("Working sessions are 60 to 75 minute calls designed to land decisions, not just have a discussion. Each one has a pre-read sent 24 to 48 hours ahead and a short decisions and open questions summary sent within 24 to 48 hours after. Specific week placement scales to the selected tier.", { after: 80 }),
      bullet("Kickoff. 60 to 75 min. Success metrics, decision rights, data access checklist, team conversations schedule. All tiers."),
      bullet("Working Session 1. 60 min. Diagnosis and findings alignment, held during Phase 2. All tiers."),
      bullet("Working Session 2. 60 min. Strategy framework review, held during Phase 3. Tiers 02 and 03."),
      bullet("Working Session 3. 60 min. Retail concept and marketing frameworks review, held during Phase 3. Tier 03 only."),
      bullet("Final pre-read. 30 min. Walk-through of the final deliverable draft before the final walk-through, to surface any last adjustments. Held during Phase 4. Tiers 02 and 03."),
      bullet("Final walk-through. 60 to 90 min. Final deliverable walk-through, decisions captured, next steps framing. All tiers."),

      // ============ MILESTONES ============
      eyebrow("02 · Deliverable Milestones"),
      h1("What lands when."),
      p("Milestones are anchored to the confirmed kickoff date. Day numbers are relative to kickoff (Day 1) and scale to the tier selected. Tier 01 lands on a 30-day arc, Tier 02 on a 60-day arc, and Tier 03 on a 90-day arc. Specific calendar dates are filled in at engagement letter signature.", { after: 160 }),

      (function milestonesTable() {
        const colW = [3260, 1500, 1500, 1500, 1600];
        const headerFill = OBSIDIAN;
        const head = (text) => new Paragraph({ spacing: { before: 60, after: 60 },
          alignment: AlignmentType.LEFT,
          children: [new TextRun({ text, font: HEADLINE, size: 16, bold: true, color: PARCHMENT, allCaps: true, characterSpacing: 60 })] });
        const txt = (text, opts={}) => new Paragraph({ spacing: { before: 30, after: 30, line: 260 },
          children: [new TextRun({ text, font: BODY, size: 16, color: opts.color ?? OBSIDIAN, bold: opts.bold ?? false })] });
        const m = (milestone, t1, t2, t3, applies) => new TableRow({ children: [
          cell([txt(milestone)], { width: colW[0], fill: SAND }),
          cell([txt(t1, { bold: true, color: OBSIDIAN })], { width: colW[1] }),
          cell([txt(t2, { bold: true, color: OBSIDIAN })], { width: colW[2] }),
          cell([txt(t3, { bold: true, color: OBSIDIAN })], { width: colW[3] }),
          cell([txt(applies, { color: DUSK })], { width: colW[4] }),
        ] });
        return new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: colW,
          rows: [
            new TableRow({ tableHeader: true, children: [
              cell([head("Milestone")], { width: colW[0], fill: headerFill }),
              cell([head("Tier 01 day")], { width: colW[1], fill: headerFill }),
              cell([head("Tier 02 day")], { width: colW[2], fill: headerFill }),
              cell([head("Tier 03 day")], { width: colW[3], fill: headerFill }),
              cell([head("Applies to")], { width: colW[4], fill: headerFill }),
            ] }),
            m("Engagement letter and NDA countersigned. Deposit invoice issued.", "Day -7", "Day -7", "Day -7", "All tiers"),
            m("Kickoff pre-read sent. Data access checklist shared.",              "Day -2", "Day -2", "Day -2", "All tiers"),
            m("Kickoff call. Success metrics and decision rights confirmed.",      "Day 1",  "Day 1",  "Day 1",  "All tiers"),
            m("Team conversations complete. Document review wrapped.",             "Day 5",  "Day 10", "Day 14", "All tiers"),
            m("Working Session 1. Diagnosis and findings alignment.",              "Day 9",  "Day 17", "Day 26", "All tiers"),
            m("Diagnostic findings draft delivered for review.",                   "Day 12", "Day 24", "Day 36", "All tiers"),
            m("Working Session 2. Strategy framework review.",                     "—",      "Day 33", "Day 50", "Tiers 02 + 03"),
            m("Working Session 3. Retail concept and marketing review.",           "—",      "—",      "Day 58", "Tier 03 only"),
            m("Strategic plan draft delivered. Client review window opens.",       "—",      "Day 45", "Day 68", "Tiers 02 + 03"),
            m("30-min final deliverables preview call.",                          "—",      "Day 50", "Day 75", "Tiers 02 + 03"),
            m("Client review window closes. Final revisions incorporated.",        "Day 22", "Day 53", "Day 80", "All tiers"),
            m("Training handoff call with the day to day owner.",                  "—",      "Day 57", "Day 85", "Tiers 02 + 03"),
            m("Final walk-through. Deliverables delivered. Final invoice issued.", "Day 30", "Day 60", "Day 90", "All tiers"),
          ],
        });
      })(),

      spacer(200),
      pull("Milestones are the operating rhythm. Any change to a delivery date is flagged in writing at least five business days in advance and agreed collaboratively."),

      // ============ SCOPE BY TIER ============
      eyebrow("03 · Scope by Tier"),
      h1("What the deliverables actually contain."),
      p("This section expands the deliverables listed in the proposal. It describes the specific contents and scope of each output so both parties are aligned on what the work actually looks like. This document is the operational reference, not a contract.", { after: 160, italics: true, color: DUSK }),

      h3("Tier 01: The Diagnostic"),
      bullet("[PILLAR 01 DIAGNOSTIC DELIVERABLE — what you review and what it flags. Keep the protective hedge: 'Intended to flag (X). (Deeper Y is a follow-on scope, typically on retainer.)']"),
      bullet("[MARGIN / ECONOMICS REVIEW — scope of what you analyze. Keep: 'Estimated coverage of 3 to 5 representative (items)... Exact scope is a goal, not a fixed commitment.']"),
      bullet("[COMPETITIVE SCAN — '3 to 4 adjacent (concepts/competitors). Output is a short positioning view showing where [CLIENT COMPANY] sits relative to each.']"),
      bullet("Ranked opportunity list, usually 5 to 7 items, prioritized by speed to revenue or margin, with a directional impact estimate (in dollars, points, or percent as appropriate) and a rough read on effort to execute."),
      bullet("Written diagnostic document with findings, risks, and the ranked list. Underlying analysis is shared as a companion spreadsheet."),
      bullet("Up to 3 team conversations with the people closest to the work."),
      bullet("60-minute final walk-through with findings walk-through and decisions captured."),
      bullet("Up to 3 rounds of revision on the written diagnostic."),

      h3("Tier 02: [TIER 2 NAME]"),
      bullet("Everything in Tier 01."),
      bullet("[CORE PILLAR 01 PLAN — the main deliverable. Keep: 'Intended to include (specifics). Final format and granularity are agreed together during the engagement based on the data available.']"),
      bullet("[SUPPORTING FRAMEWORK — e.g. a roster/segmentation framework with categories and the reasoning behind each placement.]"),
      bullet("[POLICY / PRICING DELIVERABLE — what it covers.]"),
      bullet("Directional notes on Pillar 02 and Pillar 03. Usually 2 to 3 next step recommendations for each. Not full plans at this tier."),
      bullet("60 / 90 / 120 day execution plan focused on Pillar 01, with suggested owners, decision points, and target revenue or margin outcomes at each milestone. Suggested owners are starting points. The client distributes work across the team as they see fit."),
      bullet("Up to 5 team conversations with the people closest to the work."),
      bullet("2 mid-engagement working sessions, a 30-minute final deliverables preview in Week 08, and a final walk-through deck delivered in Week 09."),
      bullet("Up to 3 rounds of revision on each deliverable."),

      h3("Tier 03: The Full Plan"),
      bullet("Everything in Tier 02."),
      bullet("[PILLAR 02 DELIVERABLE — the positioning/concept document. Keep: 'Intended to cover (specifics).']"),
      bullet("[PILLAR 03 DELIVERABLE — the marketing/growth framework. Keep: 'Usually includes 3 to 5 (concepts), each with (detail). Built to work without paid media, with the option to collaborate with the client's paid media specialist if one is in place.']"),
      bullet("[SUPPORTING CALENDAR / PLAN — e.g. a roughly 90-day calendar connecting activity to the underlying Pillar 01 plan.]"),
      bullet("[OUTREACH / PARTNER STARTER LIST — '3 to 5 (targets) beyond those covered in the proposal. Contacts I have on hand are included; for ones I don't know directly, I'll do the research and ask for referrals. Actively pursuing them beyond initial outreach is a retainer scope activity, or can be handed off to the client's side if the project ends here.']"),
      bullet("60 / 90 / 120 day execution plan across all three pillars, with suggested owners, decision points, and target revenue or margin outcomes at each milestone. Suggested owners are starting points. The client distributes work across the team as they see fit."),
      bullet("Up to 7 team conversations with the people closest to the work."),
      bullet("3 mid-engagement working sessions, a 30-minute final deliverables preview in Week 08, and a final walk-through deck delivered in Week 09."),
      bullet("Up to 3 rounds of revision on each deliverable."),

      spacer(120),
      p("Final format, granularity, and exact contents of each deliverable are agreed together during the engagement and reflected in this document, not in the proposal. The goal is to match the depth of the output to the depth of the data available and the decisions the work needs to support.", { italics: true, color: DUSK, after: 120 }),

      // ============ DEPENDENCIES ============
      eyebrow("04 · Dependencies & Inputs"),
      h1("What keeps the plan on track."),
      p("The timeline above assumes the following inputs and access are provided by the client on the schedule indicated. Delays on any of these shift downstream milestones. See the Stop-work clause in the proposal terms.", { after: 120 }),

      h3("From the client, by end of Week 01"),
      bullet("A single point of contact for scheduling, introductions, and data access"),
      bullet("Editable CSV or Excel exports of [CLIENT DATA — e.g. current assortment data: style list, cost, sell-through, inventory on hand] within Week 01. Files can carry whatever password protection, watermarking, NDA scope, or other access controls the client needs. None of it leaves this engagement, per the Confidentiality clause."),
      bullet("Current P&L or unit economics reference (even rough) to support the margin and unit economics review. I'm able to work with a multitude of financial metrics (P&L, project budget, OTB, etc.) and will report against whichever ones the client prefers."),
      bullet("Intros to the 2 to 5 people identified at kickoff beyond [CLIENT CONTACT FIRST NAME] (my direct contact). The ones you want me to learn from, the ones who will have the biggest impact on results, and the ones who will be trained to run the day to day after the project closes."),
      bullet("Any existing brand, concept, or investor documents that describe the [CLIENT COMPANY] vision"),

      h3("Ongoing, throughout the engagement"),
      bullet("Feedback on drafts within 3 business days of delivery"),
      bullet("Availability for the scheduled working sessions (1 / 2 / 3 mid-engagement sessions depending on tier, plus final pre-read for Tiers 02 and 03)"),
      bullet("A decision maker available within 48 to 72 hours for escalations on scope or direction"),

      spacer(160),
      h3("From the consultant"),
      bullet("Responsiveness within one business day, Monday through Friday, during the engagement"),
      bullet("Written check-ins at key milestones summarizing progress, open questions, and what's needed from the client next. Cadence is set at kickoff, not fixed to a weekly calendar."),
      bullet("Pre-reads delivered 24 to 48 hours before every working session"),
      bullet("Decisions and open questions summary within 24 to 48 hours of every working session"),

      spacer(240),
      rule(),
      spacer(120),
      p("Changes to this document are captured in the change log below. Both parties reference this document, together with the signed engagement letter, as the working scope of the project.",
        { italics: true, color: DUSK, after: 120 }),

      // ============ CHANGE LOG ============
      new Paragraph({ children: [new PageBreak()] }),
      eyebrow("05 · Change Log"),
      h1("Document history."),
      p("Each material update to this document is logged below. Entries are added during the engagement as scope, format, granularity, or timing change. The most recent version sits at the top.", { after: 160, italics: true, color: DUSK }),

      (function changeLogTable() {
        const colW = [1400, 1400, 4060, 2500];
        const headerFill = OBSIDIAN;
        const head = (text) => new Paragraph({ spacing: { before: 60, after: 60 },
          children: [new TextRun({ text, font: HEADLINE, size: 18, bold: true, color: PARCHMENT, allCaps: true, characterSpacing: 60 })] });
        const txt = (text, opts={}) => new Paragraph({ spacing: { before: 30, after: 30, line: 260 },
          children: [new TextRun({ text, font: BODY, size: 17, color: opts.color ?? OBSIDIAN, bold: opts.bold ?? false })] });
        const empty = () => new TableRow({ children: [
          cell([txt("__________", { color: OBSIDIAN })], { width: colW[0], fill: SAND }),
          cell([txt("__________", { color: OBSIDIAN })], { width: colW[1] }),
          cell([txt("____________________________________________________________", { color: OBSIDIAN })], { width: colW[2] }),
          cell([txt("__________________________", { color: OBSIDIAN })], { width: colW[3] }),
        ] });
        return new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: colW,
          rows: [
            new TableRow({ tableHeader: true, children: [
              cell([head("Date")], { width: colW[0], fill: headerFill }),
              cell([head("Version")], { width: colW[1], fill: headerFill }),
              cell([head("Change")], { width: colW[2], fill: headerFill }),
              cell([head("Logged by")], { width: colW[3], fill: headerFill }),
            ] }),
            // Initial entry baked in
            new TableRow({ children: [
              cell([txt("__________", { color: OBSIDIAN })], { width: colW[0], fill: SAND }),
              cell([txt("v1.0", { bold: true })], { width: colW[1] }),
              cell([txt("Initial document shared alongside signed engagement letter.")], { width: colW[2] }),
              cell([txt("Consultant", { color: DUSK })], { width: colW[3] }),
            ] }),
            empty(),
            empty(),
            empty(),
            empty(),
            empty(),
            empty(),
            empty(),
          ],
        });
      })(),

      spacer(160),
      p("How changes are made: either party can request a change in writing. The other party reviews within two business days, and either approves the change, asks for clarification, or declines. Approved changes are logged here with date, version, summary, and who logged the change. The change does not modify the commercial terms in the signed proposal or the Master Services Agreement.",
        { italics: true, color: DUSK, size: 18, after: 160 }),

      spacer(240),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 200, after: 40 },
        children: [new TextRun({ text: "OPPORTUNITY DESIGNED", font: HEADLINE, size: 22, bold: true, color: OBSIDIAN, characterSpacing: 200 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 0 },
        children: [new TextRun({ text: "Growth strategy for consumer brands and the businesses that sell them.", font: HEADLINE, size: 18, italics: true, color: OBSIDIAN })] }),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = "/sessions/eloquent-friendly-cori/mnt/career/TEMPLATE-Timeline-and-Scope.docx";
  fs.writeFileSync(out, buf);
  console.log("Wrote: " + out + "  (" + buf.length + " bytes)");
});
