import React from 'react';

interface BucketProps {
  xPercent: number; // Center position of bucket (percentage 6% to 94%)
  widthPx: number; // e.g. 110px
  heightPx: number; // e.g. 70px
  hitEffect: 'none' | 'good' | 'bad';
  score?: number;
}

export const Bucket: React.FC<BucketProps> = ({
  xPercent,
  widthPx,
  heightPx,
  hitEffect,
}) => {
  return (
    <div
      id="player-bucket"
      className={`absolute bottom-3 select-none pointer-events-none transition-transform duration-75 ease-out z-20 ${
        hitEffect === 'bad'
          ? 'animate-bucket-shake'
          : hitEffect === 'good'
          ? 'animate-bucket-bounce'
          : ''
      }`}
      style={{
        left: `calc(${xPercent}% - ${widthPx / 2}px)`,
        width: `${widthPx}px`,
        height: `${heightPx}px`,
      }}
    >
      {/* Bucket Handle */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-4/5 h-7 border-4 border-gray-400 rounded-t-full pointer-events-none">
        {/* Grip */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2.5 bg-[#4a3b1a] rounded-sm shadow-xs border border-gray-600" />
      </div>

      {/* Main Bucket Body */}
      <div className="relative w-full h-full">
        {/* Bucket Rim / Catching Aperture */}
        <div
          className={`w-full h-5 rounded-t-full border-2 transition-colors duration-200 flex items-center justify-center relative overflow-hidden shadow-sm ${
            hitEffect === 'bad'
              ? 'bg-[#5c3814] border-[#F5402C]'
              : 'bg-[#FFE27D] border-[#FFC907]'
          }`}
        >
          {/* Water Surface inside rim */}
          <div
            className={`w-[90%] h-3 rounded-full transition-all duration-300 ${
              hitEffect === 'bad'
                ? 'bg-[#4a2e0e]'
                : 'bg-gradient-to-r from-[#2E9DF7] via-[#70c8ff] to-[#2E9DF7]'
            }`}
          />
        </div>

        {/* Bucket Tapered Container */}
        <div
          className={`w-full h-[calc(100%-12px)] relative rounded-b-2xl border-2 border-t-0 shadow-lg flex flex-col justify-end overflow-hidden transition-colors duration-200 ${
            hitEffect === 'bad'
              ? 'bg-gradient-to-b from-[#8C5E28] to-[#5C3814] border-[#F5402C]'
              : 'bg-gradient-to-b from-[#FFDE59] to-[#FFC907] border-[#e0ab00]'
          }`}
          style={{
            clipPath: 'polygon(0% 0%, 100% 0%, 88% 100%, 12% 100%)',
          }}
        >
          {/* Static Clean Water Level inside the bucket (does not rise up) */}
          <div
            className={`w-full transition-all duration-300 relative h-7 ${
              hitEffect === 'bad'
                ? 'bg-gradient-to-t from-[#36210b] to-[#6d4416]'
                : 'bg-gradient-to-t from-[#006ec4] via-[#2E9DF7] to-[#70c8ff]'
            }`}
          >
            {/* Water surface highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/40 blur-[0.5px]" />
          </div>

          {/* charity: water Logo / Badge on Bucket */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none drop-shadow-sm">
            <span className="text-[10px] font-black tracking-widest uppercase text-[#131313]/90 bg-white/70 px-2 py-0.5 rounded-full border border-black/10">
              WATER CAN
            </span>
          </div>
        </div>

        {/* Left / Right Catch guides */}
        <div className="absolute -bottom-1 left-2 w-3 h-1 bg-gray-400 rounded-full" />
        <div className="absolute -bottom-1 right-2 w-3 h-1 bg-gray-400 rounded-full" />
      </div>

      {/* Splash effect on hit */}
      {hitEffect !== 'none' && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 pointer-events-none">
          {hitEffect === 'bad' ? (
            <div className="flex items-center gap-1 text-xs font-black text-[#B87B00] bg-white px-2 py-0.5 rounded-full shadow-md border border-[#E5A700] animate-float-fade whitespace-nowrap">
              <span>⚠️ Dirty Water! -1</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-xs font-black text-[#2E9DF7] bg-white px-2 py-0.5 rounded-full shadow-md border border-[#2E9DF7] animate-float-fade whitespace-nowrap">
              <span>💧 Caught!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
