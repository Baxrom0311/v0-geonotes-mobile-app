'use client';

import React, { useEffect, useState } from 'react';
import { setupOfflineListener, isOnline } from '@/lib/offlineDB';
import { Wifi, WifiOff } from 'lucide-react';

export function OfflineIndicator() {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    setOnline(isOnline());
    const unsubscribe = setupOfflineListener(setOnline);
    return unsubscribe;
  }, []);

  if (online) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50">
      <div className="glassmorphism p-3 flex items-center gap-2 border-orange-500/50 bg-orange-500/10">
        <WifiOff size={18} className="text-orange-400" />
        <span className="text-sm font-medium text-orange-300">You are offline - Changes saved locally</span>
      </div>
    </div>
  );
}
