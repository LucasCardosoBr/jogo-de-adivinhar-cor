import {
  hsl,
  calculateScore
} from "./color-utils.js";

import {
  getHistory,
  addHistoryEntry,
  resetHistory,
  isSoundEnabled,
  setSoundEnabled,
  getStats,
  updateStats as saveStats,
  getProgression,
  updateProgression as saveProgression
} from "../storage.js";

import {
  calculateAccuracy,
  calculateAverageScore,
  getModeStats
} from "./statistics.js";

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

import { playSound } from "../audio.js";

import {
  getProgress,
  getLevelFromXP,
  calculateXP
} from "./progression.js";

import {
  clearGameTimer,
  startTimer
} from "./game-timer.js";

import {
  getAchievementList,
  getUnlockedAchievements,
  checkAchievements,
  getAchievement
} from "./achievements.js";


const ui = new ColorMatchUI();

let stats = getStats();

let progression =
  getProgression();

let score = 0;
let streak = 0;
let lives = 5;
let round = 1;

let currentRound = null;
let locked = false;

let sequenceAnswer = [];

function updateAdvancedStatistics() {
  const accuracy =
    calculateAccuracy(
      stats.correct,
      stats.attempts
    );

  const averageScore =
    calculateAverageScore(
      stats.totalScore,
      stats.attempts
    );

  ui.updateAdvancedStatistics({
    accuracy,
    averageScore,
    highScore: stats.highScore,
    bestStreak: stats.bestStreak,
    games: stats.games,
    correct: stats.correct
  });
}

/* ================================
   SOM
================================ */

function sound(type) {
  playSound(
    type,
    isSoundEnabled()
  );
}


/* ================================
   CONFIGURAÇÕES
================================ */

function getDifficultySettings() {
  return getSettings(
    ui.getDifficulty()
  );
}


/* ================================
   TIMER
================================ */

function runRoundTimer(duration, onFinish) {
  startTimer(
    duration,
    time => ui.setTimer(time),
    onFinish
  );
}


/* ================================
   CONQUISTAS
================================ */

function updateAchievements() {
  const newAchievements =
    checkAchievements(
      stats,
      streak
    );

  newAchievements.forEach(id => {
    const achievement =
      getAchievement(id);

    if (achievement) {
      ui.showAchievementNotification(
        achievement
      );
    }
  });

  ui.renderAchievements(
    getAchievementList(),
    getUnlockedAchievements()
  );
}


/* ================================
   ESTATÍSTICAS
================================ */

function saveGameStats() {
  stats = saveStats({
    ...stats
  });
}

function updatePlayerProgression(points) {
  const correct =
    points >= 500;

  const xpGained =
    calculateXP({
      points,
      streak,
      correct
    });

  if (xpGained <= 0) {
    ui.updateProgression(
      getProgress(
        progression.xp
      )
    );

    return;
  }

  const oldLevel =
    getLevelFromXP(
      progression.xp
    );

  progression =
    saveProgression({
      xp:
        progression.xp +
        xpGained
    });

  const newLevel =
    getLevelFromXP(
      progression.xp
    );

  ui.updateProgression(
    getProgress(
      progression.xp
    )
  );

  ui.showXPNotification(
    xpGained
  );

  if (
    newLevel.level >
    oldLevel.level
  ) {
    ui.showLevelUp(
      newLevel
    );
  }

}


/* ================================
   NOVO JOGO
================================ */

