'use client';

import React, { ReactNode } from 'react';

interface GlassmorphCardProps {
  children: ReactNode;
  className?: string;
  gradient?: 'cyan-purple' | 'purple-pink' | 'none';
  hasGlow?: boolean;
  glowColor?: 'cyan' | 'purple' | 'pink';
}

export function GlassmorphCard({
  children,
  className = '',
  gradient = 'none',
  hasGlow = true,
  glowColor = 'cyan',
}: GlassmorphCardProps) {
  const gradientClass = {
    'cyan-purple': 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20',
    'purple-pink': 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
    'none': 'bg-white/10',
  }[gradient];

  const glowClass = {
    'cyan': 'shadow-lg shadow-cyan-500/20',
    'purple': 'shadow-lg shadow-purple-500/20',
    'pink': 'shadow-lg shadow-pink-500/20',
  }[glowColor];

  return (
    <div
      className={`
        ${gradientClass}
        backdrop-blur-[10px] backdrop-saturate-150
        border border-white/20
        rounded-2xl
        ${hasGlow ? glowClass : ''}
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
