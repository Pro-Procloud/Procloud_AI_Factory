import Link from "next/link";
import { ArrowRight, CirclePause } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { MetricCard } from "@/components/metric-card";
import { prototypeData } from "@/data/prototype";

export default function CommandCenterPage() {
  const run = prototypeData.runs.find((candidate) => candidate.id === "BUG-1842");

  if (!run) {
    return (
      <AppShell active="Command Center">
        <section className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <p className="text-sm text-muted">Command Center</p>
          <h1 className="mt-1 text-2xl font-semibold">Primary demo run unavailable</h1>
          <p className="mt-2 text-sm text-muted">BUG-1842 is missing from prototype data.</p>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell active="Command Center">
      <section className="space-y-4">
        <div className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Command Center</p>
              <h1 className="mt-1 text-2xl font-semibold">AI tasks needing human attention</h1>
              <p className="mt-2 text-sm text-muted">Bugfix 主线已激活，Feature Pipeline 保留 G1/G2/G4 扩展位。</p>
            </div>
            <Link
              href={`/runs/${run.id}`}
              className="focus-ring inline-flex items-center gap-2 rounded-md border border-accent bg-accent px-3 py-2 text-sm font-medium text-white"
            >
              Open {run.id}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {prototypeData.metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <section className="rounded-md border border-line bg-panel p-4 shadow-subtle">
          <div className="flex items-center gap-2">
            <CirclePause size={17} aria-hidden="true" />
            <h2 className="text-base font-semibold">Pending intervention</h2>
          </div>
          <div className="mt-4 rounded-md border border-line p-4">
            <p className="text-sm font-semibold">
              {run.id}: {run.title}
            </p>
            <p className="mt-1 text-sm text-muted">
              Risk {run.risk} · Cost ${run.costUsed.toFixed(2)} / ${run.costLimit.toFixed(2)} · Review loop {run.reviewLoop}
            </p>
          </div>
        </section>
      </section>
    </AppShell>
  );
}
