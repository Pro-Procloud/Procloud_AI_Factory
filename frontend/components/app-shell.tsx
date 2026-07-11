import { Factory, Search } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { GateRail } from "@/components/gate-rail";
import { prototypeData } from "@/data/prototype";

const navItems = [
  { label: "Command Center", href: "/" },
  { label: "Issue Inbox", href: "/inbox" },
  { label: "Runs", href: "/runs/BUG-1842" },
  { label: "Gates", href: "/gates" },
  { label: "Agents", href: "/agents" },
  { label: "Architecture", href: "/architecture" },
  { label: "Feature Pipeline", href: "/feature-pipeline" }
];

export function AppShell({ active, children }: { active: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-line bg-panel">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border border-line bg-surface">
              <Factory size={18} aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold">Procloud AI Factory</p>
              <p className="text-xs text-muted">Bugfix workflow prototype</p>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-md border border-line bg-surface px-3 py-2 text-sm text-muted md:flex">
            <Search size={15} aria-hidden="true" />
            Search runs, gates, agents
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-4 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
        <nav className="rounded-md border border-line bg-panel p-2 shadow-subtle">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`focus-ring block rounded px-3 py-2 text-sm ${active === item.label ? "bg-surface font-semibold text-text" : "text-muted hover:text-text"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main>{children}</main>
        <GateRail gates={prototypeData.gates} />
      </div>
    </div>
  );
}
