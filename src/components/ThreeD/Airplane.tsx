'use client';
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

// Costanti per scala realistica
const MAP_WIDTH = 52.916;
const PLANE_LENGTH = 40;
const PLANE_SCALE = (PLANE_LENGTH / MAP_WIDTH) * 0.1;

type AirplaneProps = {
  id: string;
  position: THREE.Vector3;
  scale?: number;
  rotationY?: number;
  onClick?: (id: string, position: THREE.Vector3) => void;
};

export default function Airplane({
  id,
  position,
  scale = PLANE_SCALE,
  rotationY = 0,
  onClick,
}: AirplaneProps) {
  const { scene } = useGLTF('/models/airplane.glb');
  const meshRef = useRef<THREE.Group>(null);

  // 👇 CLONA la scena del modello per evitare la condivisione tra istanze
  const airplaneScene = scene.clone(true);

  useEffect(() => {
    if (!meshRef.current) return;
    const mesh = meshRef.current;

    // Aggiungi una luce locale
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(10, 20, 10);
    mesh.add(light);

    mesh.rotation.y = rotationY;

    return () => {
      mesh.remove(light);
    };
  }, [rotationY]);

  // Colora il modello (facoltativo)
  airplaneScene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.color = new THREE.Color(0xffffff);
        mat.metalness = 0.3;
        mat.roughness = 0.4;
      }
    }
  });

  return (
    <group
      ref={meshRef}
      position={position}
      scale={scale}
      onClick={() => onClick && onClick(id, position)}
    >
      <primitive object={airplaneScene} />
    </group>
  );
}
