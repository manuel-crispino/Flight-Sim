// utils/mapUtils.ts
import * as THREE from 'three';

const MAP_WIDTH = 52.916;   // unità Three.js X
const MAP_DEPTH = 33.072;   // unità Three.js Z

// lat/lon bounding box della tua mappa reale
const BBOX = {
  latMin: 36, // es. Sud Spagna
  latMax: 43, // Nord
  lonMin: -9, // Ovest
  lonMax: 3   // Est
};

export function latLonToPosition(lat: number, lon: number, altitude: number) {
  // normalizza lat/lon in 0..1
  const nx = (lon - BBOX.lonMin) / (BBOX.lonMax - BBOX.lonMin);
  const nz = (lat - BBOX.latMin) / (BBOX.latMax - BBOX.latMin);

  // trasforma in coordinate Three.js centrando mappa
  const x = nx * MAP_WIDTH - MAP_WIDTH / 2;
  const z = -(nz * MAP_DEPTH - MAP_DEPTH / 2); // negativo se z è "sud verso nord"

  // scala altitudine reale in altezza Three.js
  const y = altitude / 10000; // regola 10000 per rendere visibile altitudini grandi

  return new THREE.Vector3(x, y, z);
}
