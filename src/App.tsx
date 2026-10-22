import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ScorePanel } from './components/ScorePanel';
import { GameContainer } from './components/GameContainer';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import {
  DropItem,
  FloatingText,
  WINNING_MESSAGES,
  TRY_AGAIN_MESSAGES,
} from './utils/gameData';
import { soundManager } from './utils/audio';

export const App: React.FC = () => {
  // Game states
  const [gameRunning, setGameRunning] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cw_water_drop_highscore');
      return saved ? parseInt(saved, 10) || 0 : 0;
    }
    return 0;
  });

  // Drops & visual effects
  const [drops, setDrops] = useState<DropItem[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [bucketHitEffect, setBucketHitEffect] = useState<'none' | 'good' | 'bad'>('none');

  // Statistics
  const [goodCaught, setGoodCaught] = useState<number>(0);
  const [badCaught, setBadCaught] = useState<number>(0);

  // Modals & messages
  const [gameOverModalOpen, setGameOverModalOpen] = useState<boolean>(false);
  const [rulesModalOpen, setRulesModalOpen] = useState<boolean>(false);
  const [endMessage, setEndMessage] = useState<string>('');
  const [isWinner, setIsWinner] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // References to intervals
  const dropIntervalRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const dropIdCounter = useRef<number>(0);
  const hitTimeoutRef = useRef<number | null>(null);

  // Sound toggle
  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundManager.setMuted(nextMuted);
  };

  // End Game handler
  const handleGameOver = useCallback((finalScore: number) => {
    setGameRunning(false);

    // Clear active drops
    setDrops([]);

    // Clear active intervals
    if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    // Check if won (score >= 20)
    const won = finalScore >= 20;
    setIsWinner(won);

    // Pick random message from appropriate array as required by README
    if (won) {
      const randomWinMsg =
        WINNING_MESSAGES[Math.floor(Math.random() * WINNING_MESSAGES.length)];
      setEndMessage(randomWinMsg);
    } else {
      const randomLoseMsg =
        TRY_AGAIN_MESSAGES[Math.floor(Math.random() * TRY_AGAIN_MESSAGES.length)];
      setEndMessage(randomLoseMsg);
    }

    // Update High Score
    setHighScore((prevHigh) => {
      if (finalScore > prevHigh) {
        localStorage.setItem('cw_water_drop_highscore', finalScore.toString());
        return finalScore;
      }
      return prevHigh;
    });

    // Sound
    soundManager.playGameOver(won);

    // Show modal
    setGameOverModalOpen(true);
  }, []);

  // Spawn a single water drop
  const spawnDrop = useCallback(() => {
    dropIdCounter.current += 1;
    const id = `drop-${dropIdCounter.current}-${Date.now()}`;

    // Random type: 72% good (+1), 28% yellow dirty (-1 penalty)
    const rand = Math.random();
    let type: 'good' | 'bad' = 'good';
    let points = 1;

    if (rand < 0.28) {
      type = 'bad';
      points = -1; // Yellow dirty droplets penalty: -1 score
    }

    // Varying sizes
    const initialSize = 58;
    const sizeMultiplier = Math.random() * 0.4 + 0.85; // 0.85 to 1.25
    const size = Math.round(initialSize * sizeMultiplier);

    // Random X position between 6% and 86%
    const xPercent = Math.random() * 80 + 7;

    // Duration (3.0s to 4.2s)
    const duration = Math.random() * 1.0 + 3.0;

    const newDrop: DropItem = {
      id,
      type,
      xPercent,
      size,
      duration,
      points,
    };

    setDrops((prev) => [...prev, newDrop]);
  }, []);

  // Start Game
  const handleStartGame = useCallback(() => {
    // Reset all game states
    setScore(0);
    setTimeLeft(30);
    setDrops([]);
    setFloatingTexts([]);
    setGoodCaught(0);
    setBadCaught(0);
    setGameOverModalOpen(false);
    setGameRunning(true);
    setBucketHitEffect('none');

    soundManager.playStart();

    // Start 30s Countdown timer
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Start Drop Spawner (new drop every 800ms)
    if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
    dropIntervalRef.current = window.setInterval(() => {
      spawnDrop();
    }, 800);

    // Immediately spawn the first drop
    spawnDrop();
  }, [spawnDrop]);

  // Watch for timeLeft hitting 0 to trigger game over
  useEffect(() => {
    if (gameRunning && timeLeft === 0) {
      handleGameOver(score);
    }
  }, [gameRunning, timeLeft, score, handleGameOver]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (hitTimeoutRef.current) clearTimeout(hitTimeoutRef.current);
    };
  }, []);

  // Trigger temporary bucket hit effect
  const triggerBucketEffect = (type: 'good' | 'bad') => {
    setBucketHitEffect(type);
    if (hitTimeoutRef.current) clearTimeout(hitTimeoutRef.current);
    hitTimeoutRef.current = window.setTimeout(() => {
      setBucketHitEffect('none');
    }, 450);
  };

  // Bucket catch handler (when drop falls into player's bucket)
  const handleBucketCatch = useCallback((drop: DropItem, bucketXPercent: number) => {
    if (!gameRunning) return;

    const delta = drop.points;

    if (drop.type === 'good') {
      soundManager.playBucketCatch();
      setGoodCaught((prev) => prev + 1);
      triggerBucketEffect('good');
    } else if (drop.type === 'bad') {
      soundManager.playBadCatch();
      setBadCaught((prev) => prev + 1);
      triggerBucketEffect('bad');
    }

    setScore((prev) => Math.max(0, prev + delta));

    // Remove caught drop immediately
    setDrops((prev) => prev.filter((d) => d.id !== drop.id));

    // Spawn floating score above bucket
    const textId = `ft-b-${Date.now()}-${Math.random()}`;
    const newText: FloatingText = {
      id: textId,
      xPercent: bucketXPercent,
      yPx: 460, // just above the bucket
      text: delta > 0 ? `+${delta}` : `${delta}`,
      color: delta > 0 ? '#2E9DF7' : '#F5402C',
    };

    setFloatingTexts((prev) => [...prev, newText]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== textId));
    }, 700);
  }, [gameRunning]);

  // Drop click handler (when clicked mid-air)
  const handleDropClicked = (
    drop: DropItem,
    e: React.MouseEvent<HTMLDivElement>
  ) => {
    if (!gameRunning) return;
    e.stopPropagation();

    // Calculate score delta
    const delta = drop.points;
    if (drop.type === 'good') {
      soundManager.playGoodCatch();
      setGoodCaught((prev) => prev + 1);
    } else if (drop.type === 'bad') {
      soundManager.playBadCatch();
      setBadCaught((prev) => prev + 1);
    }

    setScore((prev) => Math.max(0, prev + delta));

    // Remove clicked drop immediately
    setDrops((prev) => prev.filter((d) => d.id !== drop.id));

    // Spawn floating score text
    const rect = e.currentTarget.parentElement?.getBoundingClientRect();
    const containerTop = rect ? rect.top : 0;
    const yPx = Math.max(20, e.clientY - containerTop - 15);

    const textId = `ft-${Date.now()}-${Math.random()}`;
    const newText: FloatingText = {
      id: textId,
      xPercent: drop.xPercent,
      yPx,
      text: delta > 0 ? `+${delta}` : `${delta}`,
      color: delta > 0 ? '#2E9DF7' : '#F5402C',
    };

    setFloatingTexts((prev) => [...prev, newText]);

    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== textId));
    }, 700);
  };

  // Missed drop handler (reached bottom without touching bucket)
  const handleDropMissed = (dropId: string) => {
    setDrops((prev) => prev.filter((d) => d.id !== dropId));
  };

  // Reset Game
  const handleResetGame = () => {
    setGameRunning(false);
    setDrops([]);
    setFloatingTexts([]);
    setBucketHitEffect('none');
    if (dropIntervalRef.current) clearInterval(dropIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    setTimeLeft(30);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f6] flex flex-col items-center justify-between py-6 px-3 sm:px-6 relative">
      <div className="w-full max-w-[800px] flex flex-col items-center gap-4">
        {/* Brand Header */}
        <Header
          highScore={highScore}
          isMuted={isMuted}
          onToggleMute={toggleMute}
          onShowRules={() => setRulesModalOpen(true)}
        />

        {/* Score Panel */}
        <ScorePanel
          score={score}
          timeLeft={timeLeft}
          gameRunning={gameRunning}
          onStartGame={handleStartGame}
          onResetGame={handleResetGame}
        />

        {/* Main Game Container with Interactive Bucket */}
        <GameContainer
          gameRunning={gameRunning}
          score={score}
          drops={drops}
          floatingTexts={floatingTexts}
          onStartGame={handleStartGame}
          onDropClicked={handleDropClicked}
          onDropMissed={handleDropMissed}
          onBucketCatch={handleBucketCatch}
          bucketHitEffect={bucketHitEffect}
        />
      </div>

      {/* Footer with brand info */}
      <footer className="mt-6 text-center text-xs text-gray-500 font-medium">
        <p>
          Inspired by{' '}
          <a
            href="https://www.charitywater.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2E9DF7] hover:underline font-bold"
          >
            charity: water
          </a>{' '}
          • 100% of public donations bring clean water to people in need.
        </p>
      </footer>

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={gameOverModalOpen}
        score={score}
        highScore={highScore}
        isWinner={isWinner}
        message={endMessage}
        goodCaught={goodCaught}
        badCaught={badCaught}
        onPlayAgain={handleStartGame}
        onClose={() => setGameOverModalOpen(false)}
      />

      {/* How to Play / Rules Modal */}
      <RulesModal
        isOpen={rulesModalOpen}
        onClose={() => setRulesModalOpen(false)}
      />
    </div>
  );
};
