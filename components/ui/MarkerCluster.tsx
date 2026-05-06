'use client';

import React from 'react';
import { Place } from '@/lib/types';

interface MarkerClusterProps {
  places: Place[];
  zoom: number;
  onClusterClick: (placeIds: string[]) => void;
}

interface Cluster {
  id: string;
  places: Place[];
  centerLat: number;
  centerLon: number;
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
}

export function MarkerCluster({ places, zoom, onClusterClick }: MarkerClusterProps) {
  // Calculate clusters based on zoom level
  const getClusters = (): Cluster[] => {
    if (zoom > 12) {
      // Don't cluster at high zoom levels
      return places.map((place) => ({
        id: place.id,
        places: [place],
        centerLat: place.latitude,
        centerLon: place.longitude,
        bounds: {
          minLat: place.latitude,
          maxLat: place.latitude,
          minLon: place.longitude,
          maxLon: place.longitude,
        },
      }));
    }

    // Cluster using a grid approach
    const gridSize = Math.pow(2, 15 - zoom);
    const clusters: Map<string, Place[]> = new Map();

    places.forEach((place) => {
      const gridX = Math.floor(place.longitude / gridSize);
      const gridY = Math.floor(place.latitude / gridSize);
      const key = `${gridX},${gridY}`;

      if (!clusters.has(key)) {
        clusters.set(key, []);
      }
      clusters.get(key)!.push(place);
    });

    return Array.from(clusters.entries()).map(([key, clusterPlaces]) => {
      const centerLat = clusterPlaces.reduce((sum, p) => sum + p.latitude, 0) / clusterPlaces.length;
      const centerLon = clusterPlaces.reduce((sum, p) => sum + p.longitude, 0) / clusterPlaces.length;
      const minLat = Math.min(...clusterPlaces.map((p) => p.latitude));
      const maxLat = Math.max(...clusterPlaces.map((p) => p.latitude));
      const minLon = Math.min(...clusterPlaces.map((p) => p.longitude));
      const maxLon = Math.max(...clusterPlaces.map((p) => p.longitude));

      return {
        id: key,
        places: clusterPlaces,
        centerLat,
        centerLon,
        bounds: { minLat, maxLat, minLon, maxLon },
      };
    });
  };

  const clusters = getClusters();

  return (
    <div className="absolute inset-0">
      {clusters.map((cluster) => {
        const isClustered = cluster.places.length > 1;
        const size = isClustered ? Math.min(50, 30 + cluster.places.length * 5) : 40;

        return (
          <div
            key={cluster.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
            onClick={() => onClusterClick(cluster.places.map((p) => p.id))}
            style={{
              left: `${((cluster.centerLon + 180) / 360) * 100}%`,
              top: `${((cluster.centerLat + 90) / 180) * 100}%`,
              cursor: 'pointer',
            }}
          >
            {isClustered ? (
              <div
                className={`
                  w-${Math.floor(size / 4)}
                  h-${Math.floor(size / 4)}
                  rounded-full
                  bg-gradient-to-br from-cyan-500 to-purple-500
                  flex items-center justify-center
                  text-white font-bold text-sm
                  shadow-lg shadow-cyan-500/50
                  hover:scale-110
                  transition-transform duration-200
                  border-2 border-white/30
                `}
                style={{
                  width: size,
                  height: size,
                }}
              >
                {cluster.places.length}
              </div>
            ) : (
              <div
                className="w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-500/50 hover:scale-150 transition-transform duration-200"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
