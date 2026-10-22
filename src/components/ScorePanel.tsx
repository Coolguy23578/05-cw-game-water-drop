import React from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface ScorePanelProps {
  score: number;
  timeLeft: number;
  gameRunning: boolean;
  onStartGame: () => void;
  onResetGame: () => void;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
  score,
  timeLeft,
  gameRunning,
  onStartGame,
  onResetGame,
}) => {
  return (
    <div className="w-full max-w-[800px] flex justify-between items-center px-4 sm:px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-100 transition-all">
      {/* Score */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 font-semibold text-sm sm:text-base uppercase tracking-wider">Score:</span>
        <span
          id="score"
          className="text-2xl sm:text-3xl font-extrabold text-[#2E9DF7] min-w-[2ch] text-left tabular-nums"
        >
          {score}
        </span>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-2">
        <span className="text-gray-500 font-semibold text-sm sm:text-base uppercase tracking-wider">Time:</span>
        <span
          id="time"
          className={`text-2xl sm:text-3xl font-extrabold tabular-nums transition-colors ${
            timeLeft <= 5 && gameRunning ? 'text-[#F5402C] animate-pulse' : 'text-[#131313]'
          }`}
        >
          {timeLeft}
        </span>
        <span className="text-sm font-bold text-gray-500">s</span>
      </div>

      {/* Action Button */}
      <div>
        {!gameRunning ? (
          <button
            id="start-btn"
            onClick={onStartGame}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#4FCB53] hover:bg-[#43b747] active:scale-95 text-white font-bold rounded-lg shadow-sm transition-all cursor-pointer text-base"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start Game</span>
          </button>
        ) : (
          <button
            onClick={onResetGame}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 active:scale-95 text-gray-700 font-semibold rounded-lg text-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
