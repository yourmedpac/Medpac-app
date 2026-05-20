'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function SplashScreen() {
  const setScreen = useAppStore((s) => s.setScreen);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger fade-in on mount
    requestAnimationFrame(() => setVisible(true));

    const timer = setTimeout(() => {
      setScreen('onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [setScreen]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-emerald-400/10 blur-2xl" />
        <div className="absolute bottom-1/3 left-1/5 w-48 h-48 rounded-full bg-teal-300/10 blur-xl" />
      </div>

      {/* Main content with fade-in */}
      <div
        className={`flex flex-col items-center justify-center gap-6 transition-all duration-1000 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Pulsing heart logo */}
        <div className="relative flex items-center justify-center">
          {/* Outer ring pulse */}
          <div className="absolute w-40 h-40 rounded-full border-2 border-white/20 animate-[ping_2s_ease-in-out_infinite]" />
          {/* Inner ring pulse */}
          <div className="absolute w-32 h-32 rounded-full border border-white/15 animate-[ping_2.5s_ease-in-out_0.5s_infinite]" />
          {/* Glow backdrop */}
          <div className="absolute w-28 h-28 rounded-full bg-white/10 blur-md" />
          {/* Icon container */}
          <div className="relative w-28 h-28 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-2xl shadow-teal-900/30">
            <Heart
              className="w-[72px] h-[72px] text-white animate-heartbeat"
              fill="white"
              strokeWidth={0}
            />
          </div>
        </div>

        {/* App name */}
        <div className="flex flex-col items-center gap-2 mt-4">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Medpac
          </h1>
          <p className="text-lg text-white/80 font-light tracking-wide">
            Your AI Health OS
          </p>
        </div>

        {/* Loading indicator */}
        <div className="mt-8 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-white/60 animate-[bounce_1.4s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Bottom tagline */}
      <div
        className={`absolute bottom-10 flex flex-col items-center gap-2 transition-all duration-1000 delay-500 ease-out ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <p className="text-sm text-white/60 font-light tracking-wider">
          Powered by AI &bull; Made for India
        </p>
      </div>

      {/* Heartbeat animation is handled via Tailwind's animate utilities */}
    </div>
  );
}
