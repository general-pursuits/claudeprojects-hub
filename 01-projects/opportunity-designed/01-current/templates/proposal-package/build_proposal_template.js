const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, PageOrientation, LevelFormat,
  TabStopType, TabStopPosition, HeadingLevel, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak
} = require('docx');

// ============ BRAND TOKENS — Black & white, print-friendly ============
const INK       = "1A1A1A";   // near-black — primary text
const CHARCOAL  = "1A1A1A";   // dark backgrounds (headers, dark cells)
const PARCHMENT = "EDEDED";   // light gray — subtle shading
const CREAM_TEXT= "FFFFFF";   // text on dark surfaces
const WARM_GRAY = "707070";   // muted / secondary text
const VIOLET    = "404040";   // dark gray — used where an accent color would be
const DEEP_VIOLET = "1A1A1A"; // emphasis fallback
const LAVENDER  = "404040";   // eyebrow labels — dark gray so they still read
const RULE      = "C8C8C8";   // neutral hairline
// Back-compat aliases:
const OBSIDIAN  = INK;
const SAND      = PARCHMENT;
const DUSK      = WARM_GRAY;

const HEADLINE = "Anton";    // display, condensed industrial — falls back gracefully if not installed
const BODY     = "Inter";

// ============ HELPERS ============
const p = (text, opts = {}) => new Paragraph({
  spacing: { before: opts.before ?? 60, after: opts.after ?? 60, line: 300 },
  alignment: opts.align ?? AlignmentType.LEFT,
  children: [new TextRun({
    text,
    font: opts.font ?? BODY,
    size: opts.size ?? 20,           // 10pt body default
    color: opts.color ?? OBSIDIAN,
    bold: opts.bold ?? false,
    italics: opts.italics ?? false,
    allCaps: opts.caps ?? false,
    characterSpacing: opts.tracking ?? 0,
  })],
});

const eyebrow = (text) => new Paragraph({
  spacing: { before: 240, after: 80 },
  children: [new TextRun({
    text, font: BODY, size: 16, color: LAVENDER, bold: true,
    allCaps: true, characterSpacing: 80,
  })],
});

const h1 = (text) => new Paragraph({
  spacing: { before: 120, after: 240 },
  children: [new TextRun({
    text, font: HEADLINE, size: 56, bold: true, allCaps: true, color: OBSIDIAN,
  })],
});

const h2 = (text) => new Paragraph({
  spacing: { before: 360, after: 120 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: OBSIDIAN, space: 6 } },
  children: [new TextRun({
    text, font: HEADLINE, size: 36, bold: true, allCaps: true, color: OBSIDIAN,
  })],
});

const h3 = (text, color) => new Paragraph({
  spacing: { before: 220, after: 80 },
  children: [new TextRun({
    text, font: HEADLINE, size: 26, bold: true, allCaps: true, color: color ?? OBSIDIAN,
  })],
});

const small = (text, color) => new Paragraph({
  spacing: { before: 0, after: 60, line: 280 },
  children: [new TextRun({
    text, font: BODY, size: 18, color: color ?? DUSK,
  })],
});

const bullet = (text) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  spacing: { before: 30, after: 30, line: 280 },
  children: [new TextRun({ text, font: BODY, size: 20, color: OBSIDIAN })],
});

const pull = (text) => new Paragraph({
  spacing: { before: 200, after: 200, line: 320 },
  alignment: AlignmentType.LEFT,
  border: { left: { style: BorderStyle.SINGLE, size: 18, color: VIOLET, space: 16 } },
  indent: { left: 240 },
  children: [new TextRun({
    text, font: BODY, size: 22, italics: true, color: INK,
  })],
});

const spacer = (h = 120) => new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun({ text: "" })] });

// Tier price/meta block: clean two-line structure under each tier H3
// Line 1: bold price (+ optional Recommended tag); Line 2: detail line in smaller text
const tierMeta = (price, details, opts = {}) => {
  const priceChildren = [
    new TextRun({ text: price, font: HEADLINE, size: 28, bold: true, allCaps: true, color: OBSIDIAN }),
  ];
  if (opts.recommended) {
    priceChildren.push(
      new TextRun({ text: "    ", font: BODY, size: 18, color: OBSIDIAN }),
      new TextRun({ text: "Recommended", font: BODY, size: 16, italics: true, bold: true, color: OBSIDIAN, allCaps: true, characterSpacing: 80 }),
    );
  }
  return [
    new Paragraph({
      spacing: { before: 60, after: 20, line: 280 },
      children: priceChildren,
    }),
    new Paragraph({
      spacing: { before: 0, after: 100, line: 280 },
      children: [new TextRun({ text: details, font: BODY, size: 17, color: OBSIDIAN })],
    }),
  ];
};

const rule = () => new Paragraph({
  spacing: { before: 80, after: 80 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 1 } },
  children: [new TextRun({ text: "" })],
});

// ============ TABLE HELPERS ============
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

