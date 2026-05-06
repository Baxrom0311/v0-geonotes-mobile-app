'use client';

import React from 'react';
import { Place } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { formatDistance, formatDate } from '@/lib/utils-geo';
import { Edit2, Trash2, Eye } from 'lucide-react';
import { CategoryBadge } from './CategoryBadge';

interface PlaceCardProps {
  place: Place;
  distance?: number;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PlaceCard({ place, distance, onView, onEdit, onDelete }: PlaceCardProps) {
  return (
    <div className="glassmorphism p-4 hover:bg-white/15 transition-all duration-300 group marker-hover-scale premium-glow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground group-hover:text-cyan-300 transition-colors">{place.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{place.description}</p>
        </div>
        <CategoryBadge category={place.category} size="sm" showLabel={false} />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        <span>{formatDate(place.createdDate)}</span>
        {distance !== undefined && <span className="text-cyan-400">{formatDistance(distance)}</span>}
      </div>

      <div className="flex gap-2">
        {onView && (
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-cyan-300 bg-cyan-500/20 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-500/50 transition-all"
          >
            <Eye size={16} />
            View
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-purple-300 bg-purple-500/20 border border-purple-500/30 rounded-lg hover:bg-purple-500/30 hover:border-purple-500/50 transition-all"
          >
            <Edit2 size={16} />
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-300 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 hover:border-red-500/50 transition-all"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
