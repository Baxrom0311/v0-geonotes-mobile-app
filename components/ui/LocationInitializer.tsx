'use client';

import { useEffect } from 'react';
import { useGeoNotesStore } from '@/hooks/useGeoNotesStore.tsx';
import { useGeolocation, type GeolocationCoordinates } from '@/hooks/useGeolocation';

/**
 * LocationInitializer component
 * Automatically initializes geolocation tracking and updates the store
 * with the current location. Mount this in the root layout or AppShell.
 */
export function LocationInitializer() {
  const { setCurrentLocation } = useGeoNotesStore();
  const { coordinates, error, isSupported } = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 5000,
    timeout: 10000,
    onUpdate: (coords: GeolocationCoordinates) => {
      setCurrentLocation(coords.latitude, coords.longitude);
    },
  });

  useEffect(() => {
    // Update store when coordinates change
    if (coordinates) {
      setCurrentLocation(coordinates.latitude, coordinates.longitude);
    }
  }, [coordinates, setCurrentLocation]);

  // Log geolocation status in development
  useEffect(() => {
    if (!isSupported) {
      console.warn('[Geolocation] Geolocation API not supported on this device');
    }
    if (error) {
      console.warn('[Geolocation] Error:', error);
    }
  }, [isSupported, error]);

  // This component doesn't render anything, it just manages state
  return null;
}
