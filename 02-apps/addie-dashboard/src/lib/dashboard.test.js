import { describe, expect, it, vi, afterEach } from "vitest";
import {
  DEFAULT_CONSULTANT, SETTINGS_KEY, STORAGE_KEY, blankProject, loadConsultant,
  loadState, migrateProject, nowStr, pct, saveConsultant, saveState, todayISO,
} from "./dashboard";

describe("pct", () => {
  it("returns 0 when the denominator is 0", () => {
    expect(pct(10, 0)).toBe(0);
    expect(pct(0, 0)).toBe(0);
  });

  it("rounds to the nearest whole percent", () => {
    expect(pct(1, 3)).toBe(33);
    expect(pct(2, 3)).toBe(67);
  });

  it("caps at 100 when over budget", () => {
    expect(pct(300, 100)).toBe(100);
  });
});

describe("blankProject", () => {
  it("uses the supplied id and safe defaults", () => {
    const p = blankProject(7);
    expect(p.id).toBe(7);
    expect(p).toMatchObject({ name: "New Project", status: "Planning", rag: "Green", budget: 0, spent: 0, confidential: false });
  });

  it("gives every project its own collection instances", () => {
    const a = blankProject(1);
    const b = blankProject(2);
    a.tasks.push({ id: 1 });
    expect(b.tasks).toEqual([]);
  });
});

describe("migrateProject", () => {
  it("adds fields introduced after the project was saved", () => {
    const legacy = { id: 3, name: "Old", client: "C", lead: "L", rag: "Green", budget: 0, spent: 0, tasks: [], milestones: [] };
    const migrated = migrateProject(legacy);
    expect(migrated.budgetHistory).toEqual([]);
    expect(migrated.meetingDate).toBe("");
    expect(migrated.confidential).toBe(false);
  });

  it("keeps saved values, including falsy ones", () => {
    const migrated = migrateProject({ id: 3, name: "Old", budget: 0, confidential: false, notes: "keep me" });
    expect(migrated).toMatchObject({ id: 3, name: "Old", budget: 0, confidential: false, notes: "keep me" });
  });
});

describe("todayISO / nowStr", () => {
  afterEach(() => vi.useRealTimers());

  it("formats today as YYYY-MM-DD", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-09T15:04:05Z"));
    expect(todayISO()).toBe("2026-03-09");
  });

  it("produces a human readable timestamp", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-09T15:04:05Z"));
    expect(nowStr()).toMatch(/Mar 9, 2026/);
  });
});

describe("state persistence", () => {
  it("returns null when nothing is stored", () => {
    expect(loadState()).toBeNull();
  });

  it("round-trips saved state", () => {
    const state = { dashTitle: "Q3", projects: [blankProject(1)], updatedAt: "now" };
    saveState(state);
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(state);
    expect(loadState()).toEqual(state);
  });

  it("returns null instead of throwing on corrupt JSON", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    expect(loadState()).toBeNull();
  });

  it("swallows storage write failures", () => {
    const spy = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("quota"); });
    expect(() => saveState({ projects: [] })).not.toThrow();
    spy.mockRestore();
  });
});

describe("consultant settings persistence", () => {
  it("falls back to the default consultant", () => {
    expect(loadConsultant()).toEqual(DEFAULT_CONSULTANT);
  });

  it("merges stored settings over the defaults", () => {
    saveConsultant({ firm: "Opportunity Designed" });
    expect(localStorage.getItem(SETTINGS_KEY)).toBe('{"firm":"Opportunity Designed"}');
    expect(loadConsultant()).toEqual({ ...DEFAULT_CONSULTANT, firm: "Opportunity Designed" });
  });

  it("falls back to the default consultant on corrupt JSON", () => {
    localStorage.setItem(SETTINGS_KEY, "nope");
    expect(loadConsultant()).toEqual(DEFAULT_CONSULTANT);
  });
});
