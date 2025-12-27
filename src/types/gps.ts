// Posição GPS individual
export interface GPSPosition {
  id: string;
  individualId: string;
  timestamp: Date | string;
  latitude: number;
  longitude: number;
  accuracy: number; // metros
  altitude?: number; // metros
  altitudeAccuracy?: number;
  heading?: number; // graus (0-360)
  speed?: number; // km/h
}

// Informações do indivíduo rastreado
export interface TrackedIndividual {
  id: string;
  name: string;
  type: 'person' | 'vehicle' | 'asset';
  status: 'active' | 'inactive' | 'warning' | 'emergency';
  color: string;
  icon?: string;
  metadata?: Record<string, unknown>;
}

// Trajeto completo (histórico)
export interface GPSTrack {
  individualId: string;
  positions: GPSPosition[];
  startTime: Date | string;
  endTime: Date | string;
  totalDistance: number; // km
  avgSpeed: number; // km/h
  maxSpeed: number; // km/h
}

// Configurações de visualização do mapa
export interface TrackingMapConfig {
  center: [number, number]; // [lat, lng]
  zoom: number;
  showTrails: boolean;
  trailDuration: number; // horas
  showSpeedIndicators: boolean;
  autoFollow: boolean; // auto-center no indivíduo selecionado
  updateInterval: number; // ms
}

// Resposta da API
export interface GPSApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
}

// Estatísticas calculadas
export interface TrackingStats {
  currentSpeed: number;
  averageSpeed: number;
  maxSpeed: number;
  totalDistance: number;
  duration: number; // minutos
  lastUpdate: Date;
  status: TrackedIndividual['status'];
}
