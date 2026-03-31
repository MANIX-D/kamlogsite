import { useEffect, useState } from 'react';

interface LoadingPageProps {
  onLoadingComplete?: () => void;
  duration?: number;
}

export default function LoadingPage({ onLoadingComplete, duration = 2000 }: LoadingPageProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          if (onLoadingComplete) {
            setTimeout(onLoadingComplete, 300);
          }
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [duration, onLoadingComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden">
      <style>
        {`
          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }

          .ripple-wave {
            animation: ripple 3s ease-out infinite;
          }

          .ripple-wave:nth-child(1) {
            animation-delay: 0s;
          }

          .ripple-wave:nth-child(2) {
            animation-delay: 0.5s;
          }

          .ripple-wave:nth-child(3) {
            animation-delay: 1s;
          }

          .ripple-wave:nth-child(4) {
            animation-delay: 1.5s;
          }

          .ripple-wave:nth-child(5) {
            animation-delay: 2s;
          }

          .ripple-wave:nth-child(6) {
            animation-delay: 2.5s;
          }
        `}
      </style>

      {/* Ondes concentriques au centre */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-32 h-32">
          {/* Ondes bleues et rouges alternées */}
          <div className="absolute inset-0 ripple-wave">
            <div className="w-full h-full rounded-full border-4 border-blue-600"></div>
          </div>
          <div className="absolute inset-0 ripple-wave">
            <div className="w-full h-full rounded-full border-4 border-red-600"></div>
          </div>
          <div className="absolute inset-0 ripple-wave">
            <div className="w-full h-full rounded-full border-4 border-blue-500"></div>
          </div>
          <div className="absolute inset-0 ripple-wave">
            <div className="w-full h-full rounded-full border-4 border-red-500"></div>
          </div>
          <div className="absolute inset-0 ripple-wave">
            <div className="w-full h-full rounded-full border-4 border-blue-700"></div>
          </div>
          <div className="absolute inset-0 ripple-wave">
            <div className="w-full h-full rounded-full border-4 border-red-700"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
