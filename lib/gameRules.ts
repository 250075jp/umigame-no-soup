export const QUESTION_LIMITS: Record<string, number> = {
  easy: 15,
  normal: 20,
  hard: 30,
};

export function getQuestionLimit(difficulty: string) {
  return QUESTION_LIMITS[difficulty] ?? QUESTION_LIMITS.normal;
}
