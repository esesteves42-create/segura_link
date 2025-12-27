import { GPSPosition, TrackingStats } from "@/types/gps";

// Converter graus para radianos
function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Converter radianos para graus
function toDeg(radians: number): number {
  return radians * (180 / Math.PI);
}

// Calcular distância entre dois pontos usando fórmula de Haversine
// Retorna distância em quilômetros
export function calculateDistance(pos1: GPSPosition, pos2: GPSPosition): number {
  const R = 6371; // Raio da Terra em km
  const dLat = toRad(pos2.latitude - pos1.latitude);
  const dLon = toRad(pos2.longitude - pos1.longitude);

  const lat1 = toRad(pos1.latitude);
  const lat2 = toRad(pos2.latitude);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Calcular bearing (direção) entre dois pontos
// Retorna ângulo em graus (0-360), onde 0 = Norte, 90 = Leste, etc.
export function calculateBearing(pos1: GPSPosition, pos2: GPSPosition): number {
  const lat1 = toRad(pos1.latitude);
  const lat2 = toRad(pos2.latitude);
  const dLon = toRad(pos2.longitude - pos1.longitude);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = toDeg(Math.atan2(y, x));

  // Normalizar para 0-360
  bearing = (bearing + 360) % 360;

  return bearing;
}

// Converter bearing para direção cardeal
export function bearingToCardinal(bearing: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

// Calcular velocidade entre dois pontos
// Retorna velocidade em km/h
export function calculateSpeed(pos1: GPSPosition, pos2: GPSPosition): number {
  const distance = calculateDistance(pos1, pos2);

  const time1 = typeof pos1.timestamp === 'string' ? new Date(pos1.timestamp) : pos1.timestamp;
  const time2 = typeof pos2.timestamp === 'string' ? new Date(pos2.timestamp) : pos2.timestamp;

  const timeHours = (time2.getTime() - time1.getTime()) / 3600000; // Converter ms para horas

  if (timeHours === 0) return 0;

  return distance / timeHours;
}

// Calcular estatísticas de um trajeto
export function calculateTrackStats(positions: GPSPosition[]): TrackingStats {
  if (positions.length === 0) {
    return {
      currentSpeed: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      totalDistance: 0,
      duration: 0,
      lastUpdate: new Date(),
      status: 'inactive'
    };
  }

  let totalDistance = 0;
  let maxSpeed = 0;
  const speeds: number[] = [];

  for (let i = 1; i < positions.length; i++) {
    const distance = calculateDistance(positions[i - 1], positions[i]);
    totalDistance += distance;

    const speed = calculateSpeed(positions[i - 1], positions[i]);
    speeds.push(speed);
    maxSpeed = Math.max(maxSpeed, speed);
  }

  const averageSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;
  const currentSpeed = speeds.length > 0 ? speeds[speeds.length - 1] : 0;

  const startTime = typeof positions[0].timestamp === 'string'
    ? new Date(positions[0].timestamp)
    : positions[0].timestamp;
  const endTime = typeof positions[positions.length - 1].timestamp === 'string'
    ? new Date(positions[positions.length - 1].timestamp)
    : positions[positions.length - 1].timestamp;

  const duration = (endTime.getTime() - startTime.getTime()) / 60000; // minutos

  return {
    currentSpeed,
    averageSpeed,
    maxSpeed,
    totalDistance,
    duration,
    lastUpdate: endTime,
    status: currentSpeed > 0 ? 'active' : 'inactive'
  };
}

// Formatar distância para exibição
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${(km * 1000).toFixed(0)}m`;
  }
  return `${km.toFixed(2)}km`;
}

// Formatar velocidade para exibição
export function formatSpeed(kmh: number): string {
  return `${kmh.toFixed(1)} km/h`;
}

// Formatar duração para exibição
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)}min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}min`;
}
