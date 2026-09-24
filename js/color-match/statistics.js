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


export function getModeStats(
  history,
  mode
) {
  const games =
    history.filter(
      game => game.mode === mode
    );

  if (!games.length) {
    return {
      games: 0,
      averageScore: 0,
      bestScore: 0
    };
  }

  const total =
    games.reduce(
      (sum, game) =>
        sum + game.score,
      0
    );

  return {
    games: games.length,

    averageScore:
      Math.round(
        total / games.length
      ),

    bestScore:
      Math.max(
        ...games.map(
          game => game.score
        )
      )
  };
}


export function getDifficultyStats(
  history,
  difficulty
) {
  const games =
    history.filter(
      game =>
        game.difficulty === difficulty
    );

  if (!games.length) {
    return {
      games: 0,
      averageScore: 0,
      bestScore: 0
    };
  }

  const total =
    games.reduce(
      (sum, game) =>
        sum + game.score,
      0
    );

  return {
    games: games.length,

    averageScore:
      Math.round(
        total / games.length
      ),

    bestScore:
      Math.max(
        ...games.map(
          game => game.score
        )
      )
  };
}


export function formatDate(
  date
) {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      dateStyle: "short",
      timeStyle: "short"
    }
  ).format(
    new Date(date)
  );
}