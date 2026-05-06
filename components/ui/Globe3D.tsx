'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as BABYLON from 'babylonjs';
import { Place } from '@/lib/types';
import { CATEGORY_CONFIG } from '@/lib/constants';

interface Globe3DProps {
  places: Place[];
  onSelectPlace: (placeId: string | null) => void;
  selectedPlaceId?: string | null;
  latitude?: number;
  longitude?: number;
  showHeatMap?: boolean;
}

export function Globe3D({ places, onSelectPlace, selectedPlaceId, showHeatMap }: Globe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const enginesRef = useRef<BABYLON.Engine | null>(null);
  const markersRef = useRef<Map<string, BABYLON.Mesh>>(new Map());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const engine = new BABYLON.Engine(canvasRef.current, true);
    enginesRef.current = engine;
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;

    // Dark background
    scene.clearColor = new BABYLON.Color3(0.059, 0.082, 0.114); // Dark navy
    scene.collisionsEnabled = true;

    // Create camera with better controls
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI,
      Math.PI / 2.5,
      80,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 50;
    camera.upperRadiusLimit = 180;
    camera.inertia = 0.7;
    camera.speed = 10;

    // Lights
    const ambientLight = new BABYLON.HemisphericLight('ambient', new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.intensity = 0.9;

    const pointLight = new BABYLON.PointLight('point', new BABYLON.Vector3(50, 50, 50), scene);
    pointLight.intensity = 0.7;
    pointLight.range = 500;

    // Create globe sphere
    const globe = BABYLON.MeshBuilder.CreateSphere('globe', { diameter: 40, segments: 128 }, scene);

    const globeMaterial = new BABYLON.StandardMaterial('globeMat', scene);
    globeMaterial.emissiveColor = new BABYLON.Color3(0.05, 0.3, 0.6);
    globeMaterial.specularColor = new BABYLON.Color3(0.2, 0.4, 0.8);
    globeMaterial.alpha = 0.95;
    globe.material = globeMaterial;

    // Add glow for premium effect
    const glow = new BABYLON.GlowLayer('glow', scene);
    glow.addIncludedOnlyMesh(globe);
    glow.intensity = 0.8;

    // Create markers
    markersRef.current.clear();

    places.forEach((place) => {
      const lat = (place.latitude * Math.PI) / 180;
      const lon = (place.longitude * Math.PI) / 180;

      const x = 21 * Math.cos(lat) * Math.cos(lon);
      const y = 21 * Math.sin(lat);
      const z = 21 * Math.cos(lat) * Math.sin(lon);

      const marker = BABYLON.MeshBuilder.CreateSphere(`marker_${place.id}`, { diameter: 1.5, segments: 32 }, scene);
      marker.position = new BABYLON.Vector3(x, y, z);

      const categoryColor = CATEGORY_CONFIG[place.category];
      const r = parseInt(categoryColor.color.slice(1, 3), 16) / 255;
      const g = parseInt(categoryColor.color.slice(3, 5), 16) / 255;
      const b = parseInt(categoryColor.color.slice(5, 7), 16) / 255;

      const markerMat = new BABYLON.StandardMaterial(`markerMat_${place.id}`, scene);
      markerMat.emissiveColor = new BABYLON.Color3(r, g, b);
      markerMat.specularColor = new BABYLON.Color3(1, 1, 1);
      marker.material = markerMat;

      glow.addIncludedOnlyMesh(marker);

      // Interaction
      marker.actionManager = new BABYLON.ActionManager(scene);
      marker.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
          onSelectPlace(place.id);
        })
      );

      // Hover animation
      let originalScale = 1;
      marker.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, () => {
          originalScale = marker.scaling.x;
          marker.scaling = new BABYLON.Vector3(1.5, 1.5, 1.5);
        })
      );

      marker.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, () => {
          marker.scaling = new BABYLON.Vector3(originalScale, originalScale, originalScale);
        })
      );

      markersRef.current.set(place.id, marker);
    });

    // Selected marker highlighting
    if (selectedPlaceId) {
      const selectedMarker = markersRef.current.get(selectedPlaceId);
      if (selectedMarker) {
        selectedMarker.scaling = new BABYLON.Vector3(2, 2, 2);
      }
    }

    // Auto-rotate
    let autoRotate = true;
    let rotationSpeed = 0.0002;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        autoRotate = !autoRotate;
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    // Render loop
    engine.runRenderLoop(() => {
      if (autoRotate && !selectedPlaceId) {
        globe.rotation.y += rotationSpeed;
      }
      scene.render();
    });

    // Handle resize
    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keypress', handleKeyPress);
      engine.dispose();
    };
  }, [isClient, places, onSelectPlace, selectedPlaceId]);

  if (!isClient) {
    return (
      <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-muted-foreground text-sm">Loading globe...</div>
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ display: 'block' }}
    />
  );
}
