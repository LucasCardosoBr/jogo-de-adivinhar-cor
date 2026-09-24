import { formatDate } from "./statistics.js";

export class ColorMatchUI {
  constructor() {
    /* ================================
       CONFIGURAÇÕES
    ================================= */

    this.gameMode =
      document.getElementById("gameMode");

    this.difficulty =
      document.getElementById("difficulty");

    this.soundButton =
      document.getElementById("soundButton");

    this.themeButton =
      document.getElementById("themeButton");


    /* ================================
       ESTATÍSTICAS
    ================================= */

    this.score =
      document.getElementById("score");

    this.streak =
      document.getElementById("streak");

    this.lives =
      document.getElementById("lives");

    this.round =
      document.getElementById("round");

    this.highScore =
      document.getElementById("highScore");

    this.bestStreak =
      document.getElementById("bestStreak");

    this.timer =
      document.getElementById("timer");


    /* ================================
       ALVO
    ================================= */

    this.targetArea =
      document.querySelector(".target-area");

    this.colorTarget =
      document.getElementById("colorTarget");

    this.targetMessage =
      document.getElementById("targetMessage");


    /* ================================
       CONTROLES
    ================================= */

    this.matchControls =
      document.getElementById("matchControls");

    this.speedControls =
      document.getElementById("speedControls");

    this.sequenceControls =
      document.getElementById("sequenceControls");


    /* ================================
       SLIDERS
    ================================= */

    this.colorPreview =
      document.getElementById("colorPreview");

    this.hue =
      document.getElementById("hue");

    this.saturation =
      document.getElementById("saturation");

    this.lightness =
      document.getElementById("lightness");

    this.hueValue =
      document.getElementById("hueValue");

    this.saturationValue =
      document.getElementById("saturationValue");

    this.lightnessValue =
      document.getElementById("lightnessValue");

    this.checkButton =
      document.getElementById("checkButton");


    /* ================================
       MODO RELÂMPAGO
    ================================= */

    this.speedOptions =
      document.getElementById("speedOptions");

    this.speedPreview =
      document.getElementById("speedPreview");


    /* ================================
       MODO SEQUÊNCIA
    ================================= */

    this.sequenceOptions =
      document.getElementById("sequenceOptions");

    this.sequencePreview =
      document.getElementById("sequencePreview");

    this.sequenceProgress =
      document.getElementById("sequenceProgress");

    this.sequenceMessage =
      document.getElementById("sequenceMessage");


    /* ================================
       RESULTADO
    ================================= */

    this.result =
      document.getElementById("result");

    this.resultTitle =
      document.getElementById("resultTitle");

    this.originalColor =
      document.getElementById("originalColor");

    this.guessedColor =
      document.getElementById("guessedColor");

    this.scoreResult =
      document.getElementById("scoreResult");

    this.resultMessage =
      document.getElementById("resultMessage");

    this.nextButton =
      document.getElementById("nextButton");

    this.restartButton =
      document.getElementById("restartButton");


    /* ================================
       CONQUISTAS
    ================================= */

    this.achievements =
      document.getElementById("achievements");

    this.achievementList =
      document.getElementById("achievementList");

    this.achievementNotification =
      document.getElementById(
        "achievementNotification"
      );


    /* ================================
       PROGRESSÃO
    ================================= */

    this.progression =
      document.getElementById("progression");

    this.playerLevel =
      document.getElementById("playerLevel");

    this.playerLevelName =
      document.getElementById("playerLevelName");

    this.playerXP =
      document.getElementById("playerXP");

    this.playerNextXP =
      document.getElementById("playerNextXP");

    this.progressBar =
      document.getElementById("progressBar");

    this.xpNotification =
      document.getElementById("xpNotification");


    /* ================================
       ESTATÍSTICAS AVANÇADAS
    ================================= */

    this.modeStatistics =
      document.getElementById("modeStatistics");

    this.gameHistory =
      document.getElementById("gameHistory");

    this.achievementNotificationTimer =
      null;

    this.xpNotificationTimer =
      null;
  }


