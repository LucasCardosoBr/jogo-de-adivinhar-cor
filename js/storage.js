const KEYS = {
  sound: "colorGameSound",
  theme: "colorGameTheme",
  stats: "colorGameStats",
  achievements: "colorGameAchievements",
  progression: "colorGameProgression",
  history: "colorGameHistory"
};

const defaultStats = {
  highScore: 0,
  bestStreak: 0,
  games: 0,
  correct: 0,
  attempts: 0,
  totalScore: 0
};

const defaultProgression = {
  xp: 0
};

function get(key, fallback = null) {
  try {
    return (
      localStorage.getItem(key) ??
      fallback
    );
  } catch {
    return fallback;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(
      key,
      value
    );
  } catch {
    // Armazenamento indisponível.
  }
}

/* ================================
   SOM
================================ */

export function isSoundEnabled() {
  return (
    get(
      KEYS.sound,
      "on"
    ) !== "off"
  );
}


export function setSoundEnabled(enabled) {
  set(
    KEYS.sound,
    enabled ? "on" : "off"
  );
}

/* ================================
   TEMA
================================ */

export function getTheme() {
  return get(
    KEYS.theme,
    "light"
  );
}

export function setTheme(theme) {
  set(
    KEYS.theme,
    theme
  );
}

/* ================================
   ESTATÍSTICAS
================================ */

export function getStats() {
  try {
    const saved =
      JSON.parse(
        get(
          KEYS.stats,
          "{}"
        )
      );

    return {
      ...defaultStats,
      ...saved
    };
  } catch {
    return {
      ...defaultStats
    };
  }
}

export function saveStats(stats) {
  set(
    KEYS.stats,
    JSON.stringify(stats)
  );
}

export function updateStats(data) {
  const updated = {
    ...getStats(),
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


/* ================================
   CONQUISTAS
================================ */

export function getAchievements() {
  try {
    const saved =
      JSON.parse(
        get(
          KEYS.achievements,
          "[]"
        )
      );

    return Array.isArray(saved)
      ? saved
      : [];
  } catch {
    return [];
  }
}


export function saveAchievements(
  achievements
) {
  set(
    KEYS.achievements,
    JSON.stringify(
      achievements
    )
  );
}


export function unlockAchievement(id) {
  const achievements =
    getAchievements();

  if (
    achievements.includes(id)
  ) {
    return false;
  }

  achievements.push(id);

  saveAchievements(
    achievements
  );

  return true;
}


export function isAchievementUnlocked(
  id
) {
  return getAchievements()
    .includes(id);
}


export function resetAchievements() {
  saveAchievements([]);
}


/* ================================
   PROGRESSÃO
================================ */

export function getProgression() {
  try {
    const saved =
      JSON.parse(
        get(
          KEYS.progression,
          "{}"
        )
      );

    return {
      ...defaultProgression,
      ...saved
    };
  } catch {
    return {
      ...defaultProgression
    };
  }
}


export function saveProgression(
  progression
) {
  set(
    KEYS.progression,
    JSON.stringify(
      progression
    )
  );
}


export function updateProgression(
  data
) {
  const updated = {
    ...getProgression(),
    ...data
  };

  saveProgression(
    updated
  );

  return updated;
}


export function resetProgression() {
  saveProgression({
    ...defaultProgression
  });
}

/* ================================
   HISTÓRICO
================================ */

export function getHistory() {
  try {
    const saved =
      JSON.parse(
        get(
          KEYS.history,
          "[]"
        )
      );

    return Array.isArray(saved)
      ? saved
      : [];
  } catch {
    return [];
  }
}


export function saveHistory(history) {
  set(
    KEYS.history,
    JSON.stringify(history)
  );
}


export function addHistoryEntry(entry) {
  const history =
    getHistory();

  history.unshift(entry);

  const limited =
    history.slice(0, 10);

  saveHistory(limited);

  return limited;
}


export function resetHistory() {
  saveHistory([]);
}