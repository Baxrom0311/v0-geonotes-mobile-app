export type CategoryType = 'home' | 'work' | 'study' | 'travel' | 'food' | 'favorite' | 'other';

export interface Place {
  id: string;
  title: string;
  description: string;
  category: CategoryType;
  latitude: number;
  longitude: number;
  photo?: string;
  createdDate: Date;
  updatedDate: Date;
}

export interface GeoNotesStoreContextType {
  places: Place[];
  filteredPlaces: Place[];
  selectedCategory: CategoryType | null;
  searchQuery: string;
  currentLocation: { latitude: number; longitude: number };
  
  addPlace: (place: Omit<Place, 'id' | 'createdDate' | 'updatedDate'>) => void;
  updatePlace: (id: string, place: Partial<Place>) => void;
  deletePlace: (id: string) => void;
  setSelectedCategory: (category: CategoryType | null) => void;
  setSearchQuery: (query: string) => void;
  setCurrentLocation: (location: { latitude: number; longitude: number }) => void;
  getPlaceById: (id: string) => Place | undefined;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}
