export const QUESTION_LIMITS: Record<string, number> = {
  easy: 15,
  normal: 20,
  hard: 30,
};

export function getQuestionLimit(difficulty: string) {
  return QUESTION_LIMITS[difficulty] ?? QUESTION_LIMITS.normal;
}

export const DIFFICULTY_STARS: Record<string, number> = {
  easy: 1,
  normal: 2,
  hard: 3,
};

export function getDifficultyStars(difficulty: string) {
  return DIFFICULTY_STARS[difficulty] ?? DIFFICULTY_STARS.normal;
}
