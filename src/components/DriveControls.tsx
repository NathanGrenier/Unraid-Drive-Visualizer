import React, { useState } from "react";
import { Database, Plus, Trash2 } from "lucide-react";
import type { Drive } from "../types";

const COMMON_DRIVE_SIZES = [4, 8, 12, 14, 16, 18, 20, 22];

type DriveControlsProps = {
  drives: Drive[];
  onAddDrive: (s: number) => void;
  onClearDrives: () => void;
};

export function DriveControls({
  drives,
  onAddDrive,
  onClearDrives,
}: DriveControlsProps) {
  const [customSize, setCustomSize] = useState<string>("");

  const handleCustomAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const size = parseFloat(customSize);
    if (!isNaN(size) && size > 0) {
      onAddDrive(size);
      setCustomSize("");
    }
  };

  return (
    <section className="bg-unraid-gray rounded-2xl border border-white/5 p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Database className="w-5 h-5 text-unraid-orange" /> Add Drives
        </h2>
        {drives.length > 0 && (
          <button
            onClick={onClearDrives}
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
                onClick={() => onAddDrive(size)}
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
  );
}
