import type { LucideIcon } from "lucide-react";

export interface ActionItem {
  label: string;
  icon: LucideIcon;
  variant?: "primary" | "secondary" | "danger";
}

export function ActionBar({ actions }: { actions: ActionItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const Icon = action.icon;
        const variant = action.variant ?? "secondary";
        const classes =
          variant === "primary"
            ? "bg-accent text-white border-accent"
            : variant === "danger"
              ? "bg-red-50 text-danger border-red-200"
              : "bg-panel text-text border-line";
        return (
          <button key={action.label} className={`focus-ring inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium ${classes}`}>
            <Icon size={16} aria-hidden="true" />
            {action.label}
          </button>
        );
      })}
    </div>
  );
}
