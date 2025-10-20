// ThreeD/Airplane.tsx
'use client';
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { latLonToPosition } from '@/utils/mapUtils';

// 🔹 Costanti per scala realistica
const MAP_WIDTH = 52.916; // larghezza mappa in unità Three.js
const PLANE_LENGTH = 40;  // lunghezza reale aereo in metri
const PLANE_SCALE = (PLANE_LENGTH / MAP_WIDTH) * 0.1; // regola 0.1 per visibilità

type AirplaneProps = {
  lat: number;
  lon: number;
  altitude: number; // metri reali
  scale?: number;
  rotationY?: number;
   onClick?: (position: THREE.Vector3) => void;
};

export default function Airplane({
  lat,
  lon,
  altitude,
  scale = PLANE_SCALE, // usa la scala calcolata
  rotationY = 0,
    onClick,
}: AirplaneProps) {
  const gltf = useGLTF('/models/airplane.glb');
  const meshRef = useRef<THREE.Group>(null);

  // 🔹 Ottieni direttamente Vector3
  const position = latLonToPosition(lat, lon, altitude); 

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(10, 20, 10);
    mesh.add(light);

    mesh.rotation.y = rotationY;

    return () => {
      mesh.remove(light);
    };
  }, [rotationY]);

  useEffect(() => {
    gltf.scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.material) {
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.color = new THREE.Color(0xFFFFFF);
          mat.metalness = 0.3;
          mat.roughness = 0.4;
        }
      }
    });
  }, [gltf.scene]);

  return (
      <group
      ref={meshRef}
      position={position}
      scale={scale}
      onClick={() => onClick && onClick(position)}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}
