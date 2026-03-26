import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useEffect, useMemo, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "lucide-react";
import { GPSPosition, TrackedIndividual } from "@/types/gps";
import { LatLngExpression } from 'leaflet';
import IndividualMarker from './IndividualMarker';
import TrackingPolyline from './TrackingPolyline';
import MyLocationMarker from './MyLocationMarker';
import MyRoutePolyline from './MyRoutePolyline';
import "@/styles/leaflet-custom.css";

interface TrackingMapProps {
  individuals: TrackedIndividual[];
  positions: Map<string, GPSPosition>;
  tracks: Map<string, GPSPosition[]>;
  selectedIndividualId?: string | null;
  onIndividualSelect: (id: string) => void;
  // GPS real do utilizador
  myPosition?: GPSPosition | null;
  myRoute?: GPSPosition[];
  centerOnMe?: boolean;
  onCenterOnMeDone?: () => void;
}

// Componente auxiliar para controlar o centro do mapa
function MapController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);

  return null;
}

export default function TrackingMap({
  individuals,
  positions,
  tracks,
  selectedIndividualId,
  onIndividualSelect,
  myPosition,
  myRoute = [],
  centerOnMe = false,
  onCenterOnMeDone,
}: TrackingMapProps) {
  // Calcular centro do mapa baseado nas posições
  const mapCenter: LatLngExpression = useMemo(() => {
    // Se ha posicao real do utilizador e nenhum individuo selecionado, centrar nele
    if (myPosition && !selectedIndividualId) {
      return [myPosition.latitude, myPosition.longitude];
    }

    // Se há um indivíduo selecionado, centralizar nele
    if (selectedIndividualId) {
      const selectedPos = positions.get(selectedIndividualId);
      if (selectedPos) {
        return [selectedPos.latitude, selectedPos.longitude];
      }
    }

    // Senão, calcular centro médio de todas as posições
    if (positions.size > 0) {
      let totalLat = 0;
      let totalLng = 0;
      let count = 0;

      positions.forEach(pos => {
        totalLat += pos.latitude;
        totalLng += pos.longitude;
        count++;
      });

      if (count > 0) {
        return [totalLat / count, totalLng / count];
      }
    }

    // Default: Luanda, Angola
    return [-8.8383, 13.2344];
  }, [positions, selectedIndividualId, myPosition]);

  const mapZoom = selectedIndividualId ? 15 : 13;

  return (
    <Card className="h-[700px] overflow-hidden border-border/50 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Navigation className="h-5 w-5 text-primary" />
          Mapa de Rastreamento GPS
          <span className="ml-auto text-sm font-normal text-muted-foreground">
            {individuals.filter(i => i.status === 'active').length} ativos
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-80px)] p-0">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          className="h-full w-full"
          zoomControl={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          />

          <MapController center={mapCenter} zoom={mapZoom} />

          {/* Polylines de trajetos */}
          {individuals.map(individual => {
            const track = tracks.get(individual.id);
            if (!track || track.length < 2) return null;

            return (
              <TrackingPolyline
                key={`track-${individual.id}`}
                positions={track}
                color={individual.color}
                isSelected={selectedIndividualId === individual.id}
              />
            );
          })}

          {/* Marcadores dos indivíduos */}
          {individuals.map(individual => {
            const position = positions.get(individual.id);
            if (!position) return null;

            return (
              <IndividualMarker
                key={individual.id}
                individual={individual}
                position={position}
                isSelected={selectedIndividualId === individual.id}
                onClick={() => onIndividualSelect(individual.id)}
              />
            );
          })}

          {/* GPS real do utilizador - rota percorrida */}
          {myRoute.length >= 2 && (
            <MyRoutePolyline positions={myRoute} />
          )}

          {/* GPS real do utilizador - posicao atual */}
          {myPosition && (
            <MyLocationMarker
              position={myPosition}
              accuracy={myPosition.accuracy}
              heading={myPosition.heading}
              speed={myPosition.speed}
              shouldCenter={centerOnMe}
              onCenterDone={onCenterOnMeDone}
            />
          )}
        </MapContainer>
      </CardContent>
    </Card>
  );
}
