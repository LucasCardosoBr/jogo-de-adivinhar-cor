const KEYS = {
  sound: "colorGameSound",
  theme: "colorGameTheme",
  stats: "colorGameStats"
};

function get(key, fallback = null) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Armazenamento indisponível.
  }
}

export function isSoundEnabled() {
  return get(KEYS.sound, "on") !== "off";
}

export function setSoundEnabled(enabled) {
  set(KEYS.sound, enabled ? "on" : "off");
}

export function getTheme() {
  return get(KEYS.theme, "light");
}

export function setTheme(theme) {
  set(KEYS.theme, theme);
}

const defaultStats = {
  highScore: 0,
  bestStreak: 0,
  games: 0,
  correct: 0,
  attempts: 0
};

export function getStats() {
  try {
    const saved = JSON.parse(
      get(KEYS.stats, "{}")
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
  set(
    KEYS.stats,
    JSON.stringify(stats)
  );
}

export function updateStats(data) {
  const stats = getStats();

  const updated = {
    ...stats,
    ...data
  };

  saveStats(updated);

  return updated;
}

export function resetStats() {
  saveStats({
    ...defaultStats
  });
}

export function getGameSettings() {
  return {
    sound: isSoundEnabled(),
    theme: getTheme()
  };
}