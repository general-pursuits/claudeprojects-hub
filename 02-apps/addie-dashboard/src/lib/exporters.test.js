import { describe, expect, it } from "vitest";
import { buildCSVRows, buildExcelSheets, csvText, exportFileName } from "./exporters";
import { sampleProject } from "../test/fixtures";

describe("exportFileName", () => {
  it("replaces whitespace runs with underscores", () => {
    expect(exportFileName(sampleProject({ client: "Acme  Co", name: "Growth Plan" }), ".csv"))
      .toBe("Acme_Co_Growth_Plan.csv");
  });
});

describe("buildCSVRows", () => {
  const rows = buildCSVRows(sampleProject());
  const text = csvText(rows);

  it("puts the summary fields first", () => {
    expect(rows[0]).toEqual(["Project", "Growth Plan"]);
    expect(rows).toContainEqual(["Remaining", 6000]);
    expect(rows).toContainEqual(["Confidential", "No"]);
  });

  it("escapes embedded quotes in free-text fields", () => {
    expect(text).toContain('"Phase one, ""on track"""');
    expect(text).toContain('"Draft ""brief"""');
  });

  it("renders booleans as Yes/No", () => {
    expect(rows).toContainEqual(['"Kickoff"', "2026-02-01", "Yes"]);
    expect(text).toContain('"Send brand assets",Acme Co,2026-03-12,No');
  });

  it("includes a section header for every log", () => {
    for (const section of ["EXEC SUMMARY", "TALKING POINTS", "TASKS", "MILESTONES", "DELIVERABLES", "RISKS", "DECISIONS", "OPEN ASKS"]) {
      expect(rows).toContainEqual([section]);
    }
  });

  it("handles a project with no rows in any log", () => {
    const empty = sampleProject({ tasks: [], milestones: [], deliverables: [], risks: [], decisions: [], openAsks: [], execSummary: "", talkingPoints: "" });
    expect(() => csvText(buildCSVRows(empty))).not.toThrow();
    expect(csvText(buildCSVRows(empty))).toContain('EXEC SUMMARY\n""');
  });
});

describe("buildExcelSheets", () => {
  const sheets = buildExcelSheets(sampleProject());

  it("creates one sheet per section", () => {
    expect(Object.keys(sheets)).toEqual(["Summary", "Tasks", "Milestones", "Deliverables", "Risks", "Decisions", "Open Asks"]);
  });

  it("writes unescaped values with a header row", () => {
    expect(sheets.Tasks[0]).toEqual(["Task", "Owner", "Due", "Status"]);
    expect(sheets.Tasks[1]).toEqual(['Draft "brief"', "Addie", "2026-03-01", "Done"]);
    expect(sheets.Summary).toContainEqual(["Remaining", 6000]);
  });

  it("keeps only the header row when a section is empty", () => {
    expect(buildExcelSheets(sampleProject({ risks: [] })).Risks).toHaveLength(1);
  });
});
