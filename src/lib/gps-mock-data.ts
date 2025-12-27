import { GPSPosition, TrackedIndividual } from "@/types/gps";

// Simulador de movimento GPS realista
export class GPSSimulator {
  private basePosition: [number, number];
  private currentPosition: GPSPosition;
  private currentHeading: number;
  private currentSpeed: number;
  private isPaused: boolean;
  private pauseCounter: number;

  constructor(
    individualId: string,
    startLat: number,
    startLng: number,
    initialHeading = 0
  ) {
    this.basePosition = [startLat, startLng];
    this.currentHeading = initialHeading;
    this.currentSpeed = Math.random() * 30 + 10; // 10-40 km/h inicial
    this.isPaused = false;
    this.pauseCounter = 0;

    this.currentPosition = {
      id: this.generateId(),
      individualId,
      timestamp: new Date(),
      latitude: startLat,
      longitude: startLng,
      accuracy: this.randomAccuracy(),
      heading: initialHeading,
      speed: this.currentSpeed,
      altitude: Math.random() * 50 + 700 // 700-750m
    };
  }

  private generateId(): string {
    return `pos-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private randomAccuracy(): number {
    // Precisão GPS entre 5-20 metros
    return Math.random() * 15 + 5;
  }

  // Gera próxima posição baseada em movimento realista
  generateNextPosition(): GPSPosition {
    // Simular paradas ocasionais
    if (!this.isPaused && Math.random() > 0.95) {
      this.isPaused = true;
      this.pauseCounter = Math.floor(Math.random() * 5) + 2; // Parar por 2-6 updates
    }

    if (this.isPaused) {
      this.pauseCounter--;
      if (this.pauseCounter <= 0) {
        this.isPaused = false;
        this.currentSpeed = Math.random() * 30 + 10; // Retomar movimento
      } else {
        this.currentSpeed = 0;
      }
    }

    // Variar velocidade gradualmente
    if (!this.isPaused) {
      const speedChange = (Math.random() - 0.5) * 5; // Variação de -2.5 a +2.5 km/h
      this.currentSpeed = Math.max(5, Math.min(60, this.currentSpeed + speedChange));
    }

    // Variar direção gradualmente
    const headingChange = (Math.random() - 0.5) * 30; // Variação de -15 a +15 graus
    this.currentHeading = (this.currentHeading + headingChange + 360) % 360;

    // Calcular novo deslocamento
    // Converter km/h para graus (aproximado: 1 grau ≈ 111km)
    const timeStep = 5 / 3600; // 5 segundos em horas
    const distanceKm = this.currentSpeed * timeStep;
    const distanceDeg = distanceKm / 111;

    const headingRad = (this.currentHeading * Math.PI) / 180;
    const deltaLat = distanceDeg * Math.cos(headingRad);
    const deltaLng = distanceDeg * Math.sin(headingRad) / Math.cos((this.currentPosition.latitude * Math.PI) / 180);

    const newLat = this.currentPosition.latitude + deltaLat;
    const newLng = this.currentPosition.longitude + deltaLng;

    this.currentPosition = {
      id: this.generateId(),
      individualId: this.currentPosition.individualId,
      timestamp: new Date(),
      latitude: newLat,
      longitude: newLng,
      accuracy: this.randomAccuracy(),
      heading: this.currentHeading,
      speed: this.currentSpeed,
      altitude: (this.currentPosition.altitude || 700) + (Math.random() - 0.5) * 5
    };

    return { ...this.currentPosition };
  }

  // Gera trajeto completo para testes
  generateTrack(durationMinutes: number): GPSPosition[] {
    const positions: GPSPosition[] = [{ ...this.currentPosition }];
    const updates = Math.floor(durationMinutes * 12); // Update a cada 5s

    for (let i = 0; i < updates; i++) {
      positions.push(this.generateNextPosition());
    }

    return positions;
  }

  getCurrentPosition(): GPSPosition {
    return { ...this.currentPosition };
  }

  reset(): void {
    this.currentPosition.latitude = this.basePosition[0];
    this.currentPosition.longitude = this.basePosition[1];
    this.currentSpeed = Math.random() * 30 + 10;
    this.isPaused = false;
  }
}

// Dados mockados de indivíduos
export const mockIndividuals: TrackedIndividual[] = [
  {
    id: 'IND-001',
    name: 'Veículo Patrulha Alpha',
    type: 'vehicle',
    status: 'active',
    color: '#22c55e', // green
    icon: 'car'
  },
  {
    id: 'IND-002',
    name: 'Agente Silva',
    type: 'person',
    status: 'active',
    color: '#3b82f6', // blue
    icon: 'person'
  },
  {
    id: 'IND-003',
    name: 'Drone Beta',
    type: 'asset',
    status: 'active',
    color: '#a855f7', // purple
    icon: 'drone'
  },
  {
    id: 'IND-004',
    name: 'Veículo Transporte Gamma',
    type: 'vehicle',
    status: 'active',
    color: '#f59e0b', // amber
    icon: 'truck'
  }
];

// Criar simuladores para cada indivíduo
// Posições iniciais em Luanda, Angola (variando levemente)
export const simulators = new Map<string, GPSSimulator>([
  ['IND-001', new GPSSimulator('IND-001', -8.8383, 13.2344, 45)],   // Luanda Centro
  ['IND-002', new GPSSimulator('IND-002', -8.8483, 13.2444, 135)],  // Zona Sul
  ['IND-003', new GPSSimulator('IND-003', -8.8283, 13.2244, 90)],   // Zona Norte
  ['IND-004', new GPSSimulator('IND-004', -8.8583, 13.2544, 270)]   // Zona Leste
]);

// Histórico de posições (para demonstração)
export const mockHistoryCache = new Map<string, GPSPosition[]>();

// Inicializar histórico para cada simulador
mockIndividuals.forEach(individual => {
  const simulator = simulators.get(individual.id);
  if (simulator) {
    // Gerar histórico de 2 horas
    mockHistoryCache.set(individual.id, simulator.generateTrack(120));
    // Reset simulador para posição inicial
    simulator.reset();
  }
});
