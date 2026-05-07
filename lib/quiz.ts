import type { QuizRow, QuizSessionRow, TentativoRow } from "@/types/database";

export function shuffleQuestions(items: QuizRow[]) {
  const clone = [...items];
  for (let i = clone.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [clone[i], clone[j]] = [clone[j], clone[i]];
  }
  return clone;
}

export function computePercentage(correctAnswers: number, totalQuestions: number) {
  if (!totalQuestions) {
    return 0;
  }
  return Number(((correctAnswers / totalQuestions) * 100).toFixed(2));
}

export function buildQuestionOptions(question: QuizRow) {
  return [
    { key: "A", text: question.A },
    { key: "B", text: question.B },
    { key: "C", text: question.C },
    { key: "D", text: question.D },
    { key: "E", text: question.E }
  ] as const;
}

export function aggregateQuestionErrors(
  questions: QuizRow[],
  attempts: Array<TentativoRow & { quiz?: Pick<QuizRow, "domanda" | "materia" | "argomento"> | null }>
) {
  return questions.map((question) => {
    const related = attempts.filter((attempt) => attempt.quiz_id === question.id);
    const wrong = related.filter((attempt) => !attempt.corretta).length;
    const total = related.length;
    return {
      id: question.id,
      materia: question.materia,
      argomento: question.argomento,
      domanda: question.domanda,
      attempts: total,
      wrong,
      errorRate: total ? Number(((wrong / total) * 100).toFixed(2)) : 0
    };
  }).sort((a, b) => b.errorRate - a.errorRate || b.attempts - a.attempts);
}

export function aggregateStudentRanking(
  sessions: Array<QuizSessionRow & { profiles?: { full_name: string | null; email: string } | null }>
) {
  const byStudent = new Map<string, { name: string; sessions: number; average: number; best: number }>();
  for (const session of sessions) {
    const key = session.user_id;
    const current = byStudent.get(key) ?? {
      name: session.profiles?.full_name || session.profiles?.email || "Studente",
      sessions: 0,
      average: 0,
      best: 0
    };
    current.sessions += 1;
    current.average += session.percentage;
    current.best = Math.max(current.best, session.percentage);
    byStudent.set(key, current);
  }

  return [...byStudent.entries()].map(([userId, value]) => ({
    userId,
    name: value.name,
    sessions: value.sessions,
    average: Number((value.average / value.sessions).toFixed(2)),
    best: value.best
  })).sort((a, b) => b.average - a.average || b.best - a.best);
}
