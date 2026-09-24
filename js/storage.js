const STORAGE_KEYS = {
  history: "colorGameHistory",
  sound: "colorGameSound",
  stats: "colorGameStats",
  progression: "colorGameProgression",
  achievements: "colorGameAchievements"
};


/* ================================
   STORAGE
================================ */

function get(key, fallback) {
  try {
    const value = localStorage.getItem(key);

    return value === null
      ? fallback
      : JSON.parse(value);
  } catch {
    return fallback;
  }
}

function set(key, value) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

    return value;
  } catch {
    return value;
  }
}


/* ================================
   HISTÓRICO
================================ */

export function getHistory() {
  return get(
    STORAGE_KEYS.history,
    []
  );
}

export function saveHistory(history) {
  return set(
    STORAGE_KEYS.history,
    history
  );
}

export function addHistoryEntry(entry) {
  const history = [
    entry,
    ...getHistory()
  ].slice(0, 10);

  return saveHistory(history);
}

export function resetHistory() {
  return saveHistory([]);
}


/* ================================
   SOM
================================ */

export function isSoundEnabled() {
  return get(
    STORAGE_KEYS.sound,
    true
  );
}

export function setSoundEnabled(enabled) {
  return set(
    STORAGE_KEYS.sound,
    enabled
  );
}


/* ================================
   ESTATÍSTICAS
================================ */

const DEFAULT_STATS = {
  highScore: 0,
  bestStreak: 0,
  games: 0,
  correct: 0,
  attempts: 0,
  totalScore: 0
};

export function getStats() {
  return {
    ...DEFAULT_STATS,
    ...get(
      STORAGE_KEYS.stats,
      {}
    )
  };
}

export function updateStats(stats) {
  const current = getStats();

  return set(
    STORAGE_KEYS.stats,
    {
      ...current,
      ...stats
    }
  );
}

export function resetStats() {
  return set(
    STORAGE_KEYS.stats,
    {
      ...DEFAULT_STATS
    }
  );
}


/* ================================
   PROGRESSÃO
================================ */

const DEFAULT_PROGRESSION = {
  xp: 0
};

export function getProgression() {
  return {
    ...DEFAULT_PROGRESSION,
    ...get(
      STORAGE_KEYS.progression,
      {}
    )
  };
}

export function updateProgression(
  progression
) {
  const current =
    getProgression();

  return set(
    STORAGE_KEYS.progression,
    {
      ...current,
      ...progression
    }
  );
}

export function resetProgression() {
  return set(
    STORAGE_KEYS.progression,
    {
      ...DEFAULT_PROGRESSION
    }
  );
}


/* ================================
   CONQUISTAS
================================ */

export function getUnlockedAchievements() {
  return get(
    STORAGE_KEYS.achievements,
    []
  );
}

export function saveUnlockedAchievements(
  achievements
) {
  return set(
    STORAGE_KEYS.achievements,
    achievements
  );
}

export function unlockAchievement(id) {
  const unlocked =
    getUnlockedAchievements();

  if (!unlocked.includes(id)) {
    unlocked.push(id);
    saveUnlockedAchievements(
      unlocked
    );
  }

  return unlocked;
}

export function resetAchievements() {
  return saveUnlockedAchievements(
    []
  );
}