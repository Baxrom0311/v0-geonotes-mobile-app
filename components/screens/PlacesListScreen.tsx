'use client';

import React, { useState } from 'react';
import { useGeoNotesStore } from '@/hooks/useGeoNotesStore';
import { PlaceCard } from '@/components/ui/PlaceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search, Filter } from 'lucide-react';
import { CATEGORY_CONFIG } from '@/lib/constants';

export function PlacesListScreen() {
  const { filteredPlaces, currentLocation, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, deletePlace, calculateDistance } = useGeoNotesStore();
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  if (filteredPlaces.length === 0) {
    return (
      <div className="h-full flex flex-col bg-gray-50 p-4">
        <div className="flex gap-2 mb-4">
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
        <EmptyState
          title="No places found"
          description="Add your first place or adjust your filters to see results"
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header with search and filter */}
      <div className="p-4 bg-white border-b border-gray-200 space-y-3 sticky top-0 z-10">
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

      {/* Places list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredPlaces.map((place) => (
          <PlaceCard
            key={place.id}
            place={place}
            distance={calculateDistance(
              currentLocation.latitude,
              currentLocation.longitude,
              place.latitude,
              place.longitude
            )}
            onDelete={() => deletePlace(place.id)}
          />
        ))}
      </div>
    </div>
  );
}
