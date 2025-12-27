import { useQuery } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import {
  fetchAllActivePositions,
  fetchIndividuals,
  fetchRecentTrack
} from '@/lib/gps-api';
import { GPSPosition, TrackedIndividual, TrackingStats } from '@/types/gps';
import { calculateTrackStats } from '@/lib/gps-calculations';

export function useGPSTracking() {
  const [selectedIndividualId, setSelectedIndividualId] = useState<string | null>(null);

  // Query para indivíduos (cache longo - 5 minutos)
  const individualsQuery = useQuery({
    queryKey: ['tracked-individuals'],
    queryFn: fetchIndividuals,
    staleTime: 5 * 60 * 1000, // 5 minutos
    refetchOnWindowFocus: false,
  });

  // Query para posições atuais (polling a cada 5 segundos)
  const positionsQuery = useQuery({
    queryKey: ['gps-positions'],
    queryFn: fetchAllActivePositions,
    refetchInterval: 5000, // Atualizar a cada 5s
    staleTime: 2000,
    refetchIntervalInBackground: false, // Pausar quando tab inativa
  });

  // Query para histórico do indivíduo selecionado
  const historyQuery = useQuery({
    queryKey: ['gps-history', selectedIndividualId],
    queryFn: () => {
      if (!selectedIndividualId) return Promise.resolve([]);
      return fetchRecentTrack(selectedIndividualId, 2); // Últimas 2 horas
    },
    enabled: !!selectedIndividualId,
    staleTime: 30000, // 30 segundos
  });

  // Calcular estatísticas do indivíduo selecionado
  const selectedStats = useMemo(() => {
    if (!selectedIndividualId || !historyQuery.data || historyQuery.data.length === 0) {
      return null;
    }
    return calculateTrackStats(historyQuery.data);
  }, [selectedIndividualId, historyQuery.data]);

  // Combinar posições atuais com histórico para criar trajetos
  const tracks = useMemo(() => {
    const tracksMap = new Map<string, GPSPosition[]>();

    if (!positionsQuery.data) return tracksMap;

    // Para cada indivíduo ativo, obter últimas posições
    individualsQuery.data?.forEach(individual => {
      if (individual.id === selectedIndividualId && historyQuery.data) {
        tracksMap.set(individual.id, historyQuery.data);
      } else {
        // Usar apenas posição atual para outros indivíduos
        const currentPos = positionsQuery.data.get(individual.id);
        if (currentPos) {
          tracksMap.set(individual.id, [currentPos]);
        }
      }
    });

    return tracksMap;
  }, [positionsQuery.data, individualsQuery.data, selectedIndividualId, historyQuery.data]);

  return {
    individuals: individualsQuery.data ?? [],
    positions: positionsQuery.data ?? new Map<string, GPSPosition>(),
    tracks,
    selectedIndividualId,
    setSelectedIndividualId,
    selectedStats,
    isLoading: individualsQuery.isLoading || positionsQuery.isLoading,
    isLoadingHistory: historyQuery.isLoading,
    error: individualsQuery.error || positionsQuery.error,
  };
}
