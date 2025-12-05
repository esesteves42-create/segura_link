import { useState, useEffect } from "react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import SensorCharts from "@/components/dashboard/SensorCharts";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import InteractiveMap from "@/components/dashboard/InteractiveMap";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [realtimeData, setRealtimeData] = useState({
    temperature: 25,
    humidity: 65,
    soilMoisture: 45,
    motion: false,
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
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
              <h1 className="text-3xl font-bold text-foreground">Dashboard Segura-Link</h1>
              <p className="text-muted-foreground">Monitoramento em Tempo Real</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse"></div>
            <span className="text-sm text-muted-foreground">Sistema Ativo</span>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStats data={realtimeData} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Map - 2 columns */}
          <div className="lg:col-span-2">
            <InteractiveMap />
          </div>

          {/* Alerts - 1 column */}
          <div className="lg:col-span-1">
            <AlertsPanel />
          </div>
        </div>

        {/* Charts */}
        <div className="mt-6">
          <SensorCharts data={realtimeData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
