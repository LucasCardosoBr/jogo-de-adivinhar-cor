import {
  getTheme,
  setTheme as saveTheme
} from "../storage.js";

export function setTheme(theme) {
  const valid =
    theme === "dark"
      ? "dark"
      : theme === "system"
        ? "system"
        : "light";

  saveTheme(valid);

  applyTheme(valid);

  return valid;
}

export function toggleTheme() {
  const current = getTheme();

  return setTheme(
    current === "dark"
      ? "light"
      : "dark"
  );
}

export function applySavedTheme() {
  return setTheme(getTheme());
}

function applyTheme(theme) {
  const root =
    document.documentElement;

  if (theme === "system") {
    root.dataset.theme =
      window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches
        ? "dark"
        : "light";

    return;
  }

  root.dataset.theme = theme;
}