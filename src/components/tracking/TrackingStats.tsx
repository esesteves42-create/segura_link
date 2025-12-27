import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Navigation2, TrendingUp, AlertCircle } from "lucide-react";
import { TrackedIndividual, GPSPosition } from "@/types/gps";
import { formatDistance, formatSpeed } from "@/lib/gps-calculations";

interface TrackingStatsProps {
  individuals: TrackedIndividual[];
  positions: Map<string, GPSPosition>;
  tracks: Map<string, GPSPosition[]>;
}

export default function TrackingStats({
  individuals,
  positions,
  tracks,
}: TrackingStatsProps) {
  // Calcular estatísticas gerais
  const activeCount = individuals.filter(i => i.status === 'active').length;

  let totalDistance = 0;
  let totalSpeeds: number[] = [];

  tracks.forEach((track) => {
    if (track.length >= 2) {
      for (let i = 1; i < track.length; i++) {
        const lat1 = track[i - 1].latitude;
        const lon1 = track[i - 1].longitude;
        const lat2 = track[i].latitude;
        const lon2 = track[i].longitude;

        // Aproximação simples de distância
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        totalDistance += R * c;
      }
    }
  });

  positions.forEach(pos => {
    if (pos.speed !== undefined && pos.speed > 0) {
      totalSpeeds.push(pos.speed);
    }
  });

  const avgSpeed = totalSpeeds.length > 0
    ? totalSpeeds.reduce((a, b) => a + b, 0) / totalSpeeds.length
    : 0;

  const warningCount = individuals.filter(
    i => i.status === 'warning' || i.status === 'emergency'
  ).length;

  const stats = [
    {
      title: "Indivíduos Ativos",
      value: activeCount.toString(),
      icon: Activity,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Distância Total",
      value: formatDistance(totalDistance),
      icon: Navigation2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Velocidade Média",
      value: formatSpeed(avgSpeed),
      icon: TrendingUp,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Alertas",
      value: warningCount.toString(),
      icon: AlertCircle,
      color: warningCount > 0 ? "text-destructive" : "text-muted-foreground",
      bgColor: warningCount > 0 ? "bg-destructive/10" : "bg-muted/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
