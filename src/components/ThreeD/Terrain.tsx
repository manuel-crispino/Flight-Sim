// ThreeD/Terrain.tsx
'use client';
import { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three'; // ✅ aggiungi questo import

export default function Terrain() {
  const gltf = useGLTF('/models/spain.glb');

  // bounding box della mappa per capire scala
  const box = new THREE.Box3().setFromObject(gltf.scene);
  const size = new THREE.Vector3();
  box.getSize(size);
  console.log('Dimensioni mappa:', size); // utile per scalare gli aerei

  return (
    <Suspense fallback={null}>
      <primitive object={gltf.scene} scale={2.9} position={[-5, -17, 0]} />
    </Suspense>
  );
}
