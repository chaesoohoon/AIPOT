import { makeWrongNoteEntry, storage } from "../utils/storage";
import type { GradeResult, GradeStatus, Question } from "../types";

export interface StudyPersistResult {
  message: string;
  tone: "info" | "success" | "warning";
}

export const WrongNoteService = {
  persistFirstStudyResult(question: Question, userAnswer: string, grade: GradeResult): StudyPersistResult {
    storage.addAttempt({
      questionId: question.id,
      mode: "study",
      userAnswer,
      correctAnswer: question.answer,
      result: grade.status,
      isCorrect: grade.status === "correct",
      isPartial: grade.status === "partial",
      score: grade.scoreRatio,
      scoreRatio: grade.scoreRatio,
      category: question.category,
      difficulty: question.difficulty,
      type: question.type,
    });

    if (grade.status === "correct") {
      const hadWrongNote = storage.getWrongNotes().some((note) => note.questionId === question.id);
      if (hadWrongNote) {
        storage.markWrongAsCorrect(question.id);
        return { message: "오답노트 상태를 최근 정답으로 업데이트했습니다.", tone: "success" };
      }
      return { message: "풀이 기록을 저장했습니다.", tone: "success" };
    }

    storage.upsertWrongNote(makeWrongNoteEntry(question, userAnswer, grade.status));
    return { message: "오답노트에 자동 저장했습니다.", tone: "warning" };
  },

  syncLaterStudyResult(questionId: string, status: GradeStatus): StudyPersistResult | undefined {
    if (status !== "correct") return undefined;
    const hadWrongNote = storage.getWrongNotes().some((note) => note.questionId === questionId);
    if (!hadWrongNote) return undefined;
    storage.markWrongAsCorrect(questionId);
    return { message: "이 문제를 최근 정답 상태로 표시했습니다.", tone: "success" };
  },
};
