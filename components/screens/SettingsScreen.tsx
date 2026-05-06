'use client';

import React from 'react';
import { GlassmorphCard } from '@/components/ui/GlassmorphCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Moon, Zap } from 'lucide-react';

export function SettingsScreen() {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <GlassmorphCard className="rounded-none p-4 border-b">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </GlassmorphCard>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl space-y-4">
          {/* Appearance section */}
          <GlassmorphCard className="p-4 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Zap size={20} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Appearance</h2>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-cyan-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Already active!</p>
                </div>
              </div>
              <Switch checked={true} disabled />
            </div>
          </GlassmorphCard>

          {/* About section */}
          <GlassmorphCard className="p-4 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Zap size={20} className="text-purple-400" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">About</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Application</p>
                <p className="text-sm font-bold text-cyan-300 mt-1">GeoNotes</p>
              </div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Version</p>
                <p className="text-sm font-bold text-cyan-300 mt-1">2.0.0 Premium</p>
              </div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Build</p>
                <p className="text-sm font-bold text-cyan-300 mt-1">2024.03 - 3D Globe</p>
              </div>
            </div>
          </GlassmorphCard>

          {/* Features section */}
          <GlassmorphCard className="p-4 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Zap size={20} className="text-pink-400" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Premium Features</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                <span className="text-foreground">3D Rotating Globe Map</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                <span className="text-foreground">Glassmorphic UI Design</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                <span className="text-foreground">Heat Map Visualization</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                <span className="text-foreground">Location Clustering</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                <span className="text-foreground">Smooth Animations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full" />
                <span className="text-foreground">Particle Effects</span>
              </div>
            </div>
          </GlassmorphCard>

          {/* Danger zone */}
          <GlassmorphCard className="p-4 space-y-4 border-red-500/30 bg-red-500/5">
            <h2 className="text-sm font-semibold text-red-400 uppercase tracking-wider">Danger Zone</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center gap-2 transition-all"
                >
                  <Trash2 size={18} />
                  Clear All Places
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glassmorphism">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">Clear All Places?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This action cannot be undone. All your places will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-3">
                  <AlertDialogCancel className="bg-black/30 border border-white/10 text-foreground hover:bg-black/40">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white">
                    Delete All
                  </AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </GlassmorphCard>
        </div>
      </div>
    </div>
  );
}
