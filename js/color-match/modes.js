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


/* ================================
   CONFIGURAÇÕES
================================ */

export function getSettings(difficulty) {
  return settings[difficulty] || settings.easy;
}


/* ================================
   MODO COMBINAÇÃO
================================ */

export function createMatchRound() {
  return {
    target: randomHSL()
  };
}


/* ================================
   MODO RELÂMPAGO
================================ */

export function createSpeedRound() {
  const target = randomHSL();

  const options = createPalette(
    target,
    4,
    750
  );

  const shuffled = shuffle(options);

  return {
    target,
    options: shuffled,
    correctIndex: shuffled.indexOf(target)
  };
}


/* ================================
   MODO SEQUÊNCIA
================================ */

export function createSequenceRound(difficulty) {
  const length =
    getSettings(difficulty).sequence;

  const palette = createPalette(
    null,
    4,
    700
  );

  const sequence = Array.from(
    { length },
    () =>
      Math.floor(
        Math.random() * palette.length
      )
  );

  return {
    palette,
    sequence
  };
}


/* ================================
   PALETA
================================ */

function createPalette(
  firstColor,
  size,
  similarityLimit
) {
  const palette = firstColor
    ? [firstColor]
    : [];

  while (palette.length < size) {
    const color = randomHSL();

    const tooSimilar = palette.some(
      option =>
        calculateScore(
          option,
          color
        ) > similarityLimit
    );

    if (!tooSimilar) {
      palette.push(color);
    }
  }

  return palette;
}


/* ================================
   EMBARALHAR
================================ */

function shuffle(array) {
  const result = [...array];

  for (
    let i = result.length - 1;
    i > 0;
    i--
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [
      result[i],
      result[j]
    ] = [
      result[j],
      result[i]
    ];
  }

  return result;
}