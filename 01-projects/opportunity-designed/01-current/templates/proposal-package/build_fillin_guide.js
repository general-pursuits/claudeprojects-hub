const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, TabStopType, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber
} = require('docx');

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
const HEADLINE  = "Anton";
const BODY      = "Inter";

const p = (text, opts = {}) => new Paragraph({
  spacing: { before: opts.before ?? 60, after: opts.after ?? 80, line: 300 },
  children: [new TextRun({ text, font: opts.font ?? BODY, size: opts.size ?? 20,
    color: opts.color ?? OBSIDIAN, bold: opts.bold ?? false, italics: opts.italics ?? false })],
});
const eyebrow = (text) => new Paragraph({
  spacing: { before: 280, after: 80 },
  children: [new TextRun({ text, font: BODY, size: 16, color: LAVENDER, bold: true, allCaps: true, characterSpacing: 80 })],
});
const h1 = (text) => new Paragraph({
  spacing: { before: 80, after: 160 },
  children: [new TextRun({ text, font: HEADLINE, size: 52, bold: true, allCaps: true, color: OBSIDIAN })],
});
const h3 = (text) => new Paragraph({
  spacing: { before: 200, after: 80 },
  children: [new TextRun({ text, font: HEADLINE, size: 24, bold: true, allCaps: true, color: OBSIDIAN })],
});
const bullet = (text) => new Paragraph({
  bullet: { level: 0 },
  spacing: { before: 30, after: 30, line: 280 },
  children: [new TextRun({ text, font: BODY, size: 19, color: OBSIDIAN })],
});
const spacer = (h = 120) => new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun({ text: "" })] });

const cellBorder = { style: BorderStyle.SINGLE, size: 4, color: RULE };
const allBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const cell = (children, opts = {}) => new TableCell({
  borders: allBorders,
  width: { size: opts.width, type: WidthType.DXA },
  shading: opts.fill ? { fill: opts.fill, type: ShadingType.CLEAR, color: "auto" } : undefined,
  margins: { top: 100, bottom: 100, left: 140, right: 140 },
  verticalAlign: VerticalAlign.TOP,
  children,
});

// placeholder reference table
const phTable = (rows) => {
  const colW = [3000, 4560, 1800];
  const head = (t) => new Paragraph({ spacing: { before: 40, after: 40 },
    children: [new TextRun({ text: t, font: HEADLINE, size: 16, bold: true, color: PARCHMENT, allCaps: true, characterSpacing: 50 })] });
  const tx = (t, opts={}) => new Paragraph({ spacing: { before: 20, after: 20, line: 250 },
    children: [new TextRun({ text: t, font: opts.mono ? "Consolas" : BODY, size: 16, color: opts.color ?? OBSIDIAN, bold: opts.bold ?? false })] });
  const r = (ph, what, where) => new TableRow({ children: [
    cell([tx(ph, { bold: true })], { width: colW[0], fill: SAND }),
    cell([tx(what)], { width: colW[1] }),
    cell([tx(where, { color: DUSK })], { width: colW[2] }),
  ] });
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: colW,
    rows: [
      new TableRow({ tableHeader: true, children: [
        cell([head("Placeholder")], { width: colW[0], fill: OBSIDIAN }),
        cell([head("What to write")], { width: colW[1], fill: OBSIDIAN }),
        cell([head("Appears in")], { width: colW[2], fill: OBSIDIAN }),
      ] }),
      ...rows.map(([a,b,c]) => r(a,b,c)),
    ],
  });
};

