export interface DropItem {
  id: string;
  type: 'good' | 'bad';
  xPercent: number; // 5% to 90%
  size: number; // in px
  duration: number; // in seconds
  points: number;
}

export interface FloatingText {
  id: string;
  xPercent: number;
  yPx: number;
  text: string;
  color: string;
}

export const WINNING_MESSAGES: string[] = [
  "Incredible work! You caught enough clean water to change lives. Every drop counts!",
  "Water Champion! You dodged the yellow dirty droplets and collected safe water!",
  "Amazing job! You filled the clean water bucket and brought hope to communities in need!",
  "Outstanding effort! Clean water means better health, education, and opportunity for all!",
  "Congratulations!"
];

export const TRY_AGAIN_MESSAGES: string[] = [
  "Watch out for the yellow dirty drops! Each one costs -1 point. Move the bucket to dodge them!",
  "Almost there! Steer your bucket away from yellow contaminated drops and catch the clean blue water!",
  "Every drop matters! Grab your bucket, stay alert, and don't let yellow dirty water in!",
  "Good effort! With quick reflexes and focus, you'll easily reach the 20-point target!",
  "So close! Keep your bucket clean and pure to bring safe water to communities worldwide. Try again!"
];

export const WATER_FACTS: string[] = [
  "703 million people live without clean water. That’s 1 in 10 people worldwide.",
  "Contaminated water spreads diseases like cholera, dysentery, and typhoid. Clean water saves lives.",
  "Access to clean water means women and girls save up to 200 million hours every day that they currently spend walking for water.",
  "charity: water proves every single project with GPS coordinates and photos.",
  "100% of public donations fund clean water projects—private donors cover all operating costs."
];

export const BRAND_COLORS = {
  yellow: '#FFC907',
  blue: '#2E9DF7',
  lightBlue: '#8BD1CB',
  green: '#4FCB53',
  orange: '#FF902A',
  red: '#F5402C',
  darkGreen: '#159A48',
  pink: '#F16061',
  darkText: '#131313',
  dirtyYellow: '#E6A700',
};
