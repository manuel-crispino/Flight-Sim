'use client';
import { useState } from 'react';
import { FiMaximize, FiMinimize } from 'react-icons/fi';

type FullscreenButtonProps = {
  containerId: string; // id della div da mettere in fullscreen
};

export default function FullscreenButton({ containerId }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const elem = document.getElementById(containerId);
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <button
        type='button'
      onClick={toggleFullscreen}
      className="absolute bottom-4 right-4 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-80 transition-colors"
    >
      {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
    </button>
  );
}
