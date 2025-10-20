'use client';
import { useRef, useState, useEffect, Fragment } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import Terrain from './ThreeD/Terrain';
import SunController from './ThreeD/SunController';
import { Suspense } from 'react';
import Airplane from './ThreeD/Airplane';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { latLonToPosition } from '@/utils/mapUtils';

// ✅ Tipizzazione degli aerei
interface AirplaneData {
  id: string;
  callsign: string;
  lat: number;
  lon: number;
  altitude: number;
  rotationY: number;
  position: THREE.Vector3;
}

export default function World() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [airplanes, setAirplanes] = useState<AirplaneData[]>([]); // ✅ niente any

  // ✅ Funzione per centrare la camera su un aereo
  const focusObject = (position: THREE.Vector3) => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.copy(position);
    controls.object.position.set(position.x + 0, position.y + 5, position.z - 10);
    controls.update();
  };

  // ✅ Fetch dei voli in tempo reale
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch(
          'https://opensky-network.org/api/states/all?lamin=35.5&lomin=-11.0&lamax=44.5&lomax=5.0'
        );
        const data = await res.json();
        if (!data.states) return;

        // Ogni "state" ha [0]=icao24, [1]=callsign, [5]=longitude, [6]=latitude, [7]=altitude
        const planes: AirplaneData[] = data.states
          .filter(
            (p:any) =>
              p[5] !== null && p[6] !== null && p[7] !== null
          )
          .map((p: any): AirplaneData => {
            const id = p[0];
            const callsign = p[1]?.trim() || 'N/A';
            const lat = p[6];
            const lon = p[5];
            const altitude = p[7] || 10000;
            const rotationY = Math.random() * Math.PI * 2;
            const position = new THREE.Vector3(...latLonToPosition(lat, lon, altitude));
            return { id, callsign, lat, lon, altitude, rotationY, position };
          });

        setAirplanes(planes);
      } catch (err) {
        console.error('Errore fetch voli:', err);
      }
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 10000); // 🔁 ogni 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 📋 Lista aerei cliccabili */}
      <div className="airplane-list absolute left-2 top-10 bg-gray-900/90 px-2 py-2 z-50 max-h-[80vh] overflow-y-auto">
        <h1 className="pb-5 font-extrabold">✈️ Voli sopra la Spagna</h1>
        <p>Clicca per centrare un aereo</p>
        <br />
        {airplanes.length === 0 && <p>Caricamento voli...</p>}
        {airplanes.map((plane) => (
          <Fragment key={plane.id}>
            <button
              type="button"
              className="bg-blue-950 mb-2 ml-2 p-1 text-sm rounded hover:bg-blue-400 hover:scale-110 transition"
              onClick={() => focusObject(plane.position)}
            >
              {plane.callsign || plane.id}
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
