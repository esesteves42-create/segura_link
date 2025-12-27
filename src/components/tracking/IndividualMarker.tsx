import { Marker, Popup, Circle } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { GPSPosition, TrackedIndividual } from "@/types/gps";
import { formatSpeed, bearingToCardinal } from "@/lib/gps-calculations";
import { Car, User, Package, AlertTriangle } from "lucide-react";
import { renderToStaticMarkup } from 'react-dom/server';

interface IndividualMarkerProps {
  individual: TrackedIndividual;
  position: GPSPosition;
  isSelected: boolean;
  onClick: () => void;
}

// Criar ícone customizado baseado no tipo
function createCustomIcon(individual: TrackedIndividual, isSelected: boolean) {
  const IconComponent = individual.type === 'vehicle' ? Car :
    individual.type === 'person' ? User : Package;

  const iconHtml = renderToStaticMarkup(
    <div
      style={{
        backgroundColor: individual.color,
        borderRadius: '50%',
        padding: '8px',
        border: isSelected ? '3px solid white' : '2px solid white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <IconComponent size={isSelected ? 20 : 16} color="white" />
    </div>
  );

  return new Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(iconHtml),
    iconSize: [isSelected ? 40 : 32, isSelected ? 40 : 32],
    iconAnchor: [isSelected ? 20 : 16, isSelected ? 20 : 16],
    popupAnchor: [0, isSelected ? -20 : -16],
  });
}

export default function IndividualMarker({
  individual,
  position,
  isSelected,
  onClick,
}: IndividualMarkerProps) {
  const markerPosition: LatLngExpression = [position.latitude, position.longitude];
  const icon = createCustomIcon(individual, isSelected);

  const direction = position.heading !== undefined
    ? bearingToCardinal(position.heading)
    : 'N/A';

  const speed = position.speed !== undefined
    ? formatSpeed(position.speed)
    : 'N/A';

  return (
    <>
      {/* Círculo de pulse para marcador ativo */}
      {individual.status === 'active' && (
        <Circle
          center={markerPosition}
          radius={50}
          pathOptions={{
            color: individual.color,
            fillColor: individual.color,
            fillOpacity: 0.2,
            opacity: 0.4,
            weight: 2,
          }}
          className="tracking-marker-pulse"
        />
      )}

      {/* Marcador principal */}
      <Marker
        position={markerPosition}
        icon={icon}
        eventHandlers={{
          click: onClick,
        }}
      >
        <Popup>
          <div className="p-2 min-w-[200px]">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              {individual.name}
              {individual.status === 'warning' && (
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              )}
              {individual.status === 'emergency' && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><strong>Tipo:</strong> {individual.type === 'vehicle' ? 'Veículo' : individual.type === 'person' ? 'Pessoa' : 'Asset'}</p>
              <p><strong>Status:</strong> <span style={{ color: individual.color }}>{individual.status}</span></p>
              <p><strong>Velocidade:</strong> {speed}</p>
              <p><strong>Direção:</strong> {direction}</p>
              <p><strong>Precisão:</strong> ±{position.accuracy.toFixed(0)}m</p>
              <p className="text-xs mt-2 text-muted-foreground">
                Última atualização: {new Date(position.timestamp).toLocaleTimeString('pt-BR')}
              </p>
            </div>
          </div>
        </Popup>
      </Marker>
    </>
  );
}
