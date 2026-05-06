'use client';

import { Place } from '@/lib/types';

export interface ExportData {
  version: string;
  exportDate: string;
  places: Place[];
  metadata: {
    totalPlaces: number;
    categories: Record<string, number>;
  };
}

export function exportPlacesAsJSON(places: Place[]): void {
  const categoryMap: Record<string, number> = {};
  places.forEach((place) => {
    categoryMap[place.category] = (categoryMap[place.category] || 0) + 1;
  });

  const exportData: ExportData = {
    version: '2.1.0',
    exportDate: new Date().toISOString(),
    places: places,
    metadata: {
      totalPlaces: places.length,
      categories: categoryMap,
    },
  };

  const jsonString = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `geonotes-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportPlacesAsCSV(places: Place[]): void {
  const headers = ['ID', 'Title', 'Description', 'Category', 'Latitude', 'Longitude', 'Created Date', 'Updated Date'];
  const rows = places.map((place) => [
    place.id,
    `"${place.title.replace(/"/g, '""')}"`,
    `"${place.description.replace(/"/g, '""')}"`,
    place.category,
    place.latitude,
    place.longitude,
    new Date(place.createdDate).toISOString(),
    new Date(place.updatedDate).toISOString(),
  ]);

  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `geonotes-backup-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importPlacesFromJSON(file: File): Promise<Place[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content) as ExportData;

        if (!data.places || !Array.isArray(data.places)) {
          throw new Error('Invalid export file format');
        }

        // Validate places
        const validatedPlaces = data.places.filter((place) => {
          return (
            place.id &&
            place.title &&
            typeof place.latitude === 'number' &&
            typeof place.longitude === 'number'
          );
        });

        if (validatedPlaces.length === 0) {
          throw new Error('No valid places found in file');
        }

        // Convert date strings back to Date objects
        const placesWithDates = validatedPlaces.map((place) => ({
          ...place,
          createdDate: new Date(place.createdDate),
          updatedDate: new Date(place.updatedDate),
        }));

        resolve(placesWithDates);
      } catch (error) {
        reject(new Error(`Failed to import file: ${error instanceof Error ? error.message : 'Unknown error'}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

export function validateImportedPlaces(places: Place[]): { valid: boolean; message: string } {
  if (!Array.isArray(places) || places.length === 0) {
    return { valid: false, message: 'No places to import' };
  }

  const invalidPlaces = places.filter(
    (place) => !place.id || !place.title || typeof place.latitude !== 'number' || typeof place.longitude !== 'number'
  );

  if (invalidPlaces.length > 0) {
    return {
      valid: false,
      message: `${invalidPlaces.length} places have invalid data and will be skipped`,
    };
  }

  return { valid: true, message: `Ready to import ${places.length} places` };
}
