import { CheckCircle2, GitPullRequest, RotateCcw, TriangleAlert } from "lucide-react";
import { ActionBar } from "@/components/action-bar";
import { AppShell } from "@/components/app-shell";
import { AuditLog } from "@/components/audit-log";
import { prototypeData } from "@/data/prototype";

export default async function GateConsolePage({ searchParams }: { searchParams: Promise<{ decision?: string }> }) {
  const { decision } = await searchParams;
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
                { label: "Approve MR", icon: CheckCircle2, href: "/gates?decision=approved", variant: "primary" },
                { label: "Request Fix", icon: RotateCcw, href: "/gates?decision=fix" },
                { label: "Escalate", icon: TriangleAlert, href: "/gates?decision=escalated", variant: "danger" },
                { label: "Open MR", icon: GitPullRequest, href: "/gates?decision=mr" }
              ]}
            />
          </div>
        </div>
        {decision ? (
          <section className="rounded-md border border-line bg-panel p-4 shadow-subtle">
            <h2 className="text-base font-semibold">Decision preview</h2>
            <p className="mt-2 text-sm text-muted">
              {decision === "approved"
                ? "Approval recorded. The prototype run moves to MR ready with an Approval audit event."
                : decision === "fix"
                  ? "Fix requested. The review loop returns to backend_coder and records a GateResult blocker."
                  : decision === "escalated"
                    ? "Escalation created. The run is assigned to a human owner after max review or risk threshold."
                    : "MR link opened in preview mode. Real SCM integration is intentionally out of scope for this prototype."}
            </p>
          </section>
        ) : null}
        <AuditLog items={prototypeData.auditObjects} />
      </section>
    </AppShell>
  );
}
