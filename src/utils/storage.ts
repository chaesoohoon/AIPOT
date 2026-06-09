import { questions } from "../data/questionBank";
import type {
  AttemptRecord,
  Category,
  Difficulty,
  ExamResult,
  FavoriteEntry,
  GradeStatus,
  Question,
  QuestionType,
  UserSettings,
  WrongNoteEntry,
} from "../types";

const ATTEMPTS_KEY = "aipot2.attempts";
const WRONG_KEY = "aipot2.wrongNotes";
const FAVORITES_KEY = "aipot2.favorites";
const EXAMS_KEY = "aipot2.examResults";
const SETTINGS_KEY = "aipot2.settings";

const nowId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const canUseStorage = () => typeof window !== "undefined" && typeof window.localStorage !== "undefined";

const read = <T,>(key: string, fallback: T): T => {
  if (!canUseStorage()) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const write = <T,>(key: string, value: T) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const storage = {
  getAttempts: () =>
    read<AttemptRecord[]>(ATTEMPTS_KEY, []).map((attempt) => ({
      ...attempt,
      attemptId: attempt.attemptId ?? attempt.id,
      correctAnswer: attempt.correctAnswer ?? questionMap.get(attempt.questionId)?.answer,
      isCorrect: attempt.isCorrect ?? attempt.result === "correct",
      isPartial: attempt.isPartial ?? attempt.result === "partial",
      score: attempt.score ?? attempt.scoreRatio,
    })),
  addAttempt: (attempt: Omit<AttemptRecord, "id" | "answeredAt">) => {
    const attempts = storage.getAttempts();
    const id = nowId();
    const next: AttemptRecord = {
      ...attempt,
      id,
      attemptId: attempt.attemptId ?? id,
      isCorrect: attempt.isCorrect ?? attempt.result === "correct",
      isPartial: attempt.isPartial ?? attempt.result === "partial",
      score: attempt.score ?? attempt.scoreRatio,
      answeredAt: new Date().toISOString(),
    };
    write(ATTEMPTS_KEY, [next, ...attempts].slice(0, 2000));
    return next;
  },
  getWrongNotes: () => read<WrongNoteEntry[]>(WRONG_KEY, []),
  upsertWrongNote: (entry: Omit<WrongNoteEntry, "wrongAt" | "retryCount">) => {
    const notes = storage.getWrongNotes();
    const existing = notes.find((note) => note.questionId === entry.questionId);
    const nextEntry: WrongNoteEntry = {
      ...entry,
      wrongAt: new Date().toISOString(),
      retryCount: existing ? existing.retryCount + 1 : 1,
    };
    write(WRONG_KEY, [nextEntry, ...notes.filter((note) => note.questionId !== entry.questionId)]);
    return nextEntry;
  },
  deleteWrongNote: (questionId: string) => {
    write(
      WRONG_KEY,
      storage.getWrongNotes().filter((note) => note.questionId !== questionId),
    );
  },
  markWrongAsCorrect: (questionId: string) => {
    write(
      WRONG_KEY,
      storage.getWrongNotes().map((note) => (note.questionId === questionId ? { ...note, lastResult: "correct" as GradeStatus } : note)),
    );
  },
  getFavorites: () => read<FavoriteEntry[]>(FAVORITES_KEY, []),
  isFavorite: (questionId: string) => storage.getFavorites().some((favorite) => favorite.questionId === questionId),
  toggleFavorite: (questionId: string) => {
    const favorites = storage.getFavorites();
    const exists = favorites.some((favorite) => favorite.questionId === questionId);
    const next = exists
      ? favorites.filter((favorite) => favorite.questionId !== questionId)
      : [{ questionId, addedAt: new Date().toISOString() }, ...favorites];
    write(FAVORITES_KEY, next);
    return !exists;
  },
  getExamResults: () => read<ExamResult[]>(EXAMS_KEY, []),
  addExamResult: (result: Omit<ExamResult, "id" | "date">) => {
    const next: ExamResult = { ...result, id: nowId(), date: new Date().toISOString() };
    write(EXAMS_KEY, [next, ...storage.getExamResults()].slice(0, 100));
    return next;
  },
  getSettings: (): UserSettings => read<UserSettings>(SETTINGS_KEY, { passScore: 70, darkMode: false }),
  saveSettings: (settings: UserSettings) => write(SETTINGS_KEY, settings),
  resetAll: () => {
    if (!canUseStorage()) return;
    [ATTEMPTS_KEY, WRONG_KEY, FAVORITES_KEY, EXAMS_KEY].forEach((key) => window.localStorage.removeItem(key));
  },
};

const questionMap = new Map(questions.map((question) => [question.id, question]));

const byCategory = (records: AttemptRecord[]) => {
  const map = new Map<Category, { total: number; earned: number; wrong: number }>();
  records.forEach((record) => {
    const current = map.get(record.category) ?? { total: 0, earned: 0, wrong: 0 };
    current.total += 1;
    current.earned += record.scoreRatio;
    if (record.result === "wrong") current.wrong += 1;
    map.set(record.category, current);
  });
  return Array.from(map.entries()).map(([category, value]) => ({
    category,
    total: value.total,
    accuracy: value.total ? Math.round((value.earned / value.total) * 100) : 0,
    wrong: value.wrong,
  }));
};

const byType = (records: AttemptRecord[]) => {
  const map = new Map<QuestionType, { total: number; earned: number; wrong: number }>();
  records.forEach((record) => {
    const current = map.get(record.type) ?? { total: 0, earned: 0, wrong: 0 };
    current.total += 1;
    current.earned += record.scoreRatio;
    if (record.result === "wrong") current.wrong += 1;
    map.set(record.type, current);
  });
  return Array.from(map.entries()).map(([type, value]) => ({
    type,
    total: value.total,
    accuracy: value.total ? Math.round((value.earned / value.total) * 100) : 0,
    wrong: value.wrong,
  }));
};

export const getLearningSnapshot = () => {
  const attempts = storage.getAttempts();
  const exams = storage.getExamResults();
  const total = attempts.length;
  const earned = attempts.reduce((sum, attempt) => sum + attempt.scoreRatio, 0);
  const accuracy = total ? Math.round((earned / total) * 100) : 0;
  const uniqueSolved = new Set(attempts.map((attempt) => attempt.questionId)).size;
  const recentAttempts = attempts.slice(0, 30);
  const recentAccuracy = recentAttempts.length ? Math.round((recentAttempts.reduce((sum, attempt) => sum + attempt.scoreRatio, 0) / recentAttempts.length) * 100) : 0;
  const examAverage = exams.length ? Math.round(exams.reduce((sum, exam) => sum + exam.score, 0) / exams.length) : 0;
  const recentExam3 = exams.slice(0, 3);
  const recentExam3Average = recentExam3.length ? Math.round(recentExam3.reduce((sum, exam) => sum + exam.score, 0) / recentExam3.length) : 0;
  const weak = byCategory(attempts)
    .filter((item) => item.total >= 5)
    .sort((a, b) => b.wrong - a.wrong || a.accuracy - b.accuracy)
    .slice(0, 3);
  const recentScore = exams[0]?.score ?? 0;
  const passReadiness =
    exams.length < 3
      ? { label: "데이터 부족", basis: "실전모드 3회 이상 응시 후 분석 가능" }
      : recentExam3Average >= 85
        ? { label: "안정권", basis: "최근 3회 평균 85점 이상" }
        : recentExam3Average >= 70
          ? { label: "합격권", basis: "최근 3회 평균 70점 이상" }
          : recentExam3Average >= 60
            ? { label: "보완 필요", basis: "최근 3회 평균 60~69점" }
            : { label: "기초 복습 필요", basis: "최근 3회 평균 60점 미만" };

  const wrongNotes = storage.getWrongNotes();
  const reviewedWrongAttempts = attempts.filter((attempt) => wrongNotes.some((note) => note.questionId === attempt.questionId));
  const repeatedWrong = reviewedWrongAttempts.filter((attempt) => attempt.result === "wrong").length;
  const relapseRate = reviewedWrongAttempts.length ? Math.round((repeatedWrong / reviewedWrongAttempts.length) * 100) : 0;
  const reviewComplete = wrongNotes.length ? Math.round((wrongNotes.filter((note) => note.lastResult === "correct").length / wrongNotes.length) * 100) : 0;

  return {
    total,
    uniqueSolved,
    accuracy,
    recentAccuracy,
    examAverage,
    wrongTotal: storage.getWrongNotes().length,
    weak,
    recentScore,
    passReadiness,
    recentExam3Average,
    relapseRate,
    reviewComplete,
    examCount: exams.length,
  };
};

export const getAccuracyByCategory = () => byCategory(storage.getAttempts());

export const getAccuracyByDifficulty = () => {
  const attempts = storage.getAttempts();
  const map = new Map<Difficulty, { total: number; earned: number }>();
  attempts.forEach((record) => {
    const current = map.get(record.difficulty) ?? { total: 0, earned: 0 };
    current.total += 1;
    current.earned += record.scoreRatio;
    map.set(record.difficulty, current);
  });
  return Array.from(map.entries()).map(([difficulty, value]) => ({
    difficulty,
    total: value.total,
    accuracy: value.total ? Math.round((value.earned / value.total) * 100) : 0,
  }));
};

export const getAccuracyByType = () => byType(storage.getAttempts());

export const getMostWrongConcepts = () => {
  const wrongNotes = storage.getWrongNotes();
  return wrongNotes
    .map((note) => {
      const question = questionMap.get(note.questionId);
      return {
        questionId: note.questionId,
        label: question?.relatedConcept ?? note.questionId,
        retryCount: note.retryCount,
        category: note.category,
      };
    })
    .sort((a, b) => b.retryCount - a.retryCount)
    .slice(0, 5);
};

export const makeWrongNoteEntry = (question: Question, userAnswer: string, result: GradeStatus): Omit<WrongNoteEntry, "wrongAt" | "retryCount"> => ({
  questionId: question.id,
  userAnswer,
  correctAnswer: question.answer,
  explanation: question.explanation,
  category: question.category,
  difficulty: question.difficulty,
  lastResult: result,
  memoryTip: question.memoryTip,
});
