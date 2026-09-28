let audioContext;

const sounds = {
  success: {
    frequency: 620,
    duration: 0.55,
    volume: 0.16
  },

  click: {
    frequency: 380,
    duration: 0.30,
    volume: 0.12
  },

  error: {
    frequency: 180,
    duration: 0.60,
    volume: 0.14
  }
};

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

function normalizeVolume(volume) {
  const value = Number(volume);

  if (!Number.isFinite(value)) {
    return 100;
  }

  return Math.min(100, Math.max(0, value));
}

export function playSound(
  type,
  enabled = true,
  volume = 100
) {
  if (!enabled) {
    return;
  }

  const masterVolume =
    normalizeVolume(volume) / 100;

  if (masterVolume <= 0) {
    return;
  }

  try {
    const context =
      getAudioContext();

    if (!context) {
      return;
    }

    if (context.state === "suspended") {
      context.resume();
    }

    const sound =
      sounds[type] || sounds.click;

    const oscillator =
      context.createOscillator();

    const gain =
      context.createGain();

    const now =
      context.currentTime;

    const finalVolume =
      sound.volume * masterVolume;

    oscillator.connect(gain);
    gain.connect(
      context.destination
    );

    oscillator.type = "sine";

    oscillator.frequency.setValueAtTime(
      sound.frequency,
      now
    );

    gain.gain.setValueAtTime(
      0.001,
      now
    );

    gain.gain.linearRampToValueAtTime(
      finalVolume,
      now + 0.05
    );

    gain.gain.exponentialRampToValueAtTime(
      0.001,
      now + sound.duration
    );

    oscillator.start(now);

    oscillator.stop(
      now + sound.duration
    );
  } catch {
    // Áudio indisponível.
  }
}

export function stopAudio() {
  if (!audioContext) {
    return;
  }

  try {
    if (audioContext.state !== "closed") {
      audioContext.close();
    }
  } catch {
    // Áudio indisponível.
  }

  audioContext = null;
}