import React from 'react';
import { Volume2, VolumeX, HelpCircle, Trophy } from 'lucide-react';

interface HeaderProps {
  highScore: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onShowRules: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  highScore,
  isMuted,
  onToggleMute,
  onShowRules,
}) => {
  return (
    <header className="w-full max-w-[800px] flex flex-col items-center gap-2 pt-4 px-3 sm:px-0">
      {/* Brand Bar */}
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img
            src="/img/cw_logo-horizontal.png"
            alt="charity: water"
            className="h-7 sm:h-8 object-contain"
            onError={(e) => {
              // Fallback to text if missing
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div className="flex items-center gap-1.5 bg-[#FFC907]/20 border border-[#FFC907] px-2.5 py-0.5 rounded-full text-xs font-bold text-[#131313]">
            <img src="/img/water-can-transparent.png" alt="Jerry Can" className="w-4 h-4 object-contain inline-block" />
            <span>Water Project</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {highScore > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-xs text-xs font-bold text-[#131313] border border-gray-200">
              <Trophy className="w-3.5 h-3.5 text-[#FF902A]" />
              <span>Best: {highScore}</span>
            </div>
          )}

          <button
            onClick={onShowRules}
            aria-label="How to play"
            className="p-2 rounded-full bg-white hover:bg-gray-100 text-gray-700 shadow-xs border border-gray-200 transition-colors"
            title="How to Play"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
            className="p-2 rounded-full bg-white hover:bg-gray-100 text-gray-700 shadow-xs border border-gray-200 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-[#2E9DF7]" />}
          </button>
        </div>
      </div>

      {/* Main Game Title & Tagline matching original */}
      <div className="text-center mt-1">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#131313] tracking-tight flex items-center justify-center gap-2">
          <span>Water Drop</span>
          <span className="text-[#2E9DF7] inline-block animate-pulse">💧</span>
        </h1>
        <p className="text-sm sm:text-base text-gray-600 font-medium mt-1">
          Catch the good drops, avoid the bad ones!
        </p>
      </div>
    </header>
  );
};
