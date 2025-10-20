'use client';
import { useEffect, useRef, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';

export default function SunController() {
  const { scene } = useThree();
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const [hour, setHour] = useState<number>(12);

  // ora locale spagnola
  const getSpanishHour = () => {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Madrid',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    }).formatToParts(now);

    const h = Number(parts.find(p => p.type === 'hour')?.value || '0');
    const m = Number(parts.find(p => p.type === 'minute')?.value || '0');
    const s = Number(parts.find(p => p.type === 'second')?.value || '0');
    return h + m / 60 + s / 3600;
  };

  // calcola elevazione corretta: -15° a notte, +75° a mezzogiorno
  const hourToSpherical = (h: number) => {
    let elevationDeg;
    if (h < 6) elevationDeg = THREE.MathUtils.lerp(-15, 0, h / 6);          // notte -> alba
    else if (h < 12) elevationDeg = THREE.MathUtils.lerp(0, 75, (h - 6) / 6); // mattina -> mezzogiorno
    else if (h < 18) elevationDeg = THREE.MathUtils.lerp(75, 0, (h - 12) / 6); // mezzogiorno -> tramonto
    else elevationDeg = THREE.MathUtils.lerp(0, -15, (h - 18) / 6);          // tramonto -> notte

    const azimuthDeg = (h / 24) * 360 - 90; // rotazione orizzontale del sole
    return {
      elevation: THREE.MathUtils.degToRad(elevationDeg),
      azimuth: THREE.MathUtils.degToRad(azimuthDeg),
    };
  };

  const sphericalToCartesian = (elevation: number, azimuth: number, dist = 400) => {
    const x = dist * Math.cos(elevation) * Math.cos(azimuth);
    const y = dist * Math.sin(elevation);
    const z = dist * Math.cos(elevation) * Math.sin(azimuth);
    return new THREE.Vector3(x, y, z);
  };

  useEffect(() => {
    const dl = new THREE.DirectionalLight(0xffffff, 1.2);
    dl.castShadow = true;
    scene.add(dl);
    dirLightRef.current = dl;

    // luce ambient minima
    const ambient = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambient);

    scene.fog = new THREE.Fog('#aabbd7', 200, 2000);

    return () => {
      scene.remove(dl);
      scene.remove(ambient);
      scene.fog = null;
    };
  }, [scene]);

  useEffect(() => {
    const update = () => setHour(getSpanishHour());
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  // aggiornamento luce e sole
  useEffect(() => {
    if (!dirLightRef.current) return;

    const { elevation, azimuth } = hourToSpherical(hour);
    const pos = sphericalToCartesian(elevation, azimuth, 400);
    dirLightRef.current.position.copy(pos);

    // intensità solare realistica: notte = 0, giorno = max
    const intensity = Math.max(0, Math.sin(elevation));
    dirLightRef.current.intensity = THREE.MathUtils.lerp(0.1, 1.6, intensity);

    // colore luce più caldo all'alba/tramonto
    dirLightRef.current.color.setHSL(0.08, 0.6, THREE.MathUtils.lerp(0.3, 1, intensity));
    
    const amb = scene.children.find(c => c.type === 'AmbientLight') as THREE.AmbientLight | undefined;
    if (amb) amb.intensity = THREE.MathUtils.lerp(0.1, 0.6, intensity);
  }, [hour, scene]);

  const { elevation, azimuth } = hourToSpherical(hour);
  const sunPos = sphericalToCartesian(elevation, azimuth, 450000);

  return (
    <Sky
      distance={450000}
      sunPosition={[sunPos.x, sunPos.y, sunPos.z]}
      turbidity={7}
      rayleigh={1.2}
      mieCoefficient={0.004}
      mieDirectionalG={0.8}
    />
  );
}
