// ==========================================================================
// charity: water – Water Drop Game (Vanilla JavaScript)
// ==========================================================================

// --- State Variables ---
let gameRunning = false;
let score = 0;
let timeLeft = 30;
let highScore = 0;
let goodCaught = 0;
let badCaught = 0;
let bucketXPercent = 50; // Horizontal center percentage of the bucket (8% - 92%)
let dropMaker = null;
let timerInterval = null;
let collisionFrameId = null;
let isMuted = false;
let dropIdCounter = 0;

// Load high score from localStorage if available
try {
  const saved = localStorage.getItem('cw_water_drop_highscore');
  if (saved) highScore = parseInt(saved, 10) || 0;
} catch {
  highScore = 0;
}

// --- Winning and Try-Again Messages ---
const WINNING_MESSAGES = [
  "Congratulations!",
  "Incredible work! You caught enough clean water to change lives. Every drop counts!",
  "Water Champion! You dodged the yellow dirty droplets and collected safe water!",
  "Amazing job! You filled the clean water bucket and brought hope to communities in need!",
  "Outstanding effort! Clean water means better health, education, and opportunity for all!"
];

const TRY_AGAIN_MESSAGES = [
  "Watch out for the yellow dirty drops! Each one costs -1 point. Move the bucket to dodge them!",
  "Almost there! Steer your bucket away from yellow contaminated drops and catch the clean blue water!",
  "Every drop matters! Grab your bucket, stay alert, and don't let yellow dirty water in!",
  "Good effort! With quick reflexes and focus, you'll easily reach the 20-point target!",
  "So close! Keep your bucket clean and pure to bring safe water to communities worldwide. Try again!"
];

// --- DOM Elements ---
const gameContainer = document.getElementById("game-container");
const playerBucket = document.getElementById("player-bucket");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const highScoreEl = document.getElementById("high-score");
const startBtn = document.getElementById("start-btn");
const overlayStartBtn = document.getElementById("overlay-start-btn");
const startOverlay = document.getElementById("start-overlay");
const btnContainer = document.getElementById("btn-container");
const muteBtn = document.getElementById("mute-btn");
const rulesBtn = document.getElementById("rules-btn");

// Modals
const gameOverModal = document.getElementById("game-over-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const modalDismissBtn = document.getElementById("modal-dismiss-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const modalRibbon = document.getElementById("modal-ribbon");
const modalEmoji = document.getElementById("modal-emoji");
const modalHeading = document.getElementById("modal-heading");
const modalSub = document.getElementById("modal-sub");
const modalMessageBox = document.getElementById("modal-message-box");
const finalScoreEl = document.getElementById("final-score");
const modalHighScoreEl = document.getElementById("modal-high-score");
const modalCleanDropsEl = document.getElementById("modal-clean-drops");
const modalDirtyDropsEl = document.getElementById("modal-dirty-drops");

const rulesModal = document.getElementById("rules-modal");
const closeRulesBtn = document.getElementById("close-rules-btn");
const rulesGotItBtn = document.getElementById("rules-got-it-btn");

// Update initial high score display
highScoreEl.textContent = highScore.toString();

// ==========================================================================
// Web Audio API Sound Synthesizer (Instant, Responsive, Zero Dependencies)
// ==========================================================================
class SoundManager {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playGoodCatch() {
    if (isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(1150, now + 0.12);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Audio autoplay policy
    }
  }

  playBucketCatch() {
    if (isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.16);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // Ignored
    }
  }

  playBadCatch() {
    if (isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignored
    }
  }

  playStart() {
    if (isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [440, 554, 659].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.2, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.14);
      });
    } catch {
      // Ignored
    }
  }

  playGameOver(won) {
    if (isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = won ? [440, 554, 659, 880] : [440, 392, 349, 293];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = won ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.11);
        gain.gain.setValueAtTime(0.22, now + idx * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.11);
        osc.stop(now + idx * 0.11 + 0.3);
      });
    } catch {
      // Ignored
    }
  }
}

const sounds = new SoundManager();

// ==========================================================================
// Bucket Movement & Position Control
// ==========================================================================
function setBucketPosition(percent) {
  // Clamp bucket position between 8% and 92% of container width
  bucketXPercent = Math.max(8, Math.min(92, percent));
  playerBucket.style.left = `calc(${bucketXPercent}% - 52px)`;
}

