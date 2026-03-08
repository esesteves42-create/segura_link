import { useState, useEffect } from "react";
import DashboardStats from "@/components/dashboard/DashboardStats";
import SensorCharts from "@/components/dashboard/SensorCharts";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import InteractiveMap from "@/components/dashboard/InteractiveMap";

const Dashboard = () => {
  const [realtimeData, setRealtimeData] = useState({
    temperature: 25,
    humidity: 65,
    soilMoisture: 45,
    motion: false,
  });

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
    <div className="p-4 space-y-4">
      <DashboardStats data={realtimeData} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <InteractiveMap />
        </div>
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>
      </div>

      <SensorCharts data={realtimeData} />
    </div>
  );
};

export default Dashboard;
