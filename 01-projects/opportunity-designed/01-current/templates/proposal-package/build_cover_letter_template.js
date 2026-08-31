const fs = require('fs');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, TabStopType,
  BorderStyle, WidthType
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
const HEADLINE = "Anton";
const BODY     = "Inter";

const para = (text, opts = {}) => new Paragraph({
  spacing: { before: opts.before ?? 0, after: opts.after ?? 200, line: 320 },
  alignment: opts.align ?? AlignmentType.LEFT,
  children: [new TextRun({
    text, font: opts.font ?? BODY, size: opts.size ?? 22,
    color: opts.color ?? OBSIDIAN, bold: opts.bold ?? false,
    italics: opts.italics ?? false,
  })],
});

const spacer = (h = 200) => new Paragraph({ spacing: { before: h, after: 0 }, children: [new TextRun({ text: "" })] });

const doc = new Document({
  creator: "Opportunity Designed",
  title: "[CLIENT COMPANY] Cover Letter",
  styles: { default: { document: { run: { font: BODY, size: 22, color: OBSIDIAN } } } },
  sections: [{
    properties: { page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
    headers: { default: new Header({ children: [(function headerTable() {
      const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
      const nb = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };
      const colW = [4680, 4680];
      return new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: colW,
        rows: [new TableRow({ children: [
          new TableCell({ borders: nb, width: { size: colW[0], type: WidthType.DXA },
            margins: { top: 0, bottom: 60, left: 0, right: 0 },
            children: [new Paragraph({ children: [new TextRun({ text: "OPPORTUNITY DESIGNED", font: HEADLINE, size: 16, bold: true, color: OBSIDIAN, characterSpacing: 100 })] })] }),
          new TableCell({ borders: nb, width: { size: colW[1], type: WidthType.DXA },
            margins: { top: 0, bottom: 60, left: 0, right: 0 },
            children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: "Cover letter  ·  [CLIENT COMPANY]", font: BODY, size: 16, color: OBSIDIAN })] })] }),
        ] })],
      });
    })()] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: "Growth strategy for consumer brands and the businesses that sell them.", font: BODY, size: 14, italics: true, color: WARM_GRAY })],
    })] }) },
    children: [
      // ============ TOP META ============
      spacer(200),
      new Paragraph({
        spacing: { before: 0, after: 60 },
        tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
        children: [
          new TextRun({ text: "[CLIENT CONTACT FIRST NAME],", font: HEADLINE, size: 36, bold: true, allCaps: true, color: OBSIDIAN }),
          new TextRun({ text: "\t____________________", font: BODY, size: 18, color: OBSIDIAN }),
        ],
      }),
      new Paragraph({
        spacing: { before: 0, after: 320 },
        tabStops: [{ type: TabStopType.RIGHT, position: 9360 }],
        children: [
          new TextRun({ text: "", font: BODY, size: 18, color: DUSK }),
          new TextRun({ text: "\tDate", font: BODY, size: 16, color: DUSK }),
        ],
      }),

      // ============ BODY ============
      // PARA 1 — the customer story. Open on the specific person the client serves. 3 to 5 concrete details, then the turn: what they've outgrown, and that [CLIENT COMPANY] is what they've been waiting for.
      para("[CUSTOMER STORY — I keep thinking about the person you're building this for. (2 to 4 vivid, specific sentences about who that customer is and what they want.) They've outgrown (the alternatives). [CLIENT COMPANY] is what they've been waiting for.]"),

      // PARA 2 — the foundation and the gap. What they already have, then what's missing, then 'That's what this project is for.'
      para("You have the foundation. [WHAT THEY ALREADY HAVE — 3 to 4 assets in a list.] What's missing is [THE GAP — the plan/concept/rhythm this project delivers]. That's what this project is for."),

      // PARA 3 — why you, personally. Keep the opener; swap the community line and brands for this client.
      para("I'm not coming to this as a consultant looking for a logo on a portfolio page. [WHY THIS CLIENT, PERSONALLY — one sentence on your connection to what they're building.] [If relevant: the brands you're going after, [BRANDS], are brands I've worked with directly,] and the barriers to entry are ones I've worked through."),

      // PARA 4 — track record. Reusable as-is; this is your standing credential set.
      para("What I'd bring is track record. Vendor relationships built from scratch into top accounts. Doubled revenue for existing brands. Partnerships grown into largest US distributor positions. Top brands have come to me for input on their own product development. I'm fluent across OTB, cost models, and the P&L, and I've worked the brand side too."),

      // PARA 5 — the vision close + commitment. Swap the deliverables; keep the 'If we sign, you have me' commitment.
      para("We can do something real here. Not a deck that lands well and then stalls. [WHAT THEY WALK AWAY WITH — 2 to 3 concrete outcomes their team can carry forward.] If we sign, you have me. I'll push back when I disagree, sit next to you in the hard calls, and help [CLIENT COMPANY] become the operator I think it can be."),

      spacer(80),
      para("Looking forward to building this with you,", { after: 240 }),

      new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: "Addie Morrow", font: HEADLINE, size: 26, bold: true, allCaps: true, color: OBSIDIAN })],
      }),
      new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: "Opportunity Designed", font: BODY, size: 18, color: DUSK })],
      }),
      new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [new TextRun({ text: "hello@opportunitydesigned.com  ·  opportunitydesigned.com", font: BODY, size: 16, color: DUSK })],
      }),
    ],
  }],
});

Packer.toBuffer(doc).then(buf => {
  const out = "/sessions/eloquent-friendly-cori/mnt/career/TEMPLATE-Cover-Letter.docx";
  fs.writeFileSync(out, buf);
  console.log("Wrote: " + out + "  (" + buf.length + " bytes)");
});
