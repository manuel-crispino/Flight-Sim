'use client';
import { useRef, Fragment } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Terrain from './ThreeD/Terrain';
import SunController from './ThreeD/SunController';
import { Suspense } from 'react';
import Airplane from './ThreeD/Airplane';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { latLonToPosition } from '@/utils/mapUtils';

export default function World() {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const airplanes = [
    { id: 'MAD1', lat: 40.4168, lon: -3.7038, altitude: 10000, rotationY: Math.PI / 2 },
    { id: 'BCN1', lat: 41.3851, lon: 2.1734, altitude: 9000, rotationY: Math.PI },
  ];

  // calcoliamo le posizioni solo una volta
  const airplanePositions = airplanes.map((plane) => ({
    ...plane,
    position: new THREE.Vector3(...latLonToPosition(plane.lat, plane.lon, plane.altitude)),
  }));

  console.log(
  'Airplane positions:',
  airplanePositions.map((p) => ({
    id: p.id,
    pos: [p.position.x.toFixed(2), p.position.y.toFixed(2), p.position.z.toFixed(2)]
  }))
);

  const focusObject = (position: THREE.Vector3) => {
    const controls = controlsRef.current;
    if (!controls) return;

    controls.target.copy(position);
    controls.object.position.set(position.x + 0, position.y + 5, position.z - 10);
    controls.update();

    console.log('airplane on focus clicked', position);
  };

  return (
    <>
      {/* Lista aerei cliccabili */}
      <div className="airplane-list absolute left-2 top-10 bg-gray-900/90 px-2 py-2 z-50">
        <h1 className="pb-5 font-extrabold">List of Airplanes:</h1>
        <p>Click to focus the airplane</p>
        <br />
        {airplanePositions.map((plane) => (
          <Fragment key={plane.id}>
            <button
              type="button"
              className="bg-blue-950 mb-4 ml-5 p-1 hover:bg-blue-400 hover:scale-125"
              onClick={() => focusObject(plane.position)}
            >
              {plane.id}
            </button>
            <br />
          </Fragment>
        ))}
      </div>

      <Canvas camera={{ position: [0, 40, 70], fov: 40 }} shadows>
        <ambientLight intensity={0.1} />
        <SunController />
        <OrbitControls
          ref={controlsRef}
          maxPolarAngle={Math.PI / 2}
          minDistance={10}
          maxDistance={2000}
        />
        <Suspense fallback={null}>
          <Terrain />
          {airplanePositions.map((plane) => (
            <Airplane
              key={plane.id}
              id={plane.id}
              position={plane.position} // ✅ passiamo la posizione calcolata
              scale={0.0009}
              rotationY={plane.rotationY}
              onClick={() => focusObject(plane.position)}
            />
          ))}
          
        </Suspense>
        <Stars />
      </Canvas>
    </>
  );
}
