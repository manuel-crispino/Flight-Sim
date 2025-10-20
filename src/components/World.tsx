'use client';
import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Terrain from './ThreeD/Terrain';
import SunController from './ThreeD/SunController';
import Airplane from './ThreeD/Airplane';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { latLonToPosition } from '@/utils/mapUtils';
import FlightList, { AirplaneData } from './ThreeD/FlightList';

// ✅ Tipizzazione secondo OpenSky
interface OpenSkyState {
  0: string; // icao24
  1: string | null; // callsign
  2: string | null; // origin_country
  5: number | null; // longitude
  6: number | null; // latitude
  7: number | null; // altitude
  10: number | null; // true_track
}

export default function World() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [airplanes, setAirplanes] = useState<AirplaneData[]>([]);

  const focusObject = (position: THREE.Vector3) => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.copy(position);
    controls.object.position.set(position.x, position.y + 5, position.z - 10);
    controls.update();
  };

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch(
          'https://opensky-network.org/api/states/all?lamin=34.0&lomin=-12.0&lamax=45.0&lomax=6.0'
        );
        const data = await res.json();
        if (!data.states) return;

        const planes: AirplaneData[] = (data.states as OpenSkyState[])
          .filter(
            (p) =>
              typeof p[5] === 'number' &&
              typeof p[6] === 'number' &&
              p[5] !== null &&
              p[6] !== null
          )
          .map((p) => {
            const id = p[0];
            const callsign = p[1]?.trim() || 'N/A';
            const lat = p[6]!;
            const lon = p[5]!;
            const altitude = p[7] ?? 10000;
            const trueTrack = p[10];

            // Direzione realistica
            const rotationY = trueTrack
              ? THREE.MathUtils.degToRad(360 - trueTrack)
              : 0;

            const position = new THREE.Vector3(
              ...latLonToPosition(lat, lon, altitude)
            );

            return { id, callsign, lat, lon, altitude, rotationY, position };
          });

        // Merge per evitare "salti"
        setAirplanes((prev) =>
          planes.map((plane) => {
            const existing = prev.find((p) => p.id === plane.id);
            if (!existing) return plane;

            // Rotazione più fluida (interpolata)
            const smoothRotation =
              existing.rotationY +
              (plane.rotationY - existing.rotationY) * 0.2;

            return { ...plane, rotationY: smoothRotation };
          })
        );
      } catch (err) {
        console.error('Errore fetch voli:', err);
      }
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <FlightList airplanes={airplanes} onSelect={focusObject} />

      <Canvas camera={{ position: [0, 40, 70], fov: 40 }} shadows>
        <ambientLight intensity={0.01} />
        <SunController />
        <OrbitControls
          ref={controlsRef}
          maxPolarAngle={Math.PI / 2}
          minDistance={10}
          maxDistance={2000}
        />

        <Suspense fallback={null}>
          <Terrain />
          {airplanes.map((plane) => (
            <Airplane
              key={plane.id}
              id={plane.id}
              position={plane.position}
              scale={0.0005}
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
