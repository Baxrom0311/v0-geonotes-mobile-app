'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useGeoNotesStore } from '@/hooks/useGeoNotesStore.tsx';
import { MapView } from '@/components/ui/MapView';
import { GlassmorphCard } from '@/components/ui/GlassmorphCard';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { CategoryType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, ArrowLeft } from 'lucide-react';

const DynamicMarker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

interface AddPlaceScreenProps {
  onScreenChange: (screen: 'map' | 'places' | 'add' | 'settings') => void;
}

export function AddPlaceScreen({ onScreenChange }: AddPlaceScreenProps) {
  const { addPlace, currentLocation } = useGeoNotesStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other' as CategoryType,
    latitude: currentLocation.latitude,
    longitude: currentLocation.longitude,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.latitude || !formData.longitude) {
      newErrors.location = 'Location is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Add place
    addPlace({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      latitude: formData.latitude,
      longitude: formData.longitude,
    });

    // Reset and go back
    setFormData({
      title: '',
      description: '',
      category: 'other',
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    });
    setErrors({});
    onScreenChange('places');
  };

  const handleUseCurrentLocation = () => {
    setFormData({
      ...formData,
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <GlassmorphCard className="rounded-none p-4 flex items-center gap-3 border-b">
        <button
          onClick={() => onScreenChange('places')}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-cyan-400" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Add New Place</h1>
      </GlassmorphCard>

      {/* Form */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <GlassmorphCard className="p-4 space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Title
            </label>
            <Input
              type="text"
              placeholder="Place name"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              className={`bg-black/30 border ${errors.title ? 'border-red-500' : 'border-cyan-500/30'} text-foreground placeholder-muted-foreground focus:ring-cyan-500`}
            />
            {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}
          </GlassmorphCard>

          {/* Description */}
          <GlassmorphCard className="p-4 space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Description
            </label>
            <Textarea
              placeholder="Add notes about this place..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="bg-black/30 border border-cyan-500/30 text-foreground placeholder-muted-foreground focus:ring-cyan-500"
            />
          </GlassmorphCard>

          {/* Category */}
          <GlassmorphCard className="p-4 space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Category
            </label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value as CategoryType })}>
              <SelectTrigger className="bg-black/30 border border-cyan-500/30 text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <CategoryBadge category={key as CategoryType} size="sm" />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </GlassmorphCard>

          {/* Location */}
          <GlassmorphCard className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Latitude
              </label>
              <Input
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                placeholder="0.0000"
                className="bg-black/30 border border-cyan-500/30 text-foreground placeholder-muted-foreground focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Longitude
              </label>
              <Input
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                placeholder="0.0000"
                className="bg-black/30 border border-cyan-500/30 text-foreground placeholder-muted-foreground focus:ring-cyan-500"
              />
            </div>
            {errors.location && <p className="text-red-400 text-xs">{errors.location}</p>}
            <Button
              type="button"
              onClick={handleUseCurrentLocation}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
            >
              <MapPin size={16} className="mr-2" />
              Use Current Location
            </Button>
          </GlassmorphCard>

          {/* Map preview */}
          <GlassmorphCard className="p-4 space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Location Preview
            </label>
            <MapView latitude={formData.latitude} longitude={formData.longitude} height="h-40">
              <Suspense fallback={null}>
                <DynamicMarker position={[formData.latitude, formData.longitude]} />
              </Suspense>
            </MapView>
          </GlassmorphCard>

          {/* Submit button */}
          <Button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-semibold">
            Save Place
          </Button>
        </form>
      </div>
    </div>
  );
}
