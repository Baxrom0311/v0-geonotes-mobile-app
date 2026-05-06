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
    <nav className="border-t border-gray-200 bg-white">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onScreenChange(id)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentScreen === id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700'
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
