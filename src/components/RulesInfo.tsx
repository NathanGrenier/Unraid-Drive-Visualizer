import { Info } from "lucide-react";

export function RulesInfo() {
  return (
    <section className="bg-blue-950/30 border border-blue-900/50 rounded-2xl p-5 text-sm text-blue-200/80">
      <h3 className="font-semibold text-blue-400 flex items-center gap-2 mb-2">
        <Info className="w-4 h-4" /> Unraid Rules Applied
      </h3>
      <ul className="list-disc list-inside space-y-1 ml-1">
        <li>Largest drives are automatically assigned as parity.</li>
        <li>Parity drives must be &ge; the largest data drive.</li>
        <li>Total usable space is the sum of all data drives.</li>
      </ul>
    </section>
  );
}
