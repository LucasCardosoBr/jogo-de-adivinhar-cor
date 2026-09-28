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

export function getSettings() {
  return {
    theme: getTheme(),
    volume: getVolume(),
    sound: isSoundEnabled(),
    animations: getAnimations(),
    highContrast: isHighContrastEnabled(),
    fontSize: getFontSize(),
    defaultMode: getDefaultMode(),
    defaultDifficulty: getDefaultDifficulty()
  };
}

export function saveSettings(settings = {}) {
  const current = getSettings();

  const updated = {
    ...current,
    ...settings
  };

  saveTheme(updated.theme);
  setVolume(updated.volume);
  setSoundEnabled(updated.sound);
  setAnimations(updated.animations);
  setHighContrast(updated.highContrast);
  setFontSize(updated.fontSize);
  setDefaultMode(updated.defaultMode);
  setDefaultDifficulty(
    updated.defaultDifficulty
  );

  applySettings();

  return getSettings();
}

export function resetSettings() {
  saveTheme(DEFAULT_SETTINGS.theme);
  setVolume(DEFAULT_SETTINGS.volume);
  setSoundEnabled(DEFAULT_SETTINGS.sound);
  setAnimations(
    DEFAULT_SETTINGS.animations
  );
  setHighContrast(
    DEFAULT_SETTINGS.highContrast
  );
  setFontSize(
    DEFAULT_SETTINGS.fontSize
  );
  setDefaultMode(
    DEFAULT_SETTINGS.defaultMode
  );
  setDefaultDifficulty(
    DEFAULT_SETTINGS.defaultDifficulty
  );

  applySettings();

  return getSettings();
}

export function applySettings() {
  const settings = getSettings();

  applyTheme(settings.theme);
  applyAnimations(settings.animations);
  applyAccessibility(settings);

  return settings;
}

function applyTheme(theme) {
  const root =
    document.documentElement;

  if (theme === "dark") {
    root.dataset.theme = "dark";
    return;
  }

  if (theme === "light") {
    root.dataset.theme = "light";
    return;
  }

  root.dataset.theme =
    window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches
      ? "dark"
      : "light";
}

function applyAnimations(mode) {
  const root =
    document.documentElement;

  root.dataset.animations = mode;
}

function applyAccessibility(settings) {
  const root =
    document.documentElement;

  root.dataset.contrast =
    settings.highContrast
      ? "high"
      : "normal";

  root.dataset.fontSize =
    settings.fontSize;
}

export function updateSetting(
  name,
  value
) {
  return saveSettings({
    [name]: value
  });
}