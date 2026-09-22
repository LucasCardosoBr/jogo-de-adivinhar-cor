import {
  colors,
  hardColors,
  difficultyConfig,
  shuffle,
  getColorValue
} from "./colors.js";

import { playSound } from "./audio.js";
import { saveStats } from "./storage.js";

const GAME_TIME = 30;
const MEMORY_TIME = 3;

export class ColorGame {
  constructor(ui, stats) {
    this.ui = ui;
    this.stats = stats;

    this.resetState();
  }

  resetState() {
    this.score = 0;
    this.streak = 0;
    this.attempts = 0;
    this.lives = 0;
    this.round = 0;
    this.totalAnswers = 0;
    this.correctAnswers = 0;
    this.secret = null;
    this.options = [];
    this.timer = null;
    this.memoryTimer = null;
    this.memoryActive = false;
    this.gameActive = false;
  }

  start() {
    this.stopTimer();
    this.stopMemoryTimer();
    this.resetState();

    this.gameActive = true;
    this.stats.totalGames++;

    this.updateUI();
    this.ui.hideModal();

    if (this.getMode() === "time") {
      this.lives = 3;
      this.startTimeAttack();
    }

    this.startRound();
    this.save();
  }

  startRound() {
    if (!this.gameActive) return;

    this.stopMemoryTimer();

    document.body.classList.remove("memory-mode");

    this.attempts = 0;
    this.memoryActive = false;
    this.ui.clearFeedback();
    this.ui.clearHint();

    if (this.getMode() === "memory") {
      this.startMemoryRound();
      return;
    }

    this.prepareOptions();
    this.renderQuestion();

    if (this.getMode() === "classic") {
      this.lives = this.getMaxAttempts();
      this.ui.setStatusType("attempts");
      this.ui.hideTimer();
    } else {
      this.ui.setStatusType("lives");
    }

    this.updateUI();
  }

  getDifficulty() {
    return this.ui.getDifficulty();
  }

  getMode() {
    return this.ui.getGameMode();
  }

  getFormat() {
    return this.ui.getColorFormat();
  }

  getConfig() {
    return difficultyConfig[this.getDifficulty()];
  }

  getMaxAttempts() {
    return this.getConfig().attempts;
  }

  prepareOptions() {
    const source =
      this.getDifficulty() === "hard"
        ? hardColors
        : colors;

    this.options = shuffle(source).slice(
      0,
      this.getConfig().options
    );

    this.secret =
      this.options[Math.floor(Math.random() * this.options.length)];
  }

  renderQuestion() {
    const format = this.getFormat();

    this.ui.showColorCode(
      getColorValue(this.secret, format)
    );

    this.ui.renderOptions(
      this.options,
      false
    );
  }

  guess(color, button) {
    if (!this.gameActive || this.memoryActive) return;

    if (button?.disabled) return;

    this.totalAnswers++;
    this.stats.totalAnswers++;

    if (color.hex === this.secret.hex) {
      this.handleCorrect(button);
    } else {
      this.handleWrong(button);
    }

    this.save();
  }

  handleCorrect(button) {
    this.correctAnswers++;
    this.stats.correctAnswers++;

    this.streak++;
    this.stats.bestStreak = Math.max(
      this.stats.bestStreak,
      this.streak
    );

    const multiplier = Math.min(this.streak, 5);
    const points = 10 * multiplier;

    this.score += points;

    this.stats.highScore = Math.max(
      this.stats.highScore,
      this.score
    );

    this.ui.showFeedback(
      `Correto! +${points} pontos`,
      "success"
    );

    this.ui.clearHint();
    this.ui.disableOptions();

    playSound(
      "success",
      this.stats.soundEnabled
    );

    this.celebrate();
    this.updateUI();

    setTimeout(() => {
      if (this.gameActive) {
        this.round++;
        this.startRound();
      }
    }, 900);
  }

  handleWrong(button) {
    this.streak = 0;

    if (this.getMode() === "classic") {
      this.attempts++;

      this.ui.showFeedback(
        "Resposta incorreta!",
        "error"
      );

      this.showClassicHint();

      if (this.attempts >= this.getMaxAttempts()) {
        setTimeout(
          () => this.endGame(
            `Você esgotou as ${this.getMaxAttempts()} tentativas.`
          ),
          700
        );
      }
    } else {
      this.lives--;

      this.ui.showFeedback(
        "Resposta incorreta!",
        "error"
      );

      if (button) {
        button.classList.add("wrong");

        setTimeout(() => {
          button.classList.remove("wrong");
        }, 500);
      }

      if (this.lives <= 0) {
        setTimeout(
          () => this.endGame("Você ficou sem vidas!"),
          700
        );
      }
    }

    playSound(
      "error",
      this.stats.soundEnabled
    );

    this.updateUI();
  }

  showClassicHint() {
    const remaining =
      this.getMaxAttempts() - this.attempts;

    const { rgb, hex, name } = this.secret;

    let hint;

    if (remaining >= 4) {
      hint = `A cor secreta começa com a letra "${name[0]}".`;
    } else if (remaining === 3) {
      const [r, g, b] = rgb
        .match(/\d+/g)
        .map(Number);

      const largest = Math.max(r, g, b);

      if (largest === r) {
        hint = "A cor possui predominância de vermelho.";
      } else if (largest === g) {
        hint = "A cor possui predominância de verde.";
      } else {
        hint = "A cor possui predominância de azul.";
      }
    } else if (remaining === 2) {
      hint = `O código HEX começa com "${hex.slice(0, 4)}".`;
    } else {
      hint = `Última dica: ${rgb}.`;
    }

    this.ui.showHint(hint);
  }

