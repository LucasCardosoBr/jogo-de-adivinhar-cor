const STORAGE_KEY = "colorGuessStats";
const THEME_KEY = "colorGuessTheme";

const defaultStats = {
  highScore: 0,
  bestStreak: 0,
  totalGames: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  soundEnabled: true
};

export function loadStats() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(STORAGE_KEY)
    );

    return {
      ...defaultStats,
      ...saved
    };
  } catch {
    return { ...defaultStats };
  }
}

export function saveStats(stats) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(stats)
  );
}

export function resetStats() {
  localStorage.removeItem(STORAGE_KEY);
}

export function loadTheme() {
  return (
    localStorage.getItem(THEME_KEY) ||
    "light"
  );
}

export function saveTheme(theme) {
  localStorage.setItem(
    THEME_KEY,
    theme
  );
}