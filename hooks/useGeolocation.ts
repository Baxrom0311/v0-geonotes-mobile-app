'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export interface GeolocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  altitudeAccuracy?: number;
  heading?: number;
  speed?: number;
}

export interface GeolocationState {
  coordinates: GeolocationCoordinates | null;
  isLoading: boolean;
  error: string | null;
  isSupported: boolean;
  isWatching: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  onUpdate?: (coords: GeolocationCoordinates) => void;
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 5000,
    onUpdate,
  } = options;

  const [state, setState] = useState<GeolocationState>({
    coordinates: null,
    isLoading: true,
    error: null,
    isSupported: typeof navigator !== 'undefined' && 'geolocation' in navigator,
    isWatching: false,
  });

  const watchIdRef = useRef<number | null>(null);

  const startWatching = useCallback(() => {
    if (!state.isSupported) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation not supported',
        isLoading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, isWatching: true }));

    const options = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy, altitude, altitudeAccuracy, heading, speed } =
        position.coords;

      const coordinates: GeolocationCoordinates = {
        latitude,
        longitude,
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        speed,
      };

      setState((prev) => ({
        ...prev,
        coordinates,
        isLoading: false,
        error: null,
        isWatching: true,
      }));

      onUpdate?.(coordinates);
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'Unknown error';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Position unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }

      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
        isWatching: false,
      }));
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options
    );
  }, [state.isSupported, enableHighAccuracy, timeout, maximumAge, onUpdate]);

  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setState((prev) => ({ ...prev, isWatching: false }));
    }
  }, []);

  useEffect(() => {
    startWatching();

    return () => {
      stopWatching();
    };
  }, [startWatching, stopWatching]);

  return {
    ...state,
    startWatching,
    stopWatching,
  };
}
