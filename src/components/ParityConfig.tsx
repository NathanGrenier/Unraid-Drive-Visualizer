import { ShieldCheck } from "lucide-react";

type ParityConfigProps = {
  parityCount: number;
  setParityCount: (n: number) => void;
};

export function ParityConfig({
  parityCount,
  setParityCount,
}: ParityConfigProps) {
  return (
    <section className="bg-unraid-gray rounded-2xl border border-white/5 p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-unraid-orange" /> Parity
        Configuration
      </h2>
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((count) => (
            <button
              key={count}
              onClick={() => setParityCount(count)}
              className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                parityCount === count
                  ? "bg-unraid-orange text-white shadow-md"
                  : "bg-unraid-dark text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {count} Parity
            </button>
          ))}
        </div>
        <div className="bg-unraid-dark/50 rounded-lg p-4 text-sm text-gray-400 border border-white/5">
          {parityCount === 0 && (
            <p>
              <strong className="text-red-400">Warning:</strong> Zero parity
              means no fault tolerance. Data loss is imminent upon drive
              failure.
            </p>
          )}
          {parityCount === 1 && (
            <p>
              Protects against{" "}
              <strong className="text-white">1 drive failure</strong>. Standard
              for arrays with &lt;10-12 drives.
            </p>
          )}
          {parityCount === 2 && (
            <p>
              Protects against{" "}
              <strong className="text-white">
                2 simultaneous drive failures
              </strong>
              . Recommended for large arrays.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
