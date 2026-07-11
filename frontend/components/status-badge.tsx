const toneClass = {
  neutral: "border-line bg-surface text-muted",
  good: "border-green-200 bg-green-50 text-good",
  warn: "border-amber-200 bg-amber-50 text-warn",
  danger: "border-red-200 bg-red-50 text-danger"
};

export function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: keyof typeof toneClass }) {
  return <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium border ${toneClass[tone]}`}>{label}</span>;
}
