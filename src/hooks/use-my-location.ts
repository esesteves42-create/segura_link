import { useState, useEffect, useRef, useCallback } from 'react';
import { GPSPosition } from '@/types/gps';
import { calculateDistance, calculateBearing, bearingToCardinal, formatDistance, formatSpeed, formatDuration } from '@/lib/gps-calculations';
import { insertPosition } from '@/lib/gps-api';

export interface MyLocationStats {
  currentSpeed: number;       // km/h (do sensor GPS)
  calculatedSpeed: number;    // km/h (calculado entre pontos)
  averageSpeed: number;       // km/h
  maxSpeed: number;           // km/h
  totalDistance: number;      // km
  duration: number;           // minutos
  bearing: number;            // graus
  cardinalDirection: string;  // N, NE, E, ...
  accuracy: number;           // metros
  altitude?: number;
  pointsRecorded: number;
}

export interface MyLocationState {
  currentPosition: GPSPosition | null;
  routeHistory: GPSPosition[];
  isTracking: boolean;
  isLoading: boolean;
  error: string | null;
  stats: MyLocationStats;
  formattedStats: {
    speed: string;
    distance: string;
    duration: string;
    accuracy: string;
    direction: string;
    maxSpeed: string;
    avgSpeed: string;
  };
  startTracking: () => void;
  stopTracking: () => void;
  resetRoute: () => void;
  centerOnMe: () => { lat: number; lng: number } | null;
  syncedToCloud: boolean;
}

export interface UseMyLocationOptions {
  /** Se fornecido, cada nova posição é gravada na tabela `positions` para este individual */
  individualId?: string | null;
  /** Distância mínima em metros entre pontos guardados na BD (default 5m, evita ruído) */
  minDistanceMeters?: number;
}

const DEFAULT_STATS: MyLocationStats = {
  currentSpeed: 0,
  calculatedSpeed: 0,
  averageSpeed: 0,
  maxSpeed: 0,
  totalDistance: 0,
  duration: 0,
  bearing: 0,
  cardinalDirection: 'N',
  accuracy: 0,
  pointsRecorded: 0,
};

