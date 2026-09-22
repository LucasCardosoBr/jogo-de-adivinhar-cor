import { ColorGame } from "./game.js";
import {
    loadStats,
    saveStats,
    resetStats,
    loadTheme,
    saveTheme
} from "./storage.js";

const $ = (selector) => document.querySelector(selector);

const elements = {
    difficulty: $("#difficulty"),
    gameMode: $("#gameMode"),
    colorFormat: $("#colorFormat"),

    score: $("#score"),
    streak: $("#streak"),
    lives: $("#lives"),
    livesLabel: $("#livesLabel"),
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

    resetStats: $("#resetStatsButton"),

    themeButton: $("#themeButton"),
    soundButton: $("#soundButton"),

    gameOverModal: $("#gameOverModal"),
    finalScore: $("#finalScore"),
    finalStreak: $("#finalStreak"),
    finalAccuracy: $("#finalAccuracy"),
    gameOverMessage: $("#gameOverMessage"),

    closeModal: $("#closeModal"),
    playAgainButton: $("#playAgainButton"),

    memoryTimer: $("#memoryTimer")
};

class GameUI {

    constructor(elements) {
        this.elements = elements;
    }

    getDifficulty() {
        return this.elements.difficulty.value;
    }

    getGameMode() {
        return this.elements.gameMode.value;
    }

    getColorFormat() {
        return this.elements.colorFormat.value;
    }

    setStatusType(type) {
        const label = this.elements.livesLabel;

        if (!label) {
            return;
        }

        if (type === "attempts") {
            label.textContent = "🎯 Tentativas";
        } else {
            label.textContent = "❤️ Vidas";
        }
    }

    updateStatus({
        score,
        streak,
        lives,
        round,
        attempts
    }) {
        this.elements.score.textContent = score;
        this.elements.streak.textContent = streak;
        this.elements.lives.textContent = lives;
        this.elements.round.textContent = `Rodada ${round}`;
        this.elements.attempts.textContent = `Tentativas: ${attempts}`;
    }

    updateStats(stats, accuracy) {
        this.elements.highScore.textContent = stats.highScore;
        this.elements.bestStreak.textContent = stats.bestStreak;
        this.elements.totalGames.textContent = stats.totalGames;
        this.elements.accuracy.textContent = `${accuracy}%`;
    }

    updateAccuracy(accuracy) {
        this.elements.accuracy.textContent = `${accuracy}%`;
    }

    showColorCode(value) {
        this.elements.colorCode.textContent = value;
    }

    renderOptions(options, game, memory = false) {
        const container = this.elements.colorOptions;

        container.innerHTML = "";

        options.forEach((color) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = memory
                ? "color-option memory-option"
                : "color-option";

            button.style.backgroundColor = color.hex;

            button.dataset.color = color.name;
            button.setAttribute(
                "aria-label",
                `Cor ${color.name}`
            );

            const name = document.createElement("span");
            name.textContent = color.name;

            button.appendChild(name);

            button.addEventListener("click", () => {
                if (memory) {
                    game.guessMemory(color, button);
                } else {
                    game.guess(color, button);
                }
            });

            container.appendChild(button);
        });
    }

    disableOptions() {
        const buttons = this.elements.colorOptions.querySelectorAll(
            "button"
        );

        buttons.forEach((button) => {
            button.disabled = true;
        });
    }

    showFeedback(message, type = "") {
        const feedback = this.elements.feedback;

        feedback.textContent = message;
        feedback.className = "feedback";

        if (type) {
            feedback.classList.add(type);
        }
    }

    clearFeedback() {
        const feedback = this.elements.feedback;

        feedback.textContent = "";
        feedback.className = "feedback";
    }

    showHint(message) {
        const hint = this.elements.hint;

        hint.textContent = message;
        hint.classList.remove("hidden");
        hint.classList.add("show");
    }

    clearHint() {
        const hint = this.elements.hint;

        hint.textContent = "";
        hint.classList.remove("show");
        hint.classList.add("hidden");
    }

    showTimer(seconds) {
        const timer = this.elements.timer;
        const container = timer.closest(".stat");

        timer.textContent = seconds;

        if (container) {
            container.classList.remove("hidden");
        }
    }

    hideTimer() {
        const timer = this.elements.timer;
        const container = timer.closest(".stat");

        if (container) {
            container.classList.add("hidden");
        }
    }

    showMemoryTimer(seconds) {
        const timer = this.elements.memoryTimer;

        timer.textContent = seconds;
        timer.classList.remove("hidden");
        timer.style.display = "grid";
    }

    hideMemoryTimer() {
        const timer = this.elements.memoryTimer;

        timer.textContent = "";
        timer.classList.add("hidden");
        timer.style.display = "none";
    }

    startMemoryDisplay(color, seconds) {
        document.body.classList.add("memory-mode");

        this.elements.colorDisplay.style.backgroundColor = color;

        this.elements.colorCode.textContent = "";

        this.showMemoryTimer(seconds);
    }

    hideMemoryColor() {
        this.elements.colorDisplay.style.backgroundColor =
            "var(--surface)";

        this.elements.colorCode.textContent = "";

        this.hideMemoryTimer();
    }

    showGameOver({
        score,
        streak,
        accuracy,
        message
    }) {
        this.elements.finalScore.textContent = score;
        this.elements.finalStreak.textContent = streak;
        this.elements.finalAccuracy.textContent = `${accuracy}%`;
        this.elements.gameOverMessage.textContent = message;

        this.elements.gameOverModal.classList.remove("hidden");
        this.elements.gameOverModal.classList.add("show");
    }

    hideModal() {
        this.elements.gameOverModal.classList.remove("show");
        this.elements.gameOverModal.classList.add("hidden");
    }

    setQuestionLabel(text) {
        if (this.elements.questionLabel) {
            this.elements.questionLabel.textContent = text;
        }
    }
}

