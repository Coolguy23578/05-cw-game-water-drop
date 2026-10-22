# charity: water – Water Drop Game (React)

A fast-paced, interactive web game built in React + TypeScript + Vite with Tailwind CSS, inspired by **charity: water**'s mission to bring clean and safe drinking water to every person on the planet.

## 💧 Game Overview

Catch as many clean water drops as you can before the 30-second timer runs out! 

- **Player-Controlled Bucket 🪣**: Steer the water bucket horizontally across the bottom with mouse, touch drag, or Left/Right Arrow keys (<kbd>←</kbd> <kbd>→</kbd> / <kbd>A</kbd> <kbd>D</kbd>) to catch drops!
- **Good Drops (Blue 💧)**: +1 Point. Pure clean water caught in your bucket or clicked mid-air.
- **Dirty Droplets (Yellow ⚠️)**: **-1 Point Penalty!** Contaminated runoff water. Dodge them with your bucket!
- **Win Condition**: Reach **20 or more points** within 30 seconds to win and celebrate with confetti!
- **Try Again**: Scores below 20 display encouraging words to try again.

## 🛠️ Tech Stack & Features

- **React 19 & TypeScript**: Component-driven architecture with clean hook-based state management (`useState`, `useEffect`, `useCallback`, `useRef`).
- **Tailwind CSS v4**: Fluid typography, responsive layouts, and smooth animations.
- **Synthesized Audio (Web Audio API)**: Zero external audio file dependencies; uses procedural waveforms for instant, responsive sound effects with mute toggle.
- **Confetti Celebration**: Confetti bursts upon reaching the 20-point target.
- **charity: water Brand Alignment**:
  - Primary colors: Yellow (`#FFC907`), Blue (`#2E9DF7`)
  - Secondary colors: Light Blue (`#8BD1CB`), Green (`#4FCB53`), Orange (`#FF902A`), Red (`#F5402C`)
  - Official brand logos and jerry can iconography
  - Dynamic reservoir gauge showing progress toward the 20-drop goal
  - Randomly selected winning/losing messages and charity: water impact facts
  - High score tracking via `localStorage`

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start the development server (runs on port 3000)
npm run dev

# Build for production
npm run build
```
