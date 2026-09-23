import {
  hsl,
  calculateScore
} from "./color-utils.js";

import {
  createMatchRound,
  createSpeedRound,
  createSequenceRound,
  getSettings
} from "./modes.js";

import { ColorMatchUI } from "./color-match-ui.js";

import {
  applySavedTheme,
  toggleTheme
} from "./theme.js";

import {
  isSoundEnabled,
  setSoundEnabled,
  getStats,
  updateStats
} from "../storage.js";

import { playSound } from "../audio.js";

const ui = new ColorMatchUI();
let stats = getStats();

let score = 0;
let streak = 0;
let lives = 5;
let round = 1;

let currentRound = null;
let timer = null;
let locked = false;
let sequenceAnswer = [];

function sound(type) {
  playSound(type, isSoundEnabled());
}

function getDifficultySettings() {
  return getSettings(ui.getDifficulty());
}

function clearGameTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function startNewGame() {
  const settings =
    getDifficultySettings();

  score = 0;
  streak = 0;
  round = 1;
  lives = settings.lives;

  stats.games++;

  updateStats(stats);

  ui.updateRecords(
    stats.highScore,
    stats.bestStreak
  );

  startRound();
}

function resetGame() {
  const settings =
    getDifficultySettings();

  score = 0;
  streak = 0;
  round = 1;
  lives = settings.lives;

  ui.updateRecords(
    stats.highScore,
    stats.bestStreak
  );

  startRound();
}

function startRound() {
  clearGameTimer();

  locked = true;
  sequenceAnswer = [];

  ui.hideResult();
  ui.hideControls();
  ui.setCheckEnabled(false);
  ui.setNextEnabled(false);
  ui.resetSliders();
  ui.clearSequencePreview();
  ui.setTargetAreaVisible(true);

  const mode = ui.getMode();

  if (mode === "match") {
    startMatchRound();
  } else if (mode === "speed") {
    startSpeedRound();
  } else {
    startSequenceRound();
  }

  ui.updateStats(
    score,
    streak,
    lives,
    round
  );
}

function startMatchRound() {
  currentRound = createMatchRound();

  const settings = getDifficultySettings();
  let time = settings.time;

  ui.showTarget(
    hsl(currentRound.target),
    "Memorize esta cor!"
  );

  ui.setTimer(time);

  timer = setInterval(() => {
    time = Math.max(0, time - 0.1);

    ui.setTimer(time);

    if (time <= 0) {
      clearGameTimer();
      finishMatchMemory();
    }
  }, 100);
}

function finishMatchMemory() {
  ui.hideTarget("Agora recrie a cor!");
  ui.showModeControls("match");
  ui.setCheckEnabled(true);

  updatePreview();

  locked = false;
}

function updatePreview() {
  if (!locked) {
    ui.updatePreview(hsl(ui.getGuess()));
  }
}

function checkMatch() {
  if (locked) {
    return;
  }

  locked = true;
  ui.setCheckEnabled(false);

  const guess = ui.getGuess();

  const points = calculateScore(
    currentRound.target,
    guess
  );

  processScore(points);

  sound(
    points >= 500
      ? "success"
      : "error"
  );

  ui.showResult(
    hsl(currentRound.target),
    hsl(guess),
    points,
    getResultMessage(points)
  );

  finishAttempt();
}

function startSpeedRound() {
  currentRound = createSpeedRound();

  const settings = getDifficultySettings();
  let time = settings.time;

  ui.showTarget(
    hsl(currentRound.target),
    "Memorize esta cor!"
  );

  ui.showSpeedPreview();
  ui.setTimer(time);

  timer = setInterval(() => {
    time = Math.max(0, time - 0.1);

    ui.setTimer(time);

    if (time <= 0) {
      clearGameTimer();
      finishSpeedMemory();
    }
  }, 100);
}

