import { AppShell } from "@/components/app-shell";
import { prototypeData } from "@/data/prototype";

export default function FeaturePipelinePage() {
  return (
    <AppShell active="Feature Pipeline">
      <section className="rounded-md border border-line bg-panel p-5 shadow-subtle">
        <p className="text-sm text-muted">Feature Pipeline</p>
        <h1 className="mt-1 text-2xl font-semibold">G1/G2/G4 expansion path</h1>
        <p className="mt-2 text-sm text-muted">
          第一版原型只激活 Bugfix 的 G3 MR Approval；Feature workflow 在这里展示未来扩展位。
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {prototypeData.gates.map((gate) => (
            <div key={gate.id} className="rounded-md border border-line p-4">
              <p className="text-sm font-semibold">
                {gate.id}: {gate.name}
              </p>
              <p className="mt-1 text-sm text-muted">{gate.status}</p>
              <p className="mt-2 text-sm text-muted">{gate.description}</p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
