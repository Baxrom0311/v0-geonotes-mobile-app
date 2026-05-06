'use client';

import React from 'react';
import { Map, List, Plus, Settings } from 'lucide-react';

interface BottomNavProps {
  currentScreen: 'map' | 'places' | 'add' | 'settings';
  onScreenChange: (screen: 'map' | 'places' | 'add' | 'settings') => void;
}

export function BottomNav({ currentScreen, onScreenChange }: BottomNavProps) {
  const tabs = [
    { id: 'map' as const, icon: Map, label: 'Map' },
    { id: 'places' as const, icon: List, label: 'Places' },
    { id: 'add' as const, icon: Plus, label: 'Add' },
    { id: 'settings' as const, icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="border-t border-white/10 bg-black/30 backdrop-blur-[10px]">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onScreenChange(id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300 ${
              currentScreen === id
                ? 'text-cyan-400 bg-gradient-to-t from-cyan-500/20 to-transparent premium-glow'
                : 'text-muted-foreground hover:text-cyan-300'
            }`}
            aria-label={label}
          >
            <Icon size={24} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
