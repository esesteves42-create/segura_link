import { useState } from "react";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, BellRing, Mail, MessageSquare, Phone, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DashboardAlerts = () => {
  const [notifications, setNotifications] = useState({
    sms: true,
    email: true,
    push: true,
    call: false,
  });

  const alertHistory = [
    {
      id: 1,
      type: "critical",
      title: "Movimento Detectado - Zona Restrita",
      description: "Sensor de movimento ativado na área protegida Norte",
      timestamp: "2025-12-04 14:23",
      channels: ["SMS", "Email", "Push"],
      status: "acknowledged"
    },
    {
      id: 2,
      type: "warning",
      title: "Temperatura Elevada - Sensor A",
      description: "Temperatura acima do limite: 35.2°C",
      timestamp: "2025-12-04 13:45",
      channels: ["Email", "Push"],
      status: "resolved"
    },
    {
      id: 3,
      type: "info",
      title: "Manutenção Programada",
      description: "Sistema de backup será atualizado às 03:00",
      timestamp: "2025-12-04 12:00",
      channels: ["Email"],
      status: "pending"
    },
    {
      id: 4,
      type: "critical",
      title: "Bateria Baixa - Sensor F",
      description: "Nível de bateria crítico: 12%",
      timestamp: "2025-12-04 11:15",
      channels: ["SMS", "Push"],
      status: "acknowledged"
    },
    {
      id: 5,
      type: "warning",
      title: "Conexão Intermitente - Gateway 2",
      description: "Perda de sinal detectada por 5 minutos",
      timestamp: "2025-12-04 10:30",
      channels: ["Email"],
      status: "resolved"
    },
  ];

  const alertStats = [
    { label: "Alertas Hoje", value: 12, change: "+3", trend: "up" },
    { label: "Críticos Ativos", value: 2, change: "0", trend: "neutral" },
    { label: "Tempo Médio Resposta", value: "4.2 min", change: "-1.3", trend: "down" },
    { label: "Taxa de Resolução", value: "94%", change: "+2%", trend: "up" },
  ];

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "warning": return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "info": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-gray-500 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending": return <Badge variant="secondary">Pendente</Badge>;
      case "acknowledged": return <Badge className="bg-blue-500">Reconhecido</Badge>;
      case "resolved": return <Badge className="bg-green-500">Resolvido</Badge>;
      default: return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-orange-500/5">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Bell className="h-8 w-8 text-orange-500" />
                Dashboard de Alertas
              </h1>
              <p className="text-muted-foreground">Centro de Notificações e Alertas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-orange-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">2 Alertas Críticos Ativos</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {alertStats.map((stat, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <div className="flex items-end justify-between">
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <Badge
                      variant="outline"
                      className={`${
                        stat.trend === "up" ? "text-green-500" :
                        stat.trend === "down" ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alert History - 2 columns */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Alertas</CardTitle>
                <CardDescription>Registro completo de notificações e eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 mb-4">
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="critical">Críticos</TabsTrigger>
                    <TabsTrigger value="warning">Avisos</TabsTrigger>
                    <TabsTrigger value="info">Info</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="space-y-3">
                    {alertHistory.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${getAlertColor(alert.type)} transition-all hover:shadow-md`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{alert.title}</h4>
                          {getStatusBadge(alert.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{alert.timestamp}</span>
                          <div className="flex gap-1">
                            {alert.channels.map((channel, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {channel}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Active Alerts - 1 column */}
          <div className="lg:col-span-1">
            <AlertsPanel />
          </div>
        </div>

        {/* Notification Settings */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configurações de Notificação
            </CardTitle>
            <CardDescription>Gerencie como e quando você deseja receber alertas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="font-medium">Notificações SMS</p>
                    <p className="text-sm text-muted-foreground">Receber alertas por mensagem de texto</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-medium">Notificações por Email</p>
                    <p className="text-sm text-muted-foreground">Receber alertas no seu email</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-medium">Notificações Push</p>
                    <p className="text-sm text-muted-foreground">Receber alertas no aplicativo móvel</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="font-medium">Chamadas de Emergência</p>
                    <p className="text-sm text-muted-foreground">Receber ligações para alertas críticos</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.call}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, call: checked })}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button className="flex-1">Salvar Configurações</Button>
              <Button variant="outline">Testar Notificações</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAlerts;
