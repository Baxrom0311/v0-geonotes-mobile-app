'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicMapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false, loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" /> }
);

const DynamicTileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

const DynamicMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

const DynamicPopup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

import { CATEGORY_CONFIG } from '@/lib/constants';
import { CategoryType } from '@/lib/types';

// Create marker icon icons without using Leaflet directly
export function createCategoryMarkerIcon(category: CategoryType) {
  const config = CATEGORY_CONFIG[category];
  return {
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C8.27 0 2 6.27 2 14c0 10 14 26 14 26s14-16 14-26c0-7.73-6.27-14-14-14z" fill="${encodeURIComponent(config.color)}" />
        <circle cx="16" cy="14" r="6" fill="white" />
      </svg>
    `)}`,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
  };
}

interface MapViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  children?: React.ReactNode;
  height?: string;
}

export function MapView({ latitude, longitude, zoom = 13, children, height = 'h-full' }: MapViewProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className={`${height} bg-gray-100 animate-pulse`} />;
  }

  return (
    <div className={`${height} w-full rounded-lg overflow-hidden border border-gray-200`}>
      <DynamicMapContainer
        center={[latitude, longitude]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <DynamicTileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </DynamicMapContainer>
    </div>
  );
}
