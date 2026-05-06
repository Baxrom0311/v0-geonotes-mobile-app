'use client';

import React from 'react';
import { useGeoNotesStore } from '@/hooks/useGeoNotesStore.tsx';
import { GlassmorphCard } from '@/components/ui/GlassmorphCard';
import { CATEGORY_CONFIG } from '@/lib/constants';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, MapPin, Layers } from 'lucide-react';

export function AnalyticsScreen() {
  const { places } = useGeoNotesStore();

  // Calculate statistics
  const totalPlaces = places.length;
  const categoryStats = Object.entries(CATEGORY_CONFIG).map(([key, config]) => ({
    name: config.label,
    value: places.filter((p) => p.category === key).length,
    color: config.color,
  })).filter(stat => stat.value > 0);

  const recentPlaces = places.slice().sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()).slice(0, 7);

  const timelineData = recentPlaces.map((place) => ({
    date: new Date(place.createdDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    count: 1,
    title: place.title,
  }));

  const avgDistances = places.map((place) => ({
    title: place.title,
    distance: Math.round(Math.random() * 50 + 5),
  })).slice(0, 5);

  return (
    <div className="h-full flex flex-col bg-background overflow-y-auto">
      {/* Header */}
      <GlassmorphCard className="rounded-none p-4 border-b sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">Your location insights</p>
      </GlassmorphCard>

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3">
          <GlassmorphCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-cyan-400" />
              <span className="text-xs text-muted-foreground">Total Places</span>
            </div>
            <p className="text-2xl font-bold text-cyan-300">{totalPlaces}</p>
          </GlassmorphCard>

          <GlassmorphCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Layers size={16} className="text-purple-400" />
              <span className="text-xs text-muted-foreground">Categories</span>
            </div>
            <p className="text-2xl font-bold text-purple-300">{categoryStats.length}</p>
          </GlassmorphCard>

          <GlassmorphCard className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-pink-400" />
              <span className="text-xs text-muted-foreground">This Month</span>
            </div>
            <p className="text-2xl font-bold text-pink-300">{places.filter(p => new Date(p.createdDate).getMonth() === new Date().getMonth()).length}</p>
          </GlassmorphCard>
        </div>

        {/* Category distribution */}
        <GlassmorphCard className="p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Category Distribution</h2>
          <div className="h-40 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a1f26', border: '1px solid #00d9ff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassmorphCard>

        {/* Category breakdown */}
        <GlassmorphCard className="p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Places by Category</h2>
          <div className="space-y-2">
            {categoryStats.map((stat) => (
              <div key={stat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                  <span className="text-sm text-foreground">{stat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-black/30 px-2 py-1 rounded text-xs text-cyan-300 font-semibold">
                    {stat.value}
                  </div>
                  <div className="w-20 bg-black/30 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${(stat.value / totalPlaces) * 100}%`,
                        backgroundColor: stat.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassmorphCard>

        {/* Recent activity */}
        <GlassmorphCard className="p-4">
          <h2 className="text-sm font-semibold text-foreground mb-3">Recent Places</h2>
          <div className="space-y-2">
            {recentPlaces.slice(0, 5).map((place) => (
              <div key={place.id} className="p-2 bg-black/20 rounded-lg border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{place.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(place.createdDate).toLocaleDateString()}
                  </p>
                </div>
                <div
                  className="px-2 py-1 rounded text-xs font-semibold text-white"
                  style={{ backgroundColor: CATEGORY_CONFIG[place.category].color }}
                >
                  {CATEGORY_CONFIG[place.category].label}
                </div>
              </div>
            ))}
          </div>
        </GlassmorphCard>
      </div>
    </div>
  );
}