// ============ TIER COMPARISON TABLE ============
const tierTable = () => {
  const colW = [2160, 2400, 2400, 2400]; // sums to 9360
  const headerFill = CHARCOAL;
  const headerText = (text) => new Paragraph({
    spacing: { before: 60, after: 60 },
    children: [new TextRun({
      text, font: HEADLINE, size: 22, bold: true, color: PARCHMENT,
      allCaps: true, characterSpacing: 60,
    })],
  });
  const cellText = (text, opts={}) => new Paragraph({
    spacing: { before: 30, after: 30, line: 260 },
    children: [new TextRun({
      text, font: BODY, size: 18, color: opts.color ?? OBSIDIAN, bold: opts.bold ?? false,
    })],
  });

  const rowOf = (label, t1, t2, t3, isPrice=false) => new TableRow({
    children: [
      cell([cellText(label, { bold: true, color: DUSK })], { width: colW[0], fill: SAND }),
      cell([cellText(t1, { bold: isPrice })], { width: colW[1] }),
      cell([cellText(t2, { bold: isPrice })], { width: colW[2], fill: isPrice ? "D8D8D8" : undefined }),
      cell([cellText(t3, { bold: isPrice })], { width: colW[3] }),
    ],
  });

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colW,
    rows: [
      new TableRow({
        tableHeader: true,
        children: [
          cell([headerText("")], { width: colW[0], fill: headerFill }),
          cell([headerText("Tier 01")], { width: colW[1], fill: headerFill }),
          cell([
            headerText("Tier 02"),
            new Paragraph({
              spacing: { before: 30, after: 30 },
              children: [new TextRun({ text: "Recommended", font: BODY, size: 16, italics: true, color: PARCHMENT })],
            }),
          ], { width: colW[2], fill: CHARCOAL }),
          cell([headerText("Tier 03")], { width: colW[3], fill: headerFill }),
        ],
      }),
      new TableRow({
        children: [
          cell([cellText("", { color: DUSK })], { width: colW[0], fill: SAND }),
          cell([new Paragraph({ children: [new TextRun({ text: "The Diagnostic", font: HEADLINE, size: 24, bold: true, allCaps: true, color: OBSIDIAN })] })], { width: colW[1] }),
          cell([new Paragraph({ children: [new TextRun({ text: "[TIER 2 NAME]", font: HEADLINE, size: 24, bold: true, allCaps: true, color: OBSIDIAN })] })], { width: colW[2], fill: "D8D8D8" }),
          cell([new Paragraph({ children: [new TextRun({ text: "The Full Plan", font: HEADLINE, size: 24, bold: true, allCaps: true, color: OBSIDIAN })] })], { width: colW[3] }),
        ],
      }),
      rowOf("Investment", "[TIER 1 PRICE]", "[TIER 2 PRICE]", "[TIER 3 PRICE]", true),
      rowOf("Duration", "30 days", "60 days", "90 days"),
      rowOf("Engagement style", "Fixed scope, paid on deliverables", "Fixed scope, paid on deliverables", "Fixed scope, paid on deliverables"),
      rowOf("Pillar coverage",
        "Pillar 01 only (assessed)",
        "Pillar 01 deep. Pillars 02 and 03 directional.",
        "All three pillars at full strategic depth"),
      rowOf("Best for",
        "[TIER 1 — who it's for, one line]",
        "[TIER 2 — who it's for, one line]",
        "[TIER 3 — who it's for, one line]"),
      rowOf("Working sessions", "1 kickoff + 1 working + 1 readout", "1 kickoff + 2 working + 30-min final pre-read + 1 readout", "1 kickoff + 3 working + 30-min final pre-read + 1 readout"),
      rowOf("Team conversations", "Up to 3", "Up to 5", "Up to 7"),
      rowOf("Final deliverables",
        "[TIER 1 deliverables, short]",
        "[TIER 2 deliverables, short — 'Everything in Tier 01 + ...']",
        "[TIER 3 deliverables, short — 'Everything in Tier 02 + ...']"),
    ],
  });
};

// ============ NUMBERING ============
const numbering = {
  config: [
    { reference: "bullets",
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: "·", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 240 } } }
      }]
    },
    { reference: "numbers",
      levels: [{
        level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
        style: { paragraph: { indent: { left: 360, hanging: 240 } } }
      }]
    },
  ],
};

