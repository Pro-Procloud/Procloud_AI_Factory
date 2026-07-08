import "@testing-library/jest-dom/vitest";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "@/components/app-shell";
import { prototypeData } from "@/data/prototype";

describe("AppShell", () => {
  it("renders all primary navigation items and the visible gate rail", () => {
    render(
      <AppShell active="Command Center">
        <div>Page body</div>
      </AppShell>
    );

    for (const item of ["Command Center", "Issue Inbox", "Runs", "Gates", "Agents", "Architecture", "Feature Pipeline"]) {
      expect(screen.getByRole("link", { name: item })).toBeInTheDocument();
    }

    for (const gate of prototypeData.gates) {
      expect(screen.getByLabelText(`${gate.id} ${gate.status}`)).toBeInTheDocument();
    }
  });
});
