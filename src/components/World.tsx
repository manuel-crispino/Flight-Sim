'use client';
import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';

export default function World() {
  return (
    <Canvas camera={{ position: [0, 50, 100], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[50, 100, 50]} intensity={1} />
      
      {/* Controlli della camera */}
      <OrbitControls maxPolarAngle={Math.PI / 2} minDistance={10} maxDistance={500} />

      {/* Cielo */}
      <Sky distance={450000} sunPosition={[100, 20, 100]} />

      {/* Terreno con altezza simulata */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[500, 500, 256, 256]} />
        <meshStandardMaterial color="green" wireframe={false} />
      </mesh>

      {/* Stelle */}
      <Stars />
    </Canvas>
  );
}
