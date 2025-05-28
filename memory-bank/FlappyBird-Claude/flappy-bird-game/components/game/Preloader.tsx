import { useEffect, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing...');

  useEffect(() => {
    const loadAssets = async () => {
      const steps = [
        { name: 'Loading fonts...', weight: 20 },
        { name: 'Initializing audio...', weight: 30 },
        { name: 'Preparing graphics...', weight: 30 },
        { name: 'Ready!', weight: 20 },
      ];

      let currentProgress = 0;

      for (const step of steps) {
        setStatus(step.name);
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 200));
        
        currentProgress += step.weight;
        setProgress(currentProgress);
      }

      // Small delay before starting
      setTimeout(onComplete, 300);
    };

    loadAssets();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl text-yellow-400 mb-8 font-['Press_Start_2P']">
          FLAPPY BIRD
        </h1>
        <div className="w-80 h-8 bg-gray-800 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white text-sm font-['Press_Start_2P']">{status}</p>
      </div>
    </div>
  );
} 