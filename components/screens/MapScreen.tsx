'use client';

import React, { useState, useEffect } from 'react';
import { Globe3D } from '@/components/ui/Globe3D';
import { GlassmorphCard } from '@/components/ui/GlassmorphCard';
import { HeatMapLayer } from '@/components/ui/HeatMapLayer';
import { MarkerCluster } from '@/components/ui/MarkerCluster';
import { useGeoNotesStore } from '@/hooks/useGeoNotesStore.tsx';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { CategoryType } from '@/lib/types';
import { Search, Filter, Layers, Eye, EyeOff } from 'lucide-react';

type MapMode = 'globe' | 'heatmap' | 'cluster';

interface MapScreenProps {
  onScreenChange?: (screen: 'map' | 'places' | 'add' | 'settings') => void;
}

export function MapScreen({ onScreenChange }: MapScreenProps) {
  const { places, currentLocation, filteredPlaces, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useGeoNotesStore();
  const [mapMode, setMapMode] = useState<MapMode>('globe');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);

  const selectedPlace = places.find(p => p.id === selectedPlaceId);

  return (
    <div className="h-full w-full bg-background relative overflow-hidden">
      {/* Main Globe */}
      <div className="absolute inset-0">
        <Globe3D
          latitude={currentLocation.latitude}
          longitude={currentLocation.longitude}
          places={filteredPlaces}
          selectedPlaceId={selectedPlaceId}
          onSelectPlace={setSelectedPlaceId}
          showHeatMap={showHeatMap}
        />
        {showHeatMap && <HeatMapLayer places={filteredPlaces} />}
      </div>

      {/* Top Control Panel - Glassmorphic */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <GlassmorphCard className="p-4 space-y-3">
          {/* Search and Controls */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-cyan-400" />
              <input
                type="text"
                placeholder="Search places..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-cyan-500/30 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className="p-2.5 bg-black/30 border border-cyan-500/30 rounded-lg hover:bg-black/40 transition-all hover:border-cyan-500/50 premium-glow"
            >
              <Filter size={20} className="text-cyan-400" />
            </button>
          </div>

          {/* Map Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setMapMode('globe')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                mapMode === 'globe'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white premium-glow'
                  : 'bg-black/30 border border-white/10 text-muted-foreground hover:border-cyan-500/50'
              }`}
            >
              3D Globe
            </button>
            <button
              onClick={() => setMapMode('heatmap')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                mapMode === 'heatmap'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white premium-glow'
                  : 'bg-black/30 border border-white/10 text-muted-foreground hover:border-cyan-500/50'
              }`}
            >
              Heat Map
            </button>
            <button
              onClick={() => setMapMode('cluster')}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                mapMode === 'cluster'
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white premium-glow'
                  : 'bg-black/30 border border-white/10 text-muted-foreground hover:border-cyan-500/50'
              }`}
            >
              Cluster
            </button>
          </div>

          {/* Category Filter Chips */}
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

      {/* Right Side Panel - Stats and Controls */}
      <div className="absolute right-4 top-4 z-20 flex flex-col gap-3">
        <GlassmorphCard className="p-4 space-y-2 min-w-[200px]">
          <div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Statistics</div>
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Places</span>
              <span className="font-bold text-foreground">{places.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Visible</span>
              <span className="font-bold text-cyan-400">{filteredPlaces.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Categories</span>
              <span className="font-bold text-purple-400">
                {new Set(places.map(p => p.category)).size}
              </span>
            </div>
          </div>
        </GlassmorphCard>

        {/* Heat Map Toggle */}
        <button
          onClick={() => setShowHeatMap(!showHeatMap)}
          className="p-3 bg-black/30 border border-cyan-500/30 rounded-lg hover:bg-black/40 transition-all premium-glow group"
        >
          {showHeatMap ? (
            <Eye size={20} className="text-cyan-400 group-hover:text-cyan-300" />
          ) : (
            <EyeOff size={20} className="text-muted-foreground group-hover:text-cyan-400" />
          )}
        </button>

        {/* Layers Toggle */}
        <button
          onClick={() => setMapMode(mapMode === 'globe' ? 'heatmap' : 'globe')}
          className="p-3 bg-black/30 border border-cyan-500/30 rounded-lg hover:bg-black/40 transition-all premium-glow group"
        >
          <Layers size={20} className="text-cyan-400 group-hover:text-cyan-300" />
        </button>
      </div>

      {/* Bottom Panel - Selected Place Details */}
      {selectedPlace && (
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <GlassmorphCard className="p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-bold text-foreground">{selectedPlace.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedPlace.description}</p>
              </div>
              <div
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                style={{ backgroundColor: CATEGORY_CONFIG[selectedPlace.category].color }}
              >
                {CATEGORY_CONFIG[selectedPlace.category].label}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground uppercase font-semibold">Latitude</div>
                <div className="text-foreground font-mono">{selectedPlace.latitude.toFixed(4)}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground uppercase font-semibold">Longitude</div>
                <div className="text-foreground font-mono">{selectedPlace.longitude.toFixed(4)}</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-white/10">
              <button
                onClick={() => setSelectedPlaceId(null)}
                className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-sm font-medium text-foreground hover:bg-black/40 transition-all"
              >
                Close
              </button>
              <button
                onClick={() => onScreenChange?.('places')}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg text-sm font-medium text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                View All
              </button>
            </div>
          </GlassmorphCard>
        </div>
      )}
    </div>
  );
}
