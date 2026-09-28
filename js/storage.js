const STORAGE_KEYS = {
  history: "colorGameHistory",
  sound: "colorGameSound",
  stats: "colorGameStats",
  progression: "colorGameProgression",
  achievements: "colorGameAchievements",
  theme: "colorGameTheme",
  volume: "colorGameVolume",
  animations: "colorGameAnimations",
  highContrast: "colorGameHighContrast",
  fontSize: "colorGameFontSize",
  defaultMode: "colorGameDefaultMode",
  defaultDifficulty: "colorGameDefaultDifficulty"
};

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

/* =========================
   HISTÓRICO
========================= */

export function getHistory() {
  return get(STORAGE_KEYS.history, []);
}

export function saveHistory(history) {
  return set(STORAGE_KEYS.history, history);
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

/* =========================
   SOM
========================= */

export function isSoundEnabled() {
  return get(STORAGE_KEYS.sound, true);
}

export function setSoundEnabled(enabled) {
  return set(STORAGE_KEYS.sound, Boolean(enabled));
}

/* =========================
   TEMA
========================= */

export function getTheme() {
  return get(STORAGE_KEYS.theme, "light");
}

export function setTheme(theme) {
  return set(STORAGE_KEYS.theme, theme);
}

/* =========================
   VOLUME
========================= */

export function getVolume() {
  const volume = Number(
    get(STORAGE_KEYS.volume, 100)
  );

  return Math.min(
    100,
    Math.max(0, volume)
  );
}

export function setVolume(volume) {
  const value = Math.min(
    100,
    Math.max(0, Number(volume) || 0)
  );

  return set(
    STORAGE_KEYS.volume,
    value
  );
}

/* =========================
   ANIMAÇÕES
========================= */

export function getAnimations() {
  return get(
    STORAGE_KEYS.animations,
    "full"
  );
}

export function setAnimations(animations) {
  const valid = [
    "full",
    "reduced",
    "off"
  ];

  const value = valid.includes(animations)
    ? animations
    : "full";

  return set(
    STORAGE_KEYS.animations,
    value
  );
}

/* =========================
   ALTO CONTRASTE
========================= */

export function isHighContrastEnabled() {
  return get(
    STORAGE_KEYS.highContrast,
    false
  );
}

export function setHighContrast(enabled) {
  return set(
    STORAGE_KEYS.highContrast,
    Boolean(enabled)
  );
}

/* =========================
   TAMANHO DA FONTE
========================= */

export function getFontSize() {
  const valid = [
    "normal",
    "large",
    "very-large"
  ];

  const value = get(
    STORAGE_KEYS.fontSize,
    "normal"
  );

  return valid.includes(value)
    ? value
    : "normal";
}

export function setFontSize(fontSize) {
  const valid = [
    "normal",
    "large",
    "very-large"
  ];

  const value = valid.includes(fontSize)
    ? fontSize
    : "normal";

  return set(
    STORAGE_KEYS.fontSize,
    value
  );
}

/* =========================
   MODO PADRÃO
========================= */

export function getDefaultMode() {
  const valid = [
    "match",
    "speed",
    "sequence"
  ];

  const value = get(
    STORAGE_KEYS.defaultMode,
    "match"
  );

  return valid.includes(value)
    ? value
    : "match";
}

export function setDefaultMode(mode) {
  const valid = [
    "match",
    "speed",
    "sequence"
  ];

  const value = valid.includes(mode)
    ? mode
    : "match";

  return set(
    STORAGE_KEYS.defaultMode,
    value
  );
}

/* =========================
   DIFICULDADE PADRÃO
========================= */

export function getDefaultDifficulty() {
  const valid = [
    "easy",
    "medium",
    "hard"
  ];

  const value = get(
    STORAGE_KEYS.defaultDifficulty,
    "easy"
  );

  return valid.includes(value)
    ? value
    : "easy";
}

export function setDefaultDifficulty(
  difficulty
) {
  const valid = [
    "easy",
    "medium",
    "hard"
  ];

  const value = valid.includes(difficulty)
    ? difficulty
    : "easy";

  return set(
    STORAGE_KEYS.defaultDifficulty,
    value
  );
}

/* =========================
   ESTATÍSTICAS
========================= */

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
    ...get(STORAGE_KEYS.stats, {})
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

/* =========================
   PROGRESSÃO
========================= */

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
  const current = getProgression();

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

/* =========================
   CONQUISTAS
========================= */

export function getAchievements() {
  return get(
    STORAGE_KEYS.achievements,
    []
  );
}

export function getUnlockedAchievements() {
  return getAchievements();
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

    return true;
  }

  return false;
}

export function resetAchievements() {
  return saveUnlockedAchievements([]);
}