  /* ================================
     CONFIGURAÇÕES
  ================================= */

  getMode() {
    return this.gameMode.value;
  }

  getDifficulty() {
    return this.difficulty.value;
  }


  /* ================================
     ESTATÍSTICAS
  ================================= */

  updateStats(
    score,
    streak,
    lives,
    round
  ) {
    this.score.textContent = score;
    this.streak.textContent = streak;
    this.lives.textContent = lives;
    this.round.textContent = round;

    this.animateValue(this.score);
    this.animateValue(this.streak);

    this.streak.classList.toggle(
      "streak-active",
      streak >= 3
    );

    this.lives.classList.toggle(
      "lives-danger",
      lives <= 1
    );
  }

  updateRecords(
    highScore,
    bestStreak
  ) {
    this.highScore.textContent =
      highScore;

    this.bestStreak.textContent =
      bestStreak;
  }

  animateValue(element) {
    if (!element) {
      return;
    }

    element.classList.remove(
      "stat-value-pop"
    );

    void element.offsetWidth;

    element.classList.add(
      "stat-value-pop"
    );
  }


  /* ================================
     TIMER
  ================================= */

  setTimer(time) {
    if (!this.timer) {
      return;
    }

    this.timer.textContent =
      `${Math.max(0, time).toFixed(1)}s`;

    this.timer.classList.toggle(
      "timer-warning",
      time <= 1.5 && time > 0.7
    );

    this.timer.classList.toggle(
      "timer-danger",
      time <= 0.7
    );
  }


  /* ================================
     ALVO
  ================================= */

  showTarget(
  color,
  message
) {
  this.setTargetAreaVisible(true);

  this.colorTarget.style.background =
    color;

  this.targetMessage.textContent =
    message;

  this.colorTarget.classList.remove(
    "hidden-color",
    "target-reveal"
  );

  void this.colorTarget.offsetWidth;

  this.colorTarget.classList.add(
    "target-reveal"
  );
}

  hideTarget(message) {
    this.colorTarget.classList.add(
      "hidden-color"
    );

    this.targetMessage.textContent =
      message;
  }

  setTargetAreaVisible(visible) {
    this.targetArea?.classList.toggle(
      "hidden",
      !visible
    );
  }


  /* ================================
     CONTROLES
  ================================= */

  hideControls() {
    this.matchControls?.classList.add(
      "hidden"
    );

    this.speedControls?.classList.add(
      "hidden"
    );

    this.sequenceControls?.classList.add(
      "hidden"
    );
  }

  showModeControls(mode) {
    this.hideControls();

    const controls = {
      match: this.matchControls,
      speed: this.speedControls,
      sequence: this.sequenceControls
    };

    controls[mode]?.classList.remove(
      "hidden"
    );
  }

  setCheckEnabled(enabled) {
    if (this.checkButton) {
      this.checkButton.disabled =
        !enabled;
    }
  }

  setNextEnabled(enabled) {
    if (this.nextButton) {
      this.nextButton.disabled =
        !enabled;
    }
  }


  /* ================================
     SLIDERS
  ================================= */

  getGuess() {
    return {
      h: Number(this.hue.value),
      s: Number(this.saturation.value),
      l: Number(this.lightness.value)
    };
  }

  resetSliders() {
    this.hue.value = 180;
    this.saturation.value = 65;
    this.lightness.value = 50;

    this.updateValues();
  }

  updateValues() {
    this.hueValue.textContent =
      this.hue.value;

    this.saturationValue.textContent =
      `${this.saturation.value}%`;

    this.lightnessValue.textContent =
      `${this.lightness.value}%`;
  }

  updatePreview(color) {
    if (!this.colorPreview) {
      return;
    }

    this.colorPreview.style.background =
      color;

    this.colorPreview.classList.remove(
      "preview-update"
    );

    void this.colorPreview.offsetWidth;

    this.colorPreview.classList.add(
      "preview-update"
    );
  }


  /* ================================
     MODO RELÂMPAGO
  ================================= */

