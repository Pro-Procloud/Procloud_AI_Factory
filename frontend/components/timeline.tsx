import type { TimelineEvent } from "@/lib/types";

export function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="space-y-3">
      {events.map((event) => (
        <li key={`${event.status}-${event.time}`} className="rounded-md border border-line bg-panel p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{event.label}</p>
              <p className="mt-1 text-sm text-muted">{event.detail}</p>
            </div>
            <span className="text-xs text-muted">{event.time}</span>
          </div>
          <p className="mt-2 text-xs text-muted">{event.actor}</p>
        </li>
      ))}
    </ol>
  );
}
