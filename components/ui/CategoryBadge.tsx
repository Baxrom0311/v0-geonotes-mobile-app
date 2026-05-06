'use client';

import React from 'react';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { CategoryType } from '@/lib/types';
import * as Icons from 'lucide-react';

interface CategoryBadgeProps {
  category: CategoryType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function CategoryBadge({ category, size = 'md', showLabel = true }: CategoryBadgeProps) {
  const config = CATEGORY_CONFIG[category];
  const Icon = Icons[config.icon as keyof typeof Icons] as any;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ${sizeClasses[size]}`}
      style={{ backgroundColor: config.bgColor, color: config.color }}
    >
      <Icon size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} />
      {showLabel && <span>{config.label}</span>}
    </div>
  );
}
