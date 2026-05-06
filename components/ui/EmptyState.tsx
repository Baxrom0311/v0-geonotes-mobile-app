'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4">
      <div className="text-gray-400 mb-4">
        <MapPin size={48} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 text-center mb-6">{description}</p>
      {action}
    </div>
  );
}