// ============ DOCUMENT ============
const doc = new Document({
  creator: "Opportunity Designed",
  title: "Proposal: [CLIENT COMPANY]",
  description: "Engagement proposal for [CLIENT COMPANY]",
  styles: {
    default: {
      document: { run: { font: BODY, size: 20, color: OBSIDIAN } },
    },
  },
  numbering,
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [(function headerTable() {
          const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
          const nb = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
          const colW = [4680, 4680];
          return new Table({
            width: { size: 9360, type: WidthType.DXA },
            columnWidths: colW,
            rows: [new TableRow({ children: [
              new TableCell({
                borders: nb, width: { size: colW[0], type: WidthType.DXA },
                margins: { top: 0, bottom: 60, left: 0, right: 0 },
                children: [new Paragraph({
                  children: [new TextRun({ text: "OPPORTUNITY DESIGNED", font: HEADLINE, size: 16, bold: true, color: OBSIDIAN, characterSpacing: 100 })],
                })],
              }),
              new TableCell({
                borders: nb, width: { size: colW[1], type: WidthType.DXA },
                margins: { top: 0, bottom: 60, left: 0, right: 0 },
                children: [new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  children: [new TextRun({ text: "Proposal  ·  [CLIENT COMPANY]", font: BODY, size: 16, color: OBSIDIAN })],
                })],
              }),
            ] })],
          });
        })()],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
          children: [
            new TextRun({ text: "Opportunity doesn't appear. It's built.", font: HEADLINE, size: 16, italics: true, color: DUSK }),
            new TextRun({ text: "\t", font: BODY, size: 16 }),
            new TextRun({ text: "Page ", font: BODY, size: 16, color: DUSK }),
            new TextRun({ children: [PageNumber.CURRENT], font: BODY, size: 16, color: DUSK }),
            new TextRun({ text: " / ", font: BODY, size: 16, color: DUSK }),
            new TextRun({ children: [PageNumber.TOTAL_PAGES], font: BODY, size: 16, color: DUSK }),
          ],
        })],
      }),
    },
    children: [
      // ============ COVER ============
      spacer(1600),
      new Paragraph({
        spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "PROPOSAL · [MONTH YEAR]", font: BODY, size: 18, color: OBSIDIAN, bold: true, allCaps: true, characterSpacing: 100 })],
      }),
      new Paragraph({
        spacing: { before: 120, after: 80 },
        children: [new TextRun({ text: "Prepared for", font: BODY, size: 20, color: DUSK })],
      }),
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [new TextRun({ text: "[CLIENT COMPANY]", font: HEADLINE, size: 88, bold: true, allCaps: true, color: OBSIDIAN })],
      }),
      spacer(120),
      new Paragraph({
        spacing: { before: 0, after: 40 },
        children: [new TextRun({ text: "[ONE-LINE PROJECT DESCRIPTION — what this engagement does for them, e.g. 'A scoped project to tighten the assortment, sharpen the retail concept, and find the fastest path to revenue.']", font: BODY, size: 24, italics: true, color: INK })],
      }),
      spacer(240),
      (function coverInfoTable() {
        const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
        const nb = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
        const colW = [3600, 5760];
        const labelCell = (text) => new TableCell({
          borders: nb, width: { size: colW[0], type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 0, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text, font: BODY, size: 18, color: OBSIDIAN })],
          })],
        });
        const valueCell = (text, opts={}) => new TableCell({
          borders: nb, width: { size: colW[1], type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 0, right: 0 },
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text, font: opts.font ?? BODY, size: opts.size ?? 20, color: OBSIDIAN, bold: opts.bold ?? true })],
          })],
        });
        const r = (label, value, opts) => new TableRow({ children: [labelCell(label), valueCell(value, opts)] });
        return new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: colW,
          rows: [
            r("Proposed kickoff", "Week of  ____________________"),
            r("Final walk-through", "30, 60, or 90 days from kickoff (varies by selected tier)"),
            r("Proposal valid through", "30 days from issue date"),
          ],
        });
      })(),
      spacer(500),
      rule(),
      spacer(200),
      (function coverContactTable() {
        const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
        const nb = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
        const colW = [3600, 5760];
        const labelCell = (text) => new TableCell({
          borders: nb, width: { size: colW[0], type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 0, right: 120 },
          children: [new Paragraph({
            children: [new TextRun({ text, font: BODY, size: 18, color: OBSIDIAN })],
          })],
        });
        const valueCell = (text, opts={}) => new TableCell({
          borders: nb, width: { size: colW[1], type: WidthType.DXA },
          margins: { top: 60, bottom: 60, left: 0, right: 0 },
          children: [new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text, font: opts.font ?? BODY, size: opts.size ?? 20, color: OBSIDIAN, bold: opts.bold ?? true, allCaps: opts.font === HEADLINE })],
          })],
        });
        const r = (label, value, opts) => new TableRow({ children: [labelCell(label), valueCell(value, opts)] });
        return new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: colW,
          rows: [
            r("From", "Opportunity Designed", { font: HEADLINE, size: 22 }),
            r("Author", "Addie Morrow"),
            r("Contact", "hello@opportunitydesigned.com  ·  opportunitydesigned.com"),
          ],
        });
      })(),
      new Paragraph({ children: [new PageBreak()] }),

      // ============ THE OPPORTUNITY (forced after cover) ============
      eyebrow("01 · The Opportunity"),
      h1("What we heard."),
      p("[OPENING — 3 to 4 sentences naming what [CLIENT COMPANY] already has going for it and the opportunity in front of them. Pattern: they have the foundation, what's missing is the plan. Example: '[CLIENT COMPANY] has the foundation to build something its market doesn't currently have. [WHAT THEY ALREADY HAVE]. The opportunity is to [THE OPPORTUNITY IN A SENTENCE]. The pieces are there. The plan is what's missing.']", { after: 160 }),
      p("Three things stood out from the working notes:", { after: 80 }),
      bullet("[THEME 1 — short label, then 2 to 3 sentences on what you heard and the opportunity it points to. Lead with a one-word label and a period, e.g. 'Assortment.']"),
      bullet("[THEME 2 — short label, then 2 to 3 sentences. e.g. 'Retail concept.' or 'Operations.']"),
      bullet("[THEME 3 — short label, then 2 to 3 sentences. e.g. 'Margin and ROI.']"),
      spacer(120),
      pull("This proposal is built around closing those open questions and giving you a real plan for what to build, buy, and launch first. I'll work closely with you and your team the whole way. We'll make the hard calls together in Week 01 and keep making them together until the final walk-through."),

      // ============ APPROACH ============
      eyebrow("02 · The Approach"),
      h1("Three pillars. Three project lengths."),
      p("Every option below is built on the same three pillars I've grouped from the ideas we covered in our conversations, organized this way to make them easy to approach and tackle. What changes between tiers is how deep we go, what you walk away with, how much of the work we actually do inside the project window, and the length of that window.", { after: 160 }),

      h3("Pillar 01: [PILLAR 1 NAME — the core deliverable, e.g. 'Assortment & brand roster']"),
      p("[PILLAR 1 DESCRIPTION — 3 to 5 sentences on what this pillar covers and the decisions it lands. This is the deepest pillar in every tier.]"),

      h3("Pillar 02: [PILLAR 2 NAME — the second focus area, e.g. 'Retail concept & community model']"),
      p("[PILLAR 2 DESCRIPTION — 3 to 5 sentences. Note what is built inside the project window vs. handed off for execution afterward.]"),

      h3("Pillar 03: [PILLAR 3 NAME — the third focus area, e.g. 'Marketing tie-ins and fastest ROI initiatives']"),
      p("[PILLAR 3 DESCRIPTION — 3 to 5 sentences on how this pillar connects the first two to revenue.]"),

      // ============ ENGAGEMENT OPTIONS ============
      eyebrow("03 · Engagement Options"),
      h1("Three ways to work together."),
      p("Each tier runs on its own project length, scaled to the depth of the work and how much of the three-pillar scope gets built. Tier 01 is a 30-day diagnostic, Tier 02 is a 60-day plan with execution help where it fits, and Tier 03 is a 90-day full build.", { after: 200 }),

      tierTable(),

      spacer(160),
      new Paragraph({
        spacing: { before: 100, after: 120, line: 300 },
        border: { left: { style: BorderStyle.SINGLE, size: 18, color: OBSIDIAN, space: 16 } },
        indent: { left: 240 },
        children: [
          new TextRun({ text: "If you're early and watching your cash, Tier 02 is the right move. ", font: BODY, size: 20, bold: true, color: OBSIDIAN }),
          new TextRun({ text: "[WHY TIER 2 IS THE SMART CHOICE — 3 to 5 sentences. Name the single biggest lever in this client's business, explain how Tier 02 lands that decision without overcommitting, and frame the other pillars as the clear next step once the foundation is set.]", font: BODY, size: 20, color: OBSIDIAN }),
        ],
      }),

      // ============ DETAILED SCOPE ============
      eyebrow("04 · What's Included"),
      h1("Scope by tier."),

      h3("Tier 01: The Diagnostic"),
      ...tierMeta("[TIER 1 PRICE]", "30-day project  ·  Fixed scope, paid on deliverables"),
      p("[TIER 1 SUMMARY — 1 to 2 sentences on the outside read this tier delivers and what they walk away with.]", { after: 80 }),
      bullet("[Deliverable — e.g. 'Review of the current [CORE ASSET] and [POLICY/PROCESS] direction']"),
      bullet("[Deliverable — e.g. 'Margin and unit economics review']"),
      bullet("[Deliverable — e.g. 'Competitive scan of adjacent concepts']"),
      bullet("[Deliverable — 'Ranked opportunity list prioritized by speed to revenue or margin']"),
      bullet("[Deliverable — 'Written diagnostic with findings, risks, and recommendations']"),
      bullet("Up to 3 team conversations with the people closest to the work"),
      bullet("Final walk-through at the end of the engagement"),
      bullet("Specific contents and scope of each deliverable are detailed in the accompanying Project Timeline & Scope document"),
      spacer(60),
      new Paragraph({
        spacing: { before: 60, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: OBSIDIAN, space: 12 } },
        indent: { left: 200 },
        children: [
          new TextRun({ text: "What you get out of it: ", font: BODY, size: 18, bold: true, color: OBSIDIAN }),
          new TextRun({ text: "[2 to 3 sentences on the outcome. What it tells them, what decisions it backs, and that it's a document they can hand to an investor, advisor, or future hire without translating it first.]", font: BODY, size: 18, color: OBSIDIAN, italics: true }),
        ],
      }),

      h3("Tier 02: [TIER 2 NAME]"),
      ...tierMeta("[TIER 2 PRICE]", "60-day project  ·  Fixed scope, paid on deliverables", { recommended: true }),
      p("Everything in The Diagnostic, plus a strategic plan for Pillar 01 and directional pointers on Pillars 02 and 03. [ONE LINE on what they leave with.]", { after: 80 }),
      bullet("Everything included in Tier 01"),
      bullet("[Core Pillar 01 deliverable — e.g. '12-month assortment plan']"),
      bullet("[Supporting framework — e.g. 'Brand roster framework']"),
      bullet("[Policy/pricing deliverable]"),
      bullet("Directional notes on Pillars 02 and 03 (not full plans at this tier)"),
      bullet("60 / 90 / 120 day post-project execution plan focused on Pillar 01"),
      bullet("Up to 5 team conversations with the people closest to the work"),
      bullet("2 mid-engagement working sessions, a final deliverables preview in Week 08, and a final walk-through in Week 09"),
      bullet("Training handoff so the person or people carrying out execution know how the plan works and can run it without me on the floor every day"),
      bullet("Specific contents and scope of each deliverable are detailed in the accompanying Project Timeline & Scope document"),
      spacer(60),
      new Paragraph({
        spacing: { before: 60, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: OBSIDIAN, space: 12 } },
        indent: { left: 200 },
        children: [
          new TextRun({ text: "What you get out of it: ", font: BODY, size: 18, bold: true, color: OBSIDIAN }),
          new TextRun({ text: "[3 to 4 sentences on the outcome. The core plan with reasoning written down, a framework the team can run without you in the room, execution help inside the window, and a trained owner. End on: an operating system and a roadmap the team can keep building from.]", font: BODY, size: 18, color: OBSIDIAN, italics: true }),
        ],
      }),

      h3("Tier 03: The Full Plan"),
      ...tierMeta("[TIER 3 PRICE]", "90-day project  ·  Fixed scope, paid on deliverables"),
      p("Everything in Tier 02, plus strategic plans for Pillars 02 and 03. [ONE LINE on the complete plan they leave with, with work already in motion.]", { after: 80 }),
      bullet("Everything included in Tier 02"),
      bullet("[Pillar 02 deliverable — e.g. 'Retail concept positioning']"),
      bullet("[Pillar 03 deliverable — e.g. 'Marketing and assortment tie-in framework']"),
      bullet("[Additional deliverable — e.g. 'Vendor outreach starter list']"),
      bullet("90 / 120 / 180 day post-project execution plan across all three pillars"),
      bullet("Up to 7 team conversations with the people closest to the work"),
      bullet("3 mid-engagement working sessions, a final deliverables preview in Week 12, and a final walk-through in Week 13"),
      bullet("Training handoff so execution continues after the engagement closes"),
      bullet("Specific contents and scope of each deliverable are detailed in the accompanying Project Timeline & Scope document"),
      spacer(60),
      new Paragraph({
        spacing: { before: 60, after: 120 },
        border: { left: { style: BorderStyle.SINGLE, size: 12, color: OBSIDIAN, space: 12 } },
        indent: { left: 200 },
        children: [
          new TextRun({ text: "What you get out of it: ", font: BODY, size: 18, bold: true, color: OBSIDIAN }),
          new TextRun({ text: "The full build. [2 to 3 sentences naming the complete set of deliverables across all three pillars and the trained team carrying it forward.] It's the most complete version of the work and the most expensive. For most early stage operators, Tier 02 plus a follow-on retainer is the more responsible path. Tier 03 is the right call only if [CLIENT COMPANY] is ready to move on all three pillars at once and has the team to absorb it.", font: BODY, size: 18, color: OBSIDIAN, italics: true }),
        ],
      }),

      // ============ WHY ME ============
      eyebrow("05 · Why Me"),
      h1("Why I'm the right person for this."),
      p("You're hiring someone to help make real [KEY DECISIONS — e.g. assortment, margin, and brand] decisions for [CLIENT COMPANY]. Here's what I bring to those conversations.", { after: 120 }),
      bullet("Track record. Over a decade in retail. Vendor relationships built from scratch into top accounts. Doubled revenue for existing brands by capturing missed opportunity. Brand partnerships grown into largest US distributor positions. Top brands have come to me for input on their own product development, including the balance of tech, aesthetic, and pricing, and launching new outdoor lines."),
      bullet("Strategy lens. My buying experience taught me how the business actually runs, and I'd bring that lens to [CLIENT COMPANY] as the strategy designer and trainer. I build the plan, the framework, and the parameters your team uses day to day."),
      bullet("Financial fluency. I'm comfortable across project budgets, OTB planning, cost models for product development, and inventory and COGS reporting that feeds the P&L. I can report against whichever financial lens [CLIENT COMPANY] uses."),
      bullet("Brand side experience. I've built manufacturing processes and cost models, managed regulatory, and run end to end product development. I've worked across e-comm models including D2C, dropship, multi brand retail with OTB and owned inventory, and managed Amazon brands and accounts."),
      bullet("Category breadth. Most recently footwear and kids at a major specialty retailer that leads the industry. Stepping into new categories is something I do often and well, which is part of why I move fast in any retail vertical."),
      bullet("Brand access. I've worked directly with the brands [CLIENT COMPANY] is going after, including [BRANDS THEY'RE GOING AFTER], and have active rep contacts in several. I've worked through the barriers to entry that stop most specialty retailers, and I know where bigger retailers can't move because of their size, which is exactly the opportunity [CLIENT COMPANY] is built to take."),
      bullet("Customer lens. I live in the community [CLIENT COMPANY] is building for. I run, ski, and spend weekends around the people [CLIENT COMPANY] is designing for. My retail background turns that viewpoint into decisions grounded in data and behavior."),
      bullet("How I'd show up. Committed to the outcome, ready to push back when I disagree, willing to sit next to you in the hard calls, and clear about the real answer when it matters more than the pretty one."),
      spacer(120),

      // ============ TIMELINE (companion doc + preview) ============
      eyebrow("06 · Timeline"),
      h1("A companion document."),
      p("A detailed Project Timeline & Scope document covering weekly phases, working sessions, deliverable milestones, and dependencies is shared alongside the signed engagement letter once a kickoff date is confirmed. That document is the operational reference for the project window of the tier selected and is updated together during the engagement if inputs or priorities change.", { after: 140 }),

      spacer(100),
      new Paragraph({
        spacing: { before: 80, after: 160, line: 300 },
        border: { left: { style: BorderStyle.SINGLE, size: 18, color: OBSIDIAN, space: 16 } },
        indent: { left: 240 },
        children: [
          new TextRun({ text: "Important. ", font: BODY, size: 18, bold: true, color: OBSIDIAN }),
          new TextRun({ text: "The Project Timeline & Scope document is a working document, not a contract. It evolves as we learn more during the engagement. Specific formats, granularity, quantities, products, brands, and metrics in that document are agreed together during the engagement based on the data available, the people involved, and the priorities that emerge. The Timeline & Scope document does not modify or expand the commercial terms in this proposal, and neither party is legally bound to any specific content, format, quantity, or outcome described in that document. The proposal and the Master Services Agreement govern the engagement. The Timeline & Scope document supports it.", font: BODY, size: 18, color: OBSIDIAN, italics: true }),
        ],
      }),

      pull("Keeping the specifics in a working document rather than a contract gives us the room to do the work well instead of defending a checklist."),
      spacer(120),

      // ============ WHAT WE NEED FROM YOU ============
      eyebrow("07 · What We Need From You"),
      h1("To keep the project on track."),
      p("The work moves as fast as I can get the information I need. Here's what I'll be asking you for to keep the project on track.", { after: 120 }),
      bullet("A single point of contact for scheduling, introductions, and data access"),
      bullet("Editable CSV or Excel exports of [CLIENT DATA — e.g. current assortment data: SKU list, cost, sell-through, inventory on hand] within Week 01. Files can carry whatever password protection, watermarking, NDA scope, or other access controls you need. I need editable formats to sort, pivot, and actually work the data. None of it leaves this engagement, per the Confidentiality clause."),
      bullet("Current P&L or unit economics reference (even rough) to support the margin and unit economics review"),
      bullet("Intros to 2 to 5 additional people on your side. Focus on the people you want me to learn from, the people who will have the biggest impact on this project and its results, and the people who will be trained to run the day-to-day after the project closes."),
      bullet("Any existing brand, concept, or investor documents that describe the [CLIENT COMPANY] vision in your own words"),
      bullet("Feedback on drafts within three business days of delivery. Each deliverable includes up to three rounds of revision, and delays beyond the three-day window shift downstream milestones, with timeline adjustments captured in writing."),
      bullet("Willingness to co-define success metrics at kickoff. We'll agree in Week 01 on the two or three outcomes that matter for you to call this engagement a success."),
      spacer(120),
      h3("Kickoff preview", OBSIDIAN),
      p("The Week 01 kickoff call runs 60 to 75 minutes and covers: (1) the top three questions [CLIENT COMPANY] needs answered by the end of the project, (2) what success looks like to you, in your words, (3) a quick walk-through of the data access checklist and who I'll be talking with, and (4) who signs off on what, and when. A short pre-read lands in your inbox 24 to 48 hours before the call.", { after: 120 }),

      // ============ INVESTMENT ============
      eyebrow("08 · Investment & Terms"),
      h1("The money part."),
      p("Pricing is fixed per tier. Payment timing and structure is something we work out together and put in the engagement letter.", { after: 160 }),

      (function termsTable() {
        const colW = [3120, 6240];
        const txt = (text, opts={}) => new Paragraph({
          spacing: { before: 30, after: 30, line: 260 },
          children: [new TextRun({ text, font: BODY, size: 18, color: opts.color ?? OBSIDIAN, bold: opts.bold ?? false, italics: opts.italics ?? false })],
        });
        const row = (a, b) => new TableRow({
          children: [
            cell([txt(a, { bold: true, color: OBSIDIAN })], { width: colW[0], fill: SAND }),
            cell([txt(b)], { width: colW[1] }),
          ],
        });
        const rowMulti = (label, paragraphs) => new TableRow({
          children: [
            cell([txt(label, { bold: true, color: OBSIDIAN })], { width: colW[0], fill: SAND }),
            cell(paragraphs, { width: colW[1] }),
          ],
        });
        return new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: colW,
          rows: [
            rowMulti("Payment structure", [
              txt("Fixed fee by tier. A non-refundable deposit is required at signed engagement letter as a prepay due before any work begins. The deposit is not subject to net payment terms. The remainder is paid on agreed milestones and on the net terms negotiated below."),
              txt("Net terms apply only to the final project invoice and any milestone invoices issued during the engagement. The deposit invoice is paid at signature and outside of those net terms.", { italics: true }),
              txt("Suggested terms (open to negotiation): non-refundable deposit at signature, with the remaining balance payable on extended net terms against the final project invoice. Offered as a recommendation to help [CLIENT COMPANY]'s early stage cash flow, not a fixed requirement.", { italics: true }),
              txt(" "),
              txt("Negotiated and agreed net terms (final invoice):  ____________________________________"),
              txt("Deposit amount:  ____________________________________"),
              txt("Initials, [CLIENT COMPANY]:  ______        Initials, Consultant:  ______"),
              txt(" "),
              txt("All payment terms, deposit amount, and milestone structure are finalized through negotiation and documented in the signed engagement letter."),
            ]),
            row("Deposit", "Non-refundable. Retained in full if the engagement is terminated for any reason by either party."),
            row("Revisions", "Up to three (3) rounds of revisions per deliverable, requested in writing during the 7-business-day Deliverable Acceptance window."),
            row("Deliverable acceptance", "Deliverables are accepted seven (7) business days after delivery unless Client provides written notice of specific objections grounded in scope within that window. Subjective dissatisfaction or strategic disagreement with recommendations is not a valid basis for withholding payment."),
            row("Termination", "Termination before the final walk-through requires a signed Separation Agreement executed by both parties. To start the termination process, the requesting party must provide written notice of intent to terminate with a minimum of seven (7) days' notice. The Separation Agreement template will be provided to Client digitally upon written request to terminate. Upon termination, the deposit is retained in full and no fees are pro-rated. Any outstanding expense reimbursements owed to Consultant are due at the time of Separation Agreement execution. If Client initiates termination, all previously issued invoices and any outstanding balances become due immediately upon delivery of notice of termination, any negotiated net payment terms are void, and payment is required in full at the time of Separation Agreement execution. If Consultant initiates termination, previously issued invoices remain payable per their original negotiated terms."),
            row("Confidentiality & IP", "Mutual NDA executed before kickoff. All final deliverables owned by Client. Consultant retains rights to frameworks and anonymized learnings for future work."),
            row("Proposal validity", "Pricing and scope above are valid for 30 days from the proposal issue date."),
            row("Late payment", "Any invoice not paid in full by its agreed due date is considered past due. Past-due amounts accrue interest at 1.5% per month (18% annualized), or the maximum rate allowed by Utah law, whichever is lower, compounded monthly from the original due date until paid in full. A late fee of $75 applies to any invoice more than 7 days past due, in addition to accrued interest."),
            row("Full terms", "Non-payment enforcement, scope flexibility and expansion handling, exclusivity, travel and expenses, liability caps, force majeure, governing law, and all other standard legal provisions are set out in the Master Services Agreement, which is executed alongside this signed proposal before kickoff."),
          ],
        });
      })(),

      // ============ NEXT STEPS ============
      eyebrow("09 · Next Steps"),
      h1("How we get started."),
      p("Three things between this proposal and a kickoff:", { after: 80 }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { before: 30, after: 30, line: 280 },
        children: [new TextRun({ text: "Pick a tier, or tell me what you'd want to flex. Tier 02 ([TIER 2 NAME]) is the recommended starting point.", font: BODY, size: 20, color: OBSIDIAN })],
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { before: 30, after: 30, line: 280 },
        children: [new TextRun({ text: "Sign the engagement letter and mutual NDA (sent within 24 hours of your selection). The Project Timeline & Scope document is shared at the same time.", font: BODY, size: 20, color: OBSIDIAN })],
      }),
      new Paragraph({
        numbering: { reference: "numbers", level: 0 },
        spacing: { before: 30, after: 30, line: 280 },
        children: [new TextRun({ text: "Confirm a kickoff date and the two to five people on your team I'll have conversations with in Week 01.", font: BODY, size: 20, color: OBSIDIAN })],
      }),

      spacer(240),
      h3("After the project: suggested follow-up"),
      p("The project covers the hardest part of the work. [ONE LINE on what the project sets up.] Keeping that moving afterward is better as a monthly rhythm than another one-off project.", { after: 100 }),
      p("What I'd suggest is a monthly retainer starting the month after the final walk-through, sized based on what the work actually needs to keep moving. The retainer can be light touch advisory, an active partner, or close to embedded, depending on the level of ongoing involvement the work calls for.", { after: 100 }),
      p("A retainer proposal will be provided at the close of the project, not before. The reason is simple: this project is what tells us what the right retainer shape, monthly hours, and hourly rate should actually be. Pricing it up front would miss the real need either over or under, and neither serves [CLIENT COMPANY]. We decide together at the final walk-through, once both of us can see what the work calls for, and a tailored retainer proposal follows from there.", { after: 160, italics: true }),

      spacer(120),
      rule(),

      // ============ NOTE / DISCLAIMER ============
      // [OPTIONAL SECTION — keep for new-business pitches or warm relationships; delete the eyebrow + paragraph below if not needed. The scope-slip language ("a few things can shift a deliverable by a few days") is useful protection in any version.]
      eyebrow("A note on the work"),
      p("This is exactly the kind of work I built Opportunity Designed for, and I'd love to do this one with you. In any engagement, there are things like vendor responsiveness, internal data access, and scheduling that can occasionally shift a deliverable date by a few days. Where that happens, I'll flag it early and we'll figure out the fix together. Any change to the final walk-through date needs explicit sign-off from both of us.", { after: 120 }),

      // ============ SIGNATURE / ACCEPTANCE ============
      new Paragraph({ children: [new PageBreak()] }),
      eyebrow("10 · Acceptance"),
      h1("Let's get started."),
      p("Countersigning below means you're in for the tier selected and the terms in this proposal. A short Master Services Agreement covering the standard legal language, the mutual NDA, and the Separation Agreement template are sent for signature within 24 hours of countersignature. The deposit invoice follows on signed MSA, with the amount and payment terms we worked out together.", { after: 200 }),

      // Tier selection box
      (function tierSelectionTable() {
        const colW = [600, 8760];
        const txt = (text, opts={}) => new Paragraph({
          spacing: { before: 30, after: 30, line: 260 },
          children: [new TextRun({ text, font: BODY, size: 20, color: opts.color ?? OBSIDIAN, bold: opts.bold ?? false })],
        });
        const headerCell = new Paragraph({
          spacing: { before: 60, after: 60 },
          children: [new TextRun({ text: "TIER SELECTION", font: HEADLINE, size: 18, bold: true, color: PARCHMENT, allCaps: true, characterSpacing: 80 })],
        });
        const tierRow = (label) => new TableRow({
          children: [
            cell([txt("☐", { bold: true })], { width: colW[0] }),
            cell([txt(label)], { width: colW[1] }),
          ],
        });
        return new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: colW,
          rows: [
            new TableRow({
              tableHeader: true,
              children: [
                new TableCell({
                  borders: allBorders,
                  width: { size: colW[0] + colW[1], type: WidthType.DXA },
                  shading: { fill: OBSIDIAN, type: ShadingType.CLEAR, color: "auto" },
                  margins: { top: 140, bottom: 140, left: 160, right: 160 },
                  verticalAlign: VerticalAlign.TOP,
                  columnSpan: 2,
                  children: [headerCell],
                }),
              ],
            }),
            tierRow("Tier 01: The Diagnostic. [TIER 1 PRICE]."),
            tierRow("Tier 02: [TIER 2 NAME]. [TIER 2 PRICE]. Recommended."),
            tierRow("Tier 03: The Full Plan. [TIER 3 PRICE]."),
          ],
        });
      })(),

      spacer(280),

      // Signature blocks side-by-side using a 2-column table
      (function signatureTable() {
        const colW = [4500, 360, 4500]; // gap column in middle
        const lineRow = (l, r) => new TableRow({
          children: [
            cell([new Paragraph({
              spacing: { before: 200, after: 40 },
              border: { top: { style: BorderStyle.SINGLE, size: 6, color: OBSIDIAN, space: 4 } },
              children: [new TextRun({ text: l, font: BODY, size: 16, color: DUSK })],
            })], { width: colW[0] }),
            cell([new Paragraph({ children: [new TextRun({ text: "" })] })], { width: colW[1] }),
            cell([new Paragraph({
              spacing: { before: 200, after: 40 },
              border: { top: { style: BorderStyle.SINGLE, size: 6, color: OBSIDIAN, space: 4 } },
              children: [new TextRun({ text: r, font: BODY, size: 16, color: DUSK })],
            })], { width: colW[2] }),
          ],
        });
        const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
        const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
        const cellNB = (children, opts={}) => new TableCell({
          borders: noBorders,
          width: { size: opts.width, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 0, right: 0 },
          verticalAlign: VerticalAlign.TOP,
          children,
        });
        return new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: colW,
          rows: [
            // Header row: for / from
            new TableRow({
              children: [
                cellNB([new Paragraph({
                  spacing: { before: 0, after: 80 },
                  children: [new TextRun({ text: "FOR [CLIENT COMPANY]", font: BODY, size: 16, bold: true, color: OBSIDIAN, allCaps: true, characterSpacing: 80 })],
                })], { width: colW[0] }),
                cellNB([new Paragraph({ children: [new TextRun({ text: "" })] })], { width: colW[1] }),
                cellNB([new Paragraph({
                  spacing: { before: 0, after: 80 },
                  children: [new TextRun({ text: "FOR OPPORTUNITY DESIGNED", font: BODY, size: 16, bold: true, color: OBSIDIAN, allCaps: true, characterSpacing: 80 })],
                })], { width: colW[2] }),
              ],
            }),
            // Signature line + label
            new TableRow({
              children: [
                cellNB([new Paragraph({
                  spacing: { before: 320, after: 40 },
                  border: { top: { style: BorderStyle.SINGLE, size: 6, color: OBSIDIAN, space: 4 } },
                  children: [new TextRun({ text: "Signature", font: BODY, size: 16, color: DUSK })],
                })], { width: colW[0] }),
                cellNB([new Paragraph({ children: [new TextRun({ text: "" })] })], { width: colW[1] }),
                cellNB([new Paragraph({
                  spacing: { before: 320, after: 40 },
                  border: { top: { style: BorderStyle.SINGLE, size: 6, color: OBSIDIAN, space: 4 } },
                  children: [new TextRun({ text: "Signature  ·  Addie Morrow", font: BODY, size: 16, color: DUSK })],
                })], { width: colW[2] }),
              ],
            }),
            // Name line
            new TableRow({
              children: [
                cellNB([new Paragraph({
                  spacing: { before: 200, after: 40 },
                  border: { top: { style: BorderStyle.SINGLE, size: 6, color: OBSIDIAN, space: 4 } },
                  children: [new TextRun({ text: "Printed name", font: BODY, size: 16, color: DUSK })],
                })], { width: colW[0] }),
                cellNB([new Paragraph({ children: [new TextRun({ text: "" })] })], { width: colW[1] }),
                cellNB([new Paragraph({
                  spacing: { before: 200, after: 40 },
                  border: { top: { style: BorderStyle.SINGLE, size: 6, color: OBSIDIAN, space: 4 } },
                  children: [new TextRun({ text: "Date", font: BODY, size: 16, color: DUSK })],
                })], { width: colW[2] }),
              ],
            }),
            // Title line
            new TableRow({
              children: [
                cellNB([new Paragraph({
                  spacing: { before: 200, after: 40 },
                  border: { top: { style: BorderStyle.SINGLE, size: 6, color: OBSIDIAN, space: 4 } },
                  children: [new TextRun({ text: "Title", font: BODY, size: 16, color: DUSK })],
                })], { width: colW[0] }),
                cellNB([new Paragraph({ children: [new TextRun({ text: "" })] })], { width: colW[1] }),
                cellNB([new Paragraph({ children: [new TextRun({ text: "" })] })], { width: colW[2] }),
              ],
            }),
            // Date line
            new TableRow({
              children: [
                cellNB([new Paragraph({
                  spacing: { before: 200, after: 40 },
                  border: { top: { style: BorderStyle.SINGLE, size: 6, color: OBSIDIAN, space: 4 } },
                  children: [new TextRun({ text: "Date", font: BODY, size: 16, color: DUSK })],
                })], { width: colW[0] }),
                cellNB([new Paragraph({ children: [new TextRun({ text: "" })] })], { width: colW[1] }),
                cellNB([new Paragraph({ children: [new TextRun({ text: "" })] })], { width: colW[2] }),
              ],
            }),
          ],
        });
      })(),

      spacer(240),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 40 },
        children: [new TextRun({ text: "OPPORTUNITY DESIGNED", font: HEADLINE, size: 22, bold: true, color: OBSIDIAN, characterSpacing: 200 })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 40, after: 0 },
        children: [new TextRun({ text: "Growth strategy for consumer brands and the businesses that sell them.", font: BODY, size: 18, italics: true, color: INK })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = "/sessions/eloquent-friendly-cori/mnt/career/TEMPLATE-Proposal.docx";
  fs.writeFileSync(out, buf);
  console.log("Wrote: " + out + "  (" + buf.length + " bytes)");
});
