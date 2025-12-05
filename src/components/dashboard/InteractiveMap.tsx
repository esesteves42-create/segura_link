import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Droplets, Thermometer, AlertTriangle } from "lucide-react";

interface Sensor {
  id: number;
  name: string;
  type: "agriculture" | "security" | "geology";
  position: { x: number; y: number };
  status: "active" | "warning" | "error";
  data?: string;
}

const InteractiveMap = () => {
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  const sensors: Sensor[] = [
    { id: 1, name: "Sensor Agrícola #1", type: "agriculture", position: { x: 20, y: 30 }, status: "active", data: "Solo: 45% | Temp: 24°C" },
    { id: 2, name: "Sensor Agrícola #2", type: "agriculture", position: { x: 60, y: 40 }, status: "warning", data: "Solo: 28% | Temp: 28°C" },
    { id: 3, name: "Câmera Segurança #1", type: "security", position: { x: 80, y: 20 }, status: "active", data: "Sem movimento" },
    { id: 4, name: "Sensor Geológico #1", type: "geology", position: { x: 40, y: 70 }, status: "active", data: "Estável" },
    { id: 5, name: "Sensor Agrícola #3", type: "agriculture", position: { x: 30, y: 55 }, status: "active", data: "Solo: 52% | Temp: 23°C" },
    { id: 6, name: "Câmera Segurança #2", type: "security", position: { x: 70, y: 65 }, status: "error", data: "Movimento detectado!" },
  ];

  const getStatusColor = (status: Sensor["status"]) => {
    switch (status) {
      case "active":
        return "fill-success";
      case "warning":
        return "fill-accent";
      case "error":
        return "fill-destructive";
    }
  };

  const getTypeIcon = (type: Sensor["type"]) => {
    switch (type) {
      case "agriculture":
        return <Droplets className="h-3 w-3" />;
      case "security":
        return <AlertTriangle className="h-3 w-3" />;
      case "geology":
        return <Thermometer className="h-3 w-3" />;
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Mapa de Sensores</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs">
              <span className="h-2 w-2 rounded-full bg-success mr-1"></span>
              Activo
            </Badge>
            <Badge variant="outline" className="text-xs">
              <span className="h-2 w-2 rounded-full bg-accent mr-1"></span>
              Aviso
            </Badge>
            <Badge variant="outline" className="text-xs">
              <span className="h-2 w-2 rounded-full bg-destructive mr-1"></span>
              Erro
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 relative">
        {/* Map Background */}
        <svg
          className="w-full h-full rounded-lg border border-border/50 bg-gradient-to-br from-primary/5 via-background to-secondary/5"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="hsl(var(--muted))" strokeWidth="0.1" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Terrain features */}
          <ellipse cx="30" cy="40" rx="15" ry="10" fill="hsl(var(--primary))" opacity="0.1" />
          <ellipse cx="70" cy="60" rx="20" ry="15" fill="hsl(var(--secondary))" opacity="0.1" />

          {/* Sensors */}
          {sensors.map((sensor) => (
            <g
              key={sensor.id}
              onClick={() => setSelectedSensor(sensor)}
              className="cursor-pointer transition-transform hover:scale-110"
              style={{ transformOrigin: `${sensor.position.x}% ${sensor.position.y}%` }}
            >
              {/* Pulse animation for active sensors */}
              {sensor.status === "active" && (
                <circle
                  cx={sensor.position.x}
                  cy={sensor.position.y}
                  r="2"
                  className={getStatusColor(sensor.status)}
                  opacity="0.3"
                >
                  <animate
                    attributeName="r"
                    from="2"
                    to="4"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.3"
                    to="0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              
              {/* Sensor marker */}
              <circle
                cx={sensor.position.x}
                cy={sensor.position.y}
                r="1.5"
                className={getStatusColor(sensor.status)}
                stroke="hsl(var(--background))"
                strokeWidth="0.3"
              />
            </g>
          ))}
        </svg>

        {/* Selected Sensor Info */}
        {selectedSensor && (
          <div className="absolute bottom-4 left-4 right-4 p-4 rounded-lg border border-border bg-card/90 backdrop-blur-md animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <Badge variant={selectedSensor.status === "error" ? "destructive" : "default"}>
                  {getTypeIcon(selectedSensor.type)}
                </Badge>
                <h3 className="font-semibold">{selectedSensor.name}</h3>
              </div>
              <button
                onClick={() => setSelectedSensor(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-muted-foreground">{selectedSensor.data}</p>
            <div className="mt-2 flex items-center gap-2">
              <MapPin className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Posição: {selectedSensor.position.x.toFixed(1)}, {selectedSensor.position.y.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveMap;
