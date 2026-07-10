import Link from "next/link";
import { Play } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { prototypeData } from "@/data/prototype";

export default function IssueInboxPage() {
  return (
    <AppShell active="Issue Inbox">
      <section className="rounded-md border border-line bg-panel p-5 shadow-subtle">
        <p className="text-sm text-muted">Issue Inbox</p>
        <h1 className="mt-1 text-2xl font-semibold">Plane inbound queue</h1>
        <div className="mt-4 divide-y divide-line">
          {prototypeData.issues.map((issue) => (
            <div key={issue.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="text-sm font-semibold">
                  {issue.id}: {issue.title}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {issue.source} · {issue.type} · {issue.dedupeStatus} · {issue.readiness}
                </p>
              </div>
              {issue.id === "BUG-1842" ? (
                <Link
                  href="/runs/BUG-1842"
                  className="focus-ring inline-flex items-center gap-2 rounded-md border border-accent bg-accent px-3 py-2 text-sm font-medium text-white"
                >
                  <Play size={16} aria-hidden="true" />
                  Start Bugfix Workflow
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
