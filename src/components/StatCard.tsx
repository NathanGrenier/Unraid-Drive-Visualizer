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
    <div className="relative flex flex-col">
      {/* Main Card Container */}
      <div
        className={`bg-unraid-gray rounded-2xl border p-4 flex flex-col h-full ${
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
      </div>

      {subtext && (
        <div className="absolute top-full left-0 right-0 pt-1.5 px-2 z-10 pointer-events-none">
          <p className="text-xs text-red-400/80 leading-tight">{subtext}</p>
        </div>
      )}
    </div>
  );
}
