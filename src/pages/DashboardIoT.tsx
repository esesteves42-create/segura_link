import { useState, useEffect } from "react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import SensorCharts from "@/components/dashboard/SensorCharts";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Wifi, WifiOff, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DashboardIoT = () => {
  const [realtimeData, setRealtimeData] = useState({
    temperature: 25,
    humidity: 65,
    soilMoisture: 45,
    motion: false,
  });

  const [sensors] = useState([
    { id: "SEN-001", name: "Sensor Temperatura A", type: "Temperatura", status: "online", battery: 87, signal: 95 },
    { id: "SEN-002", name: "Sensor Humidade B", type: "Humidade", status: "online", battery: 92, signal: 88 },
    { id: "SEN-003", name: "Sensor Solo C", type: "Solo", status: "online", battery: 78, signal: 92 },
    { id: "SEN-004", name: "Sensor Movimento D", type: "Movimento", status: "warning", battery: 45, signal: 76 },
    { id: "SEN-005", name: "Sensor Pressão E", type: "Pressão", status: "online", battery: 91, signal: 89 },
    { id: "SEN-006", name: "Sensor Luz F", type: "Luminosidade", status: "offline", battery: 12, signal: 0 },
  ]);

  // Simulate real-time sensor updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)),
        humidity: Math.max(30, Math.min(90, prev.humidity + (Math.random() - 0.5) * 3)),
        soilMoisture: Math.max(20, Math.min(80, prev.soilMoisture + (Math.random() - 0.5) * 2)),
        motion: Math.random() > 0.9,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "warning": return "bg-yellow-500";
      case "offline": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online": return <Badge className="bg-green-500">Online</Badge>;
      case "warning": return <Badge className="bg-yellow-500">Aviso</Badge>;
      case "offline": return <Badge variant="destructive">Offline</Badge>;
      default: return <Badge variant="secondary">Desconhecido</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5">
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
                <Wifi className="h-8 w-8 text-blue-500" />
                Dashboard IoT Integrado
              </h1>
              <p className="text-muted-foreground">Rede de Sensores em Tempo Real</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm text-muted-foreground">6 Sensores Ativos</span>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStats data={realtimeData} />

        {/* Sensors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {sensors.map((sensor) => (
            <Card key={sensor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {sensor.status === "online" ? (
                      <Wifi className="h-5 w-5 text-green-500" />
                    ) : sensor.status === "warning" ? (
                      <Radio className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <WifiOff className="h-5 w-5 text-red-500" />
                    )}
                    {sensor.name}
                  </CardTitle>
                  {getStatusBadge(sensor.status)}
                </div>
                <CardDescription>ID: {sensor.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tipo:</span>
                    <span className="font-medium">{sensor.type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Bateria:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            sensor.battery > 60 ? 'bg-green-500' :
                            sensor.battery > 30 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${sensor.battery}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{sensor.battery}%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Sinal:</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 transition-all"
                          style={{ width: `${sensor.signal}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{sensor.signal}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="mt-6">
          <SensorCharts data={realtimeData} />
        </div>

        {/* Network Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informações da Rede LoRaWAN</CardTitle>
            <CardDescription>Conectividade e cobertura de rede</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Gateway Ativo</p>
                <p className="text-2xl font-bold">GTW-001</p>
                <p className="text-xs text-muted-foreground">São Paulo, Brasil</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Frequência</p>
                <p className="text-2xl font-bold">915 MHz</p>
                <p className="text-xs text-muted-foreground">Banda ISM</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Taxa de Transmissão</p>
                <p className="text-2xl font-bold">5.2 kbps</p>
                <p className="text-xs text-muted-foreground">SF7 BW125</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardIoT;
