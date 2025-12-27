import { Polyline } from 'react-leaflet';
import { GPSPosition } from "@/types/gps";
import { LatLngExpression } from 'leaflet';

interface TrackingPolylineProps {
  positions: GPSPosition[];
  color: string;
  isSelected: boolean;
}

export default function TrackingPolyline({
  positions,
  color,
  isSelected,
}: TrackingPolylineProps) {
  if (positions.length < 2) return null;

  const coordinates: LatLngExpression[] = positions.map(pos => [
    pos.latitude,
    pos.longitude,
  ]);

  return (
    <Polyline
      positions={coordinates}
      pathOptions={{
        color: color,
        weight: isSelected ? 4 : 2,
        opacity: isSelected ? 0.9 : 0.6,
        lineJoin: 'round',
        lineCap: 'round',
      }}
    />
  );
}
