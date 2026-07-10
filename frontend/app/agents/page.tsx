import { AppShell } from "@/components/app-shell";
import { prototypeData } from "@/data/prototype";

export default function AgentRegistryPage() {
  return (
    <AppShell active="Agents">
      <section className="space-y-4">
        <div className="rounded-md border border-line bg-panel p-5 shadow-subtle">
          <p className="text-sm text-muted">Agent Registry</p>
          <h1 className="mt-1 text-2xl font-semibold">Agent capabilities and boundaries</h1>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {prototypeData.agents.map((agent) => (
            <article key={agent.id} className="rounded-md border border-line bg-panel p-4 shadow-subtle">
              <h2 className="text-base font-semibold">{agent.name}</h2>
              <p className="mt-2 text-sm text-muted">{agent.role}</p>
              <h3 className="mt-4 text-sm font-semibold">Permissions</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {agent.permissions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <h3 className="mt-4 text-sm font-semibold">Limits</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
                {agent.limits.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
