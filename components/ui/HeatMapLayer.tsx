'use client';

import React from 'react';
import { Place } from '@/lib/types';

interface HeatMapLayerProps {
  places: Place[];
  width: number;
  height: number;
}

export function HeatMapLayer({ places, width, height }: HeatMapLayerProps) {
  // Create a canvas-based heatmap visualization
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Create gradient data
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    // Create a simple density map
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      data[i + 3] = 0;
    }

    // Add place contributions to heatmap
    places.forEach((place) => {
      const x = Math.floor(((place.longitude + 180) / 360) * width);
      const y = Math.floor(((place.latitude + 90) / 180) * height);

      // Create a radial gradient effect around each place
      const radius = 50;
      for (let px = Math.max(0, x - radius); px < Math.min(width, x + radius); px++) {
        for (let py = Math.max(0, y - radius); py < Math.min(height, y + radius); py++) {
          const distance = Math.sqrt((px - x) ** 2 + (py - y) ** 2);
          const intensity = Math.max(0, 1 - distance / radius);

          const index = (py * width + px) * 4;
          // Create a blue-to-red gradient based on intensity
          data[index] = Math.min(255, data[index] + intensity * 255); // Red
          data[index + 1] = Math.min(255, data[index + 1] + intensity * 100); // Green
          data[index + 2] = Math.min(255, data[index + 2] + intensity * 50); // Blue
          data[index + 3] = Math.min(255, data[index + 3] + intensity * 150); // Alpha
        }
      }
    });

    ctx.putImageData(imageData, 0, 0);
  }, [places, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full opacity-60 mix-blend-screen"
    />
  );
}
