import { StatusBadge } from "@/components/status-badge";
import type { Gate } from "@/lib/types";

function gateTone(status: Gate["status"]) {
  if (status === "Active") return "good";
  if (status === "Coming Next") return "warn";
  return "neutral";
}

export function GateRail({ gates }: { gates: Gate[] }) {
  return (
    <aside className="rounded-md border border-line bg-panel p-4 shadow-subtle">
      <h2 className="text-sm font-semibold text-text">Approval Rail</h2>
      <div className="mt-4 space-y-3">
        {gates.map((gate) => (
          <div key={gate.id} aria-label={`${gate.id} ${gate.status}`} className="flex items-start justify-between gap-3 border-l-2 border-line pl-3">
            <div>
              <p className="text-sm font-semibold">{gate.id}</p>
              <p className="text-sm text-muted">{gate.name}</p>
            </div>
            <StatusBadge label={gate.status} tone={gateTone(gate.status)} />
          </div>
        ))}
      </div>
    </aside>
  );
}
