import { CategoryType } from './types';

export const CATEGORY_CONFIG: Record<CategoryType, { label: string; color: string; icon: string; bgColor: string }> = {
  home: {
    label: 'Home',
    color: '#ef4444',
    icon: 'Home',
    bgColor: '#fee2e2',
  },
  work: {
    label: 'Work',
    color: '#a855f7',
    icon: 'Briefcase',
    bgColor: '#f3e8ff',
  },
  study: {
    label: 'Study',
    color: '#f97316',
    icon: 'BookOpen',
    bgColor: '#ffedd5',
  },
  travel: {
    label: 'Travel',
    color: '#0891b2',
    icon: 'Plane',
    bgColor: '#cffafe',
  },
  food: {
    label: 'Food',
    color: '#22c55e',
    icon: 'UtensilsCrossed',
    bgColor: '#dcfce7',
  },
  favorite: {
    label: 'Favorite',
    color: '#eab308',
    icon: 'Star',
    bgColor: '#fef3c7',
  },
  other: {
    label: 'Other',
    color: '#6b7280',
    icon: 'MapPin',
    bgColor: '#f3f4f6',
  },
};

export const MOCK_PLACES = [
  {
    id: '1',
    title: 'University',
    description: 'Main campus library',
    category: 'study' as CategoryType,
    latitude: 40.8076,
    longitude: -73.9626,
    createdDate: new Date('2024-01-15'),
    updatedDate: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Home',
    description: 'My apartment',
    category: 'home' as CategoryType,
    latitude: 40.7128,
    longitude: -74.006,
    createdDate: new Date('2024-01-10'),
    updatedDate: new Date('2024-01-10'),
  },
  {
    id: '3',
    title: 'Favorite Cafe',
    description: 'Best coffee in town',
    category: 'food' as CategoryType,
    latitude: 40.7505,
    longitude: -73.9972,
    createdDate: new Date('2024-01-20'),
    updatedDate: new Date('2024-01-20'),
  },
  {
    id: '4',
    title: 'Office',
    description: 'Work headquarters',
    category: 'work' as CategoryType,
    latitude: 40.7489,
    longitude: -73.968,
    createdDate: new Date('2024-01-05'),
    updatedDate: new Date('2024-01-05'),
  },
  {
    id: '5',
    title: 'Central Park',
    description: 'Great place to walk',
    category: 'favorite' as CategoryType,
    latitude: 40.7649,
    longitude: -73.9776,
    createdDate: new Date('2024-01-25'),
    updatedDate: new Date('2024-01-25'),
  },
];

export const DEFAULT_LOCATION = {
  latitude: 40.7128,
  longitude: -74.006,
};
