import { useMemo } from 'react';
import { GPSPosition, TrackingStats } from '@/types/gps';
import {
  calculateTrackStats,
  calculateBearing,
  bearingToCardinal,
  formatDistance,
  formatSpeed,
  formatDuration,
} from '@/lib/gps-calculations';

export function useTrackingCalculations(positions: GPSPosition[]) {
  const stats = useMemo(() => {
    if (positions.length === 0) return null;
    return calculateTrackStats(positions);
  }, [positions]);

  const currentDirection = useMemo(() => {
    if (positions.length < 2) return null;

    const latest = positions[positions.length - 1];
    const previous = positions[positions.length - 2];

    const bearing = calculateBearing(previous, latest);
    return bearingToCardinal(bearing);
  }, [positions]);

  const formattedStats = useMemo(() => {
    if (!stats) return null;

    return {
      ...stats,
      formattedDistance: formatDistance(stats.totalDistance),
      formattedCurrentSpeed: formatSpeed(stats.currentSpeed),
      formattedAvgSpeed: formatSpeed(stats.averageSpeed),
      formattedMaxSpeed: formatSpeed(stats.maxSpeed),
      formattedDuration: formatDuration(stats.duration),
    };
  }, [stats]);

  return {
    stats,
    formattedStats,
    currentDirection,
  };
}
