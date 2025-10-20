'use client';
import { useEffect, useRef, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import * as THREE from 'three';

export default function SunController() {
  const { scene } = useThree();
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);

  // 🕐 Ora locale Madrid (una sola volta)
  const hour = useMemo(() => {
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
  }, []);

  // 🔭 Ora → coordinate solari
  const hourToSpherical = (h: number) => {
    let elevationDeg;
    if (h < 6) elevationDeg = THREE.MathUtils.lerp(-10, 0, h / 6);
    else if (h < 12) elevationDeg = THREE.MathUtils.lerp(0, 55, (h - 6) / 6);
    else if (h < 18) elevationDeg = THREE.MathUtils.lerp(55, 0, (h - 12) / 6);
    else elevationDeg = THREE.MathUtils.lerp(0, -10, (h - 18) / 6);

    const azimuthDeg = (h / 24) * 360 - 90;
    return {
      elevation: THREE.MathUtils.degToRad(elevationDeg),
      azimuth: THREE.MathUtils.degToRad(azimuthDeg),
    };
  };

  const sphericalToCartesian = (elevation: number, azimuth: number, dist = 300) => {
    const x = dist * Math.cos(elevation) * Math.cos(azimuth);
    const y = dist * Math.sin(elevation);
    const z = dist * Math.cos(elevation) * Math.sin(azimuth);
    return new THREE.Vector3(x, y, z);
  };

  // ☀️ Setup luci ultra leggere
  useEffect(() => {
    // Luce direzionale (sole)
    const dirLight = new THREE.DirectionalLight(0xfff6e0, 0.4);
    dirLight.castShadow = false; // 🚫 niente ombre = più FPS
    dirLightRef.current = dirLight;
    scene.add(dirLight);

    // Luce ambient tenue
    const ambient = new THREE.AmbientLight(0xbfd5ff, 0.12);
    scene.add(ambient);

    return () => {
      scene.remove(dirLight);
      scene.remove(ambient);
    };
  }, [scene]);

  // 💡 Posizione e colore del sole
  useEffect(() => {
    if (!dirLightRef.current) return;

    const { elevation, azimuth } = hourToSpherical(hour);
    const pos = sphericalToCartesian(elevation, azimuth, 300);
    const dirLight = dirLightRef.current;

    dirLight.position.copy(pos);

    // Intensità dinamica giorno/notte
    const daylight = Math.max(0, Math.sin(elevation));
    dirLight.intensity = THREE.MathUtils.lerp(0.05, 0.35, daylight);
    dirLight.color.setHSL(0.08, 0.35, THREE.MathUtils.lerp(0.35, 0.8, daylight));

    // Ambient coerente
    const amb = scene.children.find(
      c => c.type === 'AmbientLight'
    ) as THREE.AmbientLight | undefined;
    if (amb) amb.intensity = THREE.MathUtils.lerp(0.05, 0.2, daylight);
  }, [hour, scene]);

  // 🌇 Cielo realistico leggero
  const { elevation, azimuth } = useMemo(() => hourToSpherical(hour), [hour]);
  const sunPos = useMemo(() => sphericalToCartesian(elevation, azimuth, 100000), [elevation, azimuth]);

  return (
    <Sky
      distance={100000}
      sunPosition={[sunPos.x, sunPos.y, sunPos.z]}
      turbidity={4}
      rayleigh={0.7}
      mieCoefficient={0.0015}
      mieDirectionalG={0.85}
    />
  );
}
