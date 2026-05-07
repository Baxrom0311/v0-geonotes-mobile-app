'use client';

import React, { useState } from 'react';
import { BottomNav } from './BottomNav';
import { MapScreen } from '@/components/screens/MapScreen';
import { PlacesListScreen } from '@/components/screens/PlacesListScreen';
import { AddPlaceScreen } from '@/components/screens/AddPlaceScreen';
import { SettingsScreen } from '@/components/screens/SettingsScreen';
import { AnalyticsScreen } from '@/components/screens/AnalyticsScreen';
import { OfflineIndicator } from '@/components/ui/OfflineIndicator';
import { LocationInitializer } from '@/components/ui/LocationInitializer';

type ScreenType = 'map' | 'places' | 'add' | 'settings' | 'analytics';

export function AppShell() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('map');

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Location tracking initializer */}
      <LocationInitializer />

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {currentScreen === 'map' && <MapScreen />}
        {currentScreen === 'places' && <PlacesListScreen />}
        {currentScreen === 'add' && <AddPlaceScreen onScreenChange={setCurrentScreen} />}
        {currentScreen === 'settings' && <SettingsScreen onScreenChange={setCurrentScreen} />}
        {currentScreen === 'analytics' && <AnalyticsScreen />}
      </div>

      {/* Offline indicator */}
      <OfflineIndicator />

      {/* Bottom navigation */}
      <BottomNav currentScreen={currentScreen} onScreenChange={setCurrentScreen} />
    </div>
  );
}
