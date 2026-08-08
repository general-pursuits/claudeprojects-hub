import { describe, expect, it, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { STORAGE_KEY, loadState } from "./lib/dashboard";

const renderApp = () => ({ user: userEvent.setup(), ...render(<App />) });
const addProjectButton = () => screen.getByRole("button", { name: "New project" });

describe("App", () => {
  beforeEach(() => localStorage.clear());

  it("starts with a single blank project when there is nothing stored", () => {
    renderApp();
    expect(screen.getByText("Project Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Client Name")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Executive Summary" })).toBeInTheDocument();
  });

  it("restores previously saved state from localStorage", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      dashTitle: "Client Portfolio",
      updatedAt: "Mar 9, 2026",
      projects: [{ id: 9, name: "Growth Plan", client: "Acme Co", lead: "Addie", rag: "Amber", budget: 100, spent: 40, tasks: [], milestones: [], deliverables: [], risks: [], decisions: [], openAsks: [], meetings: [], budgetHistory: [] }],
    }));
    renderApp();
    expect(screen.getByText("Client Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Acme Co")).toBeInTheDocument();
  });

  it("renders a project saved before newer fields existed", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      dashTitle: "Legacy", updatedAt: "old",
      projects: [{ id: 1, name: "Old", client: "C", lead: "L", rag: "Green", budget: 0, spent: 0, tasks: [], milestones: [] }],
    }));
    expect(() => renderApp()).not.toThrow();
    expect(screen.getByText("Legacy")).toBeInTheDocument();
  });

  it("adds a project and persists it", async () => {
    const { user } = renderApp();
    await user.click(addProjectButton());
    expect(loadState().projects).toHaveLength(2);
  });

  it("saves an inline edit of the dashboard title", async () => {
    const { user } = renderApp();
    await user.click(screen.getByText("Project Dashboard"));
    const input = screen.getByDisplayValue("Project Dashboard");
    await user.clear(input);
    await user.type(input, "Q3 Portfolio{Enter}");
    expect(screen.getByText("Q3 Portfolio")).toBeInTheDocument();
    expect(loadState().dashTitle).toBe("Q3 Portfolio");
  });

  it("discards an inline edit on Escape", async () => {
    const { user } = renderApp();
    await user.click(screen.getByText("Project Dashboard"));
    const input = screen.getByDisplayValue("Project Dashboard");
    await user.clear(input);
    await user.type(input, "Throwaway{Escape}");
    expect(screen.getByText("Project Dashboard")).toBeInTheDocument();
    expect(loadState()).toBeNull();
  });

  it("shows the confidential banner when the project is flagged", async () => {
    const { user } = renderApp();
    expect(screen.queryByText(/not for distribution/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole("checkbox"));
    expect(screen.getByText(/not for distribution/i)).toBeInTheDocument();
  });

  it("hides a panel when it is toggled off in the panel menu", async () => {
    const { user } = renderApp();
    await user.click(screen.getByRole("button", { name: /panels/i }));
    await user.click(screen.getByRole("checkbox", { name: /executive summary/i }));
    expect(screen.queryByRole("heading", { name: "Executive Summary" })).not.toBeInTheDocument();
  });

  it("sets the document title from the active project", () => {
    renderApp();
    expect(document.title).toBe("New Project — Client Name");
  });
});