// Mouse and Touch Pointer tracking
function updateBucketFromPointer(e) {
  if (!gameRunning) return;
  const rect = gameContainer.getBoundingClientRect();
  const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
  if (clientX === null) return;
  const relativeX = clientX - rect.left;
  const percent = (relativeX / rect.width) * 100;
  setBucketPosition(percent);
}

gameContainer.addEventListener("mousemove", updateBucketFromPointer);
gameContainer.addEventListener("touchmove", (e) => {
  e.preventDefault();
  updateBucketFromPointer(e);
}, { passive: false });

// Keyboard controls (Arrow keys or A / D)
window.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
    setBucketPosition(bucketXPercent - 5);
  } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
    setBucketPosition(bucketXPercent + 5);
  }
});

// ==========================================================================
// Drop Spawner & Animation
// ==========================================================================
function createDrop() {
  if (!gameRunning) return;

  dropIdCounter += 1;
  const drop = document.createElement("div");
  drop.className = "water-drop";
  drop.id = `drop-${dropIdCounter}`;

  // 72% chance of Good Blue Drop (+1), 28% chance of Yellow Dirty Drop (-1)
  const isDirty = Math.random() < 0.28;
  const points = isDirty ? -1 : 1;
  drop.dataset.points = points.toString();
  drop.dataset.type = isDirty ? "bad" : "good";

  // Drop size variety
  const initialSize = 58;
  const sizeMultiplier = Math.random() * 0.4 + 0.85; // 0.85 to 1.25
  const size = Math.round(initialSize * sizeMultiplier);
  drop.style.width = `${size}px`;
  drop.style.height = `${size}px`;

  // Random horizontal position across container width
  const gameWidth = gameContainer.offsetWidth;
  const xPosition = Math.random() * (gameWidth - size - 24) + 12;
  drop.style.left = `${xPosition}px`;

  // Fall duration (3.0s to 4.2s)
  const duration = Math.random() * 1.0 + 3.0;
  drop.style.animationDuration = `${duration}s`;

  if (isDirty) {
    drop.classList.add("bad-drop");
    drop.innerHTML = `
      <svg viewBox="0 0 100 100">
        <defs>
          <linearGradient id="yd-grad-${drop.id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE169" />
            <stop offset="35%" stop-color="#E5A700" />
            <stop offset="70%" stop-color="#B87B00" />
            <stop offset="100%" stop-color="#805300" />
          </linearGradient>
        </defs>
        <path d="M 50,5 C 50,5 92,55 92,72 C 92,90 73,95 50,95 C 27,95 8,90 8,72 C 8,55 50,5 50,5 Z"
              fill="url(#yd-grad-${drop.id})" stroke="#5E3D00" stroke-width="2" />
        <ellipse cx="34" cy="60" rx="8" ry="13" fill="#FFF2B2" opacity="0.4" transform="rotate(-25 34 60)" />
        <circle cx="42" cy="74" r="3" fill="#422900" />
        <circle cx="62" cy="68" r="3.5" fill="#422900" />
        <circle cx="50" cy="83" r="2.5" fill="#382200" />
        <line x1="40" y1="58" x2="60" y2="78" stroke="#4A2E00" stroke-width="5" stroke-linecap="round" />
        <line x1="60" y1="58" x2="40" y2="78" stroke="#4A2E00" stroke-width="5" stroke-linecap="round" />
        <line x1="40" y1="58" x2="60" y2="78" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" />
        <line x1="60" y1="58" x2="40" y2="78" stroke="#FFF" stroke-width="2.5" stroke-linecap="round" />
      </svg>
      <span class="drop-badge">-1</span>
    `;
  } else {
    drop.classList.add("good-drop");
    drop.innerHTML = `
      <svg viewBox="0 0 100 100">
        <defs>
          <linearGradient id="bg-grad-${drop.id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#70c8ff" />
            <stop offset="45%" stop-color="#2E9DF7" />
            <stop offset="100%" stop-color="#006ec4" />
          </linearGradient>
        </defs>
        <path d="M 50,5 C 50,5 92,55 92,72 C 92,90 73,95 50,95 C 27,95 8,90 8,72 C 8,55 50,5 50,5 Z"
              fill="url(#bg-grad-${drop.id})" />
        <ellipse cx="36" cy="62" rx="10" ry="16" fill="white" opacity="0.45" transform="rotate(-25 36 62)" />
        <circle cx="38" cy="46" r="4" fill="white" opacity="0.6" />
      </svg>
    `;
  }

  // Allow clicking drop mid-air
  drop.addEventListener("click", (e) => {
    e.stopPropagation();
    handleDropInteraction(drop, e.clientX, e.clientY);
  });

  // Remove drop cleanly when it finishes falling
  drop.addEventListener("animationend", () => {
    drop.remove();
  });

  gameContainer.appendChild(drop);
}

