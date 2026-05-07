'use client';

import React from 'react';
import { useGeoNotesStore } from '@/hooks/useGeoNotesStore.tsx';
import { useGeolocation } from '@/hooks/useGeolocation';
import { MapPin, AlertCircle, Loader2 } from 'lucide-react';

export function LocationStatus() {
  const { currentLocation } = useGeoNotesStore();
  const { isLoading, error, coordinates, isSupported, isWatching } = useGeolocation({
    enableHighAccuracy: true,
    maximumAge: 5000,
  });

  // Calculate accuracy level
  const getAccuracyLevel = (accuracy?: number) => {
    if (!accuracy) return 'Unknown';
    if (accuracy < 10) return 'Excellent';
    if (accuracy < 50) return 'Good';
    if (accuracy < 100) return 'Fair';
    return 'Poor';
  };

  if (!isSupported) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
        <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
        <span className="text-xs text-red-300">Geolocation not supported</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
        <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
        <span className="text-xs text-red-300">{error}</span>
      </div>
    );
  }

  if (isLoading || !coordinates) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
        <Loader2 size={16} className="text-cyan-400 flex-shrink-0 animate-spin" />
        <span className="text-xs text-cyan-300">Getting location...</span>
      </div>
    );
  }

  const accuracy = coordinates.accuracy || 0;
  const accuracyLevel = getAccuracyLevel(accuracy);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-lg">
        <MapPin size={16} className="text-cyan-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-cyan-300">Live Location</p>
          <p className="text-xs text-muted-foreground truncate">
            {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
          </p>
        </div>
        {isWatching && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg">
          <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
          <p className="text-sm font-semibold text-cyan-300">{accuracy.toFixed(1)}m</p>
          <p className="text-xs text-muted-foreground">{accuracyLevel}</p>
        </div>

        {coordinates.altitude !== undefined && (
          <div className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Altitude</p>
            <p className="text-sm font-semibold text-purple-300">{coordinates.altitude.toFixed(1)}m</p>
          </div>
        )}

        {coordinates.speed !== undefined && coordinates.speed !== null && (
          <div className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Speed</p>
            <p className="text-sm font-semibold text-green-300">
              {(coordinates.speed * 3.6).toFixed(1)}km/h
            </p>
          </div>
        )}

        {coordinates.heading !== undefined && coordinates.heading !== null && (
          <div className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Heading</p>
            <p className="text-sm font-semibold text-pink-300">{coordinates.heading.toFixed(0)}°</p>
          </div>
        )}
      </div>
    </div>
  );
}
