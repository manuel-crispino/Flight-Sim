'use client';
import { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import Terrain from './ThreeD/Terrain';
import SunController from './ThreeD/SunController';
import Airplane from './ThreeD/Airplane';
import * as THREE from 'three';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { latLonToPosition } from '@/utils/mapUtils';
import FlightList, { AirplaneData } from './ThreeD/FlightList';

// ✅ Tipizzazione OpenSky
interface OpenSkyState {
  0: string;
  1: string | null;
  2: string | null;
  5: number | null;
  6: number | null;
  7: number | null;
  10: number | null;
}

export default function World() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [airplanes, setAirplanes] = useState<AirplaneData[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Focus camera su un aereo
  const focusObject = (position: THREE.Vector3) => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.target.copy(position);
    controls.object.position.set(position.x, position.y + 5, position.z - 10);
    controls.update();
  };

  // ✅ Fetch ottimizzato voli
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await fetch(
          'https://opensky-network.org/api/states/all?lamin=34.0&lomin=-12.0&lamax=45.0&lomax=6.0'
        );
        const data = await res.json();
        if (!data.states) return;

        const planes: AirplaneData[] = (data.states as OpenSkyState[])
          .filter((p) => p[5] && p[6])
          .slice(0, 10) // 🧩 Limitiamo a 150 aerei max (miglior performance)
          .map((p) => {
            const id = p[0];
            const callsign = p[1]?.trim() || 'N/A';
            const lat = p[6]!;
            const lon = p[5]!;
            const altitude = p[7] ?? 10000;
            const trueTrack = p[10];
            const rotationY = trueTrack
              ? THREE.MathUtils.degToRad(360 - trueTrack)
              : 0;

            const position = new THREE.Vector3(
              ...latLonToPosition(lat, lon, altitude)
            );

            return { id, callsign, lat, lon, altitude, rotationY, position };
          });

        setAirplanes((prev) =>
          planes.map((plane) => {
            const existing = prev.find((p) => p.id === plane.id);
            if (!existing) return plane;

            const smoothRotation =
              existing.rotationY +
              (plane.rotationY - existing.rotationY) * 0.15;

            return { ...plane, rotationY: smoothRotation, position: plane.position };
          })
        );

        setLoading(false); // 🔥 Caricamento completato
      } catch (err) {
        console.error('Errore fetch voli:', err);
        setLoading(false);
      }
    };

    fetchFlights();
    const interval = setInterval(fetchFlights, 25000); // ⏱️ ogni 25s
    return () => clearInterval(interval);
  }, []);

  // ✅ Memo per evitare re-render completi
  const airplaneElements = useMemo(
    () =>
      airplanes.map((plane) => (
        <Airplane
          key={plane.id}
          id={plane.id}
          position={plane.position}
          scale={0.0004}
          rotationY={plane.rotationY}
          onClick={() => focusObject(plane.position)}
        />
      )),
    [airplanes]
  );

  return (
    <>
      <FlightList airplanes={airplanes} onSelect={focusObject} />

      {/* 🎬 Canvas 3D ottimizzato */}
      <Canvas
        camera={{ position: [0, 40, 70], fov: 40 }}
        gl={{ antialias: false }}
        dpr={[1, 1.5]}
        shadows={false}
        frameloop="demand" // 🚀 Render solo quando serve
      >
        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center justify-center text-center text-white bg-black/60 p-4 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white mb-2"></div>
                <p>Cargando mapa y vuelos...</p>
              </div>
            </Html>
          }
        >
          {/* 💡 Luci ottimizzate */}
          <ambientLight intensity={0.15} />
          <directionalLight
            intensity={0.8}
            position={[150, 250, 100]}
            color={'#ffe7b0'}
          />

          <SunController />

          <OrbitControls
            ref={controlsRef}
            maxPolarAngle={Math.PI / 2}
            minDistance={10}
            maxDistance={2000}
          />

          <Terrain />
          {!loading && airplaneElements}

          {/* 🌌 Stelle */}
          <Stars radius={200} depth={60} count={5000} factor={3} fade />
        </Suspense>
      </Canvas>
    </>
  );
}
