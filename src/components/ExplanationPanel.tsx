import { CheckCircle, RotateCcw, XCircle } from "lucide-react";
import { resultTone, statusLabel } from "../utils/grading";
import type { GradeResult, GradeStatus, Question } from "../types";

interface ExplanationPanelProps {
  question: Question;
  grade?: GradeResult;
  userAnswer: string;
  onOverride?: (status: GradeStatus) => void;
}

export default function ExplanationPanel({ question, grade, userAnswer, onOverride }: ExplanationPanelProps) {
  const status = grade?.status ?? "unchecked";

  return (
    <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className={`mb-4 flex items-center justify-between gap-3 rounded-lg border px-4 py-3 ${resultTone(status)}`}>
        <div className="flex items-center gap-2 font-bold">
          {status === "correct" ? <CheckCircle size={20} /> : status === "wrong" ? <XCircle size={20} /> : <RotateCcw size={20} />}
          {statusLabel[status]}
        </div>
        {grade ? <span className="text-sm font-semibold">{Math.round(grade.scoreRatio * 100)}%</span> : null}
      </div>

      <div className="grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
          <div className="font-semibold text-slate-500 dark:text-slate-400">내 답</div>
          <div className="mt-1 whitespace-pre-line text-slate-900 dark:text-slate-100">{userAnswer || "미입력"}</div>
        </div>
        <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950">
          <div className="font-semibold text-emerald-700 dark:text-emerald-200">정답</div>
          <div className="mt-1 whitespace-pre-line text-emerald-900 dark:text-emerald-100">{question.answer}</div>
          {question.acceptedAnswers.length > 0 ? (
            <div className="mt-2 text-xs text-emerald-700 dark:text-emerald-200">허용 답안: {question.acceptedAnswers.join(", ")}</div>
          ) : null}
        </div>
      </div>

      {grade ? (
        <div className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-100">
          {grade.message}
          {grade.matchedKeywords.length > 0 ? <div className="mt-2">포함 키워드: {grade.matchedKeywords.join(", ")}</div> : null}
        </div>
      ) : null}

      <div className="mt-4 rounded-lg bg-amber-50 p-4 text-slate-900 dark:bg-amber-950 dark:text-amber-50">
        <div className="mb-2 font-bold">상세 해설</div>
        <p className="leading-7">{question.explanation}</p>
      </div>

      {question.wrongExplanations.length > 0 ? (
        <div className="mt-4">
          <div className="mb-2 font-bold text-slate-900 dark:text-slate-100">보기별 오답 포인트</div>
          <div className="grid gap-2">
            {question.wrongExplanations.map((explanation, index) => (
              <div key={`${question.id}-wrong-${index}`} className="rounded-lg border border-slate-200 p-3 text-sm leading-6 dark:border-slate-700">
                <span className="font-semibold text-slate-500 dark:text-slate-400">{index + 1}. </span>
                {explanation}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
          <div className="text-sm font-bold">시험 포인트</div>
          <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{question.examPoint}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
          <div className="text-sm font-bold">암기 키워드</div>
          <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{question.memoryTip}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
          <div className="text-sm font-bold">관련 개념</div>
          <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{question.relatedConcept}</p>
        </div>
      </div>

      {question.partialCriteria?.length ? (
        <div className="mt-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
          <div className="mb-2 font-bold">부분점수 기준</div>
          <ul className="space-y-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
            {question.partialCriteria.map((criteria) => (
              <li key={criteria}>{criteria}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {onOverride ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => onOverride("correct")}
            className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
          >
            정답 처리
          </button>
          <button
            type="button"
            onClick={() => onOverride("wrong")}
            className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200"
          >
            오답 처리
          </button>
        </div>
      ) : null}
    </aside>
  );
}
