import { useQuery } from '@tanstack/react-query';
import { fetchCurrentPosition } from '@/lib/gps-api';
import { GPSPosition } from '@/types/gps';

export function useGPSPosition(individualId: string | null, enabled = true) {
  return useQuery<GPSPosition | null>({
    queryKey: ['gps-position', individualId],
    queryFn: async () => {
      if (!individualId) return null;
      return fetchCurrentPosition(individualId);
    },
    enabled: !!individualId && enabled,
    refetchInterval: 5000, // Atualizar a cada 5 segundos
    staleTime: 2000,
    refetchIntervalInBackground: false,
  });
}
