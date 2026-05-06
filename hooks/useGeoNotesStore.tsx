'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Place, CategoryType, GeoNotesStoreContextType } from '@/lib/types';
import { MOCK_PLACES, DEFAULT_LOCATION } from '@/lib/constants';
import { calculateDistance as calcDist } from '@/lib/utils-geo';

const GeoNotesStoreContext = createContext<GeoNotesStoreContextType | undefined>(undefined);

export function GeoNotesProvider({ children }: { children: React.ReactNode }) {
  const [places, setPlaces] = useState<Place[]>(MOCK_PLACES);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);

  // Filter places based on search and category
  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addPlace = useCallback((place: Omit<Place, 'id' | 'createdDate' | 'updatedDate'>) => {
    const newPlace: Place = {
      ...place,
      id: Date.now().toString(),
      createdDate: new Date(),
      updatedDate: new Date(),
    };
    setPlaces((prev) => [...prev, newPlace]);
  }, []);

  const updatePlace = useCallback((id: string, updates: Partial<Place>) => {
    setPlaces((prev) =>
      prev.map((place) =>
        place.id === id
          ? { ...place, ...updates, updatedDate: new Date() }
          : place
      )
    );
  }, []);

  const deletePlace = useCallback((id: string) => {
    setPlaces((prev) => prev.filter((place) => place.id !== id));
  }, []);

  const getPlaceById = useCallback(
    (id: string) => places.find((place) => place.id === id),
    [places]
  );

  const calculateDistance = useCallback(
    (lat1: number, lon1: number, lat2: number, lon2: number) => {
      return calcDist(lat1, lon1, lat2, lon2);
    },
    []
  );

  const value: GeoNotesStoreContextType = {
    places,
    filteredPlaces,
    selectedCategory,
    searchQuery,
    currentLocation,
    addPlace,
    updatePlace,
    deletePlace,
    setSelectedCategory,
    setSearchQuery,
    setCurrentLocation,
    getPlaceById,
    calculateDistance,
  };

  return (
    <GeoNotesStoreContext.Provider value={value}>
      {children}
    </GeoNotesStoreContext.Provider>
  );
}

export function useGeoNotesStore() {
  const context = useContext(GeoNotesStoreContext);
  if (!context) {
    throw new Error('useGeoNotesStore must be used within a GeoNotesProvider');
  }
  return context;
}
