import type { GradeResult, GradeStatus, Question } from "../types";

export const normalizeAnswer = (value: string) =>
  value
    .normalize("NFKC")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^\p{L}\p{N}#+]/gu, "");

const includesNormalized = (answer: string, keyword: string) => {
  const normalizedAnswer = normalizeAnswer(answer);
  const normalizedKeyword = normalizeAnswer(keyword);
  return normalizedKeyword.length > 0 && normalizedAnswer.includes(normalizedKeyword);
};

export const getMatchedKeywords = (question: Question, rawAnswer: string) => {
  if (!rawAnswer.trim()) return [];
  return question.keywords.filter((keyword) => includesNormalized(rawAnswer, keyword));
};

export const statusLabel: Record<GradeStatus, string> = {
  correct: "정답",
  partial: "부분정답",
  wrong: "오답",
  unchecked: "미채점",
};

export const gradeQuestion = (question: Question, rawAnswer: string, checkedChecklist: string[] = []): GradeResult => {
  const answer = rawAnswer.trim();
  const accepted = [question.answer, ...question.acceptedAnswers];

  if (question.type === "multiple" || question.type === "ox") {
    const isCorrect = accepted.some((candidate) => normalizeAnswer(candidate) === normalizeAnswer(answer));
    return {
      status: isCorrect ? "correct" : "wrong",
      scoreRatio: isCorrect ? 1 : 0,
      matchedKeywords: [],
      message: isCorrect ? "선택한 답이 정답입니다." : "선택한 답이 정답과 다릅니다.",
    };
  }

  if (question.type === "short" || question.type === "blank") {
    const isExact = accepted.some((candidate) => normalizeAnswer(candidate) === normalizeAnswer(answer));
    const matchedKeywords = getMatchedKeywords(question, answer);
    const isCorrect = isExact || matchedKeywords.length > 0;
    return {
      status: isCorrect ? "correct" : "wrong",
      scoreRatio: isCorrect ? 1 : 0,
      matchedKeywords,
      message: isCorrect ? "허용 답안 또는 핵심 키워드와 일치합니다." : "정답 키워드가 충분히 포함되지 않았습니다.",
    };
  }

  if (question.type === "prompt" && checkedChecklist.length > 0) {
    if (checkedChecklist.length >= 5) {
      return { status: "correct", scoreRatio: 1, matchedKeywords: checkedChecklist, message: "체크리스트의 핵심 요소를 대부분 충족했습니다." };
    }
    if (checkedChecklist.length >= 3) {
      return { status: "partial", scoreRatio: 0.5, matchedKeywords: checkedChecklist, message: "일부 요소는 충족했지만 조건이나 출력 형식 보완이 필요합니다." };
    }
    return { status: "wrong", scoreRatio: 0, matchedKeywords: checkedChecklist, message: "프롬프트의 핵심 구성 요소가 부족합니다." };
  }

  const matchedKeywords = getMatchedKeywords(question, answer);
  const correctThreshold = question.type === "prompt" ? 5 : 4;
  const partialThreshold = question.type === "prompt" ? 3 : 2;

  if (matchedKeywords.length >= correctThreshold) return { status: "correct", scoreRatio: 1, matchedKeywords, message: "핵심 키워드가 충분히 포함되었습니다." };
  if (matchedKeywords.length >= partialThreshold) return { status: "partial", scoreRatio: 0.5, matchedKeywords, message: "핵심 키워드 일부가 포함되어 부분정답입니다." };
  return { status: "wrong", scoreRatio: 0, matchedKeywords, message: "핵심 키워드가 부족합니다." };
};

export const resultTone = (status: GradeStatus) => {
  if (status === "correct") return "text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-200 dark:bg-emerald-950 dark:border-emerald-800";
  if (status === "partial") return "text-amber-700 bg-amber-50 border-amber-200 dark:text-amber-200 dark:bg-amber-950 dark:border-amber-800";
  if (status === "wrong") return "text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-200 dark:bg-rose-950 dark:border-rose-800";
  return "text-slate-600 bg-slate-50 border-slate-200 dark:text-slate-200 dark:bg-slate-900 dark:border-slate-700";
};
