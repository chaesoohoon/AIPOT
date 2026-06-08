import { useMemo, useState } from "react";
import { createExamQuestions, defaultExamSettings } from "../utils/exam";
import { gradeQuestion } from "../utils/grading";
import { makeWrongNoteEntry, storage } from "../utils/storage";
import type { ExamResult, ExamSettings, Question } from "../types";

interface UseExamModeOptions {
  initialPoolIds?: string[];
  onStored: () => void;
  onComplete: (result: ExamResult) => void;
}

export function useExamMode({ initialPoolIds, onStored, onComplete }: UseExamModeOptions) {
  const [settings, setSettings] = useState<ExamSettings>({ ...defaultExamSettings });
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [startedAt, setStartedAt] = useState<number | undefined>();

  const current = examQuestions[currentIndex];
  const answeredCount = examQuestions.filter((question) => answers[question.id]?.trim()).length;
  const unanswered = examQuestions.length - answeredCount;
  const availableCount = useMemo(() => createExamQuestions(settings, storage.getFavorites(), storage.getWrongNotes(), initialPoolIds).length, [initialPoolIds, settings]);

  const start = () => {
    const selected = createExamQuestions(settings, storage.getFavorites(), storage.getWrongNotes(), initialPoolIds);
    if (!selected.length) return false;
    setExamQuestions(selected);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setStartedAt(Date.now());
    return true;
  };

  const setCurrentAnswer = (value: string) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  };

  const toggleFlag = () => {
    if (!current) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(current.id)) next.delete(current.id);
      else next.add(current.id);
      return next;
    });
  };

  const submit = () => {
    if (!examQuestions.length) return;
    const categoryBreakdown: ExamResult["categoryBreakdown"] = {};
    const grading: ExamResult["grading"] = {};
    const wrongQuestionIds: string[] = [];
    let earned = 0;
    let correctCount = 0;
    let partialCount = 0;
    let wrongCount = 0;

    examQuestions.forEach((question) => {
      const userAnswer = answers[question.id] ?? "";
      const grade = gradeQuestion(question, userAnswer);
      grading[question.id] = grade.status;
      earned += grade.scoreRatio;

      const category = categoryBreakdown[question.category] ?? { total: 0, earned: 0 };
      category.total += 1;
      category.earned += grade.scoreRatio;
      categoryBreakdown[question.category] = category;

      if (grade.status === "correct") correctCount += 1;
      else if (grade.status === "partial") partialCount += 1;
      else wrongCount += 1;

      storage.addAttempt({
        questionId: question.id,
        mode: "exam",
        userAnswer,
        result: grade.status,
        scoreRatio: grade.scoreRatio,
        category: question.category,
        difficulty: question.difficulty,
        type: question.type,
      });

      if (grade.status !== "correct") {
        wrongQuestionIds.push(question.id);
        storage.upsertWrongNote(makeWrongNoteEntry(question, userAnswer, grade.status));
      }
    });

    const score = Math.round((earned / examQuestions.length) * 100);
    const settingsStore = storage.getSettings();
    const result = storage.addExamResult({
      score,
      maxScore: 100,
      passScore: settingsStore.passScore,
      passed: score >= settingsStore.passScore,
      correctCount,
      partialCount,
      wrongCount,
      questionCount: examQuestions.length,
      durationSeconds: startedAt ? Math.round((Date.now() - startedAt) / 1000) : 0,
      questionIds: examQuestions.map((question) => question.id),
      answers,
      grading,
      categoryBreakdown,
      wrongQuestionIds,
    });
    onStored();
    onComplete(result);
  };

  return {
    settings,
    setSettings,
    examQuestions,
    current,
    currentIndex,
    setCurrentIndex,
    answers,
    flagged,
    startedAt,
    answeredCount,
    unanswered,
    availableCount,
    start,
    setCurrentAnswer,
    toggleFlag,
    submit,
  };
}
