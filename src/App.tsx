import { useEffect, useState } from "react";
import type { Drive } from "./types";
import { useStorageStats } from "./hooks/useStorageStats";

import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ParityConfig } from "./components/ParityConfig";
import { DriveControls } from "./components/DriveControls";
import { RulesInfo } from "./components/RulesInfo";
import { StatCard } from "./components/StatCard";
import { DriveVisualizer } from "./components/DriveVisualizer";

const generateId = () => Math.random().toString(36).substring(7);
const STORAGE_KEY = "unraid_planner_config";

const loadSavedConfig = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to parse config from local storage:", error);
  }
  return null;
};

export default function App() {
  const savedConfig = loadSavedConfig();

  const [drives, setDrives] = useState<Drive[]>(
    savedConfig?.drives ?? [
      { id: "1", size: 14 },
      { id: "2", size: 14 },
      { id: "3", size: 8 },
      { id: "4", size: 8 },
    ],
  );
  const [parityCount, setParityCount] = useState<number>(
    savedConfig?.parityCount ?? 1,
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ drives, parityCount }));
  }, [drives, parityCount]);

  const stats = useStorageStats(drives, parityCount);

  const addDrive = (size: number) =>
    setDrives((prev) => [...prev, { id: generateId(), size }]);
  const removeDrive = (id: string) =>
    setDrives((prev) => prev.filter((d) => d.id !== id));
  const clearDrives = () => {
    if (window.confirm("Are you sure you want to remove all drives?")) {
      setDrives([]);
    }
  };

  return (
    <div className="min-h-screen bg-unraid-darker text-unraid-light font-sans selection:bg-unraid-orange selection:text-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Configuration Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <ParityConfig
              parityCount={parityCount}
              setParityCount={setParityCount}
            />
            <DriveControls
              drives={drives}
              onAddDrive={addDrive}
              onClearDrives={clearDrives}
            />
            <RulesInfo />
          </div>

          {/* Visualization & Stats */}
          <div className="lg:col-span-8 space-y-6">
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
            <DriveVisualizer
              stats={stats}
              parityCount={parityCount}
              onRemoveDrive={removeDrive}
              drivesLength={drives.length}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
