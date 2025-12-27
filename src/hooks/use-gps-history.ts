import { useQuery } from '@tanstack/react-query';
import { fetchPositionHistory, fetchRecentTrack } from '@/lib/gps-api';
import { GPSPosition } from '@/types/gps';

export function useGPSHistory(
  individualId: string | null,
  hoursAgo = 2,
  enabled = true
) {
  return useQuery<GPSPosition[]>({
    queryKey: ['gps-history', individualId, hoursAgo],
    queryFn: async () => {
      if (!individualId) return [];
      return fetchRecentTrack(individualId, hoursAgo);
    },
    enabled: !!individualId && enabled,
    staleTime: 30000, // 30 segundos
  });
}

export function useGPSHistoryRange(
  individualId: string | null,
  startTime: Date | null,
  endTime: Date | null,
  enabled = true
) {
  return useQuery<GPSPosition[]>({
    queryKey: ['gps-history-range', individualId, startTime, endTime],
    queryFn: async () => {
      if (!individualId || !startTime || !endTime) return [];
      return fetchPositionHistory(individualId, startTime, endTime);
    },
    enabled: !!individualId && !!startTime && !!endTime && enabled,
    staleTime: 60000, // 1 minuto
  });
}
