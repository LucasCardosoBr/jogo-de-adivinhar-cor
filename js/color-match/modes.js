import {
  randomHSL,
  calculateScore
} from "./color-utils.js";

const settings = {
  easy: {
    time: 3,
    sequence: 3,
    lives: 5
  },

  medium: {
    time: 2.5,
    sequence: 4,
    lives: 4
  },

  hard: {
    time: 2,
    sequence: 5,
    lives: 3
  }
};

export function getSettings(difficulty) {
  return settings[difficulty] || settings.easy;
}

export function createMatchRound() {
  return {
    target: randomHSL()
  };
}

export function createSpeedRound() {
  const target = randomHSL();
  const options = [target];

  while (options.length < 4) {
    const color = randomHSL();

    const tooSimilar = options.some(
      option => calculateScore(option, color) > 750
    );

    if (!tooSimilar) {
      options.push(color);
    }
  }

  const shuffled = shuffle(options);

  return {
    target,
    options: shuffled,
    correctIndex: shuffled.indexOf(target)
  };
}

export function createSequenceRound(difficulty) {
  const length =
    getSettings(difficulty).sequence;

  const palette = [];

  while (palette.length < 4) {
    const color = randomHSL();

    const tooSimilar = palette.some(
      option => calculateScore(option, color) > 700
    );

    if (!tooSimilar) {
      palette.push(color);
    }
  }

  const sequence = Array.from(
    { length },
    () => Math.floor(Math.random() * palette.length)
  );

  return {
    palette,
    sequence
  };
}

function shuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [result[i], result[j]] =
      [result[j], result[i]];
  }

  return result;
}