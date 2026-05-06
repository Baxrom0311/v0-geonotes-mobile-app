'use client';

import React, { useState } from 'react';
import { useGeoNotesStore } from '@/hooks/useGeoNotesStore.tsx';
import { PlaceCard } from '@/components/ui/PlaceCard';
import { GlassmorphCard } from '@/components/ui/GlassmorphCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Search, Filter } from 'lucide-react';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { CategoryType } from '@/lib/types';

export function PlacesListScreen() {
  const { filteredPlaces, currentLocation, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, deletePlace, calculateDistance } = useGeoNotesStore();
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  if (filteredPlaces.length === 0) {
    return (
      <div className="h-full flex flex-col bg-background p-4">
        <GlassmorphCard className="p-4 flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
            <input
              type="text"
              placeholder="Search places..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/30 border border-cyan-500/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
            />
          </div>
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className="p-2 bg-black/30 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-all premium-glow"
          >
            <Filter size={20} className="text-cyan-400" />
          </button>
        </GlassmorphCard>
        <EmptyState
          title="No places found"
          description="Add your first place or adjust your filters to see results"
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with search and filter */}
      <div className="p-4 space-y-3 sticky top-0 z-10">
        <GlassmorphCard className="p-4 space-y-3">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/30 border border-cyan-500/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              />
            </div>
            <button
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className="p-2 bg-black/30 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-all premium-glow"
            >
              <Filter size={20} className="text-cyan-400" />
            </button>
          </div>

          {/* Category filter chips */}
          {showCategoryFilter && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white premium-glow'
                    : 'bg-black/30 border border-white/10 text-muted-foreground hover:border-cyan-500/30'
                }`}
              >
                All
              </button>
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key as CategoryType)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === key
                      ? 'text-white premium-glow'
                      : 'bg-black/30 border border-white/10 text-muted-foreground hover:border-white/30'
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
        </GlassmorphCard>
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
