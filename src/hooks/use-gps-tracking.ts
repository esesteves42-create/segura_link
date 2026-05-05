import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo, useEffect } from 'react';
import {
  fetchAllActivePositions,
  fetchIndividuals,
  fetchRecentTrack
} from '@/lib/gps-api';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/use-auth';
import { GPSPosition } from '@/types/gps';
import { calculateTrackStats } from '@/lib/gps-calculations';

export function useGPSTracking() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedIndividualId, setSelectedIndividualId] = useState<string | null>(null);

  // Query para indivíduos (cache longo - 5 minutos)
  const individualsQuery = useQuery({
    queryKey: ['tracked-individuals', user?.id ?? 'anon'],
    queryFn: fetchIndividuals,
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  // Query para posições atuais (realtime invalidates this; polling como fallback)
  const positionsQuery = useQuery({
    queryKey: ['gps-positions', user?.id ?? 'anon'],
    queryFn: fetchAllActivePositions,
    enabled: !!user,
    refetchInterval: 30_000,
    staleTime: 5_000,
    refetchIntervalInBackground: false,
  });

  // Realtime: invalida cache quando há nova posição ou alteração nos individuals
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`tracking-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'positions' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['gps-positions', user.id] });
          if (selectedIndividualId) {
            queryClient.invalidateQueries({ queryKey: ['gps-history', selectedIndividualId] });
          }
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'individuals', filter: `owner_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['tracked-individuals', user.id] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient, selectedIndividualId]);

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