  showSpeedPreview() {
    this.speedPreview?.classList.remove(
      "hidden"
    );
  }

  hideSpeedPreview() {
    this.speedPreview?.classList.add(
      "hidden"
    );
  }

  setSpeedOptions(colors) {
    const buttons =
      this.speedOptions?.querySelectorAll(
        ".color-option"
      ) || [];

    buttons.forEach(
      (button, index) => {
        button.disabled = false;
        button.dataset.index = index;

        button.classList.remove(
          "selected",
          "correct-option",
          "wrong-option"
        );

        if (colors[index]) {
          this.setColor(
            button,
            colors[index]
          );
        }
      }
    );
  }

  disableSpeedOptions() {
    this.speedOptions
      ?.querySelectorAll(
        ".color-option"
      )
      .forEach(button => {
        button.disabled = true;
      });
  }


  /* ================================
     MODO SEQUÊNCIA
  ================================= */

  setSequenceOptions(colors) {
    const buttons =
      this.sequenceOptions?.querySelectorAll(
        ".sequence-color"
      ) || [];

    buttons.forEach(
      (button, index) => {
        button.disabled = false;
        button.dataset.index = index;

        button.classList.remove(
          "selected",
          "correct-option",
          "wrong-option"
        );

        if (colors[index]) {
          this.setColor(
            button,
            colors[index]
          );
        }
      }
    );
  }

  disableSequenceOptions() {
    this.sequenceOptions
      ?.querySelectorAll(
        ".sequence-color"
      )
      .forEach(button => {
        button.disabled = true;
      });
  }

  setSequencePreview(colors) {
    if (!this.sequencePreview) {
      return;
    }

    this.sequencePreview.innerHTML = "";

    colors.forEach(color => {
      const item =
        document.createElement("span");

      item.className =
        "sequence-preview-color";

      item.style.background = color;

      this.sequencePreview.appendChild(
        item
      );
    });
  }

  clearSequencePreview() {
    if (this.sequencePreview) {
      this.sequencePreview.innerHTML = "";
    }
  }

  setSequenceProgress(
    current,
    total
  ) {
    if (!this.sequenceProgress) {
      return;
    }

    this.sequenceProgress.textContent =
      `${current}/${total}`;

    this.sequenceProgress.classList.remove(
      "progress-pop"
    );

    void this.sequenceProgress.offsetWidth;

    this.sequenceProgress.classList.add(
      "progress-pop"
    );
  }

  setSequenceMessage(message) {
    if (this.sequenceMessage) {
      this.sequenceMessage.textContent =
        message;
    }
  }


  /* ================================
     RESULTADO
  ================================= */

  showResult(
    original,
    guessed,
    points,
    message
  ) {
    this.result?.classList.remove(
      "hidden",
      "result-success",
      "result-failure"
    );

    if (this.resultTitle) {
      this.resultTitle.textContent =
        points >= 500
          ? "Resposta correta!"
          : "Resposta incorreta";
    }

    if (this.originalColor) {
      this.originalColor.style.background =
        original;
    }

    if (this.guessedColor) {
      this.guessedColor.style.background =
        guessed;
    }

    if (this.scoreResult) {
      this.scoreResult.textContent =
        points;
    }

    if (this.resultMessage) {
      this.resultMessage.textContent =
        message;
    }

    this.result?.classList.add(
      points >= 500
        ? "result-success"
        : "result-failure"
    );

    this.animateResult();
  }

  showEndGame(
    score,
    round
  ) {
    this.result?.classList.remove(
      "hidden"
    );

    if (this.resultTitle) {
      this.resultTitle.textContent =
        "Fim de jogo!";
    }

    if (this.scoreResult) {
      this.scoreResult.textContent =
        score;
    }

    if (this.resultMessage) {
      this.resultMessage.textContent =
        `Você chegou até a rodada ${round}.`;
    }

    this.result?.classList.add(
      "result-failure"
    );

    this.animateResult();
  }

  hideResult() {
    this.result?.classList.add(
      "hidden"
    );
  }

