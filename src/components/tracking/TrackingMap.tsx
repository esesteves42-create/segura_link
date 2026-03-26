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
  isMobile?: boolean;
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
  isMobile = false,
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

  // Altura responsiva: mobile 380px, tablet 500px, desktop 700px
  const cardHeight = isMobile ? 'h-[380px]' : 'h-[380px] md:h-[500px] lg:h-[700px]';
  const contentHeight = isMobile
    ? 'h-[calc(100%-60px)]'
    : 'h-[calc(100%-60px)] md:h-[calc(100%-70px)] lg:h-[calc(100%-80px)]';

  return (
    <Card className={`${cardHeight} overflow-hidden border-border/50 bg-card/50 backdrop-blur`}>
      <CardHeader className="py-3 px-4 lg:p-6">
        <CardTitle className="flex items-center gap-2 text-sm lg:text-base">
          <Navigation className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
          <span className="hidden sm:inline">Mapa de Rastreamento GPS</span>
          <span className="sm:hidden">Mapa GPS</span>
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            {individuals.filter(i => i.status === 'active').length} ativos
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className={`${contentHeight} p-0`}>
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
