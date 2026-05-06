'use client';

import { Place } from '@/lib/types';

const DB_NAME = 'GeoNotesDB';
const STORE_NAME = 'places';
const DB_VERSION = 1;

let db: IDBDatabase | null = null;

export async function initializeDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);

    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('category', 'category', { unique: false });
        store.createIndex('createdDate', 'createdDate', { unique: false });
      }
    };
  });
}

export async function savePlaceToOffline(place: Place): Promise<void> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(place);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function savePlacesToOffline(places: Place[]): Promise<void> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    places.forEach((place) => {
      store.put(place);
    });

    transaction.onerror = () => reject(transaction.error);
    transaction.oncomplete = () => resolve();
  });
}

export async function getPlacesFromOffline(): Promise<Place[]> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      const places = request.result.map((place) => ({
        ...place,
        createdDate: new Date(place.createdDate),
        updatedDate: new Date(place.updatedDate),
      }));
      resolve(places);
    };
  });
}

export async function deletePlaceFromOffline(placeId: string): Promise<void> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(placeId);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

export async function clearOfflineData(): Promise<void> {
  const database = await initializeDB();
  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onerror = () => reject(request.error);
    request.oncomplete = () => resolve();
  });
}

export function isOnline(): boolean {
  return navigator.onLine;
}

export function setupOfflineListener(callback: (online: boolean) => void): () => void {
  window.addEventListener('online', () => callback(true));
  window.addEventListener('offline', () => callback(false));

  return () => {
    window.removeEventListener('online', () => callback(true));
    window.removeEventListener('offline', () => callback(false));
  };
}
