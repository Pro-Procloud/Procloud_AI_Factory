import { CheckCircle2, GitPullRequest, RotateCcw, TriangleAlert } from "lucide-react";
import { ActionBar } from "@/components/action-bar";
import { AppShell } from "@/components/app-shell";
import { AuditLog } from "@/components/audit-log";
import { prototypeData } from "@/data/prototype";

export default function GateConsolePage() {
  const run = prototypeData.runs.find((candidate) => candidate.id === "BUG-1842");

  if (!run) {
    return (
      <AppShell active="Gates">
        <section className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <p className="text-sm text-muted">Gate Console</p>
          <h1 className="mt-1 text-2xl font-semibold">Primary demo run unavailable</h1>
          <p className="mt-2 text-sm text-muted">BUG-1842 is missing from prototype data.</p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell active="Gates">
      <section className="space-y-4">
        <div className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <p className="text-sm text-muted">Gate Console</p>
          <h1 className="mt-1 text-2xl font-semibold">G3 MR Approval</h1>
          <p className="mt-2 text-sm text-muted">
            {run.id} is ready for human review. G1/G2/G4 remain visible as Feature Pipeline expansion.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-line p-3 text-sm">Diff summary: refund status transition adjusted</div>
            <div className="rounded-md border border-line p-3 text-sm">Tests: unit and routing checks passed</div>
            <div className="rounded-md border border-line p-3 text-sm">Security: no blocking issue</div>
          </div>
          <div className="mt-4">
            <ActionBar
              actions={[
                { label: "Approve MR", icon: CheckCircle2, variant: "primary" },
                { label: "Request Fix", icon: RotateCcw },
                { label: "Escalate", icon: TriangleAlert, variant: "danger" },
                { label: "Open MR", icon: GitPullRequest }
              ]}
            />
          </div>
        </div>
        <AuditLog items={prototypeData.auditObjects} />
      </section>
    </AppShell>
  );
}
