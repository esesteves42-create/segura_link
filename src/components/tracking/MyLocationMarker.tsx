import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { GPSPosition } from '@/types/gps';

interface MyLocationMarkerProps {
  position: GPSPosition;
  accuracy: number;
  heading?: number;
  speed?: number;
  shouldCenter?: boolean;
  onCenterDone?: () => void;
}

export default function MyLocationMarker({
  position,
  accuracy,
  heading,
  speed,
  shouldCenter = false,
  onCenterDone,
}: MyLocationMarkerProps) {
  const map = useMap();
  const markerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    const latlng: L.LatLngExpression = [position.latitude, position.longitude];

    // Criar icone personalizado estilo Uber - ponto azul com seta de direcao
    const headingRad = heading != null ? heading : 0;
    const iconHtml = `
      <div style="position: relative; width: 40px; height: 40px;">
        <!-- Circulo externo pulsante -->
        <div style="
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 40px; height: 40px;
          background: rgba(59, 130, 246, 0.2);
          border-radius: 50%;
          animation: myLocationPulse 2s ease-in-out infinite;
        "></div>
        <!-- Seta de direcao (apenas se em movimento) -->
        ${speed != null && speed > 0.5 ? `
        <div style="
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(${headingRad}deg);
          width: 0; height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-bottom: 20px solid rgba(59, 130, 246, 0.8);
          margin-top: -18px;
        "></div>
        ` : ''}
        <!-- Ponto central azul -->
        <div style="
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 18px; height: 18px;
          background: #3B82F6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.6);
        "></div>
      </div>
    `;

    const icon = L.divIcon({
      html: iconHtml,
      className: '',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    // Atualizar ou criar marcador
    if (markerRef.current) {
      markerRef.current.setLatLng(latlng);
      markerRef.current.setIcon(icon);
    } else {
      markerRef.current = L.marker(latlng, { icon, zIndexOffset: 1000 })
        .addTo(layerGroupRef.current!);

      markerRef.current.bindPopup(`
        <div style="font-family: sans-serif; min-width: 150px;">
          <strong style="color: #3B82F6;">A minha localizacao</strong><br/>
          <small>GPS em tempo real</small>
        </div>
      `);
    }

    // Atualizar ou criar circulo de precisao
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setLatLng(latlng);
      accuracyCircleRef.current.setRadius(accuracy);
    } else {
      accuracyCircleRef.current = L.circle(latlng, {
        radius: accuracy,
        color: '#3B82F6',
        fillColor: '#3B82F6',
        fillOpacity: 0.08,
        weight: 1,
        dashArray: '4 4',
      }).addTo(layerGroupRef.current!);
    }

    // Centralizar no utilizador se pedido
    if (shouldCenter) {
      map.setView(latlng, Math.max(map.getZoom(), 17), { animate: true });
      onCenterDone?.();
    }

    return () => {
      // Nao limpar aqui - atualizado no proximo render
    };
  }, [position, accuracy, heading, speed, shouldCenter, map, onCenterDone]);

  // Limpar ao desmontar
  useEffect(() => {
    return () => {
      if (layerGroupRef.current) {
        layerGroupRef.current.clearLayers();
        map.removeLayer(layerGroupRef.current);
        layerGroupRef.current = null;
        markerRef.current = null;
        accuracyCircleRef.current = null;
      }
    };
  }, [map]);

  return null;
}