// Trigger bucket reaction (bounce or shake)
function triggerBucketReaction(type) {
  playerBucket.classList.remove("bounce", "shake");
  void playerBucket.offsetWidth; // Force reflow
  if (type === "good") {
    playerBucket.classList.add("bounce");
  } else {
    playerBucket.classList.add("shake");
  }
}

// Floating Score indicator (+1 or -1)
function spawnFloatingScore(text, xPx, yPx, isPositive) {
  const floatEl = document.createElement("div");
  floatEl.className = `floating-score ${isPositive ? 'score-plus' : 'score-minus'}`;
  floatEl.textContent = text;
  floatEl.style.left = `${xPx}px`;
  floatEl.style.top = `${yPx}px`;

  gameContainer.appendChild(floatEl);

  floatEl.addEventListener("animationend", () => {
    floatEl.remove();
  });
}

// Process drop caught (either by click or by landing in the bucket)
function handleDropInteraction(drop, clientX, clientY) {
  if (!gameRunning || !drop.parentNode) return;

  const points = parseInt(drop.dataset.points, 10);
  const isDirty = drop.dataset.type === "bad";

  if (isDirty) {
    badCaught += 1;
    sounds.playBadCatch();
    triggerBucketReaction("bad");
  } else {
    goodCaught += 1;
    sounds.playBucketCatch();
    triggerBucketReaction("good");
  }

  // Update score (clamped to 0 minimum)
  score = Math.max(0, score + points);
  scoreEl.textContent = score.toString();

  // Floating text coordinates
  const containerRect = gameContainer.getBoundingClientRect();
  const x = clientX ? clientX - containerRect.left - 15 : parseFloat(drop.style.left) + 10;
  const y = clientY ? clientY - containerRect.top - 20 : parseFloat(drop.offsetTop) || 450;

  spawnFloatingScore(points > 0 ? `+${points}` : `${points}`, x, y, points > 0);

  // Remove drop from screen
  drop.remove();
}

// ==========================================================================
// Frame-by-Frame Bucket Collision Loop
// ==========================================================================
function checkBucketCollisions() {
  if (!gameRunning) return;

  const bucketRect = playerBucket.getBoundingClientRect();
  const drops = document.querySelectorAll(".water-drop");

  drops.forEach((drop) => {
    const dropRect = drop.getBoundingClientRect();
    const dropCenterX = dropRect.left + dropRect.width / 2;
    const dropBottom = dropRect.bottom;

    // Rim collision test
    if (
      dropBottom >= bucketRect.top &&
      dropBottom <= bucketRect.top + 36 &&
      dropCenterX >= bucketRect.left - 4 &&
      dropCenterX <= bucketRect.right + 4
    ) {
      handleDropInteraction(drop, dropCenterX, bucketRect.top);
    }
  });

  collisionFrameId = requestAnimationFrame(checkBucketCollisions);
}

// ==========================================================================
// Start, Reset, and End Game
// ==========================================================================
function startGame() {
  if (gameRunning) return;

  gameRunning = true;
  score = 0;
  timeLeft = 30;
  goodCaught = 0;
  badCaught = 0;

  scoreEl.textContent = "0";
  timeEl.textContent = "30";
  timeEl.classList.remove("urgent");

  // Hide start overlay
  startOverlay.style.display = "none";

  // Change Start button to Reset button in score panel
  btnContainer.innerHTML = '<button id="reset-btn">🔄 Reset</button>';
  document.getElementById("reset-btn").addEventListener("click", resetGame);

  // Clear existing drops
  document.querySelectorAll(".water-drop").forEach((d) => d.remove());

  // Center bucket
  setBucketPosition(50);

  // Play start chime
  sounds.playStart();

  // Drop spawner interval (every 800ms)
  if (dropMaker) clearInterval(dropMaker);
  dropMaker = setInterval(createDrop, 800);

  // Start 30-second timer countdown
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = timeLeft.toString();

    if (timeLeft <= 5) {
      timeEl.classList.add("urgent");
    }

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  // Start collision loop
  if (collisionFrameId) cancelAnimationFrame(collisionFrameId);
  collisionFrameId = requestAnimationFrame(checkBucketCollisions);

  // Spawn first drop immediately
  createDrop();
}

