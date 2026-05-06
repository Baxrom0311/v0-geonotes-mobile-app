'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useGeoNotesStore } from '@/hooks/useGeoNotesStore.tsx';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { Search, Filter, MapPin, Trash2 } from 'lucide-react';
import { formatDistance } from '@/lib/utils-geo';

// Lazy load the map component
const MapScreenContent = dynamic(
  () => import('./MapScreenContent'),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100"><div className="text-gray-500">Loading map...</div></div> }
);

export function MapScreen() {
  const { places, filteredPlaces, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, currentLocation, deletePlace, calculateDistance } = useGeoNotesStore();
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  const selectedPlace = places.find((p) => p.id === selectedPlaceId);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with search and filter */}
      <div className="p-4 bg-white border-b border-gray-200 space-y-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <Filter size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Category filter chips */}
        {showCategoryFilter && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key as any)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === key
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategory === key ? config.color : undefined,
                }}
              >
                {config.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Map - rendered client-side only */}
      <div className="flex-1 overflow-hidden">
        <MapScreenContent 
          currentLocation={currentLocation}
          filteredPlaces={filteredPlaces}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={setSelectedPlaceId}
        />
      </div>

      {/* Bottom sheet with place details */}
      <BottomSheet
        isOpen={!!selectedPlace}
        title={selectedPlace?.title || ''}
        onClose={() => setSelectedPlaceId(null)}
        actions={
          selectedPlace && (
            <button
              onClick={() => {
                deletePlace(selectedPlace.id);
                setSelectedPlaceId(null);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
            >
              <Trash2 size={18} />
              Delete
            </button>
          )
        }
      >
        {selectedPlace && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{selectedPlace.title}</h3>
                <CategoryBadge category={selectedPlace.category} size="sm" />
              </div>
              <p className="text-gray-600">{selectedPlace.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{selectedPlace.latitude.toFixed(4)}, {selectedPlace.longitude.toFixed(4)}</span>
              </div>
              <div className="text-sm text-gray-600">
                Distance: {formatDistance(calculateDistance(
                  currentLocation.latitude,
                  currentLocation.longitude,
                  selectedPlace.latitude,
                  selectedPlace.longitude
                ))}
              </div>
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
