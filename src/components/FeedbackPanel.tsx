import { CheckCircle, ChevronDown, ChevronUp, HelpCircle, RotateCcw, Sparkles, XCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { resultTone, statusLabel } from "../utils/grading";
import type { GradeResult, GradeStatus, Question } from "../types";

interface FeedbackPanelProps {
  question: Question;
  grade?: GradeResult;
  userAnswer: string;
  matchedKeywords?: string[];
  onOverride?: (status: GradeStatus) => void;
  onSameConcept?: () => void;
}

const iconFor = (status: GradeStatus) => {
  if (status === "correct") return <CheckCircle size={20} aria-hidden="true" />;
  if (status === "wrong") return <XCircle size={20} aria-hidden="true" />;
  if (status === "partial") return <RotateCcw size={20} aria-hidden="true" />;
  return <HelpCircle size={20} aria-hidden="true" />;
};

export default function FeedbackPanel({ question, grade, userAnswer, matchedKeywords = [], onOverride, onSameConcept }: FeedbackPanelProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const status = grade?.status ?? "unchecked";
  const choiceIndex = useMemo(() => question.choices.findIndex((choice) => choice === userAnswer), [question.choices, userAnswer]);
  const selectedWrongExplanation = choiceIndex >= 0 && userAnswer !== question.answer ? question.wrongExplanations[choiceIndex] : "";
  const keywords = grade?.matchedKeywords.length ? grade.matchedKeywords : matchedKeywords;

  return (
    <aside className="animate-feedback-in rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 ${resultTone(status)}`}>
        <div className="flex min-w-0 items-start gap-2">
          <span className="mt-0.5">{iconFor(status)}</span>
          <div>
            <div className="font-black">{status === "unchecked" ? "자기채점 필요" : statusLabel[status]}</div>
            <p className="mt-1 text-sm leading-6">{grade?.message ?? "체크리스트와 핵심 키워드를 기준으로 답안을 점검하세요."}</p>
          </div>
        </div>
        {grade ? <span className="shrink-0 rounded-full bg-white/60 px-2 py-1 text-xs font-black dark:bg-slate-950/40">{Math.round(grade.scoreRatio * 100)}%</span> : null}
      </div>

      <div className="mt-4 grid gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
          <div className="font-bold text-slate-500 dark:text-slate-400">핵심 피드백</div>
          <p className="mt-1 leading-6 text-slate-900 dark:text-slate-100">{question.examPoint}</p>
        </div>

        {selectedWrongExplanation ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-rose-900 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-100">
            <div className="font-black">내 선택 오답 포인트</div>
            <p className="mt-1 leading-6">{selectedWrongExplanation}</p>
          </div>
        ) : null}

        {keywords.length > 0 ? (
          <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-950">
            <div className="font-bold text-blue-800 dark:text-blue-100">매칭된 핵심 키워드</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span key={keyword} className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-blue-700 ring-1 ring-blue-100 dark:bg-blue-900 dark:text-blue-50 dark:ring-blue-800">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950">
            <div className="font-bold text-emerald-700 dark:text-emerald-200">정답 / 모범답안</div>
            <p className="mt-1 whitespace-pre-line leading-6 text-emerald-950 dark:text-emerald-50">{question.answer}</p>
            {question.acceptedAnswers.length > 0 ? <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-200">허용 답안: {question.acceptedAnswers.join(", ")}</p> : null}
          </div>
          <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
            <div className="font-bold text-slate-500 dark:text-slate-400">암기 팁</div>
            <p className="mt-1 leading-6">{question.memoryTip}</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setDetailsOpen((value) => !value)}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-black text-slate-700 outline-none transition hover:bg-slate-50 focus-visible:ring-4 focus-visible:ring-blue-200 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-blue-900"
      >
        {detailsOpen ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
        상세 해설 {detailsOpen ? "접기" : "펼치기"}
      </button>

      {detailsOpen ? (
        <div className="mt-4 space-y-3">
          <div className="rounded-lg bg-amber-50 p-4 leading-7 text-slate-900 dark:bg-amber-950 dark:text-amber-50">
            <div className="mb-2 font-black">상세 해설</div>
            {question.explanation}
          </div>
          {question.wrongExplanations.length > 0 ? (
            <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-3 font-black">보기별 오답 해설</div>
              <div className="grid gap-2">
                {question.wrongExplanations.map((explanation, index) => (
                  <div key={`${question.id}-wrong-${index}`} className="rounded-lg bg-slate-50 p-3 text-sm leading-6 dark:bg-slate-950">
                    <span className="font-black text-slate-500 dark:text-slate-400">{index + 1}. </span>
                    {explanation}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          <div className="rounded-lg bg-slate-50 p-3 text-sm leading-6 dark:bg-slate-950">
            <span className="font-black">관련 개념 </span>
            {question.relatedConcept}
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {onSameConcept ? (
          <button type="button" onClick={onSameConcept} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-black text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-900">
            <Sparkles size={16} aria-hidden="true" />
            같은 개념 더 풀기
          </button>
        ) : null}
        {onOverride ? (
          <>
            <button type="button" onClick={() => onOverride("correct")} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
              정답 처리
            </button>
            <button type="button" onClick={() => onOverride("partial")} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-black text-amber-700 transition hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
              부분정답
            </button>
            <button type="button" onClick={() => onOverride("wrong")} className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 transition hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200">
              오답 처리
            </button>
          </>
        ) : null}
      </div>
    </aside>
  );
}
