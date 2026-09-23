const STORAGE_KEY="colorGameTheme";

export function getTheme(){
  return localStorage.getItem(STORAGE_KEY)||"light";
}

export function setTheme(theme){
  const valid=theme==="dark"?"dark":"light";

  document.documentElement.dataset.theme=valid;
  localStorage.setItem(STORAGE_KEY,valid);

  return valid;
}

export function toggleTheme(){
  return setTheme(getTheme()==="dark"?"light":"dark");
}

export function applySavedTheme(){
  return setTheme(getTheme());
}

export function updateThemeButton(button){
  if(!button)return;

  const dark=getTheme()==="dark";

  button.textContent=dark?"☀️":"🌙";
  button.setAttribute(
    "aria-label",
    dark?"Ativar tema claro":"Ativar tema escuro"
  );
  button.title=dark?"Tema claro":"Tema escuro";
}