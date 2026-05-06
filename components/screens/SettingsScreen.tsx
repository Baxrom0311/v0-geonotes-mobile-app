'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, Moon } from 'lucide-react';

export function SettingsScreen() {
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
      </div>

      {/* Settings content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl space-y-1">
          {/* Appearance section */}
          <div className="bg-white border-b border-gray-200">
            <h2 className="px-4 py-3 text-sm font-semibold text-gray-900">
              Appearance
            </h2>
            <div className="px-4 py-4 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Moon size={20} className="text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Dark Mode</p>
                  <p className="text-xs text-gray-500">Coming soon</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} disabled />
            </div>
          </div>

          {/* About section */}
          <div className="bg-white border-b border-gray-200">
            <h2 className="px-4 py-3 text-sm font-semibold text-gray-900">
              About
            </h2>
            <div className="px-4 py-4 space-y-3 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500">Application</p>
                <p className="text-sm font-medium text-gray-900">GeoNotes</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Version</p>
                <p className="text-sm font-medium text-gray-900">1.0.0</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Build</p>
                <p className="text-sm font-medium text-gray-900">2024.01</p>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="bg-white">
            <h2 className="px-4 py-3 text-sm font-semibold text-red-600">
              Danger Zone
            </h2>
            <div className="px-4 py-4 border-t border-gray-100">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Trash2 size={18} />
                    Clear All Places
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Places?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All your places will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex gap-3">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                      Delete All
                    </AlertDialogAction>
                  </div>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