function finishSpeedMemory() {
  ui.hideTarget("Qual era a cor?");
  ui.showModeControls("speed");
  ui.hideSpeedPreview();

  ui.setSpeedOptions(
    currentRound.options.map(hsl)
  );

  ui.setTimer(0);

  locked = false;
}

function checkSpeed(index) {
  if (locked) {
    return;
  }

  locked = true;
  ui.disableSpeedOptions();

  const selectedIndex = Number(index);

  const correct =
    selectedIndex === currentRound.correctIndex;

  const points = correct ? 1000 : 0;

  processScore(points);

  sound(
    correct
      ? "success"
      : "error"
  );

  const correctColor = hsl(
    currentRound.options[
      currentRound.correctIndex
    ]
  );

  const selectedColor = hsl(
    currentRound.options[selectedIndex]
  );

  ui.showResult(
    correctColor,
    selectedColor,
    points,
    correct
      ? "Perfeito! Você acertou a cor."
      : "Você errou. Observe melhor a próxima cor."
  );

  finishAttempt();
}

function startSequenceRound() {
  currentRound = createSequenceRound(
    ui.getDifficulty()
  );

  sequenceAnswer = [];

  ui.setTargetAreaVisible(false);

  ui.setSequenceProgress(
    0,
    currentRound.sequence.length
  );

  ui.setSequenceMessage(
    "Observe a sequência de cores."
  );

  ui.showModeControls("sequence");

  showSequence();
}

function showSequence() {
  const colors = currentRound.sequence.map(
    index => hsl(
      currentRound.palette[index]
    )
  );

  ui.setSequencePreview(colors);

  const settings = getDifficultySettings();
  let time = settings.time;

  ui.setTimer(time);

  timer = setInterval(() => {
    time = Math.max(0, time - 0.1);

    ui.setTimer(time);

    if (time <= 0) {
      clearGameTimer();
      finishSequenceMemory();
    }
  }, 100);
}

function finishSequenceMemory() {
  ui.clearSequencePreview();

  ui.setSequenceMessage(
    "Agora repita a sequência."
  );

  ui.setSequenceOptions(
    currentRound.palette.map(hsl)
  );

  ui.setSequenceProgress(
    0,
    currentRound.sequence.length
  );

  ui.setTimer(0);

  locked = false;
}

function selectSequenceColor(index) {
  if (locked) {
    return;
  }

  const selectedIndex = Number(index);

  sequenceAnswer.push(selectedIndex);

  const current = sequenceAnswer.length;
  const total = currentRound.sequence.length;

  ui.setSequenceProgress(
    current,
    total
  );

  if (
    selectedIndex !==
    currentRound.sequence[current - 1]
  ) {
    finishSequence(false);
    return;
  }

  if (current === total) {
    finishSequence(true);
  }
}

function finishSequence(correct) {
  locked = true;

  ui.disableSequenceOptions();

  const points = correct ? 1000 : 0;

  processScore(points);

  sound(
    correct
      ? "success"
      : "error"
  );

  const firstColor = hsl(
    currentRound.palette[
      currentRound.sequence[0]
    ]
  );

  const selectedIndex =
    sequenceAnswer.at(-1) ?? 0;

  const selectedColor = hsl(
    currentRound.palette[selectedIndex]
  );

  ui.showResult(
    firstColor,
    selectedColor,
    points,
    correct
      ? "Excelente! Você repetiu toda a sequência."
      : "Sequência incorreta. Tente memorizar melhor."
  );

  finishAttempt();
}

function showAnswerFeedback(correct) {
  const card =
    document.querySelector(".game-card");

  if (!card) {
    return;
  }

  card.classList.remove(
    "answer-correct",
    "answer-wrong"
  );

  void card.offsetWidth;

  card.classList.add(
    correct
      ? "answer-correct"
      : "answer-wrong"
  );

  setTimeout(() => {
    card.classList.remove(
      "answer-correct",
      "answer-wrong"
    );
  }, 500);
}

