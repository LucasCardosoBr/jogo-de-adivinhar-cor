import { ColorGame } from "./game.js";
import {
  loadStats,
  saveStats,
  resetStats,
  loadTheme
} from "./storage.js";

const $ = selector => document.querySelector(selector);

const elements = {
  difficulty: $("#difficulty"),
  gameMode: $("#gameMode"),
  colorFormat: $("#colorFormat"),

  score: $("#score"),
  streak: $("#streak"),
  lives: $("#lives"),
  round: $("#round"),
  attempts: $("#attempts"),
  timer: $("#timer"),

  colorDisplay: $("#colorDisplay"),
  colorCode: $("#colorCode"),
  questionLabel: $("#questionLabel"),
  hint: $("#hint"),
  colorOptions: $("#colorOptions"),
  feedback: $("#feedback"),

  hintButton: $("#hintButton"),
  restartButton: $("#restartButton"),

  highScore: $("#highScore"),
  bestStreak: $("#bestStreak"),
  totalGames: $("#totalGames"),
  accuracy: $("#accuracy"),

  resetStats: $("#resetStats"),

  themeButton: $("#themeButton"),
  soundButton: $("#soundButton"),

  gameOverModal: $("#gameOverModal"),
  finalScore: $("#finalScore"),
  finalStreak: $("#finalStreak"),
  finalAccuracy: $("#finalAccuracy"),
  gameOverMessage: $("#gameOverMessage"),
  closeModal: $("#closeModal"),

  memoryTimer: $("#memoryTimer")
};

const stats = loadStats();

class GameUI {
  getDifficulty() {
    return elements.difficulty.value;
  }

  getGameMode() {
    return elements.gameMode.value;
  }

  getColorFormat() {
    return elements.colorFormat.value;
  }

  setStatusType(type) {
    const label = document.querySelector(
      "#livesLabel"
    );

    if (!label) return;

    label.textContent =
      type === "attempts"
        ? "🎯 Tentativas"
        : "❤️ Vidas";
  }

  updateStatus({
    score,
    streak,
    lives,
    round,
    attempts
  }) {
    if (elements.score) {
      elements.score.textContent = score;
    }

    if (elements.streak) {
      elements.streak.textContent = streak;
    }

    if (elements.lives) {
      elements.lives.textContent = lives;
    }

    if (elements.round) {
      elements.round.textContent = round;
    }

    if (elements.attempts) {
      elements.attempts.textContent = attempts;
    }
  }

  updateStats(stats, accuracy) {
    if (elements.highScore) {
      elements.highScore.textContent =
        stats.highScore;
    }

    if (elements.bestStreak) {
      elements.bestStreak.textContent =
        stats.bestStreak;
    }

    if (elements.totalGames) {
      elements.totalGames.textContent =
        stats.totalGames;
    }

    if (elements.accuracy) {
      elements.accuracy.textContent =
        `${accuracy}%`;
    }
  }

  updateAccuracy(accuracy) {
    // Mantido para compatibilidade com o game.js.
  }

  showColorCode(code) {
    if (!elements.colorCode) return;

    elements.colorCode.textContent = code || "";
  }

  renderOptions(options, memoryMode = false) {
    if (!elements.colorOptions) return;

    elements.colorOptions.innerHTML = "";

    options.forEach(color => {
      const button = document.createElement("button");

      button.type = "button";
      button.className = memoryMode
        ? "color-option memory-option"
        : "color-option";

      button.style.backgroundColor =
        color.hex;

      button.dataset.color = color.hex;

      const span =
        document.createElement("span");

      span.textContent = color.name;

      button.appendChild(span);

      button.addEventListener(
        "click",
        () => {
          if (memoryMode) {
            game.guessMemory(
              color,
              button
            );
          } else {
            game.guess(
              color,
              button
            );
          }
        }
      );

      elements.colorOptions.appendChild(
        button
      );
    });
  }

  disableOptions() {
    elements.colorOptions
      ?.querySelectorAll("button")
      .forEach(button => {
        button.disabled = true;
      });
  }

  showFeedback(message, type = "") {
    if (!elements.feedback) return;

    elements.feedback.textContent =
      message;

    elements.feedback.className =
      `feedback ${type}`.trim();
  }

  clearFeedback() {
    if (!elements.feedback) return;

    elements.feedback.textContent = "";
    elements.feedback.className =
      "feedback";
  }

  showHint(message) {
    if (!elements.hint) return;

    elements.hint.textContent = message;
    elements.hint.classList.add("show");
  }

  clearHint() {
    if (!elements.hint) return;

    elements.hint.textContent = "";
    elements.hint.classList.remove("show");
  }