function resetGame() {
  gameRunning = false;
  if (dropMaker) clearInterval(dropMaker);
  if (timerInterval) clearInterval(timerInterval);
  if (collisionFrameId) cancelAnimationFrame(collisionFrameId);

  document.querySelectorAll(".water-drop").forEach((d) => d.remove());
  document.querySelectorAll(".floating-score").forEach((f) => f.remove());

  score = 0;
  timeLeft = 30;
  scoreEl.textContent = "0";
  timeEl.textContent = "30";
  timeEl.classList.remove("urgent");

  // Restore start button & overlay
  btnContainer.innerHTML = '<button id="start-btn">▶ Start Game</button>';
  document.getElementById("start-btn").addEventListener("click", startGame);
  startOverlay.style.display = "flex";
}

function endGame() {
  gameRunning = false;
  if (dropMaker) clearInterval(dropMaker);
  if (timerInterval) clearInterval(timerInterval);
  if (collisionFrameId) cancelAnimationFrame(collisionFrameId);

  document.querySelectorAll(".water-drop").forEach((d) => d.remove());

  const won = score >= 20;

  // Update High Score
  if (score > highScore) {
    highScore = score;
    highScoreEl.textContent = highScore.toString();
    try {
      localStorage.setItem("cw_water_drop_highscore", highScore.toString());
    } catch {
      // Ignored
    }
  }

  // Setup modal content
  finalScoreEl.textContent = score.toString();
  modalHighScoreEl.textContent = highScore.toString();
  modalCleanDropsEl.textContent = goodCaught.toString();
  modalDirtyDropsEl.textContent = badCaught.toString();

  if (won) {
    modalRibbon.className = "modal-ribbon ribbon-win";
    modalEmoji.textContent = "🎉";
    modalHeading.textContent = "Victory! You Did It!";
    modalSub.textContent = "Target Reached (20+ Drops)";
    modalMessageBox.className = "modal-message-box msg-win";
    const randomWin = WINNING_MESSAGES[Math.floor(Math.random() * WINNING_MESSAGES.length)];
    modalMessageBox.textContent = randomWin;
  } else {
    modalRibbon.className = "modal-ribbon ribbon-lose";
    modalEmoji.textContent = "💧";
    modalHeading.textContent = "Time’s Up!";
    modalSub.textContent = "Goal was 20 drops";
    modalMessageBox.className = "modal-message-box msg-lose";
    const randomLose = TRY_AGAIN_MESSAGES[Math.floor(Math.random() * TRY_AGAIN_MESSAGES.length)];
    modalMessageBox.textContent = randomLose;
  }

  // Restore score panel button
  btnContainer.innerHTML = '<button id="start-btn">▶ Start Game</button>';
  document.getElementById("start-btn").addEventListener("click", startGame);

  // Play game over sound
  sounds.playGameOver(won);

  // Show modal
  gameOverModal.classList.add("active");
}

// ==========================================================================
// Event Listeners (Buttons, Modals, Sound Toggle)
// ==========================================================================
startBtn.addEventListener("click", startGame);
overlayStartBtn.addEventListener("click", startGame);

playAgainBtn.addEventListener("click", () => {
  gameOverModal.classList.remove("active");
  startGame();
});

closeModalBtn.addEventListener("click", () => {
  gameOverModal.classList.remove("active");
  startOverlay.style.display = "flex";
});

modalDismissBtn.addEventListener("click", () => {
  gameOverModal.classList.remove("active");
  startOverlay.style.display = "flex";
});

// Rules Modal
rulesBtn.addEventListener("click", () => {
  rulesModal.classList.add("active");
});

closeRulesBtn.addEventListener("click", () => {
  rulesModal.classList.remove("active");
});

rulesGotItBtn.addEventListener("click", () => {
  rulesModal.classList.remove("active");
});

// Sound Toggle
muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  muteBtn.textContent = isMuted ? "🔇" : "🔊";
});
