import React from 'react';
import { X, Heart } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="bg-[#FFC907] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/img/water-can-transparent.png" alt="Jerry Can" className="w-6 h-6 object-contain" />
            <h3 className="font-extrabold text-lg text-[#131313]">How to Play</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-black/70 hover:text-black hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm text-gray-700">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#FFC907] text-[#131313] flex items-center justify-center shrink-0 text-xs font-black mt-0.5">
                🪣
              </div>
              <div>
                <strong className="text-[#131313] block">Move Your Bucket</strong>
                Slide your mouse, drag with touch, or press <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs font-mono">←</kbd> <kbd className="px-1 py-0.5 bg-gray-100 border rounded text-xs font-mono">→</kbd> keys to steer the clean water bucket across the bottom.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#2E9DF7] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                💧
              </div>
              <div>
                <strong className="text-[#131313] block">Catch Good Drops (+1 Pt)</strong>
                Catch falling blue drops in your bucket (or click them mid-air).
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#E5A700] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                ⚠️
              </div>
              <div>
                <strong className="text-[#996500] block">Avoid Yellow Dirty Drops (-1 Pt)</strong>
                Yellow drops represent contaminated runoff water. If one lands in your bucket or is clicked, you lose <strong>1 point (-1)</strong>!
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#4FCB53] text-white flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                🏆
              </div>
              <div>
                <strong className="text-[#131313] block">Target: 20 Points in 30 Seconds</strong>
                Score 20 or higher to win and support the clean water mission!
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#e6f7ff] rounded-xl border border-[#2E9DF7]/30 text-xs text-gray-800 flex items-start gap-2">
            <Heart className="w-4 h-4 text-[#2E9DF7] shrink-0 mt-0.5" />
            <p>
              <strong>charity: water</strong> brings clean and safe drinking water to people in developing countries. 100% of public donations directly fund water projects!
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#131313] hover:bg-gray-800 text-white font-bold rounded-xl transition-all cursor-pointer text-center"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
