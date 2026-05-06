'use client';

import React, { useRef } from 'react';
import { useTheme } from '@/hooks/useTheme';
import { useGeoNotesStore } from '@/hooks/useGeoNotesStore.tsx';
import { GlassmorphCard } from '@/components/ui/GlassmorphCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { exportPlacesAsJSON, exportPlacesAsCSV, importPlacesFromJSON } from '@/lib/exportImport';
import { Trash2, Moon, Sun, Zap, Download, Upload } from 'lucide-react';

interface SettingsScreenProps {
  onScreenChange?: (screen: 'map' | 'places' | 'add' | 'settings' | 'analytics') => void;
}

export function SettingsScreen({ onScreenChange }: SettingsScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const { places, addPlace } = useGeoNotesStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = React.useState<string>('');
  const [importError, setImportError] = React.useState<string>('');

  const handleExportJSON = () => {
    exportPlacesAsJSON(places);
  };

  const handleExportCSV = () => {
    exportPlacesAsCSV(places);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportError('');
      setImportMessage('');
      
      const importedPlaces = await importPlacesFromJSON(file);
      
      importedPlaces.forEach((place) => {
        addPlace({
          title: place.title,
          description: place.description,
          category: place.category,
          latitude: place.latitude,
          longitude: place.longitude,
        });
      });

      setImportMessage(`Successfully imported ${importedPlaces.length} place(s)!`);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Import failed');
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <GlassmorphCard className="rounded-none p-4 border-b">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </GlassmorphCard>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl space-y-4">
          <GlassmorphCard className="p-4 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Zap size={20} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Appearance</h2>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={20} className="text-cyan-400" /> : <Sun size={20} className="text-yellow-400" />}
                <div>
                  <p className="text-sm font-medium text-foreground">Theme</p>
                  <p className="text-xs text-muted-foreground">{theme === 'dark' ? 'Dark' : 'Light'}</p>
                </div>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </GlassmorphCard>

          <GlassmorphCard className="p-4 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Download size={20} className="text-purple-400" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Export Data</h2>
            </div>
            <Button onClick={handleExportJSON} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
              <Download size={18} className="mr-2" />
              Export as JSON
            </Button>
            <Button onClick={handleExportCSV} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:shadow-purple-500/50 transition-all">
              <Download size={18} className="mr-2" />
              Export as CSV
            </Button>
          </GlassmorphCard>

          <GlassmorphCard className="p-4 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Upload size={20} className="text-green-400" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Import Data</h2>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              onClick={handleImportClick}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-lg hover:shadow-green-500/50 transition-all"
            >
              <Upload size={18} className="mr-2" />
              Import from JSON
            </Button>
            {importMessage && (
              <div className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                <p className="text-sm text-green-300">{importMessage}</p>
              </div>
            )}
            {importError && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-sm text-red-300">{importError}</p>
              </div>
            )}
          </GlassmorphCard>

          <GlassmorphCard className="p-4 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Zap size={20} className="text-purple-400" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">About</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                <p className="text-xs text-muted-foreground uppercase">App</p>
                <p className="text-sm font-bold text-cyan-300 mt-1">GeoNotes Premium</p>
              </div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                <p className="text-xs text-muted-foreground uppercase">Version</p>
                <p className="text-sm font-bold text-cyan-300 mt-1">2.1.0</p>
              </div>
            </div>
          </GlassmorphCard>

          <GlassmorphCard className="p-4 space-y-4 border-red-500/30 bg-red-500/5">
            <h2 className="text-sm font-semibold text-red-400 uppercase">Danger Zone</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 size={18} className="mr-2" />
                  Clear All Places
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glassmorphism">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">Clear All Places?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-3">
                  <AlertDialogCancel className="bg-black/30 border border-white/10 text-foreground">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </GlassmorphCard>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="h-full flex flex-col bg-background">
      <GlassmorphCard className="rounded-none p-4 border-b">
        <h1 className="text-xl font-bold text-foreground">Settings</h1>
      </GlassmorphCard>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl space-y-4">
          <GlassmorphCard className="p-4 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Zap size={20} className="text-cyan-400" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Appearance</h2>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={20} className="text-cyan-400" /> : <Sun size={20} className="text-yellow-400" />}
                <div>
                  <p className="text-sm font-medium text-foreground">Theme</p>
                  <p className="text-xs text-muted-foreground">{theme === 'dark' ? 'Dark' : 'Light'}</p>
                </div>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>
          </GlassmorphCard>

          <GlassmorphCard className="p-4 space-y-3">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Download size={20} className="text-purple-400" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Data</h2>
            </div>
            <Button onClick={handleExportData} className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 text-white">
              <Download size={18} className="mr-2" />
              Export Data
            </Button>
            <Button onClick={handleImportData} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Upload size={18} className="mr-2" />
              Import Data
            </Button>
          </GlassmorphCard>

          <GlassmorphCard className="p-4 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <Zap size={20} className="text-purple-400" />
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">About</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                <p className="text-xs text-muted-foreground uppercase">App</p>
                <p className="text-sm font-bold text-cyan-300 mt-1">GeoNotes Premium</p>
              </div>
              <div className="p-3 bg-black/20 rounded-lg border border-white/10">
                <p className="text-xs text-muted-foreground uppercase">Version</p>
                <p className="text-sm font-bold text-cyan-300 mt-1">2.1.0</p>
              </div>
            </div>
          </GlassmorphCard>

          <GlassmorphCard className="p-4 space-y-4 border-red-500/30 bg-red-500/5">
            <h2 className="text-sm font-semibold text-red-400 uppercase">Danger Zone</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 size={18} className="mr-2" />
                  Clear All Places
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="glassmorphism">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">Clear All Places?</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex gap-3">
                  <AlertDialogCancel className="bg-black/30 border border-white/10 text-foreground">Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white">Delete</AlertDialogAction>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          </GlassmorphCard>
        </div>
      </div>
    </div>
  );
}