  animateResult() {
    if (!this.result) {
      return;
    }

    this.result.classList.remove(
      "result-pop"
    );

    void this.result.offsetWidth;

    this.result.classList.add(
      "result-pop"
    );
  }


  /* ================================
     CONQUISTAS
  ================================= */

  renderAchievements(
    achievements,
    unlocked
  ) {
    if (!this.achievementList) {
      return;
    }

    this.achievementList.innerHTML = "";

    achievements.forEach(
      achievement => {
        const isUnlocked =
          unlocked.includes(
            achievement.id
          );

        const item =
          document.createElement("article");

        item.className =
          "achievement";

        if (isUnlocked) {
          item.classList.add(
            "unlocked"
          );
        }

        item.dataset.id =
          achievement.id;

        item.innerHTML = `
          <div class="achievement-icon">
            ${achievement.icon}
          </div>

          <div class="achievement-info">
            <h3>${achievement.title}</h3>
            <p>${achievement.description}</p>
          </div>

          <div class="achievement-status">
            ${isUnlocked ? "✓" : "🔒"}
          </div>
        `;

        this.achievementList.appendChild(
          item
        );
      }
    );
  }

  showAchievementNotification(
    achievement
  ) {
    if (!this.achievementNotification) {
      return;
    }

    this.achievementNotification.innerHTML = `
      <span class="achievement-notification-icon">
        ${achievement.icon}
      </span>

      <div>
        <strong>Conquista desbloqueada!</strong>
        <span>${achievement.title}</span>
      </div>
    `;

    this.achievementNotification.classList.remove(
      "hidden",
      "achievement-show"
    );

    void this.achievementNotification
      .offsetWidth;

    this.achievementNotification.classList.add(
      "achievement-show"
    );

    clearTimeout(
      this.achievementNotificationTimer
    );

    this.achievementNotificationTimer =
      setTimeout(() => {
        this.achievementNotification.classList.remove(
          "achievement-show"
        );

        this.achievementNotification.classList.add(
          "hidden"
        );
      }, 3500);
  }


  /* ================================
     UTILITÁRIOS
  ================================= */

  setColor(
    element,
    color
  ) {
    element.style.background =
      color;
  }

  setSoundButton(enabled) {
    if (!this.soundButton) {
      return;
    }

    this.soundButton.textContent =
      enabled ? "🔊" : "🔇";

    this.soundButton.setAttribute(
      "aria-label",
      enabled
        ? "Desativar som"
        : "Ativar som"
    );
  }

  setThemeButton(isDark) {
    if (!this.themeButton) {
      return;
    }

    this.themeButton.textContent =
      isDark ? "☀️" : "🌙";

    this.themeButton.setAttribute(
      "aria-label",
      isDark
        ? "Ativar tema claro"
        : "Ativar tema escuro"
    );
  }


  /* ================================
     PROGRESSÃO
  ================================= */

  updateProgression(data) {
    if (!data) {
      return;
    }

    if (this.playerLevel) {
      this.playerLevel.textContent =
        data.currentLevel;
    }

    if (this.playerLevelName) {
      this.playerLevelName.textContent =
        data.currentName;
    }

    if (this.playerXP) {
      this.playerXP.textContent =
        data.currentXP;
    }

    if (this.playerNextXP) {
      this.playerNextXP.textContent =
        data.maxLevel
          ? "Nível máximo"
          : data.nextXP;
    }

    if (this.progressBar) {
      this.progressBar.style.width =
        `${data.progress}%`;

      this.progressBar.setAttribute(
        "aria-valuenow",
        data.progress
      );
    }
  }

  showXPNotification(amount) {
    if (
      !this.xpNotification ||
      amount <= 0
    ) {
      return;
    }

    this.xpNotification.textContent =
      `+${amount} XP`;

    this.xpNotification.classList.remove(
      "hidden",
      "xp-show"
    );

    void this.xpNotification.offsetWidth;

    this.xpNotification.classList.add(
      "xp-show"
    );

    clearTimeout(
      this.xpNotificationTimer
    );

    this.xpNotificationTimer =
      setTimeout(() => {
        this.xpNotification.classList.remove(
          "xp-show"
        );

        this.xpNotification.classList.add(
          "hidden"
        );
      }, 1600);
  }

