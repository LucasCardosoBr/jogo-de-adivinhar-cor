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

export function playSound(
  type,
  enabled = true
) {
  if (!enabled) {
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
      sound.volume,
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