function processScore(points) {
  score += points;

  const correct = points >= 500;

  if (correct) {
    streak++;
  } else {
    streak = 0;
  }

  if (points < 500) {
    lives--;
  }

  stats.attempts++;

  if (correct) {
    stats.correct++;
  }

  stats.highScore = Math.max(
    stats.highScore,
    score
  );

  stats.bestStreak = Math.max(
    stats.bestStreak,
    streak
  );

  updateStats(stats);

  ui.updateStats(
    score,
    streak,
    lives,
    round
  );

  ui.updateRecords(
    stats.highScore,
    stats.bestStreak
  );

  showAnswerFeedback(correct);
}

function finishAttempt() {
  if (lives <= 0) {
    endGame();
    return;
  }

  ui.setNextEnabled(true);
}

function nextRound() {
  if (lives <= 0) {
    return;
  }

  round++;
  startRound();
}

function restartGame() {
  clearGameTimer();

  sound("click");

  startNewGame();
}

ui.restartButton.addEventListener(
  "click",
  restartGame
);

function endGame() {
  clearGameTimer();

  locked = true;

  sound("error");

  ui.hideControls();
  ui.setCheckEnabled(false);
  ui.setNextEnabled(false);
  ui.setTargetAreaVisible(true);

  ui.showEndGame(
    score,
    round
  );

  ui.targetMessage.textContent =
    `Fim de jogo! Pontuação: ${score}`;
}

function changeDifficulty() {
  clearGameTimer();
  resetGame();
}

function changeMode() {
  clearGameTimer();
  resetGame();
}

function getResultMessage(points) {
  if (points === 1000) {
    return "Perfeito! Você acertou exatamente.";
  }

  if (points >= 900) {
    return "Quase perfeito! Excelente percepção.";
  }

  if (points >= 800) {
    return "Excelente! Você chegou muito perto.";
  }

  if (points >= 650) {
    return "Muito bom! Continue assim.";
  }

  if (points >= 500) {
    return "Bom trabalho! Ainda dá para melhorar.";
  }

  if (points >= 300) {
    return "A cor ficou um pouco distante.";
  }

  return "Você ficou bem longe da resposta.";
}

function updateSoundButton() {
  ui.setSoundButton(
    isSoundEnabled()
  );
}

function toggleSound() {
  const enabled = isSoundEnabled();

  setSoundEnabled(!enabled);

  updateSoundButton();

  if (!enabled) {
    sound("success");
  }
}

ui.hue.addEventListener(
  "input",
  updatePreview
);

ui.saturation.addEventListener(
  "input",
  () => {
    ui.updateValues();
    updatePreview();
  }
);

ui.lightness.addEventListener(
  "input",
  () => {
    ui.updateValues();
    updatePreview();
  }
);

ui.checkButton.addEventListener(
  "click",
  checkMatch
);

ui.nextButton.addEventListener(
  "click",
  nextRound
);

ui.difficulty.addEventListener(
  "change",
  changeDifficulty
);

ui.gameMode.addEventListener(
  "change",
  changeMode
);

ui.soundButton.addEventListener(
  "click",
  toggleSound
);

ui.themeButton.addEventListener(
  "click",
  () => {
    const theme = toggleTheme();

    ui.setThemeButton(
      theme === "dark"
    );

    sound("click");
  }
);

ui.speedOptions
  .querySelectorAll(".color-option")
  .forEach(button => {
    button.addEventListener(
      "click",
      () => checkSpeed(
        button.dataset.index
      )
    );
  });

ui.sequenceOptions
  .querySelectorAll(".sequence-color")
  .forEach(button => {
    button.addEventListener(
      "click",
      () => selectSequenceColor(
        button.dataset.index
      )
    );
  });

applySavedTheme();

updateSoundButton();
ui.updateValues();

ui.updateRecords(
  stats.highScore,
  stats.bestStreak
);

startNewGame();