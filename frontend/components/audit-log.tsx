import type { AuditObject } from "@/lib/types";

export function AuditLog({ items }: { items: AuditObject[] }) {
  return (
    <div className="rounded-md border border-line bg-panel p-4 shadow-subtle">
      <h2 className="text-sm font-semibold">Audit Objects</h2>
      <div className="mt-3 divide-y divide-line">
        {items.map((item) => (
          <div key={item.name} className="py-3">
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="mt-1 text-sm text-muted">{item.purpose}</p>
            <p className="mt-1 text-xs text-muted">{item.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
