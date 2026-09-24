function getFilteredStats(history, filter) {
  const games = history.filter(filter);

  if (!games.length) {
    return {
      games: 0,
      averageScore: 0,
      bestScore: 0
    };
  }

  const total = games.reduce(
    (sum, game) => sum + game.score,
    0
  );

  return {
    games: games.length,
    averageScore: Math.round(
      total / games.length
    ),
    bestScore: Math.max(
      ...games.map(game => game.score)
    )
  };
}


/* ================================
   PRECISÃO
================================ */

export function calculateAccuracy(
  correct,
  attempts
) {
  if (!attempts) {
    return 0;
  }

  return Math.round(
    (correct / attempts) * 100
  );
}


/* ================================
   MÉDIA DE PONTOS
================================ */

export function calculateAverageScore(
  totalScore,
  attempts
) {
  if (!attempts) {
    return 0;
  }

  return Math.round(
    totalScore / attempts
  );
}


/* ================================
   ESTATÍSTICAS POR MODO
================================ */

export function getModeStats(
  history,
  mode
) {
  return getFilteredStats(
    history,
    game => game.mode === mode
  );
}


/* ================================
   ESTATÍSTICAS POR DIFICULDADE
================================ */

export function getDifficultyStats(
  history,
  difficulty
) {
  return getFilteredStats(
    history,
    game =>
      game.difficulty === difficulty
  );
}


/* ================================
   DATA
================================ */

export function formatDate(date) {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      dateStyle: "short",
      timeStyle: "short"
    }
  ).format(new Date(date));
}