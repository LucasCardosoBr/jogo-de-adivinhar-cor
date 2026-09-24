import {
  getTheme,
  setTheme as saveTheme
} from "../storage.js";

export function setTheme(theme) {
  const valid =
    theme === "dark"
      ? "dark"
      : "light";

  document.documentElement.dataset.theme =
    valid;

  saveTheme(valid);

  return valid;
}

export function toggleTheme() {
  return setTheme(
    getTheme() === "dark"
      ? "light"
      : "dark"
  );
}

export function applySavedTheme() {
  return setTheme(
    getTheme()
  );
}