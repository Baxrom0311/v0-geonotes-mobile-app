'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/constants';

// Initialize Leaflet icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function createCategoryMarkerIcon(category: any) {
  const config = CATEGORY_CONFIG[category];
  return L.icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C8.27 0 2 6.27 2 14c0 10 14 26 14 26s14-16 14-26c0-7.73-6.27-14-14-14z" fill="${encodeURIComponent(config.color)}" />
        <circle cx="16" cy="14" r="6" fill="white" />
      </svg>
    `)}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  });
}

interface MapScreenContentProps {
  currentLocation: { latitude: number; longitude: number };
  filteredPlaces: Place[];
  selectedPlaceId: string | null;
  onSelectPlace: (id: string) => void;
}

export default function MapScreenContent({
  currentLocation,
  filteredPlaces,
  selectedPlaceId,
  onSelectPlace,
}: MapScreenContentProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="w-full h-full bg-gray-100" />;
  }

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[currentLocation.latitude, currentLocation.longitude]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Current location marker */}
        <Marker position={[currentLocation.latitude, currentLocation.longitude]} icon={L.icon({
          iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" fill="#3b82f6"/><circle cx="10" cy="10" r="5" fill="white"/></svg>'),
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })} />

        {/* Place markers */}
        {filteredPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={createCategoryMarkerIcon(place.category)}
            eventHandlers={{
              click: () => onSelectPlace(place.id),
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
}
