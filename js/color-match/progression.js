const levels = [
  {
    level: 1,
    name: "Iniciante",
    xp: 0
  },
  {
    level: 2,
    name: "Aprendiz",
    xp: 500
  },
  {
    level: 3,
    name: "Observador",
    xp: 1200
  },
  {
    level: 4,
    name: "Especialista",
    xp: 2500
  },
  {
    level: 5,
    name: "Mestre das Cores",
    xp: 5000
  },
  {
    level: 6,
    name: "Lenda das Cores",
    xp: 8000
  }
];


export function getLevels() {
  return levels.map(level => ({
    ...level
  }));
}


export function getLevelFromXP(xp = 0) {
  const currentXP =
    Math.max(0, Number(xp) || 0);

  let current =
    levels[0];

  for (const level of levels) {
    if (currentXP >= level.xp) {
      current = level;
    } else {
      break;
    }
  }

  return {
    ...current
  };
}


export function getNextLevel(xp = 0) {
  const currentXP =
    Math.max(0, Number(xp) || 0);

  return (
    levels.find(
      level => level.xp > currentXP
    ) || null
  );
}


export function getProgress(xp = 0) {
  const currentXP =
    Math.max(0, Number(xp) || 0);

  const current =
    getLevelFromXP(currentXP);

  const next =
    getNextLevel(currentXP);

  if (!next) {
    return {
      currentLevel: current.level,
      currentName: current.name,
      currentXP,
      nextXP: current.xp,
      progress: 100,
      remaining: 0,
      maxLevel: true
    };
  }

  const levelXP =
    next.xp - current.xp;

  const earnedXP =
    currentXP - current.xp;

  const progress =
    Math.min(
      100,
      Math.round(
        (earnedXP / levelXP) * 100
      )
    );

  return {
    currentLevel: current.level,
    currentName: current.name,
    currentXP,
    nextXP: next.xp,
    progress,
    remaining:
      next.xp - currentXP,
    maxLevel: false
  };
}


export function calculateXP({
  points = 0,
  streak = 0,
  correct = false
} = {}) {
  let xp = 0;

  if (correct) {
    xp += 100;
  }

  if (points >= 1000) {
    xp += 100;
  }

  if (streak >= 5) {
    xp += 50;
  }

  if (streak >= 10) {
    xp += 100;
  }

  return xp;
}