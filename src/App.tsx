import React, { useState, useMemo } from "react";
import {
  HardDrive,
  Plus,
  Trash2,
  Info,
  Server,
  Database,
  ShieldCheck,
  ExternalLink,
  Github,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type Drive = {
  id: string;
  size: number;
};

const COMMON_DRIVE_SIZES = [4, 8, 12, 14, 16, 18, 20, 22];

const generateId = () => Math.random().toString(36).substring(7);

export default function App() {
  const [drives, setDrives] = useState<Drive[]>([
    { id: "1", size: 14 },
    { id: "2", size: 14 },
    { id: "3", size: 8 },
    { id: "4", size: 8 },
  ]);
  const [parityCount, setParityCount] = useState<number>(1);
  const [customSize, setCustomSize] = useState<string>("");

  const addDrive = (size: number) => {
    setDrives([...drives, { id: generateId(), size }]);
  };

  const removeDrive = (id: string) => {
    setDrives(drives.filter((d) => d.id !== id));
  };

  const clearDrives = () => {
    if (confirm("Are you sure you want to remove all drives?")) {
      setDrives([]);
    }
  };

  // Calculations
  const stats = useMemo(() => {
    const sortedDrives = [...drives].sort((a, b) => b.size - a.size);
    const actualParityCount = Math.min(parityCount, sortedDrives.length);

    const parityDrives = sortedDrives.slice(0, actualParityCount);
    const dataDrives = sortedDrives.slice(actualParityCount);

    const largestDataDrive = dataDrives.length > 0 ? dataDrives[0].size : 0;
    const largestOverallDrive =
      sortedDrives.length > 0 ? sortedDrives[0].size : 0;

    const totalSpace = sortedDrives.reduce((sum, d) => sum + d.size, 0);
    const usableSpace = dataDrives.reduce((sum, d) => sum + d.size, 0);
    const totalParityDriveSpace = parityDrives.reduce(
      (sum, d) => sum + d.size,
      0,
    );

    // Unused space is the portion of parity drives that exceeds the largest data drive
    const unusedSpace = parityDrives.reduce((sum, d) => {
      return sum + Math.max(0, d.size - largestDataDrive);
    }, 0);

    const effectiveParitySpace = totalParityDriveSpace - unusedSpace;

    return {
      sortedDrives,
      parityDrives,
      dataDrives,
      largestDataDrive,
      largestOverallDrive,
      totalSpace,
      usableSpace,
      totalParityDriveSpace,
      effectiveParitySpace,
      unusedSpace,
    };
  }, [drives, parityCount]);

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const size = parseFloat(customSize);
    if (!isNaN(size) && size > 0) {
      addDrive(size);
      setCustomSize("");
    }
  };

  return (
    <div className="min-h-screen bg-unraid-darker text-unraid-light font-sans selection:bg-unraid-orange selection:text-white">
      {/* Header */}
      <header className="bg-unraid-dark border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-unraid-orange p-2 rounded-lg">
              <Server className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Unraid Storage Planner
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <a
              href="https://unraid.net"
              target="_blank"
              rel="noreferrer"
              className="hover:text-unraid-orange transition-colors"
            >
              unraid.net
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Configuration */}
          <div className="lg:col-span-4 space-y-6">
            {/* Parity Configuration */}
            <section className="bg-unraid-gray rounded-2xl border border-white/5 p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-unraid-orange" />
                Parity Configuration
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
                      <strong className="text-red-400">Warning:</strong> Zero
                      parity means no fault tolerance. A single drive failure
                      will result in data loss on that drive.
                    </p>
                  )}
                  {parityCount === 1 && (
                    <p>
                      Protects against{" "}
                      <strong className="text-white">1 drive failure</strong>.
                      Standard for arrays with fewer than 10-12 drives.
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

            {/* Add Drives */}
            <section className="bg-unraid-gray rounded-2xl border border-white/5 p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Database className="w-5 h-5 text-unraid-orange" />
                  Add Drives
                </h2>
                {drives.length > 0 && (
                  <button
                    onClick={clearDrives}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 p-1"
                  >
                    <Trash2 className="w-3 h-3" /> Clear All
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                    Common Sizes (TB)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {COMMON_DRIVE_SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => addDrive(size)}
                        className="bg-unraid-dark hover:bg-white/10 text-gray-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors border border-white/5 flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">
                    Custom Size (TB)
                  </label>
                  <form onSubmit={handleCustomAdd} className="flex gap-2">
                    <input
                      type="number"
                      step="1"
                      min="1"
                      max="100"
                      value={customSize}
                      onChange={(e) => setCustomSize(e.target.value)}
                      placeholder="e.g. 4"
                      className="flex-1 bg-unraid-dark border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-unraid-orange focus:ring-1 focus:ring-unraid-orange transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!customSize}
                      className="bg-unraid-orange hover:bg-unraid-orange-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </section>

            {/* Rules Info */}
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
          </div>

          {/* Right Column: Visualization & Stats */}
          <div className="lg:col-span-8 space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Total Raw Space"
                value={stats.totalSpace}
                color="text-gray-300"
              />
              <StatCard
                title="Usable Data Space"
                value={stats.usableSpace}
                color="text-emerald-400"
                highlight
              />
              <StatCard
                title="Parity Space"
                value={stats.effectiveParitySpace}
                color="text-unraid-orange"
              />
              <StatCard
                title="Unused / Wasted"
                value={stats.unusedSpace}
                color="text-red-400"
                subtext={
                  stats.unusedSpace > 0
                    ? "Parity drive is larger than max data drive"
                    : undefined
                }
              />
            </div>

            {/* Visualizer */}
            <section className="bg-unraid-gray rounded-2xl border border-white/5 p-6 shadow-lg overflow-hidden flex flex-col min-h-100">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-unraid-orange" />
                Array Visualization
              </h2>

              {drives.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-white/5 rounded-xl">
                  <HardDrive className="w-12 h-12 mb-3 opacity-20" />
                  <p>Add drives to see your array configuration</p>
                </div>
              ) : (
                <div className="flex-1 overflow-x-auto pb-4 pt-10">
                  <div className="flex items-end gap-4 min-w-max h-75 px-2">
                    <AnimatePresence mode="popLayout">
                      {stats.sortedDrives.map((drive, index) => {
                        const isParity = index < parityCount;
                        const heightPercent =
                          (drive.size / stats.largestOverallDrive) * 100;

                        // Calculate how much of the parity drive is actually used vs unused
                        let usedPercent = 100;
                        let unusedPercent = 0;

                        if (isParity) {
                          if (stats.largestDataDrive === 0) {
                            usedPercent = 0;
                            unusedPercent = 100;
                          } else if (drive.size > stats.largestDataDrive) {
                            usedPercent =
                              (stats.largestDataDrive / drive.size) * 100;
                            unusedPercent = 100 - usedPercent;
                          }
                        }

                        return (
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: 50, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 25,
                            }}
                            key={drive.id}
                            className="relative flex flex-col items-center group w-20"
                            style={{
                              height: `${Math.max(15, heightPercent)}%`,
                            }}
                          >
                            {/* Drive Box */}
                            <div
                              className={`w-full h-full rounded-t-md border-x border-t relative overflow-hidden transition-colors ${
                                isParity
                                  ? "border-unraid-orange/50 bg-unraid-orange/10"
                                  : "border-emerald-500/50 bg-emerald-500/10"
                              }`}
                            >
                              {/* Used Fill */}
                              <div
                                className={`absolute bottom-0 left-0 right-0 w-full ${
                                  isParity
                                    ? "bg-unraid-orange/40"
                                    : "bg-emerald-500/40"
                                }`}
                                style={{ height: `${usedPercent}%` }}
                              />

                              {/* Unused Fill (Striped) */}
                              {unusedPercent > 0 && (
                                <div
                                  className="absolute top-0 left-0 right-0 w-full bg-striped-unused opacity-50"
                                  style={{ height: `${unusedPercent}%` }}
                                />
                              )}

                              {/* Drive Details (Hover) */}
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/80 flex flex-col items-center justify-center transition-opacity text-xs font-mono z-10">
                                <span className="text-white font-bold">
                                  {drive.size} TB
                                </span>
                                <span
                                  className={
                                    isParity
                                      ? "text-unraid-orange"
                                      : "text-emerald-400"
                                  }
                                >
                                  {isParity ? "Parity" : "Data"}
                                </span>
                              </div>
                            </div>

                            {/* Base / Connector */}
                            <div className="w-full h-2 bg-unraid-dark border-x border-b border-white/20 rounded-b-sm mb-2" />

                            {/* Size Label */}
                            <div className="text-xs font-mono text-gray-400 mt-1">
                              {drive.size}TB
                            </div>

                            {/* Remove Button */}
                            <button
                              onClick={() => removeDrive(drive.id)}
                              className="absolute -top-8 z-20 opacity-0 group-hover:opacity-100 p-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all"
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
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="mt-12 border-t border-white/10 bg-unraid-dark py-8 text-sm text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p>&copy; {new Date().getFullYear()} Unraid Storage Planner.</p>
            <p className="text-xs text-gray-500">
              Disclaimer: This project is not affiliated with, endorsed by, or
              sponsored by Unraid or Lime Technology, Inc.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-4 md:mt-0">
            <a
              href="https://docs.unraid.net/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-unraid-orange transition-colors"
            >
              <ExternalLink className="w-4 h-4" /> Unraid Docs
            </a>
            <a
              href="https://github.com/NathanGrenier/Unraid-Drive-Visualizer"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Github className="w-4 h-4" /> View Source
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
  highlight = false,
  subtext,
}: {
  title: string;
  value: number;
  color: string;
  highlight?: boolean;
  subtext?: string;
}) {
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
