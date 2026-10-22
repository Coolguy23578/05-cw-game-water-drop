# charity: water – Water Drop Game (HTML, CSS & JavaScript)

A fast-paced, interactive web game built cleanly with standard **HTML5, CSS3, and modern DOM-based JavaScript**, inspired by **charity: water**'s mission to bring clean and safe drinking water to communities in need.

## 💧 Game Overview

Catch as many clean water drops as you can before the 30-second countdown runs out!

- **Player-Controlled Bucket 🪣**: Steer the water bucket horizontally across the bottom with mouse, touch drag, or Left/Right Arrow keys (<kbd>←</kbd> <kbd>→</kbd> / <kbd>A</kbd> <kbd>D</kbd>) to catch drops!
- **Good Drops (Blue 💧)**: `+1 Point`. Pure clean water collected in your bucket or clicked mid-air.
- **Dirty Droplets (Yellow ⚠️)**: `-1 Point Penalty!` Contaminated runoff water. Dodge them with your bucket!
- **Win Condition**: Reach **20 or more points** within 30 seconds to win and receive celebratory victory messages like *"Congratulations!"*.
- **Try Again**: Scores below 20 display encouraging words to practice and try again.

## 🛠️ Architecture

- **`index.html`**: Semantic markup containing brand header, score panel, game canvas container, and interactive modals.
- **`styles.css`**: charity: water brand styling, keyframe animations, responsive container, and droplet/bucket styles.
- **`script.js`**: Clear, beginner-friendly DOM-based game loop, collision detection, and Web Audio API procedural sound synthesizer.
