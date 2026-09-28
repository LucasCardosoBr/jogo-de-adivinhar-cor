const ANIMATION_KEY = "colorGameAnimations";

export function getAnimationMode() {
  return (
    document.documentElement.dataset.animations ||
    "full"
  );
}

export function animationsEnabled() {
  return getAnimationMode() === "full";
}

export function reducedAnimations() {
  return getAnimationMode() === "reduced";
}

export function playAnimation(
  element,
  animation,
  duration = 400
) {
  if (!element || getAnimationMode() === "off") {
    return;
  }

  element.classList.remove(animation);

  void element.offsetWidth;

  element.classList.add(animation);

  if (getAnimationMode() === "reduced") {
    duration = Math.min(duration, 120);
  }

  window.setTimeout(() => {
    element.classList.remove(animation);
  }, duration);
}

export function respectSystemMotionPreference() {
  const query = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  if (
    query.matches &&
    !localStorage.getItem(ANIMATION_KEY)
  ) {
    document.documentElement.dataset.animations =
      "reduced";
  }
}