const stats = loadStats();

const ui = new GameUI(elements);

const game = new ColorGame(ui, stats);

function updateSoundButton() {
    const enabled = stats.soundEnabled !== false;

    elements.soundButton.textContent = enabled
        ? "🔊"
        : "🔇";

    elements.soundButton.setAttribute(
        "aria-label",
        enabled
            ? "Desativar som"
            : "Ativar som"
    );

    elements.soundButton.title = enabled
        ? "Desativar som"
        : "Ativar som";
}

function applyTheme() {
    const theme = loadTheme();

    document.body.dataset.theme = theme;

    elements.themeButton.textContent =
        theme === "dark" ? "☀️" : "🌙";

    elements.themeButton.setAttribute(
        "aria-label",
        theme === "dark"
            ? "Ativar tema claro"
            : "Ativar tema escuro"
    );

    elements.themeButton.title =
        theme === "dark"
            ? "Ativar tema claro"
            : "Ativar tema escuro";
}


/* =========================
   CONTROLES DO JOGO
========================= */

elements.restartButton.addEventListener("click", () => {
    ui.hideModal();
    game.start();
});


elements.playAgainButton?.addEventListener("click", () => {
    ui.hideModal();
    game.start();
});


elements.hintButton.addEventListener("click", () => {
    game.showHint();
});


elements.difficulty.addEventListener("change", () => {
    game.start();
});


elements.gameMode.addEventListener("change", () => {
    game.start();
});


elements.colorFormat.addEventListener("change", () => {

    if (!game.gameActive) {
        return;
    }

    if (game.getMode() === "memory") {
        return;
    }

    game.renderQuestion();
});


/* =========================
   TEMA
========================= */

elements.themeButton.addEventListener("click", () => {

    const currentTheme = loadTheme();

    const newTheme =
        currentTheme === "dark"
            ? "light"
            : "dark";

    saveTheme(newTheme);

    applyTheme();
});


/* =========================
   SOM
========================= */

elements.soundButton.addEventListener("click", () => {

    stats.soundEnabled =
        stats.soundEnabled === false;

    saveStats(stats);

    updateSoundButton();
});


/* =========================
   RESETAR ESTATÍSTICAS
========================= */

elements.resetStats?.addEventListener("click", () => {

    const confirmed = confirm(
        "Deseja realmente apagar todas as estatísticas?"
    );

    if (!confirmed) {
        return;
    }

    resetStats();

    Object.assign(stats, loadStats());

    const accuracy = game.getPersistentAccuracy();

    ui.updateStats(stats, accuracy);
});


/* =========================
   MODAL
========================= */

elements.closeModal.addEventListener("click", () => {
    ui.hideModal();
});


elements.gameOverModal.addEventListener("click", (event) => {

    if (event.target === elements.gameOverModal) {
        ui.hideModal();
    }
});


/* =========================
   INICIALIZAÇÃO
========================= */

applyTheme();
updateSoundButton();

ui.updateStats(
    stats,
    game.getPersistentAccuracy()
);

game.start();