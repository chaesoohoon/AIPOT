import { ChevronLeft, Printer, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import CreatorBanner from "../components/CreatorBanner";
import FeedbackPanel from "../components/FeedbackPanel";
import ProgressBar from "../components/ProgressBar";
import ResultSummary from "../components/ResultSummary";
import { getQuestionById } from "../data/questionBank";
import { gradeQuestion } from "../utils/grading";
import type { ExamResult, GradeResult, GradeStatus, Question } from "../types";

interface ResultPageProps {
  result: ExamResult;
  onBackHome: () => void;
  onPracticeWrong: (ids: string[]) => void;
}

const statusScore = (status: GradeStatus) => {
  if (status === "correct") return 1;
  if (status === "partial") return 0.5;
  return 0;
};

const formatDuration = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  return `${minutes}분 ${remain}초`;
};

export default function ResultPage({ result, onBackHome, onPracticeWrong }: ResultPageProps) {
  const [wrongOnly, setWrongOnly] = useState(false);
  const resultQuestions = useMemo(
    () => result.questionIds.map((id) => getQuestionById(id)).filter((question): question is Question => Boolean(question)),
    [result.questionIds],
  );
  const visibleQuestions = wrongOnly ? resultQuestions.filter((question) => result.grading[question.id] !== "correct") : resultQuestions;

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBackHome} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
          <ChevronLeft size={16} aria-hidden="true" />
          메인으로
        </button>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-bold dark:border-slate-700 dark:bg-slate-900">
            <Printer size={18} aria-hidden="true" />
            인쇄
          </button>
          <button type="button" onClick={() => onPracticeWrong(result.wrongQuestionIds)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-bold text-white">
            <RotateCcw size={18} aria-hidden="true" />
            오답만 다시 풀기
          </button>
        </div>
      </div>

      <ResultSummary result={result} />
      <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        풀이 시간 {formatDuration(result.durationSeconds)}
      </div>

      <section className="grid gap-3 sm:grid-cols-4">
        <ResultStat label="문항 수" value={`${result.questionCount}`} />
        <ResultStat label="정답" value={`${result.correctCount}`} />
        <ResultStat label="부분정답" value={`${result.partialCount}`} />
        <ResultStat label="오답" value={`${result.wrongCount}`} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-black">취약 영역 분석</h2>
          <button
            type="button"
            onClick={() => setWrongOnly((value) => !value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold dark:border-slate-700"
          >
            {wrongOnly ? "전체 해설 보기" : "오답만 보기"}
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {Object.entries(result.categoryBreakdown).map(([category, value]) => (
            <div key={category} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-semibold">{category}</span>
                <span>{Math.round((value.earned / value.total) * 100)}%</span>
              </div>
              <ProgressBar value={value.earned} max={value.total} />
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        {visibleQuestions.map((question, index) => {
          const status = result.grading[question.id] ?? "wrong";
          const base = gradeQuestion(question, result.answers[question.id] ?? "");
          const displayGrade: GradeResult = {
            ...base,
            status,
            scoreRatio: statusScore(status),
          };
          return (
            <div key={question.id} className="space-y-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4 font-bold dark:border-slate-800 dark:bg-slate-900">
                {index + 1}. {question.question.split("\n")[0]}
              </div>
              <FeedbackPanel question={question} grade={displayGrade} userAnswer={result.answers[question.id] ?? ""} />
            </div>
          );
        })}
      </section>

      <CreatorBanner placement="result" />
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}
