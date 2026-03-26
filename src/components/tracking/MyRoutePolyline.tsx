import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { GPSPosition } from '@/types/gps';

interface MyRoutePolylineProps {
  positions: GPSPosition[];
}

export default function MyRoutePolyline({ positions }: MyRoutePolylineProps) {
  const map = useMap();
  const polylineRef = useRef<L.Polyline | null>(null);

  useEffect(() => {
    if (positions.length < 2) {
      if (polylineRef.current) {
        polylineRef.current.setLatLngs([]);
      }
      return;
    }

    const latlngs: L.LatLngExpression[] = positions.map(p => [p.latitude, p.longitude]);

    if (polylineRef.current) {
      polylineRef.current.setLatLngs(latlngs);
    } else {
      polylineRef.current = L.polyline(latlngs, {
        color: '#3B82F6',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: undefined,
      }).addTo(map);
    }
  }, [positions, map]);

  // Limpar ao desmontar
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
    };
  }, [map]);

  return null;
}
