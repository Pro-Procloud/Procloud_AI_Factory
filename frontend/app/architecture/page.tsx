import { AppShell } from "@/components/app-shell";
import { ArchitectureFlow } from "@/components/architecture-flow";
import { AuditLog } from "@/components/audit-log";
import { prototypeData } from "@/data/prototype";

export default function ArchitectureTracePage() {
  return (
    <AppShell active="Architecture">
      <section className="space-y-4">
        <div className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <p className="text-sm text-muted">Architecture Trace</p>
          <h1 className="mt-1 text-2xl font-semibold">Plane → Gateway → LangGraph → Agent → MR</h1>
          <p className="mt-2 text-sm text-muted">Shows why the workflow is observable, auditable, and recoverable.</p>
        </div>
        <ArchitectureFlow nodes={prototypeData.architecture} />
        <section className="rounded-md border border-line bg-panel p-4 shadow-subtle">
          <h2 className="text-base font-semibold">Failure handling</h2>
          <div className="mt-3 divide-y divide-line">
            {prototypeData.failureScenarios.map((item) => (
              <div key={item.scenario} className="grid gap-2 py-3 text-sm md:grid-cols-3">
                <p className="font-semibold">{item.scenario}</p>
                <p className="text-muted">{item.systemBehavior}</p>
                <p className="text-muted">{item.userFeedback}</p>
              </div>
            ))}
          </div>
        </section>
        <AuditLog items={prototypeData.auditObjects} />
      </section>
    </AppShell>
  );
}
