import { AlertTriangle, ChevronLeft, Flag, Send } from "lucide-react";
import { useState } from "react";
import ExamHeader from "../components/ExamHeader";
import ModeSettings from "../components/ModeSettings";
import QuestionCard from "../components/QuestionCard";
import QuestionNavigator from "../components/QuestionNavigator";
import { useExamMode } from "../hooks/useExamMode";
import type { ExamResult } from "../types";

interface ExamModePageProps {
  initialPoolIds?: string[];
  onBack: () => void;
  onComplete: (result: ExamResult) => void;
  onStored: () => void;
}

export default function ExamModePage({ initialPoolIds, onBack, onComplete, onStored }: ExamModePageProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [startError, setStartError] = useState("");
  const exam = useExamMode({ initialPoolIds, onComplete, onStored });

  const start = () => {
    setStartError("");
    if (!exam.start()) setStartError("선택 조건에 맞는 문제가 없습니다. 설정을 조정하세요.");
  };

  const submit = () => {
    setConfirmOpen(false);
    exam.submit();
  };

  if (!exam.examQuestions.length) {
    return (
      <div className="space-y-5">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-black text-blue-700 outline-none transition hover:bg-blue-50 focus-visible:ring-4 focus-visible:ring-blue-200 dark:text-blue-300 dark:hover:bg-blue-950 dark:focus-visible:ring-blue-900">
          <ChevronLeft size={16} aria-hidden="true" />
          메인으로
        </button>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-2xl font-black text-slate-950 dark:text-white">실전모드 설정</h1>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
            기본 실전모드는 CBT 대비용으로 객관식 30문항, OX 5문항, 단답형 5문항을 출제합니다. 긴 서술형과 프롬프트 작성형은 기본 제외됩니다.
          </p>
        </div>
        <ModeSettings value={exam.settings} onChange={exam.setSettings} onStart={start} availableCount={exam.availableCount} />
        {startError ? <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200">{startError}</div> : null}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="no-print sticky top-0 z-10">
        <ExamHeader
          mode="exam"
          question={exam.current}
          currentIndex={exam.currentIndex}
          total={exam.examQuestions.length}
          answeredCount={exam.answeredCount}
          timerSeconds={exam.settings.minutes * 60}
          running={Boolean(exam.startedAt)}
          onExpire={exam.submit}
          actions={
            <>
              <button type="button" onClick={exam.toggleFlag} className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 font-black text-amber-800 transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
                <Flag size={18} aria-hidden="true" />
                체크
              </button>
              <button type="button" onClick={() => setConfirmOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-black text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-900">
                <Send size={18} aria-hidden="true" />
                제출
              </button>
            </>
          }
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="space-y-4">
          {exam.current ? <QuestionCard question={exam.current} value={exam.answers[exam.current.id] ?? ""} onChange={exam.setCurrentAnswer} mode="exam" revealAnswer={false} /> : null}
          <div className="flex justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() => exam.setCurrentIndex((index) => Math.max(0, index - 1))}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
              disabled={exam.currentIndex === 0}
            >
              이전 문제
            </button>
            <button
              type="button"
              onClick={() => exam.setCurrentIndex((index) => Math.min(exam.examQuestions.length - 1, index + 1))}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 font-black text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800"
              disabled={exam.currentIndex === exam.examQuestions.length - 1}
            >
              다음 문제
            </button>
          </div>
        </main>

        <aside className="no-print rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-3 font-black">문제 번호</div>
          <QuestionNavigator questions={exam.examQuestions} currentIndex={exam.currentIndex} answers={exam.answers} flaggedIds={exam.flagged} onSelect={exam.setCurrentIndex} />
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-bold text-slate-500 dark:text-slate-400">
            <div className="rounded-lg bg-emerald-50 p-2 dark:bg-emerald-950">응답</div>
            <div className="rounded-lg bg-white p-2 ring-1 ring-slate-200 dark:bg-slate-950 dark:ring-slate-700">미응답</div>
            <div className="rounded-lg bg-amber-50 p-2 dark:bg-amber-950">체크</div>
          </div>
        </aside>
      </div>

      {confirmOpen ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft dark:bg-slate-900">
            <div className="flex items-center gap-2 text-lg font-black">
              <AlertTriangle className="text-amber-500" aria-hidden="true" />
              시험 제출 확인
            </div>
            <p className="mt-3 leading-7 text-slate-700 dark:text-slate-200">미응답 문제 {exam.unanswered}문항이 있습니다. 제출 후에는 답안을 변경할 수 없습니다.</p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setConfirmOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 font-black dark:border-slate-700">
                계속 풀기
              </button>
              <button type="button" onClick={submit} className="rounded-lg bg-blue-600 px-4 py-2 font-black text-white">
                제출하기
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
