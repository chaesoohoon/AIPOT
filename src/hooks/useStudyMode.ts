import { useEffect, useMemo, useState } from "react";
import { WrongNoteService, type StudyPersistResult } from "../services/WrongNoteService";
import { getMatchedKeywords, gradeQuestion } from "../utils/grading";
import { makeWrongNoteEntry, storage } from "../utils/storage";
import type { GradeResult, GradeStatus, Question } from "../types";

const randomItem = (items: Question[], avoidId?: string) => {
  const pool = items.filter((item) => item.id !== avoidId);
  const source = pool.length ? pool : items;
  return source[Math.floor(Math.random() * source.length)];
};

interface UseStudyModeOptions {
  pool: Question[];
  onStored: () => void;
  onToast?: (toast: StudyPersistResult) => void;
}

export function useStudyMode({ pool, onStored, onToast }: UseStudyModeOptions) {
  const [current, setCurrent] = useState<Question | undefined>();
  const [answer, setAnswer] = useState("");
  const [checklist, setChecklist] = useState<string[]>([]);
  const [grade, setGrade] = useState<GradeResult | undefined>();
  const [favorite, setFavorite] = useState(false);
  const [firstRecorded, setFirstRecorded] = useState(false);
  const [sessionIndex, setSessionIndex] = useState(0);

  const matchedKeywords = useMemo(() => (current ? getMatchedKeywords(current, answer) : []), [answer, current]);

  const resetAnswer = (question?: Question) => {
    setCurrent(question);
    setAnswer("");
    setChecklist([]);
    setGrade(undefined);
    setFirstRecorded(false);
    setFavorite(question ? storage.isFavorite(question.id) : false);
  };

  useEffect(() => {
    resetAnswer(randomItem(pool));
    setSessionIndex(0);
  }, [pool]);

  const persistGrade = (question: Question, nextAnswer: string, nextGrade: GradeResult) => {
    if (!firstRecorded) {
      setFirstRecorded(true);
      const toast = WrongNoteService.persistFirstStudyResult(question, nextAnswer, nextGrade);
      onToast?.(toast);
      onStored();
      return;
    }

    const toast = WrongNoteService.syncLaterStudyResult(question.id, nextGrade.status);
    if (toast) {
      onToast?.(toast);
      onStored();
    }
  };

  const commitAnswer = (nextAnswer = answer, nextChecklist = checklist) => {
    if (!current || !nextAnswer.trim()) return;
    const nextGrade = gradeQuestion(current, nextAnswer, nextChecklist);
    setGrade(nextGrade);
    persistGrade(current, nextAnswer, nextGrade);
  };

  const selectChoice = (choice: string) => {
    setAnswer(choice);
    if (!current) return;
    const nextGrade = gradeQuestion(current, choice);
    setGrade(nextGrade);
    persistGrade(current, choice, nextGrade);
  };

  const updateAnswer = (value: string) => {
    setAnswer(value);
    if (current?.type === "essay" || current?.type === "prompt") setGrade(undefined);
  };

  const override = (status: GradeStatus) => {
    if (!current) return;
    const scoreRatio = status === "correct" ? 1 : status === "partial" ? 0.5 : 0;
    const nextGrade: GradeResult = {
      status,
      scoreRatio,
      matchedKeywords,
      message: status === "correct" ? "사용자 자기채점으로 정답 처리했습니다." : status === "partial" ? "사용자 자기채점으로 부분정답 처리했습니다." : "사용자 자기채점으로 오답 처리했습니다.",
    };
    setGrade(nextGrade);

    if (!firstRecorded) {
      persistGrade(current, answer, nextGrade);
    } else if (status === "correct") {
      const toast = WrongNoteService.syncLaterStudyResult(current.id, status);
      if (toast) onToast?.(toast);
    } else {
      storage.upsertWrongNote(makeWrongNoteEntry(current, answer, status));
      onToast?.({ message: "오답노트 상태를 업데이트했습니다.", tone: "warning" });
      onStored();
    }
  };

  const nextQuestion = () => {
    resetAnswer(randomItem(pool, current?.id));
    setSessionIndex((value) => value + 1);
  };

  const retry = () => {
    if (!current) return;
    setAnswer("");
    setChecklist([]);
    setGrade(undefined);
  };

  const sameConcept = () => {
    if (!current) return;
    const candidates = pool.filter(
      (question) => question.id !== current.id && (question.relatedConcept === current.relatedConcept || question.tags.some((tag) => current.tags.includes(tag))),
    );
    resetAnswer(randomItem(candidates.length ? candidates : pool, current.id));
    setSessionIndex((value) => value + 1);
  };

  const toggleFavorite = () => {
    if (!current) return;
    const nextFavorite = storage.toggleFavorite(current.id);
    setFavorite(nextFavorite);
    onToast?.({ message: nextFavorite ? "즐겨찾기에 추가했습니다." : "즐겨찾기에서 해제했습니다.", tone: "info" });
    onStored();
  };

  const addWrong = () => {
    if (!current) return;
    storage.upsertWrongNote(makeWrongNoteEntry(current, answer, grade?.status ?? "unchecked"));
    onToast?.({ message: "오답노트에 저장했습니다.", tone: "warning" });
    onStored();
  };

  return {
    current,
    answer,
    checklist,
    grade,
    favorite,
    sessionIndex,
    matchedKeywords,
    setChecklist,
    updateAnswer,
    selectChoice,
    commitAnswer,
    override,
    nextQuestion,
    retry,
    sameConcept,
    toggleFavorite,
    addWrong,
  };
}
