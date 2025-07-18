import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// If you see a type error for leaflet, run: npm install --save-dev @types/leaflet
import L from 'leaflet';

interface MapPickerProps {
  value: { lat: number; lng: number };
  onChange: (coords: { lat: number; lng: number }) => void;
  center?: { lat: number; lng: number };
}

const markerIcon = new (L as any).Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const LocationMarker: React.FC<{ value: { lat: number; lng: number }; onChange: (coords: { lat: number; lng: number }) => void }> = ({ value, onChange }) => {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    dragend() {},
  });
  return (
    <Marker
      position={[value.lat, value.lng]}
      icon={markerIcon}
      draggable={true}
      eventHandlers={{
        dragend: (e: L.LeafletEvent) => {
          const marker = e.target as L.Marker;
          const position = marker.getLatLng();
          onChange({ lat: position.lat, lng: position.lng });
        },
      }}
    />
  );
};

const MapPicker: React.FC<MapPickerProps> = ({ value, onChange, center }) => {
  const mapRef = useRef<L.Map | null>(null);

  // Ensure the map resizes correctly after mount
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current!.invalidateSize();
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current && value.lat && value.lng) {
      mapRef.current.setView([value.lat, value.lng], 16);
    }
  }, [value]);
  return (
    <MapContainer
      center={center ? [center.lat, center.lng] : [value.lat, value.lng]}
      zoom={16}
      style={{ height: '300px', width: '100%' }}
      whenCreated={(mapInstance: L.Map) => (mapRef.current = mapInstance)}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker value={value} onChange={onChange} />
    </MapContainer>
  );
};

export default MapPicker; 