const doc = new Document({
  creator: "Opportunity Designed",
  title: "Template Fill-In Guide",
  styles: { default: { document: { run: { font: BODY, size: 20, color: OBSIDIAN } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
      children: [
        new TextRun({ text: "OPPORTUNITY DESIGNED", font: HEADLINE, size: 16, bold: true, color: OBSIDIAN, characterSpacing: 100 }),
        new TextRun({ text: "\tTemplate fill-in guide", font: BODY, size: 16, color: DUSK }),
      ] })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
      children: [
        new TextRun({ text: "Internal use. Not sent to clients.", font: BODY, size: 16, italics: true, color: DUSK }),
        new TextRun({ text: "\tPage ", font: BODY, size: 16, color: DUSK }),
        new TextRun({ children: [PageNumber.CURRENT], font: BODY, size: 16, color: DUSK }),
        new TextRun({ text: " / ", font: BODY, size: 16, color: DUSK }),
        new TextRun({ children: [PageNumber.TOTAL_PAGES], font: BODY, size: 16, color: DUSK }),
      ] })] }) },
    children: [
      spacer(200),
      new Paragraph({ spacing: { before: 0, after: 80 },
        children: [new TextRun({ text: "PROPOSAL PACKAGE TEMPLATES", font: BODY, size: 18, color: OBSIDIAN, bold: true, allCaps: true, characterSpacing: 100 })] }),
      h1("Fill-in guide."),
      p("Three reusable templates: the proposal, the cover letter, and the Project Timeline & Scope. Everything a client never sees is locked in. Everything that changes per client is marked with a [BRACKETED PLACEHOLDER]. Replace each one, delete the brackets, and you have a finished package.", { after: 120 }),

      eyebrow("One-time setup on your Mac"),
      p("Do these three things once, and every proposal after that renders in the real Opportunity Designed fonts. Skip this and Word will substitute defaults that break the brand look.", { after: 60 }),
      bullet("Install Anton. Go to fonts.google.com/specimen/Anton → Download family. Unzip → double-click Anton-Regular.ttf → Install Font in Font Book."),
      bullet("Install Inter. Go to fonts.google.com/specimen/Inter → Download family. Unzip → open the /static/ folder → select all .ttf files → double-click any one → Install Font (installs the whole family)."),
      bullet("Turn on font embedding in Word. Word menu → Preferences → Save → check 'Embed fonts in the file' and uncheck 'Do not embed common system fonts.' Now any .docx you save carries the fonts with it, so the client sees the real design even without the fonts on their machine."),

      eyebrow("How to use — per client"),
      bullet("Open the TEMPLATE file and immediately Save As with the client name (for example, Acme-Proposal.docx). Never edit the TEMPLATE original, so it stays clean for next time."),
      bullet("Work through every [BRACKETED] placeholder top to bottom. Each one tells you what to write and often gives an example from the SX Collective version."),
      bullet("Fastest path: use Claude for Word, or Find & Replace, to swap [CLIENT COMPANY] everywhere at once. Then fill the longer story and scope placeholders by hand."),
      bullet("Before sending, search the document for the [ and ] characters. If any bracket is left, you missed a placeholder."),

      eyebrow("The placeholders"),
      phTable([
        ["[CLIENT COMPANY]", "The client's business name. Used throughout.", "All three"],
        ["[CLIENT CONTACT FIRST NAME]", "Your main point of contact, the person the cover letter is addressed to.", "Cover, Timeline"],
        ["[MONTH YEAR]", "Proposal issue date, e.g. June 2026.", "Proposal"],
        ["[ONE-LINE PROJECT DESCRIPTION]", "The whole engagement in one sentence, on the cover.", "Proposal"],
        ["[THEME 1 / 2 / 3]", "The three things you heard in your conversations. Lead each with a one-word label.", "Proposal §01"],
        ["[PILLAR 1 / 2 / 3 NAME + DESCRIPTION]", "Your three workstreams and a short description of each. Pillar 01 is always the deepest.", "Proposal §02, Timeline"],
        ["[TIER 1 / 2 / 3 PRICE]", "The three fixed prices. Anchor to what the client's size can carry.", "Proposal, Acceptance"],
        ["[TIER 2 NAME]", "The name of the recommended middle tier (e.g. The Assortment Plan).", "Proposal, Timeline"],
        ["[TIER x — who it's for]", "One line per tier on the buyer it fits.", "Proposal table"],
        ["[TIER x deliverables, short]", "One line per tier of headline deliverables.", "Proposal table"],
        ["[WHY TIER 2 IS THE SMART CHOICE]", "The persuasive callout: the single biggest lever in this client's business and how Tier 02 lands it.", "Proposal §03"],
        ["[TIER x SUMMARY + deliverable bullets + What you get out of it]", "The detailed scope per tier. Swap the bullets and the outcome paragraph.", "Proposal §04"],
        ["[KEY DECISIONS]", "The decisions you're hired to help make (e.g. assortment, margin, brand).", "Proposal §05"],
        ["[BRANDS THEY'RE GOING AFTER]", "The brands or partners this client wants access to.", "Proposal §05, Cover"],
        ["[CLIENT DATA]", "The data you need in Week 01 (e.g. assortment exports).", "Proposal §07, Timeline"],
        ["[CUSTOMER STORY]", "Who the client serves, in vivid, specific detail. The cover letter opener.", "Cover"],
        ["[WHAT THEY ALREADY HAVE / THE GAP / WHAT THEY WALK AWAY WITH]", "The foundation, the missing piece, and the outcome. Cover letter spine.", "Cover"],
        ["[WHY THIS CLIENT, PERSONALLY]", "Your genuine connection to what they're building.", "Cover"],
        ["[CLIENT MATERIALS]", "The documents you review at kickoff.", "Timeline"],
        ["[SCOPE deliverable placeholders]", "The contents of each tier's deliverables. Keep the protective hedges (e.g. 'Intended to...', 'Exact scope is a goal, not a fixed commitment').", "Timeline §03"],
      ]),

      eyebrow("Reusable as-is — usually no change needed"),
      bullet("The Why I'm the right person bullets in the proposal are your standing credentials. Swap only the brand names and the [CLIENT COMPANY] references."),
      bullet("The track record paragraph in the cover letter is reusable word for word."),
      bullet("Working session counts, team-conversation counts, revision rounds, 30/60/90-day durations, and the milestone day numbers are your standard model. Keep them unless an engagement genuinely differs."),

      eyebrow("Protected — keep these verbatim"),
      p("These sections are your legal protection. Do not trim or reword them. Only the client name inside them changes.", { after: 60, italics: true, color: DUSK }),
      bullet("Proposal §08 Investment & Terms, every row: Payment structure, Deposit, Revisions, Deliverable acceptance, Termination, Confidentiality & IP, Proposal validity, Late payment, and Full terms."),
      bullet("Proposal §06 working-document disclaimer (the 'Important.' block about the Timeline & Scope not being a contract)."),
      bullet("Proposal §10 Acceptance language and the signature blocks."),
      bullet("Timeline & Scope cover disclaimer banner (the 'Important. This is a working document, not a contract.' block) and the closing change-log clause."),
      bullet("Any reference to the Master Services Agreement, the mutual NDA, and the Separation Agreement. Those documents carry the rest of your protection and are referenced by name on purpose."),

      eyebrow("How to ship — protect the brand look"),
      p("Anton and Inter are the Opportunity Designed fonts. If the recipient doesn't have them installed, Word substitutes a default and the design breaks. Two ways to prevent that:", { after: 60 }),
      bullet("Send as PDF (recommended). Every branded touch stays intact and the recipient can't edit accidentally. In Word: File → Save As (or Export) → PDF."),
      bullet("If you need to send an editable .docx, embed the fonts first. In Word for Mac: Word menu → Preferences → Save → check 'Embed fonts in the file' and uncheck 'Do not embed common system fonts.' In Word for Windows: File → Options → Save → check 'Embed fonts in the file' and adjust the same setting. Save the file after enabling. The .docx will get a bit larger, but the client sees the real design."),
      bullet("If you're using Claude for Word to make edits, do the embed step once on the client version after your final pass, then export the PDF from that same file."),

      spacer(160),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 160, after: 40 },
        children: [new TextRun({ text: "OPPORTUNITY DESIGNED", font: HEADLINE, size: 20, bold: true, allCaps: true, color: OBSIDIAN, characterSpacing: 200 })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 0 },
        children: [new TextRun({ text: "Growth strategy for consumer brands and the businesses that sell them.", font: HEADLINE, size: 16, italics: true, color: DUSK })] }),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = "/sessions/eloquent-friendly-cori/mnt/career/TEMPLATE-Fill-In-Guide.docx";
  fs.writeFileSync(out, buf);
  console.log("Wrote: " + out + "  (" + buf.length + " bytes)");
});
