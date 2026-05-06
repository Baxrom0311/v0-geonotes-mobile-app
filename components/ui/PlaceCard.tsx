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
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">{place.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{place.description}</p>
        </div>
        <CategoryBadge category={place.category} size="sm" showLabel={false} />
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <span>{formatDate(place.createdDate)}</span>
        {distance !== undefined && <span>{formatDistance(distance)}</span>}
      </div>

      <div className="flex gap-2">
        {onView && (
          <button
            onClick={onView}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
          >
            <Eye size={16} />
            View
          </button>
        )}
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Edit2 size={16} />
            Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
