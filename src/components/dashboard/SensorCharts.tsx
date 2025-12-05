import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartsProps {
  data: {
    temperature: number;
    humidity: number;
    soilMoisture: number;
  };
}

const SensorCharts = ({ data }: ChartsProps) => {
  const [historyData, setHistoryData] = useState<any[]>([]);

  useEffect(() => {
    setHistoryData(prev => {
      const newData = [
        ...prev,
        {
          time: new Date().toLocaleTimeString(),
          temperatura: data.temperature,
          humidade: data.humidity,
          solo: data.soilMoisture,
        },
      ].slice(-20); // Keep last 20 points
      return newData;
    });
  }, [data]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Temperature Chart */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Temperatura ao Longo do Tempo</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="temperatura" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={false}
                name="Temperatura (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Humidity Chart */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-lg">Humidade do Ar</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="humidade" 
                stroke="hsl(var(--secondary))" 
                fill="hsl(var(--secondary) / 0.2)"
                strokeWidth={2}
                name="Humidade (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Soil Moisture Chart */}
      <Card className="border-border/50 bg-card/50 backdrop-blur lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Comparação de Sensores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={historyData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="time" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="temperatura" 
                stroke="hsl(var(--accent))" 
                strokeWidth={2}
                dot={false}
                name="Temperatura (°C)"
              />
              <Line 
                type="monotone" 
                dataKey="humidade" 
                stroke="hsl(var(--secondary))" 
                strokeWidth={2}
                dot={false}
                name="Humidade Ar (%)"
              />
              <Line 
                type="monotone" 
                dataKey="solo" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
                name="Humidade Solo (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default SensorCharts;
