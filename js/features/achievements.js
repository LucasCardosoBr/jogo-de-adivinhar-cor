import {
  getAchievements,
  unlockAchievement
} from "../storage.js";


const achievements = {
  "first-correct": {
    title: "Primeiro Acerto",
    description: "Acerte uma cor pela primeira vez.",
    icon: "🎯"
  },

  "streak-5": {
    title: "Em Sequência",
    description: "Consiga uma sequência de 5 acertos.",
    icon: "🔥"
  },

  "streak-10": {
    title: "Mestre das Cores",
    description: "Consiga uma sequência de 10 acertos.",
    icon: "🏆"
  },

  "score-1000": {
    title: "Mil Pontos",
    description: "Alcance 1.000 pontos.",
    icon: "⭐"
  },

  "score-5000": {
    title: "Alta Pontuação",
    description: "Alcance 5.000 pontos.",
    icon: "💎"
  },

  "games-5": {
    title: "Experiente",
    description: "Conclua 5 partidas.",
    icon: "🎮"
  }
};


export function getAchievementList() {
  return Object.entries(
    achievements
  ).map(
    ([id, achievement]) => ({
      id,
      ...achievement
    })
  );
}


export function getUnlockedAchievements() {
  return getAchievements();
}


export function getAchievement(id) {
  return achievements[id] || null;
}


export function checkAchievements(stats, streak) {
  const unlocked = [];

  if (
    stats.correct >= 1 &&
    unlockAchievement(
      "first-correct"
    )
  ) {
    unlocked.push(
      "first-correct"
    );
  }

  if (
    streak >= 5 &&
    unlockAchievement(
      "streak-5"
    )
  ) {
    unlocked.push(
      "streak-5"
    );
  }

  if (
    streak >= 10 &&
    unlockAchievement(
      "streak-10"
    )
  ) {
    unlocked.push(
      "streak-10"
    );
  }

  if (
    stats.highScore >= 1000 &&
    unlockAchievement(
      "score-1000"
    )
  ) {
    unlocked.push(
      "score-1000"
    );
  }

  if (
    stats.highScore >= 5000 &&
    unlockAchievement(
      "score-5000"
    )
  ) {
    unlocked.push(
      "score-5000"
    );
  }

  if (
    stats.games >= 5 &&
    unlockAchievement(
      "games-5"
    )
  ) {
    unlocked.push(
      "games-5"
    );
  }

  return unlocked;
}