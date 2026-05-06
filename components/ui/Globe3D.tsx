'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as BABYLON from 'babylonjs';
import { Place } from '@/lib/types';

interface Globe3DProps {
  places: Place[];
  onMarkerClick: (placeId: string) => void;
  selectedPlaceId?: string | null;
}

export function Globe3D({ places, onMarkerClick, selectedPlaceId }: Globe3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !canvasRef.current) return;

    const engine = new BABYLON.Engine(canvasRef.current, true);
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;

    scene.clearColor = new BABYLON.Color3(0.059, 0.094, 0.149); // #0f1819
    scene.collisionsEnabled = true;

    // Create camera
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 2.5,
      100,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvasRef.current, true);
    camera.lowerRadiusLimit = 60;
    camera.upperRadiusLimit = 200;
    camera.inertia = 0.7;
    camera.angularSensibilityX = 1000;
    camera.angularSensibilityY = 1000;

    // Create lighting
    const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 1, 1), scene);
    light1.intensity = 0.8;

    const light2 = new BABYLON.PointLight('light2', new BABYLON.Vector3(10, 10, 10), scene);
    light2.intensity = 0.6;

    // Create globe
    const globe = BABYLON.MeshBuilder.CreateSphere('globe', { diameter: 40, segments: 64 }, scene);

    // Create globe material
    const globeMaterial = new BABYLON.StandardMaterial('globeMaterial', scene);
    globeMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.5, 0.8);
    globeMaterial.alpha = 0.9;
    globe.material = globeMaterial;

    // Add glow layer for globe
    const glow = new BABYLON.GlowLayer('glow', scene);
    glow.addIncludedOnlyMesh(globe);
    glow.intensity = 0.5;

    // Create markers for places
    const markerMeshes: Map<string, BABYLON.Mesh> = new Map();

    places.forEach((place) => {
      // Normalize latitude/longitude to sphere coordinates
      const lat = (place.latitude * Math.PI) / 180;
      const lon = (place.longitude * Math.PI) / 180;

      const x = 20 * Math.cos(lat) * Math.cos(lon);
      const y = 20 * Math.sin(lat);
      const z = 20 * Math.cos(lat) * Math.sin(lon);

      const marker = BABYLON.MeshBuilder.CreateSphere('marker_' + place.id, { diameter: 2 }, scene);
      marker.position = new BABYLON.Vector3(x, y, z);

      const markerMaterial = new BABYLON.StandardMaterial('markerMat_' + place.id, scene);
      markerMaterial.emissiveColor = new BABYLON.Color3(0, 0.85, 1); // Cyan
      marker.material = markerMaterial;

      glow.addIncludedOnlyMesh(marker);

      marker.actionManager = new BABYLON.ActionManager(scene);
      marker.actionManager.registerAction(
        new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
          onMarkerClick(place.id);
        })
      );

      markerMeshes.set(place.id, marker);
    });

    // Animation loop
    let rotationSpeed = 0.0005;
    engine.runRenderLoop(() => {
      globe.rotation.y += rotationSpeed;
      scene.render();
    });

    // Handle window resize
    const handleResize = () => {
      engine.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      engine.dispose();
    };
  }, [isClient, places, onMarkerClick]);

  if (!isClient) {
    return <div className="w-full h-full bg-gradient-to-b from-slate-900 to-slate-950 animate-pulse" />;
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-lg"
      style={{ display: 'block' }}
    />
  );
}
