import { GPSPosition, TrackedIndividual, GPSApiResponse } from "@/types/gps";
import { mockIndividuals, simulators, mockHistoryCache } from "./gps-mock-data";

// Simular delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Buscar posição atual de um indivíduo
export async function fetchCurrentPosition(
  individualId: string
): Promise<GPSPosition> {
  await delay(100); // Simula latência de rede

  const simulator = simulators.get(individualId);
  if (!simulator) {
    throw new Error(`Individual ${individualId} not found`);
  }

  return simulator.generateNextPosition();
}

// Buscar histórico de posições de um indivíduo
export async function fetchPositionHistory(
  individualId: string,
  startTime: Date,
  endTime: Date
): Promise<GPSPosition[]> {
  await delay(200);

  const history = mockHistoryCache.get(individualId);
  if (!history) {
    return [];
  }

  // Filtrar por intervalo de tempo
  return history.filter(pos => {
    const posTime = typeof pos.timestamp === 'string' ? new Date(pos.timestamp) : pos.timestamp;
    return posTime >= startTime && posTime <= endTime;
  });
}

// Buscar posições atuais de todos os indivíduos ativos
export async function fetchAllActivePositions(): Promise<Map<string, GPSPosition>> {
  await delay(150);

  const positions = new Map<string, GPSPosition>();

  mockIndividuals
    .filter(ind => ind.status === 'active')
    .forEach(ind => {
      const simulator = simulators.get(ind.id);
      if (simulator) {
        positions.set(ind.id, simulator.generateNextPosition());
      }
    });

  return positions;
}

// Buscar lista de indivíduos rastreados
export async function fetchIndividuals(): Promise<TrackedIndividual[]> {
  await delay(100);
  return [...mockIndividuals];
}

// Buscar histórico de trajeto completo (últimas N horas)
export async function fetchRecentTrack(
  individualId: string,
  hoursAgo = 2
): Promise<GPSPosition[]> {
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - hoursAgo * 60 * 60 * 1000);

  return fetchPositionHistory(individualId, startTime, endTime);
}

// ========================================
// Funções preparadas para backend real
// (Descomente e ajuste quando tiver API)
// ========================================

/*
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export async function fetchCurrentPositionFromAPI(
  individualId: string
): Promise<GPSPosition> {
  const response = await fetch(`${API_BASE_URL}/tracking/${individualId}/current`, {
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch position: ${response.statusText}`);
  }

  const data: GPSApiResponse<GPSPosition> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Unknown error');
  }

  return data.data;
}

export async function fetchPositionHistoryFromAPI(
  individualId: string,
  startTime: Date,
  endTime: Date
): Promise<GPSPosition[]> {
  const params = new URLSearchParams({
    start: startTime.toISOString(),
    end: endTime.toISOString()
  });

  const response = await fetch(
    `${API_BASE_URL}/tracking/${individualId}/history?${params}`,
    {
      headers: {
        'Content-Type': 'application/json',
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch history: ${response.statusText}`);
  }

  const data: GPSApiResponse<GPSPosition[]> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Unknown error');
  }

  return data.data;
}

export async function fetchAllActivePositionsFromAPI(): Promise<Map<string, GPSPosition>> {
  const response = await fetch(`${API_BASE_URL}/tracking/active`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch positions: ${response.statusText}`);
  }

  const data: GPSApiResponse<Record<string, GPSPosition>> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Unknown error');
  }

  // Converter object para Map
  return new Map(Object.entries(data.data));
}

export async function fetchIndividualsFromAPI(): Promise<TrackedIndividual[]> {
  const response = await fetch(`${API_BASE_URL}/individuals`, {
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch individuals: ${response.statusText}`);
  }

  const data: GPSApiResponse<TrackedIndividual[]> = await response.json();

  if (!data.success) {
    throw new Error(data.error || 'Unknown error');
  }

  return data.data;
}
*/
