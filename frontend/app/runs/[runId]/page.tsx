import { CirclePause, RotateCcw, ShieldCheck } from "lucide-react";
import { ActionBar } from "@/components/action-bar";
import { AppShell } from "@/components/app-shell";
import { Timeline } from "@/components/timeline";
import { prototypeData } from "@/data/prototype";

export default async function RunDetailPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = await params;
  const run =
    prototypeData.runs.find((candidate) => candidate.id === runId) ??
    prototypeData.runs.find((candidate) => candidate.id === "BUG-1842");

  if (!run) {
    return (
      <AppShell active="Runs">
        <section className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <p className="text-sm text-muted">Run Detail</p>
          <h1 className="mt-1 text-2xl font-semibold">Run unavailable</h1>
          <p className="mt-2 text-sm text-muted">The requested prototype run could not be loaded.</p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell active="Runs">
      <section className="space-y-4">
        <div className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <p className="text-sm text-muted">Run Detail</p>
          <h1 className="mt-1 text-2xl font-semibold">
            {run.id}: {run.title}
          </h1>
          <p className="mt-2 text-sm text-muted">{run.workflow.join(" → ")}</p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-md border border-line p-3 text-sm">
              Cost ${run.costUsed.toFixed(2)} / ${run.costLimit.toFixed(2)}
            </div>
            <div className="rounded-md border border-line p-3 text-sm">Review loop {run.reviewLoop}</div>
            <div className="rounded-md border border-line p-3 text-sm">Risk {run.risk}</div>
          </div>
          <div className="mt-4">
            <ActionBar
              actions={[
                { label: "View Gate Result", icon: ShieldCheck, variant: "primary" },
                { label: "Request Fix", icon: RotateCcw },
                { label: "Pause Run", icon: CirclePause, variant: "danger" }
              ]}
            />
          </div>
        </div>
        <Timeline events={run.timeline} />
      </section>
    </AppShell>
  );
}
