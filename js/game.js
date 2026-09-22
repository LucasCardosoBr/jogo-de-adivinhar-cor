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

        this.gameActive = false;

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
        this.nextRoundTimer = null;

        this.memoryActive = false;

        this.resetState();
    }


    /* =========================
       CONTROLE DO ESTADO
    ========================= */

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

        this.memoryActive = false;
    }


    stopTimers() {

        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }

        if (this.memoryTimer) {
            clearInterval(this.memoryTimer);
            this.memoryTimer = null;
        }
    }


    stopNextRoundTimer() {

        if (this.nextRoundTimer) {
            clearTimeout(this.nextRoundTimer);
            this.nextRoundTimer = null;
        }
    }


    /* =========================
       INICIAR JOGO
    ========================= */

    start() {

        this.stopTimers();
        this.stopNextRoundTimer();

        this.gameActive = false;

        this.resetState();

        this.gameActive = true;

        this.stats.totalGames++;

        this.ui.hideModal();
        this.ui.hideTimer();
        this.ui.hideMemoryTimer();

        document.body.classList.remove("memory-mode");

        this.updateUI();

        const mode = this.getMode();

        if (mode === "time") {
            this.lives = 3;
            this.startTimeAttack();
        }

        this.startRound();

        this.save();
    }


    /* =========================
       INICIAR RODADA
    ========================= */

    startRound() {

        this.stopMemoryTimer();

        this.stopNextRoundTimer();

        this.memoryActive = false;

        this.attempts = 0;

        this.ui.clearFeedback();
        this.ui.clearHint();

        this.ui.hideMemoryTimer();

        document.body.classList.remove("memory-mode");

        const mode = this.getMode();

        if (mode === "memory") {

            this.ui.hideTimer();

            this.startMemoryRound();

            return;
        }

        this.prepareOptions();

        this.renderQuestion();

        if (mode === "classic") {

            this.lives = this.getMaxAttempts();

            this.ui.setStatusType("attempts");
            this.ui.hideTimer();

            this.ui.setQuestionLabel(
                "Qual é a cor correta?"
            );

        } else {

            this.ui.setStatusType("lives");

            this.ui.setQuestionLabel(
                "Qual é esta cor?"
            );
        }

        this.updateUI();
    }


    /* =========================
       CONFIGURAÇÕES
    ========================= */

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

        return (
            difficultyConfig[this.getDifficulty()] ||
            difficultyConfig.medium
        );
    }


    getMaxAttempts() {
        return this.getConfig().attempts;
    }


    /* =========================
       PREPARAR CORES
    ========================= */

    prepareOptions() {

        const difficulty = this.getDifficulty();

        const source =
            difficulty === "hard"
                ? hardColors
                : colors;

        const amount = this.getConfig().options;

        this.options = shuffle([...source]).slice(
            0,
            Math.min(amount, source.length)
        );

        this.secret =
            this.options[
                Math.floor(
                    Math.random() * this.options.length
                )
            ];
    }


    /* =========================
       MOSTRAR PERGUNTA
    ========================= */

    renderQuestion() {

        if (!this.secret) {
            return;
        }

        const format = this.getFormat();

        const value = getColorValue(
            this.secret,
            format
        );

        this.ui.showColorCode(value);

        this.ui.renderOptions(
            this.options,
            this,
            false
        );

        this.ui.elements.colorDisplay.style.backgroundColor =
            this.secret.hex;
    }


    /* =========================
       RESPOSTA NORMAL
    ========================= */

    guess(color, button) {

        if (!this.gameActive) {
            return;
        }

        if (this.memoryActive) {
            return;
        }

        if (!button || button.disabled) {
            return;
        }

        this.totalAnswers++;
        this.stats.totalAnswers++;


        const correct =
            color.name === this.secret.name;


        if (correct) {

            this.handleCorrect();

        } else {

            this.handleWrong(button);
        }


        this.save();
    }


    /* =========================
       RESPOSTA CORRETA
    ========================= */

    handleCorrect() {

        this.correctAnswers++;
        this.stats.correctAnswers++;

        this.streak++;

        this.stats.bestStreak = Math.max(
            this.stats.bestStreak,
            this.streak
        );


        const mode = this.getMode();

        let points;


        if (mode === "memory") {

            points =
                20 +
                Math.min(
                    this.streak * 5,
                    50
                );

        } else {

            points =
                10 *
                Math.min(
                    this.streak,
                    5
                );
        }


        this.score += points;


        this.stats.highScore = Math.max(
            this.stats.highScore,
            this.score
        );


        this.ui.showFeedback(
            `Correta! +${points} pontos`,
            "success"
        );


        this.ui.clearHint();
        this.ui.disableOptions();


        playSound(
            "success",
            this.stats.soundEnabled !== false
        );


        this.celebrate();

        this.updateUI();


        this.nextRoundTimer = setTimeout(() => {

            this.nextRoundTimer = null;

            if (!this.gameActive) {
                return;
            }

            this.round++;

            this.startRound();

        }, 900);
    }


    /* =========================
       RESPOSTA ERRADA
    ========================= */

    handleWrong(button) {

        this.streak = 0;

        const mode = this.getMode();


        if (mode === "classic") {

            this.attempts++;

            const remaining =
                this.getMaxAttempts() -
                this.attempts;


            this.ui.showFeedback(
                `Errada! Você ainda tem ${remaining} tentativa(s).`,
                "error"
            );


            this.showClassicHint();


            if (remaining <= 0) {

                this.ui.showFeedback(
                    `Fim das tentativas! A cor era ${this.secret.name}.`,
                    "error"
                );


                this.disableWrongButton(button);


                setTimeout(() => {

                    if (this.gameActive) {
                        this.endGame();
                    }

                }, 700);


                return;
            }


        } else {

            this.lives--;


            this.ui.showFeedback(
                `Errada! Você perdeu uma vida.`,
                "error"
            );


            this.disableWrongButton(button);


            if (this.lives <= 0) {

                this.ui.showFeedback(
                    `Fim de jogo! A cor era ${this.secret.name}.`,
                    "error"
                );


                setTimeout(() => {

                    if (this.gameActive) {
                        this.endGame();
                    }

                }, 700);


                return;
            }
        }


        playSound(
            "error",
            this.stats.soundEnabled !== false
        );


        this.updateUI();
    }


    /* =========================
       DESABILITAR RESPOSTA ERRADA
    ========================= */

    disableWrongButton(button) {

        if (!button) {
            return;
        }

        button.classList.add("wrong");
        button.disabled = true;

        setTimeout(() => {

            button.classList.remove("wrong");

        }, 500);
    }


    /* =========================
       SISTEMA DE DICAS
    ========================= */

    showClassicHint() {

        if (!this.secret) {
            return;
        }


        const remaining =
            this.getMaxAttempts() -
            this.attempts;


        const {
            rgb,
            hex,
            name
        } = this.secret;


        let message;


        if (remaining >= 4) {

            message =
                `Dica: a cor começa com "${name.charAt(0)}".`;

        } else if (remaining === 3) {

            message =
                `Dica: RGB = ${rgb}`;

        } else if (remaining === 2) {

            message =
                `Dica: HEX começa com ${hex.substring(0, 4)}...`;

        } else {

            message =
                `Dica final: RGB = ${rgb}`;
        }


        this.ui.showHint(message);
    }


    showHint() {

        if (!this.gameActive) {
            return;
        }


        const mode = this.getMode();


        if (mode === "memory") {

            this.ui.showHint(
                "A dica não está disponível no modo Memória."
            );

            return;
        }


        if (!this.secret) {
            return;
        }


        if (mode === "classic") {

            this.showClassicHint();

            return;
        }


        const {
            rgb,
            hex
        } = this.secret;


        this.ui.showHint(
            `Dica: RGB ${rgb} • HEX ${hex}`
        );
    }


    /* =========================
       TIME ATTACK
    ========================= */

    startTimeAttack() {

        this.stopTimeTimer();

        let timeLeft = GAME_TIME;

        this.ui.showTimer(timeLeft);


        this.timer = setInterval(() => {

            if (!this.gameActive) {
                this.stopTimeTimer();
                return;
            }


            timeLeft--;

            this.ui.showTimer(timeLeft);


            if (timeLeft <= 0) {

                this.stopTimeTimer();

                this.ui.showFeedback(
                    "Tempo esgotado!",
                    "error"
                );


                setTimeout(() => {

                    if (this.gameActive) {
                        this.endGame();
                    }

                }, 500);
            }

        }, 1000);
    }


    stopTimeTimer() {

        if (this.timer) {

            clearInterval(this.timer);

            this.timer = null;
        }
    }


    /* =========================
       MODO MEMÓRIA
    ========================= */

    startMemoryRound() {

        this.stopMemoryTimer();

        const difficulty =
            this.getDifficulty();


        const source =
            difficulty === "hard"
                ? hardColors
                : colors;


        const amount =
            this.getConfig().memoryOptions;


        this.options = shuffle([
            ...source
        ]).slice(
            0,
            Math.min(
                amount,
                source.length
            )
        );


        this.secret =
            this.options[
                Math.floor(
                    Math.random() *
                    this.options.length
                )
            ];


        this.memoryActive = true;

        this.lives = 3;


        this.ui.setStatusType("lives");

        this.ui.setQuestionLabel(
            "Memorize a cor!"
        );


        this.ui.clearFeedback();
        this.ui.clearHint();


        this.ui.renderOptions(
            [],
            this,
            true
        );


        this.ui.startMemoryDisplay(
            this.secret.hex,
            MEMORY_TIME
        );


        let timeLeft = MEMORY_TIME;


        this.memoryTimer =
            setInterval(() => {

                if (!this.gameActive) {

                    this.stopMemoryTimer();

                    return;
                }


                timeLeft--;

                this.ui.showMemoryTimer(
                    timeLeft
                );


                if (timeLeft <= 0) {

                    this.finishMemoryDisplay();
                }

            }, 1000);


        this.updateUI();
    }


    finishMemoryDisplay() {

        this.stopMemoryTimer();

        if (!this.gameActive) {
            return;
        }


        this.ui.hideMemoryColor();


        this.ui.setQuestionLabel(
            "Qual era a cor?"
        );


        this.ui.showFeedback(
            "Escolha a cor que você acabou de memorizar.",
            "info"
        );


        this.ui.renderOptions(
            this.options,
            this,
            true
        );


        this.updateUI();
    }


    stopMemoryTimer() {

        if (this.memoryTimer) {

            clearInterval(
                this.memoryTimer
            );

            this.memoryTimer = null;
        }
    }


    /* =========================
       RESPOSTA DO MODO MEMÓRIA
    ========================= */

    guessMemory(color, button) {

        if (!this.gameActive) {
            return;
        }

        if (!this.memoryActive) {
            return;
        }

        if (!button || button.disabled) {
            return;
        }


        this.totalAnswers++;
        this.stats.totalAnswers++;


        const correct =
            color.name === this.secret.name;


        if (correct) {

            this.correctAnswers++;
            this.stats.correctAnswers++;

            this.streak++;


            this.stats.bestStreak =
                Math.max(
                    this.stats.bestStreak,
                    this.streak
                );


            const points =
                20 +
                Math.min(
                    this.streak * 5,
                    50
                );


            this.score += points;


            this.stats.highScore =
                Math.max(
                    this.stats.highScore,
                    this.score
                );


            this.ui.showFeedback(
                `Memória perfeita! +${points} pontos`,
                "success"
            );


            this.ui.disableOptions();


            playSound(
                "success",
                this.stats.soundEnabled !== false
            );


            this.celebrate();


            this.memoryActive = false;

            document.body.classList.remove(
                "memory-mode"
            );


            this.updateUI();


            this.nextRoundTimer =
                setTimeout(() => {

                    this.nextRoundTimer = null;

                    if (!this.gameActive) {
                        return;
                    }

                    this.round++;

                    this.startRound();

                }, 900);


        } else {

            this.streak = 0;

            this.lives--;


            this.disableWrongButton(
                button
            );


            this.ui.showFeedback(
                `Errada! Você ainda tem ${this.lives} vida(s).`,
                "error"
            );


            playSound(
                "error",
                this.stats.soundEnabled !== false
            );


            if (this.lives <= 0) {

                this.memoryActive = false;


                setTimeout(() => {

                    if (this.gameActive) {
                        this.endGame();
                    }

                }, 700);


                return;
            }


            this.updateUI();
        }


        this.save();
    }


    /* =========================
       ATUALIZAR INTERFACE
    ========================= */

    updateUI() {

        const mode = this.getMode();


        let visibleLives;


        if (mode === "classic") {

            visibleLives =
                Math.max(
                    this.getMaxAttempts() -
                    this.attempts,
                    0
                );

        } else {

            visibleLives =
                Math.max(
                    this.lives,
                    0
                );
        }


        const sessionAccuracy =
            this.getCurrentAccuracy();


        this.ui.updateStatus({

            score: this.score,

            streak: this.streak,

            lives: visibleLives,

            round: this.round + 1,

            attempts:
                mode === "classic"
                    ? this.attempts
                    : "—"
        });


        this.ui.updateStats(
            this.stats,
            this.getPersistentAccuracy()
        );


        this.ui.updateAccuracy(
            sessionAccuracy
        );
    }


    /* =========================
       ESTATÍSTICAS
    ========================= */

    getCurrentAccuracy() {

        if (this.totalAnswers === 0) {
            return 0;
        }


        return Math.round(
            (
                this.correctAnswers /
                this.totalAnswers
            ) * 100
        );
    }


    getPersistentAccuracy() {

        if (
            !this.stats.totalAnswers ||
            this.stats.totalAnswers <= 0
        ) {
            return 0;
        }


        return Math.round(
            (
                this.stats.correctAnswers /
                this.stats.totalAnswers
            ) * 100
        );
    }


    /* =========================
       FIM DE JOGO
    ========================= */

    endGame() {

        if (!this.gameActive) {
            return;
        }


        this.gameActive = false;

        this.memoryActive = false;


        this.stopTimers();
        this.stopNextRoundTimer();


        document.body.classList.remove(
            "memory-mode"
        );


        this.ui.hideTimer();
        this.ui.hideMemoryTimer();


        const accuracy =
            this.getCurrentAccuracy();


        let message;


        if (accuracy >= 80) {

            message =
                "Excelente! Você teve um ótimo desempenho.";

        } else if (accuracy >= 50) {

            message =
                "Bom trabalho! Continue praticando.";

        } else {

            message =
                "Continue tentando. A prática melhora sua pontuação!";
        }


        this.ui.showGameOver({

            score: this.score,

            streak: this.streak,

            accuracy,

            message
        });


        this.save();
    }


    /* =========================
       CONFETES
    ========================= */

    celebrate() {

        if (
            typeof window.confetti !==
            "function"
        ) {
            return;
        }


        window.confetti({

            particleCount: 80,

            spread: 70,

            origin: {
                y: 0.6
            }
        });
    }


    /* =========================
       SALVAR
    ========================= */

    save() {

        saveStats(this.stats);
    }
}