function startNewGame() {
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


/* ================================
   RESET
================================ */

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


/* ================================
   RODADA
================================ */

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


/* ================================
   MODO COMBINAÇÃO
================================ */

function startMatchRound() {
  currentRound =
    createMatchRound();

  const settings =
    getDifficultySettings();

  ui.showTarget(
    hsl(currentRound.target),
    "Memorize esta cor!"
  );

  runRoundTimer(
    settings.time,
    finishMatchMemory
  );
}

function finishMatchMemory() {
  ui.hideTarget(
    "Agora recrie a cor!"
  );

  ui.showModeControls(
    "match"
  );

  ui.setCheckEnabled(true);

  updatePreview();

  locked = false;
}

function updatePreview() {
  if (!locked) {
    ui.updatePreview(
      hsl(ui.getGuess())
    );
  }
}

function checkMatch() {
  if (locked) {
    return;
  }

  locked = true;

  ui.setCheckEnabled(false);

  const guess =
    ui.getGuess();

  const points =
    calculateScore(
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


/* ================================
   MODO RELÂMPAGO
================================ */

function startSpeedRound() {
  currentRound =
    createSpeedRound();

  const settings =
    getDifficultySettings();

  ui.showTarget(
    hsl(currentRound.target),
    "Memorize esta cor!"
  );

  ui.showSpeedPreview();

  runRoundTimer(
    settings.time,
    finishSpeedMemory
  );
}

function finishSpeedMemory() {
  ui.hideTarget(
    "Qual era a cor?"
  );

  ui.showModeControls(
    "speed"
  );

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

  const selectedIndex =
    Number(index);

  const correct =
    selectedIndex ===
    currentRound.correctIndex;

  const points =
    correct ? 1000 : 0;

  processScore(points);

  sound(
    correct
      ? "success"
      : "error"
  );

  const correctColor =
    hsl(
      currentRound.options[
        currentRound.correctIndex
      ]
    );

  const selectedColor =
    hsl(
      currentRound.options[
        selectedIndex
      ]
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


/* ================================
   MODO SEQUÊNCIA
================================ */

function startSequenceRound() {
  currentRound =
    createSequenceRound(
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

  ui.showModeControls(
    "sequence"
  );

  showSequence();
}

function showSequence() {
  const colors =
    currentRound.sequence.map(
      index =>
        hsl(
          currentRound.palette[index]
        )
    );

  ui.setSequencePreview(colors);

  const settings =
    getDifficultySettings();

  runRoundTimer(
    settings.time,
    finishSequenceMemory
  );
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

  const selectedIndex =
    Number(index);

  sequenceAnswer.push(
    selectedIndex
  );

  const current =
    sequenceAnswer.length;

  const total =
    currentRound.sequence.length;

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

  const points =
    correct ? 1000 : 0;

  processScore(points);

  sound(
    correct
      ? "success"
      : "error"
  );

  const firstColor =
    hsl(
      currentRound.palette[
        currentRound.sequence[0]
      ]
    );

  const selectedIndex =
    sequenceAnswer.at(-1) ?? 0;

  const selectedColor =
    hsl(
      currentRound.palette[
        selectedIndex
      ]
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


/* ================================
   FEEDBACK DA RESPOSTA
================================ */

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


/* ================================
   PONTUAÇÃO
================================ */

function processScore(points) {
  score += points;

  const correct =
    points >= 500;

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

  stats.totalScore += points;

  stats.highScore =
    Math.max(
      stats.highScore,
      score
    );

  stats.bestStreak =
    Math.max(
      stats.bestStreak,
      streak
    );

  saveGameStats();

ui.updateStats(
  score,
  streak,
  lives,
  round
);

updatePlayerProgression(
  points
);

ui.updateRecords(
  stats.highScore,
  stats.bestStreak
);

showAnswerFeedback(correct);

updateAchievements();
}


/* ================================
   FINAL DA TENTATIVA
================================ */

function finishAttempt() {
  if (lives <= 0) {
    endGame();
    return;
  }

  ui.setNextEnabled(true);
}


/* ================================
   PRÓXIMA RODADA
================================ */

function nextRound() {
  if (lives <= 0) {
    return;
  }

  round++;

  startRound();
}


/* ================================
   REINICIAR
================================ */

function restartGame() {
  clearGameTimer();

  sound("click");

  startNewGame();
}


/* ================================
   FIM DE JOGO
================================ */

function endGame() {
  clearGameTimer();

  locked = true;

  
saveGameStats();

addHistoryEntry({
  date: Date.now(),

  score,

  round,

  mode:
    ui.getMode(),

  difficulty:
    ui.getDifficulty(),

  streak,

  lives: 0
});

refreshAdvancedStatistics();

updateAchievements();

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


/* ================================
   CONFIGURAÇÕES
================================ */

function changeDifficulty() {
  clearGameTimer();

  resetGame();
}

function changeMode() {
  clearGameTimer();

  resetGame();
}


/* ================================
   MENSAGENS
================================ */

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


/* ================================
   SOM
================================ */

function updateSoundButton() {
  ui.setSoundButton(
    isSoundEnabled()
  );
}

function toggleSound() {
  const enabled =
    isSoundEnabled();

  setSoundEnabled(!enabled);

  updateSoundButton();

  if (!enabled) {
    sound("success");
  }
}


/* ================================
   EVENTOS
================================ */

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

ui.restartButton.addEventListener(
  "click",
  restartGame
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
    const theme =
      toggleTheme();

    ui.setThemeButton(
      theme === "dark"
    );

    sound("click");
  }
);


/* ================================
   BOTÕES DE CORES
================================ */

ui.speedOptions
  .querySelectorAll(".color-option")
  .forEach(button => {
    button.addEventListener(
      "click",
      () => {
        button.classList.add(
          "selected"
        );

        checkSpeed(
          button.dataset.index
        );
      }
    );
  });

ui.sequenceOptions
  .querySelectorAll(".sequence-color")
  .forEach(button => {
    button.addEventListener(
      "click",
      () => {
        button.classList.add(
          "selected"
        );

        selectSequenceColor(
          button.dataset.index
        );
      }
    );
  });


/* ================================
   INICIALIZAÇÃO
================================ */

applySavedTheme();

updateSoundButton();

ui.updateValues();

ui.updateRecords(
  stats.highScore,
  stats.bestStreak
);

ui.renderAchievements(
  getAchievementList(),
  getUnlockedAchievements()
);

ui.updateProgression(
  getProgress(
    progression.xp
  )
);

function refreshAdvancedStatistics() {
  updateAdvancedStatistics();

  const history =
    getHistory();

  const modeStats = {
    match:
      getModeStats(
        history,
        "match"
      ),

    speed:
      getModeStats(
        history,
        "speed"
      ),

    sequence:
      getModeStats(
        history,
        "sequence"
      )
  };

  ui.renderModeStatistics(
    modeStats
  );

  ui.renderHistory(
    history
  );
}

const clearHistoryButton =
  document.querySelector(
    "#clearHistoryButton"
  );

if (clearHistoryButton) {
  clearHistoryButton.addEventListener(
    "click",
    () => {
      resetHistory();

      refreshAdvancedStatistics();
    }
  );
}

refreshAdvancedStatistics();

startNewGame();