  startTimeAttack() {
    this.stopTimer();

    let remaining = GAME_TIME;

    this.ui.showTimer(remaining);

    this.timer = setInterval(() => {
      remaining--;

      this.ui.showTimer(remaining);

      if (remaining <= 0) {
        this.endGame("O tempo acabou!");
      }
    }, 1000);
  }

  startMemoryRound() {
    document.body.classList.add("memory-mode");

    const source =
      this.getDifficulty() === "hard"
        ? hardColors
        : colors;

    this.options = shuffle(source).slice(
      0,
      this.getConfig().memoryOptions
    );

    this.secret =
      this.options[
        Math.floor(
          Math.random() * this.options.length
        )
      ];

    this.memoryActive = true;
    this.lives = 3;

    this.ui.setStatusType("lives");
    this.ui.showColorCode("");
    this.ui.clearHint();
    this.ui.clearFeedback();

    this.ui.startMemoryDisplay(
      this.secret.hex,
      MEMORY_TIME
    );

    let remaining = MEMORY_TIME;

    this.ui.showMemoryTimer(remaining);

    this.memoryTimer = setInterval(() => {
      remaining--;

      this.ui.showMemoryTimer(remaining);

      if (remaining <= 0) {
        this.finishMemoryDisplay();
      }
    }, 1000);

    this.updateUI();
  }

  finishMemoryDisplay() {
    this.stopMemoryTimer();

    this.memoryActive = true;

    this.ui.hideMemoryColor();

    this.ui.renderOptions(
      this.options,
      true
    );

    this.ui.showFeedback(
      "Agora encontre a cor que você memorizou!",
      "info"
    );
  }

  guessMemory(color, button) {
    if (!this.gameActive || !this.memoryActive) return;

    if (button?.disabled) return;

    this.totalAnswers++;
    this.stats.totalAnswers++;

    if (color.hex === this.secret.hex) {
      this.correctAnswers++;
      this.stats.correctAnswers++;

      this.streak++;

      this.stats.bestStreak = Math.max(
        this.stats.bestStreak,
        this.streak
      );

      const points =
        20 + Math.min(this.streak * 5, 50);

      this.score += points;

      this.stats.highScore = Math.max(
        this.stats.highScore,
        this.score
      );

      this.ui.showFeedback(
        `Memória correta! +${points} pontos`,
        "success"
      );

      this.ui.disableOptions();

      playSound(
        "success",
        this.stats.soundEnabled
      );

      this.celebrate();

      this.memoryActive = false;

      document.body.classList.remove(
        "memory-mode"
      );

      this.updateUI();
      this.save();

      setTimeout(() => {
        if (this.gameActive) {
          this.round++;
          this.startRound();
        }
      }, 900);

      return;
    }

    this.streak = 0;
    this.lives--;

    this.ui.showFeedback(
      "Essa não era a cor!",
      "error"
    );

    button.classList.add("wrong");

    setTimeout(() => {
      button.classList.remove("wrong");
    }, 500);

    playSound(
      "error",
      this.stats.soundEnabled
    );

    if (this.lives <= 0) {
      this.endGame(
        "Você ficou sem vidas!"
      );

      return;
    }

    this.updateUI();
    this.save();
  }

  updateUI() {
    const accuracy =
      this.totalAnswers > 0
        ? Math.round(
            (this.correctAnswers /
              this.totalAnswers) *
              100
          )
        : 0;

    this.ui.updateStatus({
      score: this.score,
      streak: this.streak,
      lives:
        this.getMode() === "classic"
          ? Math.max(
              this.getMaxAttempts() -
                this.attempts,
              0
            )
          : this.lives,
      round: this.round + 1,
      attempts:
        this.getMaxAttempts() -
        this.attempts
    });

    this.ui.updateStats(
      this.stats,
      this.getPersistentAccuracy()
    );

    this.ui.updateAccuracy(accuracy);
  }

  getPersistentAccuracy() {
    if (!this.stats.totalAnswers) {
      return 0;
    }

    return Math.round(
      (this.stats.correctAnswers /
        this.stats.totalAnswers) *
        100
    );
  }

  endGame(message) {
    if (!this.gameActive) return;

    this.gameActive = false;

    this.stopTimer();
    this.stopMemoryTimer();

    document.body.classList.remove(
      "memory-mode"
    );

    this.stats.highScore = Math.max(
      this.stats.highScore,
      this.score
    );

    this.ui.showGameOver({
      score: this.score,
      streak: this.streak,
      accuracy: this.getPersistentAccuracy(),
      message
    });

    this.save();
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  stopMemoryTimer() {
    if (this.memoryTimer) {
      clearInterval(this.memoryTimer);
      this.memoryTimer = null;
    }
  }

  celebrate() {
    if (typeof confetti === "function") {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: {
          y: 0.6
        }
      });
    }
  }

  save() {
    saveStats(this.stats);
  }
}