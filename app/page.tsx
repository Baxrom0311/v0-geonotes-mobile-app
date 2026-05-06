'use client';

import { GeoNotesProvider } from '@/hooks/useGeoNotesStore.tsx';
import { AppShell } from '@/components/layout/AppShell';

export default function Home() {
  return (
    <GeoNotesProvider>
      <AppShell />
    </GeoNotesProvider>
  );
}
