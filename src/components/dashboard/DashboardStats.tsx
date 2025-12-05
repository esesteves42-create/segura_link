import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Sprout, Shield } from "lucide-react";

interface StatsProps {
  data: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
    motion: boolean;
  };
}

const DashboardStats = ({ data }: StatsProps) => {
  const stats = [
    {
      title: "Temperatura",
      value: `${data.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Humidade do Ar",
      value: `${data.humidity.toFixed(1)}%`,
      icon: Droplets,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Humidade do Solo",
      value: `${data.soilMoisture.toFixed(1)}%`,
      icon: Sprout,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Status Segurança",
      value: data.motion ? "Movimento Detectado" : "Tudo Normal",
      icon: Shield,
      color: data.motion ? "text-destructive" : "text-success",
      bgColor: data.motion ? "bg-destructive/10" : "bg-success/10",
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
};

export default DashboardStats;
