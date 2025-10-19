'use client';
import { useState } from 'react';
import { FiMaximize, FiMinimize } from 'react-icons/fi';

type FullscreenButtonProps = {
  containerId: string; // id della div da mettere in fullscreen
};

export default function FullscreenButton({ containerId }: FullscreenButtonProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
    <>
      <button
        type="button"
        onClick={toggleFullscreen}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
        className="absolute right-10 bottom-2 p-3 bg-black bg-opacity-50  text-white rounded-full hover:scale-125 hover:bg-gray-700 transition-all z-50"
      >
        {isFullscreen ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
      </button>

      {showInfo && (
        <div className="absolute right-25 bottom-2 p-2 bg-black bg-opacity-70 text-white rounded-md z-50 ">
          Click to toggle fullscreen
        </div>
      )}
    </>
  );
}
