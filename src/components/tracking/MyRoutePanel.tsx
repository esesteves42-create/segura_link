import { Play, Square, RotateCcw, Crosshair, Navigation2, Gauge, Route, Clock, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MyLocationState } from '@/hooks/use-my-location';

interface MyRoutePanelProps {
  locationState: MyLocationState;
  onCenterRequest: () => void;
}

export default function MyRoutePanel({ locationState, onCenterRequest }: MyRoutePanelProps) {
  const {
    isTracking,
    isLoading,
    error,
    stats,
    formattedStats,
    currentPosition,
    routeHistory,
    startTracking,
    stopTracking,
    resetRoute,
  } = locationState;

  const hasPosition = currentPosition !== null;
  const isMoving = stats.currentSpeed > 0.5;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Navigation2 className="h-4 w-4 text-blue-400" />
          Rastreamento Pessoal
          <div className="ml-auto flex items-center gap-2">
            {isTracking ? (
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs animate-pulse">
                <Wifi className="h-3 w-3 mr-1" />
                AO VIVO
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground text-xs">
                <WifiOff className="h-3 w-3 mr-1" />
                PARADO
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Botoes de controlo */}
        <div className="flex gap-2">
          {!isTracking ? (
            <Button
              onClick={startTracking}
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-9"
              size="sm"
            >
              <Play className="h-4 w-4 mr-1" />
              {isLoading ? 'A obter GPS...' : 'Iniciar Rota'}
            </Button>
          ) : (
            <Button
              onClick={stopTracking}
              variant="outline"
              className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 h-9"
              size="sm"
            >
              <Square className="h-4 w-4 mr-1" />
              Parar
            </Button>
          )}

          {hasPosition && (
            <Button
              onClick={onCenterRequest}
              variant="outline"
              size="sm"
              className="h-9 w-9 p-0 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              title="Centrar no meu local"
            >
              <Crosshair className="h-4 w-4" />
            </Button>
          )}

          <Button
            onClick={resetRoute}
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
            title="Reiniciar rota"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Erro */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* A aguardar GPS */}
        {isLoading && !hasPosition && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs text-blue-400">
            <div className="w-3 h-3 rounded-full bg-blue-400 animate-pulse" />
            <span>A conectar ao GPS... (pode demorar alguns segundos)</span>
          </div>
        )}

        {/* Estatisticas em tempo real */}
        {hasPosition && (
          <div className="grid grid-cols-2 gap-2">
            {/* Velocidade atual */}
            <div className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Gauge className="h-3 w-3" />
                Velocidade
              </div>
              <div className="text-lg font-bold text-foreground">
                {formattedStats.speed}
              </div>
              {isMoving && (
                <div className="text-xs text-blue-400 flex items-center gap-1">
                  <Navigation2 className="h-3 w-3" />
                  {formattedStats.direction}
                </div>
              )}
            </div>

            {/* Distancia percorrida */}
            <div className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Route className="h-3 w-3" />
                Distancia
              </div>
              <div className="text-lg font-bold text-foreground">
                {formattedStats.distance}
              </div>
              <div className="text-xs text-muted-foreground">
                {routeHistory.length} pontos
              </div>
            </div>

            {/* Duracao */}
            <div className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Duracao
              </div>
              <div className="text-lg font-bold text-foreground">
                {formattedStats.duration}
              </div>
            </div>

            {/* Precisao GPS */}
            <div className="p-3 rounded-lg bg-background/50 border border-border/30 space-y-1">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Crosshair className="h-3 w-3" />
                Precisao GPS
              </div>
              <div className={`text-lg font-bold ${stats.accuracy < 20 ? 'text-green-400' : stats.accuracy < 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {formattedStats.accuracy}
              </div>
            </div>
          </div>
        )}

        {/* Velocidades max/media - linha extra */}
        {hasPosition && stats.maxSpeed > 0 && (
          <div className="flex gap-2 text-xs">
            <div className="flex-1 p-2 rounded bg-background/30 border border-border/20">
              <span className="text-muted-foreground">Vel. max: </span>
              <span className="font-medium text-foreground">{formattedStats.maxSpeed}</span>
            </div>
            <div className="flex-1 p-2 rounded bg-background/30 border border-border/20">
              <span className="text-muted-foreground">Vel. media: </span>
              <span className="font-medium text-foreground">{formattedStats.avgSpeed}</span>
            </div>
          </div>
        )}

        {/* Altitude */}
        {hasPosition && stats.altitude != null && (
          <div className="text-xs text-muted-foreground p-2 rounded bg-background/30 border border-border/20">
            Altitude: <span className="text-foreground font-medium">{stats.altitude.toFixed(0)}m</span>
          </div>
        )}

        {/* Indicacao inicial */}
        {!hasPosition && !isLoading && !error && (
          <p className="text-xs text-muted-foreground text-center py-2">
            Clica em "Iniciar Rota" para comecar a rastrear a tua posicao real via GPS
          </p>
        )}
      </CardContent>
    </Card>
  );
}
