'use client';
import { Fragment } from 'react';
import * as THREE from 'three';

// ✅ Tipi condivisi
export interface AirplaneData {
  id: string;
  callsign: string;
  lat: number;
  lon: number;
  altitude: number;
  rotationY: number;
  position: THREE.Vector3;
}

interface FlightListProps {
  airplanes: AirplaneData[];
  onSelect: (position: THREE.Vector3) => void;
}

const FlightList: React.FC<FlightListProps> = ({ airplanes, onSelect }) => {
  return (
    <div className="airplane-list absolute left-2 top-10 bg-gray-900/90 px-2 py-2 z-50 max-h-[80vh] overflow-y-auto rounded-lg backdrop-blur-md border border-gray-700 shadow-lg">
      <h1 className="pb-4 font-extrabold text-white text-lg">
        ✈️ Vuelos sobre España
      </h1>
      <p className="text-gray-300 text-sm mb-3">
        Haz clic para centrar un avión
      </p>

      {airplanes.length === 0 ? (
        <p className="text-gray-400 text-sm italic">Caricamento voli...</p>
      ) : (
        airplanes.map((plane) => (
          <Fragment key={plane.id}>
            <button
              type="button"
              className="bg-blue-950 mb-2 ml-2 px-2 py-1 text-xs text-white rounded hover:bg-blue-400 hover:scale-110 transition-all duration-200"
              onClick={() => onSelect(plane.position)}
            >
              {plane.callsign !== 'N/A' ? plane.callsign : plane.id}
            </button>
            <br />
          </Fragment>
        ))
      )}
    </div>
  );
};

export default FlightList;
