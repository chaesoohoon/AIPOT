import { examBlueprint } from "../data/examBlueprint";
import { questions } from "../data/questionBank";
import type { ExamSettings, FavoriteEntry, Question, QuestionType, WrongNoteEntry } from "../types";

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export interface ExamShortage {
  type: QuestionType;
  required: number;
  available: number;
}

export interface ExamPlan {
  questions: Question[];
  targets: Partial<Record<QuestionType, number>>;
  shortages: ExamShortage[];
  eligibleCount: number;
}

const allTypes: QuestionType[] = ["multiple", "tableChoice", "ox", "short", "blank", "essay", "prompt"];

const scaledTargets = (settings: ExamSettings): Partial<Record<QuestionType, number>> => {
  const baseTargets = { ...examBlueprint.typeTargets };
  if (!settings.includeTable) baseTargets.tableChoice = 0;
  if (!settings.includeEssay) baseTargets.essay = 0;
  if (!settings.includePrompt) baseTargets.prompt = 0;

  const baseTotal = allTypes.reduce((sum, type) => sum + (baseTargets[type] ?? 0), 0);
  if (baseTotal === settings.questionCount) return baseTargets;
  if (baseTotal <= 0) return baseTargets;

  const scale = settings.questionCount / baseTotal;
  const scaled: Partial<Record<QuestionType, number>> = {};
  let assigned = 0;
  const activeTypes = allTypes.filter((type) => (baseTargets[type] ?? 0) > 0);

  activeTypes.forEach((type, index) => {
    const raw = (baseTargets[type] ?? 0) * scale;
    const count = index === activeTypes.length - 1 ? Math.max(0, settings.questionCount - assigned) : Math.max(0, Math.round(raw));
    scaled[type] = count;
    assigned += count;
  });

  return scaled;
};

const isAllowedForExam = (question: Question, settings: ExamSettings) => {
  if (question.status !== "active") return false;
  if (question.examSuitability !== "실전적합") return false;
  if (question.type === "tableChoice") return settings.includeTable;
  if (question.type === "essay") return settings.includeEssay;
  if (question.type === "prompt") return settings.includePrompt;
  return ["multiple", "ox", "short", "blank"].includes(question.type);
};

export const createExamPlan = (
  settings: ExamSettings,
  favorites: FavoriteEntry[],
  wrongNotes: WrongNoteEntry[],
  initialPoolIds?: string[],
): ExamPlan => {
  const favoriteIds = new Set(favorites.map((favorite) => favorite.questionId));
  const retryMap = new Map(wrongNotes.map((note) => [note.questionId, note.retryCount]));
  const initialIds = initialPoolIds ? new Set(initialPoolIds) : undefined;
  const targets = scaledTargets(settings);

  let pool = questions.filter((question) => {
    const categoryMatch = settings.categories.length === 0 || settings.categories.includes(question.category);
    const difficultyMatch = settings.difficulties.length === 0 || settings.difficulties.includes(question.difficulty);
    const favoriteMatch = !settings.favoriteOnly || favoriteIds.has(question.id);
    const poolMatch = !initialIds || initialIds.has(question.id);
    return categoryMatch && difficultyMatch && favoriteMatch && poolMatch && isAllowedForExam(question, settings);
  });

  pool = settings.wrongFirst
    ? [...pool].sort((a, b) => (retryMap.get(b.id) ?? 0) - (retryMap.get(a.id) ?? 0) || Math.random() - 0.5)
    : shuffle(pool);

  const selected: Question[] = [];
  const shortages: ExamShortage[] = [];

  (Object.entries(targets) as Array<[QuestionType, number]>).forEach(([type, required]) => {
    if (required <= 0) return;
    const typed = pool.filter((question) => question.type === type);
    if (typed.length < required) {
      shortages.push({ type, required, available: typed.length });
      return;
    }
    selected.push(...typed.slice(0, required));
  });

  return {
    questions: shortages.length ? [] : shuffle(selected),
    targets,
    shortages,
    eligibleCount: pool.length,
  };
};

export const createExamQuestions = (
  settings: ExamSettings,
  favorites: FavoriteEntry[],
  wrongNotes: WrongNoteEntry[],
  initialPoolIds?: string[],
) => createExamPlan(settings, favorites, wrongNotes, initialPoolIds).questions;

export const defaultExamSettings: ExamSettings = {
  questionCount: examBlueprint.totalQuestions,
  minutes: examBlueprint.timeLimitMinutes,
  categories: [],
  difficulties: ["쉬움", "보통", "어려움"],
  includeTable: examBlueprint.includeTableQuestions,
  includeEssay: examBlueprint.includeEssay,
  includePrompt: examBlueprint.includePromptPractice,
  wrongFirst: false,
  favoriteOnly: false,
};