export function useMyLocation(options: UseMyLocationOptions = {}): MyLocationState {
  const { individualId = null, minDistanceMeters = 5 } = options;

  const [currentPosition, setCurrentPosition] = useState<GPSPosition | null>(null);
  const [routeHistory, setRouteHistory] = useState<GPSPosition[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<MyLocationStats>(DEFAULT_STATS);

  const watchIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<Date | null>(null);
  const totalDistanceRef = useRef(0);
  const speedsRef = useRef<number[]>([]);
  const positionCountRef = useRef(0);
  const lastSavedRef = useRef<GPSPosition | null>(null);
  const individualIdRef = useRef<string | null>(individualId);

  useEffect(() => {
    individualIdRef.current = individualId;
  }, [individualId]);

  // Limpar watcher ao desmontar
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const buildGPSPosition = (coords: GeolocationCoordinates): GPSPosition => ({
    id: `my-pos-${Date.now()}`,
    individualId: 'ME',
    timestamp: new Date(),
    latitude: coords.latitude,
    longitude: coords.longitude,
    accuracy: coords.accuracy,
    altitude: coords.altitude ?? undefined,
    altitudeAccuracy: coords.altitudeAccuracy ?? undefined,
    heading: coords.heading ?? undefined,
    speed: coords.speed != null ? coords.speed * 3.6 : undefined, // m/s -> km/h
  });

  const updateStats = useCallback((newPos: GPSPosition, history: GPSPosition[]) => {
    const now = new Date();
    const duration = startTimeRef.current
      ? (now.getTime() - startTimeRef.current.getTime()) / 60000
      : 0;

    let calculatedSpeed = 0;
    let bearing = 0;
    let cardinalDirection = 'N';

    if (history.length >= 2) {
      const prev = history[history.length - 2];
      const dist = calculateDistance(prev, newPos);
      const timeDiff = (new Date(newPos.timestamp).getTime() - new Date(prev.timestamp).getTime()) / 3600000;
      if (timeDiff > 0) {
        calculatedSpeed = dist / timeDiff;
        speedsRef.current.push(calculatedSpeed);
      }
      bearing = calculateBearing(prev, newPos);
      cardinalDirection = bearingToCardinal(bearing);
    }

    const maxSpeed = speedsRef.current.length > 0 ? Math.max(...speedsRef.current) : 0;
    const avgSpeed = speedsRef.current.length > 0
      ? speedsRef.current.reduce((a, b) => a + b, 0) / speedsRef.current.length
      : 0;

    // Usar velocidade do sensor GPS se disponivel, senao calcular
    const currentSpeed = newPos.speed != null && newPos.speed > 0
      ? newPos.speed
      : calculatedSpeed;

    setStats({
      currentSpeed,
      calculatedSpeed,
      averageSpeed: avgSpeed,
      maxSpeed,
      totalDistance: totalDistanceRef.current,
      duration,
      bearing,
      cardinalDirection,
      accuracy: newPos.accuracy,
      altitude: newPos.altitude,
      pointsRecorded: positionCountRef.current,
    });
  }, []);

  const persistPosition = useCallback(async (gpsPos: GPSPosition) => {
    const targetId = individualIdRef.current;
    if (!targetId) return;

    // Throttling por distância para não inundar a BD com ruído GPS parado
    if (lastSavedRef.current) {
      const distMeters = calculateDistance(lastSavedRef.current, gpsPos) * 1000;
      if (distMeters < minDistanceMeters) return;
    }

    try {
      await insertPosition(targetId, {
        latitude: gpsPos.latitude,
        longitude: gpsPos.longitude,
        accuracy: gpsPos.accuracy,
        altitude: gpsPos.altitude,
        altitudeAccuracy: gpsPos.altitudeAccuracy,
        heading: gpsPos.heading,
        speed: gpsPos.speed,
        timestamp: gpsPos.timestamp,
      });
      lastSavedRef.current = gpsPos;
    } catch {
      // Falha silenciosa: tracking local continua mesmo se a BD falhar
    }
  }, [minDistanceMeters]);

  const onPosition = useCallback((position: GeolocationPosition) => {
    setIsLoading(false);
    setError(null);

    const gpsPos = buildGPSPosition(position.coords);
    positionCountRef.current++;

    setCurrentPosition(gpsPos);

    setRouteHistory(prev => {
      const updated = [...prev, gpsPos];

      // Calcular distancia incremental
      if (prev.length > 0) {
        const lastPos = prev[prev.length - 1];
        const dist = calculateDistance(lastPos, gpsPos);
        // Apenas adicionar se moveu pelo menos 2 metros (evitar ruido GPS parado)
        if (dist * 1000 >= 2) {
          totalDistanceRef.current += dist;
        }
      }

      updateStats(gpsPos, updated);
      return updated;
    });

    void persistPosition(gpsPos);
  }, [updateStats, persistPosition]);

  const onError = useCallback((err: GeolocationPositionError) => {
    setIsLoading(false);
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError('Permissao GPS negada. Permite o acesso a localizacao nas configuracoes do browser.');
        break;
      case err.POSITION_UNAVAILABLE:
        setError('Posicao GPS indisponivel. Verifica o sinal.');
        break;
      case err.TIMEOUT:
        setError('Timeout ao obter GPS. A tentar novamente...');
        break;
      default:
        setError('Erro desconhecido ao obter GPS.');
    }
    setIsTracking(false);
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('GPS nao suportado neste dispositivo/browser.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setIsTracking(true);
    startTimeRef.current = new Date();
    speedsRef.current = [];

    watchIdRef.current = navigator.geolocation.watchPosition(
      onPosition,
      onError,
      {
        enableHighAccuracy: true,  // GPS de alta precisao
        maximumAge: 1000,          // Cache maximo 1 segundo
        timeout: 15000,            // Timeout 15 segundos
      }
    );
  }, [onPosition, onError]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setIsLoading(false);
  }, []);

  const resetRoute = useCallback(() => {
    stopTracking();
    setCurrentPosition(null);
    setRouteHistory([]);
    setStats(DEFAULT_STATS);
    totalDistanceRef.current = 0;
    speedsRef.current = [];
    positionCountRef.current = 0;
    startTimeRef.current = null;
    setError(null);
  }, [stopTracking]);

  const centerOnMe = useCallback(() => {
    if (!currentPosition) return null;
    return { lat: currentPosition.latitude, lng: currentPosition.longitude };
  }, [currentPosition]);

  const formattedStats = {
    speed: formatSpeed(stats.currentSpeed),
    distance: formatDistance(stats.totalDistance),
    duration: formatDuration(stats.duration),
    accuracy: `±${stats.accuracy.toFixed(0)}m`,
    direction: stats.cardinalDirection,
    maxSpeed: formatSpeed(stats.maxSpeed),
    avgSpeed: formatSpeed(stats.averageSpeed),
  };

  return {
    currentPosition,
    routeHistory,
    isTracking,
    isLoading,
    error,
    stats,
    formattedStats,
    startTracking,
    stopTracking,
    resetRoute,
    centerOnMe,
    syncedToCloud: !!individualId,
  };
}
