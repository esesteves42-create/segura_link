import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrackedIndividual, TrackingStats } from "@/types/gps";
import {
  Navigation2,
  Gauge,
  Clock,
  MapPin,
  TrendingUp,
  Activity,
} from "lucide-react";
import { formatSpeed, formatDistance, formatDuration, bearingToCardinal } from "@/lib/gps-calculations";

interface TrackingInfoPanelProps {
  individual: TrackedIndividual | null;
  stats: TrackingStats | null;
  currentDirection: string | null;
}

export default function TrackingInfoPanel({
  individual,
  stats,
  currentDirection,
}: TrackingInfoPanelProps) {
  if (!individual || !stats) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Informações</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            Selecione um indivíduo no mapa ou na lista para ver detalhes
          </p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: TrackedIndividual['status']) => {
    switch (status) {
      case 'active':
        return 'bg-success text-success-foreground';
      case 'inactive':
        return 'bg-secondary text-secondary-foreground';
      case 'warning':
        return 'bg-yellow-500 text-white';
      case 'emergency':
        return 'bg-destructive text-destructive-foreground';
    }
  };

  const infoItems = [
    {
      icon: Gauge,
      label: "Velocidade Atual",
      value: formatSpeed(stats.currentSpeed),
      color: "text-primary",
    },
    {
      icon: TrendingUp,
      label: "Velocidade Média",
      value: formatSpeed(stats.averageSpeed),
      color: "text-secondary",
    },
    {
      icon: Activity,
      label: "Velocidade Máxima",
      value: formatSpeed(stats.maxSpeed),
      color: "text-accent",
    },
    {
      icon: Navigation2,
      label: "Direção",
      value: currentDirection || 'N/A',
      color: "text-primary",
    },
    {
      icon: MapPin,
      label: "Distância Percorrida",
      value: formatDistance(stats.totalDistance),
      color: "text-success",
    },
    {
      icon: Clock,
      label: "Tempo em Movimento",
      value: formatDuration(stats.duration),
      color: "text-muted-foreground",
    },
  ];

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{individual.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {individual.type === 'vehicle' ? 'Veículo' :
               individual.type === 'person' ? 'Pessoa' : 'Asset'}
            </p>
          </div>
          <Badge className={getStatusColor(individual.status)}>
            {individual.status === 'active' ? 'Ativo' :
             individual.status === 'inactive' ? 'Inativo' :
             individual.status === 'warning' ? 'Aviso' : 'Emergência'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {infoItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                </div>
                <span className={`text-sm font-semibold ${item.color}`}>
                  {item.value}
                </span>
              </div>
              {index < infoItems.length - 1 && <Separator className="mt-3" />}
            </div>
          );
        })}

        <Separator />

        <div className="text-xs text-muted-foreground">
          <p>Última atualização: {stats.lastUpdate.toLocaleTimeString('pt-BR')}</p>
          <p className="mt-1">
            Status: <span style={{ color: individual.color }}>Rastreamento ativo</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
