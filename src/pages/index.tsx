import World from '@/components/World';
import FullscreenButton from '@/components/utils/FullscreenButton';

export default function Home() {
  return (
    <main className='w-full h-screen relative py-20 px-40'>
      <div id="world-container" className='w-full h-200'>
        <World />
      </div>
      <FullscreenButton containerId="world-container" />
    </main>
  );
}