  showLevelUp(level) {
    if (
      !this.progression ||
      !level
    ) {
      return;
    }

    const notification =
      document.createElement("div");

    notification.className =
      "level-up-notification";

    notification.innerHTML = `
      <span class="level-up-icon">
        🎉
      </span>

      <div>
        <strong>Novo nível!</strong>

        <span>
          Nível ${level.level}
          — ${level.name}
        </span>
      </div>
    `;

    document.body.appendChild(
      notification
    );

    requestAnimationFrame(() => {
      notification.classList.add(
        "level-up-show"
      );
    });

    setTimeout(() => {
      notification.classList.remove(
        "level-up-show"
      );

      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }


  /* ================================
     ESTATÍSTICAS AVANÇADAS
  ================================= */

  updateAdvancedStatistics(data) {
    if (!data) {
      return;
    }

    const fields = {
      accuracyStat:
        `${data.accuracy}%`,

      averageScoreStat:
        data.averageScore,

      highScoreStat:
        data.highScore,

      bestStreakStat:
        data.bestStreak,

      gamesStat:
        data.games,

      correctStat:
        data.correct
    };

    Object.entries(fields).forEach(
      ([id, value]) => {
        const element =
          document.getElementById(id);

        if (element) {
          element.textContent =
            value;
        }
      }
    );
  }

  renderModeStatistics(modeStats) {
    if (!this.modeStatistics) {
      return;
    }

    const modes = [
      {
        id: "match",
        name: "Combinação",
        icon: "🎨"
      },
      {
        id: "speed",
        name: "Relâmpago",
        icon: "⚡"
      },
      {
        id: "sequence",
        name: "Sequência",
        icon: "🧠"
      }
    ];

    this.modeStatistics.innerHTML =
      modes
        .map(mode => {
          const data =
            modeStats[mode.id] || {
              games: 0,
              averageScore: 0,
              bestScore: 0
            };

          return `
            <article class="performance-card">

              <div class="performance-card-header">
                <strong>
                  ${mode.icon}
                  ${mode.name}
                </strong>

                <span>
                  ${data.games} partidas
                </span>
              </div>

              <div class="performance-values">

                <div class="performance-value">
                  <span>Média</span>
                  <strong>
                    ${data.averageScore}
                  </strong>
                </div>

                <div class="performance-value">
                  <span>Melhor</span>
                  <strong>
                    ${data.bestScore}
                  </strong>
                </div>

              </div>

            </article>
          `;
        })
        .join("");
  }

  renderHistory(history) {
    if (!this.gameHistory) {
      return;
    }

    if (!history.length) {
      this.gameHistory.innerHTML = `
        <div class="history-empty">
          Nenhuma partida registrada ainda.
        </div>
      `;

      return;
    }

    const modeNames = {
      match: "Combinação",
      speed: "Relâmpago",
      sequence: "Sequência"
    };

    const difficultyNames = {
      easy: "Fácil",
      medium: "Médio",
      hard: "Difícil"
    };

    this.gameHistory.innerHTML =
      history
        .map(game => {
          const success =
            game.score > 0;

          return `
            <article class="history-item">

              <div
                class="history-result
                ${success
                  ? "success"
                  : "failure"}"
              >
                ${success ? "✓" : "×"}
              </div>

              <div class="history-info">

                <strong>
                  ${modeNames[game.mode]
                    || game.mode}
                  ·
                  ${difficultyNames[
                    game.difficulty
                  ] || game.difficulty}
                </strong>

                <span>
                  ${formatDate(game.date)}
                  ·
                  ${game.round} rodadas
                </span>

              </div>

              <strong class="history-score">
                ${game.score} pts
              </strong>

            </article>
          `;
        })
        .join("");
  }
}