import {
  getTheme,
  setTheme as saveTheme
} from "../storage.js";

export function setTheme(theme) {
  const valid = theme === "dark" ? "dark" : "light";

  document.documentElement.dataset.theme = valid;
  saveTheme(valid);

  return valid;
}

export function toggleTheme() {
  return setTheme(
    getTheme() === "dark" ? "light" : "dark"
  );
}

export function applySavedTheme() {
  return setTheme(getTheme());
}

export function updateThemeButton(button) {
  if (!button) {
    return;
  }

  const dark = getTheme() === "dark";

  button.textContent = dark ? "☀️" : "🌙";

  button.setAttribute(
    "aria-label",
    dark
      ? "Ativar tema claro"
      : "Ativar tema escuro"
  );

  button.title = dark
    ? "Tema claro"
    : "Tema escuro";
}