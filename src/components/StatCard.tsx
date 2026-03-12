type StatCardProps = {
  title: string;
  value: number;
  color: string;
  highlight?: boolean;
  subtext?: string;
};

export function StatCard({
  title,
  value,
  color,
  highlight = false,
  subtext,
}: StatCardProps) {
  return (
    <div
      className={`bg-unraid-gray rounded-2xl border p-4 flex flex-col justify-between ${
        highlight
          ? "border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          : "border-white/5"
      }`}
    >
      <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
      <div className="flex items-baseline gap-1">
        <span className={`text-3xl font-bold tracking-tight ${color}`}>
          {value.toFixed(1).replace(/\.0$/, "")}
        </span>
        <span className="text-sm font-medium text-gray-500">TB</span>
      </div>
      {subtext && (
        <p className="text-xs text-red-400/80 mt-2 leading-tight">{subtext}</p>
      )}
    </div>
  );
}
