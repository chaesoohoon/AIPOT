import { questions } from "../data/questionBank";
import type { Category, ExamSettings, FavoriteEntry, Question, QuestionType, WrongNoteEntry } from "../types";

const shuffle = <T,>(items: T[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const baseExamTypes: QuestionType[] = ["multiple", "ox", "short", "blank"];

const typeTargets = (count: number, includeEssay: boolean, includePrompt: boolean) => {
  const essay = includeEssay ? Math.max(1, Math.round(count * 0.05)) : 0;
  const prompt = includePrompt ? Math.max(1, Math.round(count * 0.05)) : 0;
  const ox = Math.max(1, Math.round(count * 0.125));
  const short = Math.max(1, Math.round(count * 0.125));
  const blank = 0;
  const multiple = Math.max(0, count - ox - short - blank - essay - prompt);
  return { multiple, ox, short, blank, essay, prompt };
};

const categoryBalanced = (pool: Question[], count: number) => {
  const groups = new Map<Category, Question[]>();
  shuffle(pool).forEach((question) => {
    groups.set(question.category, [...(groups.get(question.category) ?? []), question]);
  });
  const categories = shuffle(Array.from(groups.keys()));
  const selected: Question[] = [];
  let cursor = 0;
  while (selected.length < count && categories.length > 0) {
    const category = categories[cursor % categories.length];
    const list = groups.get(category) ?? [];
    const next = list.shift();
    if (next && !selected.some((question) => question.id === next.id)) selected.push(next);
    if (!next || list.length === 0) {
      const idx = categories.indexOf(category);
      if (idx >= 0) categories.splice(idx, 1);
    } else {
      groups.set(category, list);
      cursor += 1;
    }
  }
  return selected;
};

const isAllowedForExam = (question: Question, settings: ExamSettings) => {
  if (baseExamTypes.includes(question.type)) return question.examSuitability === "실전적합";
  if (question.type === "essay") return settings.includeEssay;
  if (question.type === "prompt") return settings.includePrompt;
  return false;
};

export const createExamQuestions = (
  settings: ExamSettings,
  favorites: FavoriteEntry[],
  wrongNotes: WrongNoteEntry[],
  initialPoolIds?: string[],
) => {
  const favoriteIds = new Set(favorites.map((favorite) => favorite.questionId));
  const retryMap = new Map(wrongNotes.map((note) => [note.questionId, note.retryCount]));
  const initialIds = initialPoolIds ? new Set(initialPoolIds) : undefined;

  let pool = questions.filter((question) => {
    const categoryMatch = settings.categories.length === 0 || settings.categories.includes(question.category);
    const difficultyMatch = settings.difficulties.length === 0 || settings.difficulties.includes(question.difficulty);
    const favoriteMatch = !settings.favoriteOnly || favoriteIds.has(question.id);
    const poolMatch = !initialIds || initialIds.has(question.id);
    return categoryMatch && difficultyMatch && favoriteMatch && poolMatch && isAllowedForExam(question, settings);
  });

  if (settings.wrongFirst) {
    pool = [...pool].sort((a, b) => (retryMap.get(b.id) ?? 0) - (retryMap.get(a.id) ?? 0) || Math.random() - 0.5);
  } else {
    pool = shuffle(pool);
  }

  const targets = typeTargets(settings.questionCount, settings.includeEssay, settings.includePrompt);
  const selected: Question[] = [];

  (Object.entries(targets) as Array<[QuestionType, number]>).forEach(([type, target]) => {
    if (target <= 0) return;
    const typed = pool.filter((question) => question.type === type && !selected.some((picked) => picked.id === question.id));
    selected.push(...categoryBalanced(typed, target));
  });

  if (selected.length < settings.questionCount) {
    selected.push(
      ...categoryBalanced(
        pool.filter((question) => !selected.some((picked) => picked.id === question.id)),
        settings.questionCount - selected.length,
      ),
    );
  }

  return shuffle(selected).slice(0, settings.questionCount);
};

export const defaultExamSettings: ExamSettings = {
  questionCount: 40,
  minutes: 40,
  categories: [],
  difficulties: ["쉬움", "보통", "어려움"],
  includeEssay: false,
  includePrompt: false,
  wrongFirst: false,
  favoriteOnly: false,
};
