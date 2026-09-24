const state = {
  score: 0,
  streak: 0,
  lives: 0,
  round: 1,

  currentRound: null,
  locked: false,
  sequenceAnswer: []
};

export function getState() {
  return state;
}

export function resetState(lives) {
  state.score = 0;
  state.streak = 0;
  state.lives = lives;
  state.round = 1;

  state.currentRound = null;
  state.locked = false;
  state.sequenceAnswer = [];
}

export function resetRoundState() {
  state.currentRound = null;
  state.locked = true;
  state.sequenceAnswer = [];
}

export function setCurrentRound(round) {
  state.currentRound = round;
}

export function setLocked(value) {
  state.locked = value;
}

export function setSequenceAnswer(answer) {
  state.sequenceAnswer = answer;
}

export function addScore(points) {
  state.score += points;
}

export function addStreak() {
  state.streak++;
}

export function resetStreak() {
  state.streak = 0;
}

export function loseLife() {
  state.lives--;
}

export function nextRound() {
  state.round++;
}