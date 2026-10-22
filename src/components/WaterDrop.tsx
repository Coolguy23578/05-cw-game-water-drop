import React from 'react';
import { DropItem } from '../utils/gameData';

interface WaterDropProps {
  drop: DropItem;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onAnimationEnd: () => void;
}

export const WaterDrop: React.FC<WaterDropProps> = ({
  drop,
  onClick,
  onAnimationEnd,
}) => {
  const isGood = drop.type === 'good';
  const isBad = drop.type === 'bad';

  return (
    <div
      id={drop.id}
      data-drop-type={drop.type}
      data-drop-points={drop.points}
      onClick={onClick}
      onAnimationEnd={onAnimationEnd}
      className="absolute cursor-pointer select-none touch-manipulation group transition-transform hover:scale-110 active:scale-95 animate-drop-fall"
      style={{
        left: `${drop.xPercent}%`,
        width: `${drop.size}px`,
        height: `${drop.size}px`,
        animationDuration: `${drop.duration}s`,
        zIndex: 10,
      }}
    >
      {/* 1. Good Clean Water Droplet (+1) */}
      {isGood && (
        <div className="w-full h-full relative">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md filter transition-all group-hover:brightness-110"
          >
            <defs>
              <linearGradient id={`blue-grad-${drop.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#70c8ff" />
                <stop offset="45%" stopColor="#2E9DF7" />
                <stop offset="100%" stopColor="#006ec4" />
              </linearGradient>
            </defs>
            {/* Smooth teardrop */}
            <path
              d="M 50,5 C 50,5 92,55 92,72 C 92,90 73,95 50,95 C 27,95 8,90 8,72 C 8,55 50,5 50,5 Z"
              fill={`url(#blue-grad-${drop.id})`}
            />
            {/* Water highlights */}
            <ellipse cx="36" cy="62" rx="10" ry="16" fill="white" opacity="0.45" transform="rotate(-25 36 62)" />
            <circle cx="38" cy="46" r="4" fill="white" opacity="0.6" />
          </svg>
        </div>
      )}

      {/* 2. Yellow Dirty Water Droplet (-1 Penalty) */}
      {isBad && (
        <div className="w-full h-full relative">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full drop-shadow-md filter transition-all group-hover:brightness-110"
          >
            <defs>
              {/* Yellow dirty water gradient */}
              <linearGradient id={`yellow-dirty-grad-${drop.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFE169" />
                <stop offset="35%" stopColor="#E5A700" />
                <stop offset="70%" stopColor="#B87B00" />
                <stop offset="100%" stopColor="#805300" />
              </linearGradient>

              {/* Murky silt streak */}
              <linearGradient id={`silt-streak-${drop.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#805200" opacity="0.6" />
                <stop offset="100%" stopColor="#573600" opacity="0.8" />
              </linearGradient>
            </defs>

            {/* Teardrop outline */}
            <path
              d="M 50,5 C 50,5 92,55 92,72 C 92,90 73,95 50,95 C 27,95 8,90 8,72 C 8,55 50,5 50,5 Z"
              fill={`url(#yellow-dirty-grad-${drop.id})`}
              stroke="#5E3D00"
              strokeWidth="2"
            />

            {/* Silt / Dirt swirls */}
            <path
              d="M 32,54 Q 50,44 68,60 Q 52,74 32,66 Z"
              fill={`url(#silt-streak-${drop.id})`}
            />

            {/* Sediment specks */}
            <circle cx="42" cy="74" r="3" fill="#422900" />
            <circle cx="62" cy="68" r="3.5" fill="#422900" />
            <circle cx="50" cy="83" r="2.5" fill="#382200" />
            <circle cx="36" cy="45" r="2" fill="#523500" />

            {/* Grime reflection bubble */}
            <ellipse cx="34" cy="60" rx="8" ry="13" fill="#FFF2B2" opacity="0.4" transform="rotate(-25 34 60)" />

            {/* Warning cross mark */}
            <line x1="40" y1="58" x2="60" y2="78" stroke="#4A2E00" strokeWidth="5" strokeLinecap="round" />
            <line x1="60" y1="58" x2="40" y2="78" stroke="#4A2E00" strokeWidth="5" strokeLinecap="round" />
            <line x1="40" y1="58" x2="60" y2="78" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="60" y1="58" x2="40" y2="78" stroke="#FFF" strokeWidth="2.5" strokeLinecap="round" />
          </svg>

          {/* Floating Danger Badge: -1 */}
          <span className="absolute -bottom-1 -right-1 bg-[#b91c1c] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full border border-white shadow-sm flex items-center">
            -1
          </span>
        </div>
      )}
    </div>
  );
};
