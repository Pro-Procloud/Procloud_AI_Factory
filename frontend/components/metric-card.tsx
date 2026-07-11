import { StatusBadge } from "@/components/status-badge";

export function MetricCard({ label, value, detail, tone }: { label: string; value: string; detail: string; tone: "neutral" | "good" | "warn" | "danger" }) {
  return (
    <section className="rounded-md border border-line bg-panel p-4 shadow-subtle">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted">{label}</p>
        <StatusBadge label={tone} tone={tone} />
      </div>
      <p className="mt-3 text-2xl font-semibold text-text">{value}</p>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </section>
  );
}
