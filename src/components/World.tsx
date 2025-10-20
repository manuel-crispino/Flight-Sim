// World.tsx
'use client';
import { useRef} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls , Stars } from '@react-three/drei';
import Terrain from './ThreeD/Terrain';
import SunController from './ThreeD/SunController';
import { Suspense } from 'react';
import Airplane from './ThreeD/Airplane';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';


export default function World() {
     const controlsRef = useRef<OrbitControlsImpl>(null);

  // funzione per centrare la camera su un oggetto
  const focusObject = (position: THREE.Vector3) => {
    const controls = controlsRef.current;
    if (!controls) return;

    controls.target.copy(position); // centra la camera
    // sposta la camera dietro il target
    controls.object.position.set(
      position.x + 0,
      position.y + 5,
      position.z + -10
    );
    controls.update();

    console.log("airplane on focus clicked", position);
  };


  return (
    <Canvas camera={{ position: [0, 40, 70], fov: 40 }} shadows>
      <ambientLight intensity={0.1} />
      <SunController />
      {/* ✅ Passiamo il ref qui */}
      <OrbitControls
        ref={controlsRef}
        maxPolarAngle={Math.PI / 2}
        minDistance={10}
        maxDistance={2000}
      />
      <Suspense fallback={null}>
        <Terrain />
        <Airplane
            lat={40.4168}       // Madrid
            lon={-3.7038}
            altitude={10000}    // metri reali
            scale={0.0009}      // scala visibile
            rotationY={Math.PI / 2}
            onClick={(pos) => focusObject(pos)}
        />
      </Suspense>
      <Stars />
    </Canvas>
  );
}
