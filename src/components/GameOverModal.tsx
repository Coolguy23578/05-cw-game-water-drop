import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, X } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  score: number;
  highScore: number;
  isWinner: boolean;
  message: string;
  goodCaught: number;
  badCaught: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  score,
  highScore,
  isWinner,
  message,
  goodCaught,
  badCaught,
  onPlayAgain,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen && isWinner) {
      // Launch celebration confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFC907', '#2E9DF7', '#4FCB53', '#FF902A'],
      });
    }
  }, [isOpen, isWinner]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Header Ribbon */}
        <div
          className={`py-6 px-6 text-center text-white relative ${
            isWinner
              ? 'bg-gradient-to-r from-[#2E9DF7] to-[#159A48]'
              : 'bg-gradient-to-r from-[#FF902A] to-[#F16061]'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white p-1 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner">
            {isWinner ? '🎉' : '💧'}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isWinner ? 'Victory! You Did It!' : 'Time’s Up!'}
          </h2>
          <p className="text-white/90 text-sm font-medium mt-1">
            {isWinner ? 'Target Reached (20+ Drops)' : 'Goal was 20 drops'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-5">
          {/* Main Message from Random Array */}
          <div
            className={`p-4 rounded-xl text-center font-bold text-base leading-snug border ${
              isWinner
                ? 'bg-[#4FCB53]/10 text-[#159A48] border-[#4FCB53]/30'
                : 'bg-[#FF902A]/10 text-[#b55800] border-[#FF902A]/30'
            }`}
          >
            {message}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Score</span>
              <span className="text-xl font-black text-[#2E9DF7]">{score}</span>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Best</span>
              <span className="text-xl font-black text-[#FF902A] flex items-center justify-center gap-0.5">
                <Trophy className="w-3.5 h-3.5 text-[#FF902A] inline" />
                {highScore}
              </span>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Clean</span>
              <span className="text-xl font-black text-[#4FCB53]">{goodCaught}</span>
            </div>
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Dirty Hits</span>
              <span className="text-xl font-black text-[#F5402C]">{badCaught}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-1">
            <button
              onClick={onPlayAgain}
              className="flex-1 py-3 px-4 bg-[#2E9DF7] hover:bg-[#1f87dc] active:scale-95 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Play Again</span>
            </button>
            <button
              onClick={onClose}
              className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
