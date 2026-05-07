'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Place } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/constants';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  places: Place[];
  onSelectPlace: (placeId: string | null) => void;
  selectedPlaceId?: string | null;
  latitude?: number;
  longitude?: number;
}

// Custom marker icons for each category
const createMarkerIcon = (color: string) => {
  return L.divIcon({
    html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}; box-shadow: 0 0 10px ${color}80;"></div>`,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

function MapController({ latitude, longitude }: { latitude?: number; longitude?: number }) {
  const map = useMap();

  useEffect(() => {
    if (latitude && longitude) {
      map.setView([latitude, longitude], 13);
    }
  }, [latitude, longitude, map]);

  return null;
}

export function InteractiveMap({
  places,
  onSelectPlace,
  selectedPlaceId,
  latitude = 37.7749,
  longitude = -122.4194,
}: InteractiveMapProps) {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      className="w-full h-full"
      style={{ zIndex: 1 }}
    >
      {/* Map tile layer - OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Map controller for location updates */}
      <MapController latitude={latitude} longitude={longitude} />

      {/* Place markers */}
      {places.map((place) => {
        const categoryColor = CATEGORY_CONFIG[place.category];
        const isSelected = selectedPlaceId === place.id;

        return (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={createMarkerIcon(categoryColor.color)}
            eventHandlers={{
              click: () => {
                onSelectPlace(place.id);
              },
            }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <h3 className="font-bold text-foreground">{place.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{place.description}</p>
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: categoryColor.color }}
                  />
                  <span className="text-xs text-foreground">{categoryColor.label}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
