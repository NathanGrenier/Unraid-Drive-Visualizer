import { useMemo } from "react";
import type { Drive } from "../types";

export function useStorageStats(drives: Drive[], parityCount: number) {
  return useMemo(() => {
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
}
