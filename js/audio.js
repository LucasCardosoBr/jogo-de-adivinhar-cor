let audioContext;

function getAudioContext() {
  if (!audioContext) {
    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContext) {
      return null;
    }

    audioContext = new AudioContext();
  }

  return audioContext;
}

export function playSound(
  type,
  enabled = true
) {
  if (!enabled) return;

  try {
    const context = getAudioContext();

    if (!context) return;

    const oscillator =
      context.createOscillator();

    const gain =
      context.createGain();

    oscillator.connect(gain);
    gain.connect(context.destination);

    const frequency =
      type === "success"
        ? 700
        : type === "click"
          ? 400
          : 180;

    oscillator.frequency.value =
      frequency;

    oscillator.type = "sine";

    gain.gain.setValueAtTime(
      0.08,
      context.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      context.currentTime + 0.2
    );

    oscillator.start();

    oscillator.stop(
      context.currentTime + 0.2
    );
  } catch {
    // Áudio indisponível.
  }
}