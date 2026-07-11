import { describe, expect, it } from "vitest";
import { prototypeData } from "@/data/prototype";
import { formatCurrency, formatPercent } from "@/lib/format";

describe("prototype data", () => {
  it("contains the approved Bugfix workflow and visible future gates", () => {
    const primaryRun = prototypeData.runs.find((run) => run.id === "BUG-1842");

    expect(primaryRun?.workflow).toEqual([
      "Plane Issue",
      "AI Run",
      "Review Loop",
      "G3 MR Approval",
      "MR"
    ]);
    expect(prototypeData.gates.map((gate) => `${gate.id}:${gate.status}`)).toEqual([
      "G1:Feature-only",
      "G2:Feature-only",
      "G3:Active",
      "G4:Coming Next"
    ]);
  });

  it("contains required audit object types and failure scenarios", () => {
    expect(prototypeData.auditObjects.map((item) => item.name)).toEqual([
      "FactoryEvent",
      "GateResult",
      "Approval",
      "BudgetEvent"
    ]);
    expect(prototypeData.failureScenarios.map((item) => item.scenario)).toContain("重复 webhook");
    expect(prototypeData.failureScenarios.map((item) => item.scenario)).toContain("HMAC 验签失败");
    expect(prototypeData.failureScenarios.map((item) => item.scenario)).toContain("成本超限");
  });

  it("contains team programming and Git branch governance requirements", () => {
    expect(prototypeData.teamGitPolicy.map((item) => item.name)).toEqual([
      "Branch ownership",
      "Protected branches",
      "Team review handoff",
      "Parallel work safety",
      "Git audit trail"
    ]);
    expect(prototypeData.teamGitPolicy.map((item) => item.responsibility).join(" ")).toContain("force push");
    expect(prototypeData.teamGitPolicy.map((item) => item.responsibility).join(" ")).toContain("并行 AI Run");
  });

  it("formats command center metrics", () => {
    expect(formatCurrency(4.8)).toBe("$4.80");
    expect(formatPercent(0.68)).toBe("68%");
  });
});
