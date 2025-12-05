import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Alert {
  id: number;
  type: "error" | "warning" | "info" | "success";
  title: string;
  message: string;
  time: string;
}

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      type: "success",
      title: "Sistema Iniciado",
      message: "Todos os sensores conectados com sucesso",
      time: new Date().toLocaleTimeString(),
    },
  ]);

  const possibleAlerts = [
    {
      type: "warning" as const,
      title: "Humidade Baixa",
      message: "Humidade do solo abaixo de 30%. Considere irrigação.",
    },
    {
      type: "error" as const,
      title: "Movimento Detectado",
      message: "Sensor de movimento ativado na zona norte.",
    },
    {
      type: "info" as const,
      title: "Actualização de Dados",
      message: "Novos dados meteorológicos recebidos.",
    },
    {
      type: "warning" as const,
      title: "Temperatura Elevada",
      message: "Temperatura acima de 32°C detectada.",
    },
    {
      type: "success" as const,
      title: "Irrigação Completa",
      message: "Sistema de irrigação automática concluído.",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomAlert = possibleAlerts[Math.floor(Math.random() * possibleAlerts.length)];
        const newAlert: Alert = {
          id: Date.now(),
          ...randomAlert,
          time: new Date().toLocaleTimeString(),
        };
        setAlerts(prev => [newAlert, ...prev].slice(0, 10));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return <AlertCircle className="h-4 w-4" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4" />;
      case "success":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getBadgeVariant = (type: Alert["type"]) => {
    switch (type) {
      case "error":
        return "destructive";
      case "warning":
        return "default";
      case "success":
        return "default";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Alertas do Sistema</span>
          <Badge variant="outline">{alerts.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-lg border border-border/50 bg-background/50 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300"
              >
                <div className="flex items-start gap-3">
                  <Badge variant={getBadgeVariant(alert.type)} className="mt-0.5">
                    {getIcon(alert.type)}
                  </Badge>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold">{alert.title}</h4>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
