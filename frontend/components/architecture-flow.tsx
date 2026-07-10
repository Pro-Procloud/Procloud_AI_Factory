import type { ArchitectureNode } from "@/lib/types";

export function ArchitectureFlow({ nodes }: { nodes: ArchitectureNode[] }) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {nodes.map((node, index) => (
        <div key={node.name} className="rounded-md border border-line bg-panel p-4 shadow-subtle">
          <p className="text-xs text-muted">Step {index + 1}</p>
          <h2 className="mt-1 text-base font-semibold">{node.name}</h2>
          <p className="mt-2 text-sm text-muted">{node.responsibility}</p>
        </div>
      ))}
    </div>
  );
}