  showTimer(seconds) {
    if (!elements.timer) return;

    elements.timer.textContent =
      `${seconds}s`;

    elements.timer.parentElement?.classList
      .remove("hidden");
  }

  hideTimer() {
    if (!elements.timer) return;

    elements.timer.parentElement?.classList
      .add("hidden");
  }

  showMemoryTimer(seconds) {
    if (!elements.memoryTimer) return;

    elements.memoryTimer.textContent =
      seconds;
  }

  startMemoryDisplay(color, seconds) {
    document.body.classList.add(
      "memory-mode"
    );

    if (elements.colorDisplay) {
      elements.colorDisplay.style.background =
        color;
    }

    if (elements.colorCode) {
      elements.colorCode.textContent = "";
    }

    if (elements.memoryTimer) {
      elements.memoryTimer.textContent =
        seconds;
      elements.memoryTimer.style.display =
        "grid";
    }
  }

  hideMemoryColor() {
    if (elements.colorDisplay) {
      elements.colorDisplay.style.background =
        "var(--surface)";
    }

    if (elements.memoryTimer) {
      elements.memoryTimer.style.display =
        "none";
    }
  }

  showGameOver({
    score,
    streak,
    accuracy,
    message
  }) {
    if (elements.finalScore) {
      elements.finalScore.textContent =
        score;
    }

    if (elements.finalStreak) {
      elements.finalStreak.textContent =
        streak;
    }

    if (elements.finalAccuracy) {
      elements.finalAccuracy.textContent =
        `${accuracy}%`;
    }

    if (elements.gameOverMessage) {
      elements.gameOverMessage.textContent =
        message;
    }

    elements.gameOverModal
      ?.classList.add("show");
  }

  hideModal() {
    elements.gameOverModal
      ?.classList.remove("show");
  }
}

const ui = new GameUI();
const game = new ColorGame(
  ui,
  stats
);

function updateSoundButton() {
  if (!elements.soundButton) return;

  elements.soundButton.textContent =
    stats.soundEnabled
      ? "🔊"
      : "🔇";

  elements.soundButton.title =
    stats.soundEnabled
      ? "Desativar sons"
      : "Ativar sons";
}

function applyTheme() {
  const theme = loadTheme();

  document.body.dataset.theme =
    theme;

  if (elements.themeButton) {
    elements.themeButton.textContent =
      theme === "dark"
        ? "☀️"
        : "🌙";
  }
}

elements.restartButton?.addEventListener(
  "click",
  () => game.start()
);

elements.hintButton?.addEventListener(
  "click",
  () => {
    if (!game.secret) return;

    ui.showHint(
      `Dica: a cor secreta é "${game.secret.name}".`
    );
  }
);

elements.difficulty?.addEventListener(
  "change",
  () => game.start()
);

elements.gameMode?.addEventListener(
  "change",
  () => game.start()
);

elements.colorFormat?.addEventListener(
  "change",
  () => {
    if (game.gameActive) {
      game.renderQuestion();
    }
  }
);

elements.themeButton?.addEventListener(
  "click",
  () => {
    const dark =
      document.body.dataset.theme ===
      "dark";

    const theme =
      dark ? "light" : "dark";

    document.body.dataset.theme =
      theme;

    localStorage.setItem(
      "colorGuessTheme",
      theme
    );

    elements.themeButton.textContent =
      dark ? "🌙" : "☀️";
  }
);

elements.soundButton?.addEventListener(
  "click",
  () => {
    stats.soundEnabled =
      !stats.soundEnabled;

    saveStats(stats);
    updateSoundButton();
  }
);

elements.resetStats?.addEventListener(
  "click",
  () => {
    const confirmed = confirm(
      "Deseja realmente apagar todas as estatísticas?"
    );

    if (!confirmed) return;

    resetStats();

    Object.assign(stats, {
      highScore: 0,
      bestStreak: 0,
      totalGames: 0,
      correctAnswers: 0,
      totalAnswers: 0
    });

    ui.updateStats(stats, 0);
  }
);

elements.closeModal?.addEventListener(
  "click",
  () => {
    ui.hideModal();
  }
);

elements.gameOverModal?.addEventListener(
  "click",
  event => {
    if (
      event.target ===
      elements.gameOverModal
    ) {
      ui.hideModal();
    }
  }
);

applyTheme();
updateSoundButton();
ui.updateStats(
  stats,
  stats.totalAnswers
    ? Math.round(
        (stats.correctAnswers /
          stats.totalAnswers) *
          100
      )
    : 0
);

game.start();