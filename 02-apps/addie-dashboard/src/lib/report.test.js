import { describe, expect, it } from "vitest";
import { buildClientHTML, buildShareURL } from "./report";
import { sampleConsultant, sampleProject } from "../test/fixtures";

const html = (overrides = {}) => buildClientHTML(sampleProject(overrides), "Mar 9, 2026", sampleConsultant);

describe("buildClientHTML", () => {
  it("renders a full HTML document titled with the project and client", () => {
    const out = html();
    expect(out.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(out).toContain("<title>Growth Plan — Acme Co</title>");
    expect(out.trim().endsWith("</html>")).toBe(true);
  });

  it("shows the consultant, client and as-of line in the header", () => {
    const out = html();
    expect(out).toContain("Addie · Opportunity Designed");
    expect(out).toContain("Lead: Addie");
    expect(out).toContain("Meeting: 2026-03-09");
    expect(out).toContain("Rev. B");
    expect(out).toContain("As of Mar 9, 2026");
  });

  it("computes budget and milestone KPIs", () => {
    const out = html();
    expect(out).toContain("$6,000"); // remaining
    expect(out).toContain("60% left");
    expect(out).toContain("1/2"); // milestones done
  });

  it("colours the budget bar red once over 90% spent", () => {
    expect(html({ spent: 9500 })).toContain("#ef4444");
    expect(html({ spent: 8000 })).toContain("#f59e0b");
    expect(html({ spent: 1000 })).toContain("#10b981");
  });

  it("hides the budget bar when there is no budget", () => {
    expect(html({ budget: 0, spent: 0 })).not.toContain("Budget: $0 of $0");
  });

  it("adds the confidential banner and title marker only when flagged", () => {
    expect(html()).not.toContain("CONFIDENTIAL");
    const conf = html({ confidential: true });
    expect(conf).toContain("[CONFIDENTIAL]");
    expect(conf).toContain("Confidential — Not for Distribution");
  });

  it("omits optional sections that have no content", () => {
    const out = html({ talkingPoints: "", decisions: [] });
    expect(out).not.toContain("Talking Points");
    expect(out).not.toContain("Decision Log");
  });

  it("falls back to empty-state copy for each log", () => {
    const out = html({ milestones: [], deliverables: [], risks: [], openAsks: [], execSummary: "" });
    expect(out).toContain("No summary provided.");
    expect(out).toContain("No milestones added");
    expect(out).toContain("No deliverables added");
    expect(out).toContain("No risks logged");
    expect(out).toContain("No open asks");
  });

  it("includes logos only when supplied", () => {
    expect(html()).not.toContain('alt="client logo"');
    expect(buildClientHTML(sampleProject({ clientLogoDataUrl: "data:image/png;base64,AAA" }), "Mar 9, 2026", { ...sampleConsultant, logoDataUrl: "data:image/png;base64,BBB" }))
      .toContain('alt="client logo"');
  });
});

describe("buildShareURL", () => {
  it("encodes the project into a ?view= payload on the current path", () => {
    const url = buildShareURL(sampleProject());
    const [base, query] = url.split("?view=");
    expect(base).toBe(window.location.href.split("?")[0]);
    const decoded = JSON.parse(decodeURIComponent(atob(query)));
    expect(decoded.name).toBe("Growth Plan");
  });

  it("strips the client logo so the URL stays small", () => {
    const url = buildShareURL(sampleProject({ clientLogoDataUrl: "data:image/png;base64,AAAA" }));
    const decoded = JSON.parse(decodeURIComponent(atob(url.split("?view=")[1])));
    expect(decoded.clientLogoDataUrl).toBe("");
  });

  it("falls back to the current URL when the project cannot be encoded", () => {
    const cyclic = sampleProject();
    cyclic.self = cyclic;
    expect(buildShareURL(cyclic)).toBe(window.location.href);
  });
});
