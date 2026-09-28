let timer = null;

export function clearGameTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

export function startTimer(
  duration,
  onTick,
  onFinish
) {
  clearGameTimer();

  let time = duration;

  onTick(time);

  timer = setInterval(() => {
    time = Math.max(0, time - 0.1);

    onTick(time);

    if (time <= 0) {
      clearGameTimer();
      onFinish();
    }
  }, 100);
}

export function isTimerRunning() {
  return timer !== null;
}