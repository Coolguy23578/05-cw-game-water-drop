import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DropItem, FloatingText } from '../utils/gameData';
import { WaterDrop } from './WaterDrop';
import { Bucket } from './Bucket';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

interface GameContainerProps {
  gameRunning: boolean;
  score: number;
  drops: DropItem[];
  floatingTexts: FloatingText[];
  onStartGame: () => void;
  onDropClicked: (drop: DropItem, e: React.MouseEvent<HTMLDivElement>) => void;
  onDropMissed: (dropId: string) => void;
  onBucketCatch: (drop: DropItem, bucketXPercent: number) => void;
  bucketHitEffect: 'none' | 'good' | 'bad';
}

export const GameContainer: React.FC<GameContainerProps> = ({
  gameRunning,
  drops,
  floatingTexts,
  onStartGame,
  onDropClicked,
  onDropMissed,
  onBucketCatch,
  bucketHitEffect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Bucket position as percentage (8% to 92%)
  const [bucketX, setBucketX] = useState<number>(50);
  const isDraggingRef = useRef<boolean>(false);
  const caughtDropIdsRef = useRef<Set<string>>(new Set());

  // Reset caught set when game starts or drops change
  useEffect(() => {
    if (!gameRunning) {
      caughtDropIdsRef.current.clear();
      setBucketX(50);
    }
  }, [gameRunning]);

  // Pointer move handler to position the bucket
  const updateBucketFromClientX = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const percent = (relativeX / rect.width) * 100;
    setBucketX(Math.min(Math.max(percent, 8), 92));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gameRunning) return;
    isDraggingRef.current = true;
    updateBucketFromClientX(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!gameRunning) return;
    updateBucketFromClientX(e.clientX);
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Keyboard navigation for bucket
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameRunning) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        setBucketX((prev) => Math.max(prev - 5, 8));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        setBucketX((prev) => Math.min(prev + 5, 92));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameRunning]);

  // Frame-by-frame Collision Detection between falling drops and the Bucket
  useEffect(() => {
    if (!gameRunning) return;

    let animId: number;

    const checkCollisions = () => {
      const bucketEl = document.getElementById('player-bucket');
      if (bucketEl && containerRef.current) {
        const bRect = bucketEl.getBoundingClientRect();

        drops.forEach((drop) => {
          if (caughtDropIdsRef.current.has(drop.id)) return;

          const dropEl = document.getElementById(drop.id);
          if (!dropEl) return;

          const dRect = dropEl.getBoundingClientRect();
          const dropCenterX = dRect.left + dRect.width / 2;
          const dropBottom = dRect.bottom;

          // Check if drop bottom reaches the rim of the bucket
          const rimTop = bRect.top;
          const rimBottom = bRect.top + 38;

          if (
            dropBottom >= rimTop &&
            dropBottom <= rimBottom &&
            dropCenterX >= bRect.left - 4 &&
            dropCenterX <= bRect.right + 4
          ) {
            // Collision detected! Catch drop into bucket
            caughtDropIdsRef.current.add(drop.id);
            onBucketCatch(drop, bucketX);
          }
        });
      }

      animId = requestAnimationFrame(checkCollisions);
    };

    animId = requestAnimationFrame(checkCollisions);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [gameRunning, drops, bucketX, onBucketCatch]);

  return (
    <div
      ref={containerRef}
      id="game-container"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative w-full max-w-[800px] h-[520px] sm:h-[600px] bg-gradient-to-b from-[#e6f7ff] via-[#d6f0ff] to-[#c2e8ff] border-2 border-[#2b3a4a]/20 rounded-2xl overflow-hidden shadow-inner select-none touch-none cursor-crosshair"
    >
      {/* Decorative Cloud & Atmosphere accents */}
      <div className="absolute top-4 left-6 w-24 h-6 bg-white/50 rounded-full blur-[1px] pointer-events-none" />
      <div className="absolute top-8 right-12 w-32 h-7 bg-white/40 rounded-full blur-[1px] pointer-events-none" />
      <div className="absolute top-16 left-1/3 w-28 h-5 bg-white/30 rounded-full blur-[1px] pointer-events-none" />

      {/* Target & Rules Guide Badge */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-white/85 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-xs border border-white/60 pointer-events-none">
        <span className="text-[#2E9DF7]">💧 Blue: +1</span>
        <span className="text-gray-300">|</span>
        <span className="text-[#B87B00]">⚠️ Yellow: -1</span>
      </div>

      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/85 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-xs border border-white/60 pointer-events-none">
        <span>Target:</span>
        <span className="text-[#2E9DF7] font-extrabold">20 drops</span>
      </div>

      {/* Falling Drops */}
      {drops.map((drop) => (
        <WaterDrop
          key={drop.id}
          drop={drop}
          onClick={(e) => onDropClicked(drop, e)}
          onAnimationEnd={() => onDropMissed(drop.id)}
        />
      ))}

      {/* Floating Score Badges (+1, -1) */}
      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className="absolute font-black text-2xl pointer-events-none animate-float-fade z-30 drop-shadow-md"
          style={{
            left: `${ft.xPercent}%`,
            top: `${ft.yPx}px`,
            color: ft.color,
          }}
        >
          {ft.text}
        </div>
      ))}

      {/* Player-Controlled Bucket (Static bottom position, no rising water) */}
      <Bucket
        xPercent={bucketX}
        widthPx={104}
        heightPx={72}
        hitEffect={bucketHitEffect}
      />

      {/* Mobile Touch Steer Controls */}
      {gameRunning && (
        <div className="absolute bottom-2 inset-x-3 flex justify-between pointer-events-auto sm:hidden z-30">
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              setBucketX((prev) => Math.max(prev - 10, 8));
            }}
            className="w-12 h-12 rounded-full bg-white/80 active:bg-white text-gray-700 flex items-center justify-center shadow-md border border-gray-200"
            aria-label="Steer Left"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onPointerDown={(e) => {
              e.stopPropagation();
              setBucketX((prev) => Math.min(prev + 10, 92));
            }}
            className="w-12 h-12 rounded-full bg-white/80 active:bg-white text-gray-700 flex items-center justify-center shadow-md border border-gray-200"
            aria-label="Steer Right"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Start Game Prompt Overlay when not running */}
      {!gameRunning && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px] p-6 text-center animate-fade-in pointer-events-auto">
          <div className="bg-white/95 rounded-2xl p-6 sm:p-8 max-w-sm shadow-xl border border-gray-100 flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FFC907]/20 flex items-center justify-center p-3 border border-[#FFC907]">
              <img
                src="/img/water-can-transparent.png"
                alt="Water Can"
                className="w-full h-full object-contain"
              />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-[#131313]">Ready to Play?</h2>
              <div className="text-xs sm:text-sm text-gray-600 mt-2 space-y-1.5 text-left bg-gray-50 p-3 rounded-xl border border-gray-200">
                <p className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2E9DF7] inline-block" />
                  <span><strong>Move bucket</strong> to catch blue drops (<strong>+1</strong>).</span>
                </p>
                <p className="flex items-center gap-2 text-[#996500]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5A700] inline-block" />
                  <span><strong>DODGE yellow dirty drops!</strong> Penalty is <strong>-1</strong>!</span>
                </p>
              </div>
            </div>

            <button
              onClick={onStartGame}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#4FCB53] hover:bg-[#43b747] active:scale-95 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer text-base"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>Start Game</span>
            </button>
            <p className="text-[11px] text-gray-400">
              Control bucket with mouse, touch, or Arrow keys
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
