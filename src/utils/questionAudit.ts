import { examBlueprint } from "../data/examBlueprint";
import { questions } from "../data/questionBank";
import { EXAM_SUITABILITIES, QUESTION_STATUSES, QUESTION_TYPES, SOURCE_TYPES, type Question, type QuestionStatus } from "../types";

const hasFieldError = (question: Question) => {
  if (!question.id || !question.type || !question.category || !question.difficulty || !question.question || !question.answer) return true;
  if ((question.type === "multiple" || question.type === "ox" || question.type === "tableChoice") && question.choices.length < 2) return true;
  if (question.type === "tableChoice" && (!question.table || !question.table.headers.length || !question.table.rows.length)) return true;
  if (!question.explanation || !question.examPoint || !question.memoryTip) return true;
  return false;
};

const countBy = <T extends string>(items: Question[], getter: (question: Question) => T) =>
  items.reduce<Record<string, number>>((acc, question) => {
    const key = getter(question);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

const normalizedQuestion = (question: Question) => question.question.replace(/\s+/g, " ").trim().slice(0, 80);

export const getQuestionAudit = () => {
  const duplicateIdGroups = Object.entries(countBy(questions, (question) => question.id)).filter(([, count]) => count > 1);
  const duplicateTextGroups = Object.entries(countBy(questions, normalizedQuestion)).filter(([, count]) => count > 1);
  const fieldErrorIds = questions.filter(hasFieldError).map((question) => question.id);
  const active = questions.filter((question) => question.status === "active");
  const examReady = active.filter((question) => question.examSuitability === "실전적합");
  const studyReady = questions.filter((question) => question.status === "active" || question.status === "review");
  const deepPractice = questions.filter((question) => question.status === "deepPractice" || question.examSuitability === "심화학습");
  const longSubjective = questions.filter((question) => question.type === "essay" || question.type === "prompt");
  const examUnsuitable = questions.filter((question) => question.examSuitability !== "실전적합");

  return {
    total: questions.length,
    active: active.length,
    examReady: examReady.length,
    studyReady: studyReady.length,
    deepPractice: deepPractice.length,
    review: questions.filter((question) => question.status === "review").length,
    disabled: questions.filter((question) => question.status === "disabled").length,
    draft: questions.filter((question) => question.status === "draft").length,
    tableChoice: questions.filter((question) => question.type === "tableChoice").length,
    fieldError: fieldErrorIds.length,
    fieldErrorIds,
    duplicateId: duplicateIdGroups.reduce((sum, [, count]) => sum + count, 0),
    duplicateText: duplicateTextGroups.reduce((sum, [, count]) => sum + count, 0),
    duplicateTextGroups: duplicateTextGroups.map(([key, count]) => ({ key, count })),
    longSubjective: longSubjective.length,
    examUnsuitable: examUnsuitable.length,
    byStatus: QUESTION_STATUSES.reduce<Record<QuestionStatus, number>>((acc, status) => {
      acc[status] = questions.filter((question) => question.status === status).length;
      return acc;
    }, {} as Record<QuestionStatus, number>),
    byType: QUESTION_TYPES.reduce<Record<string, number>>((acc, type) => {
      acc[type] = questions.filter((question) => question.type === type).length;
      return acc;
    }, {}),
    byCategory: countBy(questions, (question) => question.category),
    byExamSuitability: EXAM_SUITABILITIES.reduce<Record<string, number>>((acc, suitability) => {
      acc[suitability] = questions.filter((question) => question.examSuitability === suitability).length;
      return acc;
    }, {}),
    bySourceType: SOURCE_TYPES.reduce<Record<string, number>>((acc, sourceType) => {
      acc[sourceType] = questions.filter((question) => question.sourceType === sourceType).length;
      return acc;
    }, {}),
    blueprint: examBlueprint,
  };
};
