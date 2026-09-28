import {
  getTheme,
  setTheme as saveTheme,
  getVolume,
  setVolume,
  isSoundEnabled,
  setSoundEnabled,
  getAnimations,
  setAnimations,
  isHighContrastEnabled,
  setHighContrast,
  getFontSize,
  setFontSize,
  getDefaultMode,
  setDefaultMode,
  getDefaultDifficulty,
  setDefaultDifficulty
} from "../storage.js";

const DEFAULT_SETTINGS = {
  theme: "light",
  volume: 100,
  sound: true,
  animations: "full",
  highContrast: false,
  fontSize: "normal",
  defaultMode: "match",
  defaultDifficulty: "easy"
};

const VALID_THEMES = ["light", "dark", "auto"];
const VALID_ANIMATIONS = ["full", "reduced", "none"];
const VALID_FONT_SIZES = ["normal", "large", "xlarge"];
const VALID_MODES = ["match", "speed", "sequence"];
const VALID_DIFFICULTIES = ["easy", "medium", "hard"];

export function getSettings() {
  return {
    theme: normalizeValue(getTheme(), VALID_THEMES, DEFAULT_SETTINGS.theme),
    volume: normalizeVolume(getVolume()),
    sound: Boolean(isSoundEnabled()),
    animations: normalizeValue(
      getAnimations(),
      VALID_ANIMATIONS,
      DEFAULT_SETTINGS.animations
    ),
    highContrast: Boolean(isHighContrastEnabled()),
    fontSize: normalizeValue(
      getFontSize(),
      VALID_FONT_SIZES,
      DEFAULT_SETTINGS.fontSize
    ),
    defaultMode: normalizeValue(
      getDefaultMode(),
      VALID_MODES,
      DEFAULT_SETTINGS.defaultMode
    ),
    defaultDifficulty: normalizeValue(
      getDefaultDifficulty(),
      VALID_DIFFICULTIES,
      DEFAULT_SETTINGS.defaultDifficulty
    )
  };
}

export function saveSettings(settings = {}) {
  const current = getSettings();

  const updated = {
    ...current,
    ...settings
  };

  const normalized = normalizeSettings(updated);

  saveTheme(normalized.theme);
  setVolume(normalized.volume);
  setSoundEnabled(normalized.sound);
  setAnimations(normalized.animations);
  setHighContrast(normalized.highContrast);
  setFontSize(normalized.fontSize);
  setDefaultMode(normalized.defaultMode);
  setDefaultDifficulty(normalized.defaultDifficulty);

  applySettings();

  return getSettings();
}

export function resetSettings() {
  return saveSettings(DEFAULT_SETTINGS);
}

export function applySettings() {
  const settings = getSettings();

  applyTheme(settings.theme);
  applyAnimations(settings.animations);
  applyAccessibility(settings);

  return settings;
}

function applyTheme(theme) {
  const root = document.documentElement;

  if (theme === "dark") {
    root.dataset.theme = "dark";
    return;
  }

  if (theme === "light") {
    root.dataset.theme = "light";
    return;
  }

  applySystemTheme();
}

function applySystemTheme() {
  const root = document.documentElement;

  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  root.dataset.theme = prefersDark ? "dark" : "light";
}

function applyAnimations(mode) {
  const root = document.documentElement;

  root.dataset.animations = mode;
}

function applyAccessibility(settings) {
  const root = document.documentElement;

  root.dataset.contrast = settings.highContrast
    ? "high"
    : "normal";

  root.dataset.fontSize = settings.fontSize;
}

function normalizeSettings(settings) {
  return {
    theme: normalizeValue(
      settings.theme,
      VALID_THEMES,
      DEFAULT_SETTINGS.theme
    ),

    volume: normalizeVolume(settings.volume),

    sound: Boolean(settings.sound),

    animations: normalizeValue(
      settings.animations,
      VALID_ANIMATIONS,
      DEFAULT_SETTINGS.animations
    ),

    highContrast: Boolean(settings.highContrast),

    fontSize: normalizeValue(
      settings.fontSize,
      VALID_FONT_SIZES,
      DEFAULT_SETTINGS.fontSize
    ),

    defaultMode: normalizeValue(
      settings.defaultMode,
      VALID_MODES,
      DEFAULT_SETTINGS.defaultMode
    ),

    defaultDifficulty: normalizeValue(
      settings.defaultDifficulty,
      VALID_DIFFICULTIES,
      DEFAULT_SETTINGS.defaultDifficulty
    )
  };
}

function normalizeValue(value, validValues, fallback) {
  return validValues.includes(value) ? value : fallback;
}

function normalizeVolume(value) {
  const volume = Number(value);

  if (!Number.isFinite(volume)) {
    return DEFAULT_SETTINGS.volume;
  }

  return Math.min(100, Math.max(0, volume));
}

export function updateSetting(name, value) {
  return saveSettings({
    [name]: value
  });
}

export function getDefaultSettings() {
  return { ...DEFAULT_SETTINGS };
}

export function initializeSettings() {
  applySettings();

  const mediaQuery = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );

  const handleSystemThemeChange = () => {
    if (getSettings().theme === "auto") {
      applySystemTheme();
    }
  };

  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener(
      "change",
      handleSystemThemeChange
    );
  } else {
    mediaQuery.addListener(handleSystemThemeChange);
  }

  return getSettings();
}