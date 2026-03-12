import { HardDrive, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { Drive } from "../types";
import { useStorageStats } from "../hooks/useStorageStats";

type StorageStats = ReturnType<typeof useStorageStats>;

type DriveVisualizerProps = {
  stats: StorageStats;
  parityCount: number;
  onRemoveDrive: (id: string) => void;
  drivesLength: number;
};

export function DriveVisualizer({
  stats,
  parityCount,
  onRemoveDrive,
  drivesLength,
}: DriveVisualizerProps) {
  return (
    <section className="bg-unraid-gray rounded-2xl border border-white/5 p-6 shadow-lg overflow-hidden flex flex-col min-h-100">
      <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
        <HardDrive className="w-5 h-5 text-unraid-orange" /> Array Visualization
      </h2>

      {drivesLength === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
          <HardDrive className="w-12 h-12 mb-3 opacity-20" />
          <p className="text-center px-4">
            Add drives to see your array configuration
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4 pt-10">
          <div className="flex items-end gap-4 min-w-max h-72 px-2">
            <AnimatePresence mode="popLayout">
              {stats.sortedDrives.map((drive: Drive, index: number) => {
                const isParity = index < parityCount;
                const heightPercent =
                  (drive.size / stats.largestOverallDrive) * 100;

                let usedPercent = 100;
                let unusedPercent = 0;

                if (isParity) {
                  if (stats.largestDataDrive === 0) {
                    usedPercent = 0;
                    unusedPercent = 100;
                  } else if (drive.size > stats.largestDataDrive) {
                    usedPercent = (stats.largestDataDrive / drive.size) * 100;
                    unusedPercent = 100 - usedPercent;
                  }
                }

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    key={drive.id}
                    className="relative flex flex-col items-center group w-20"
                    style={{ height: `${Math.max(15, heightPercent)}%` }}
                  >
                    <div
                      className={`w-full h-full rounded-t-md border-x border-t relative overflow-hidden transition-colors ${
                        isParity
                          ? "border-unraid-orange/50 bg-unraid-orange/10"
                          : "border-emerald-500/50 bg-emerald-500/10"
                      }`}
                    >
                      <div
                        className={`absolute bottom-0 left-0 right-0 w-full ${
                          isParity ? "bg-unraid-orange/40" : "bg-emerald-500/40"
                        }`}
                        style={{ height: `${usedPercent}%` }}
                      />
                      {unusedPercent > 0 && (
                        <div
                          className="absolute top-0 left-0 right-0 w-full bg-striped-unused opacity-50"
                          style={{ height: `${unusedPercent}%` }}
                        />
                      )}

                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/80 flex flex-col items-center justify-center transition-opacity text-xs font-mono z-10">
                        <span className="text-white font-bold">
                          {drive.size} TB
                        </span>
                        <span
                          className={
                            isParity ? "text-unraid-orange" : "text-emerald-400"
                          }
                        >
                          {isParity ? "Parity" : "Data"}
                        </span>
                      </div>
                    </div>

                    <div className="w-full h-2 bg-unraid-dark border-x border-b border-white/20 rounded-b-sm mb-2" />
                    <div className="text-xs font-mono text-gray-400 mt-1">
                      {drive.size}TB
                    </div>

                    <button
                      onClick={() => onRemoveDrive(drive.id)}
                      className="absolute -top-8 z-20 opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all"
                      title="Remove Drive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-6 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-emerald-500/40 border border-emerald-500/50" />
          <span>Data Drive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-unraid-orange/40 border border-unraid-orange/50" />
          <span>Parity Drive</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-unraid-orange/10 border border-unraid-orange/50 bg-striped-unused" />
          <span>Unused Parity Space</span>
        </div>
      </div>
    </section>
  );
}
