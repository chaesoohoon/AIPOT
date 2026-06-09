import { BookmarkPlus, ChevronLeft, RotateCcw, Shuffle, Star } from "lucide-react";
import { useMemo, useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import ExamHeader from "../components/ExamHeader";
import FeedbackPanel from "../components/FeedbackPanel";
import QuestionCard from "../components/QuestionCard";
import Toast, { type ToastMessage } from "../components/Toast";
import { getQuestionById, questions } from "../data/questionBank";
import { useStudyMode } from "../hooks/useStudyMode";
import { storage } from "../utils/storage";
import { DIFFICULTIES, type Category, type Difficulty, type Question, type QuestionType } from "../types";

interface StudyModePageProps {
  poolIds?: string[];
  title?: string;
  onBack: () => void;
  onStored: () => void;
}

type StudyTrack = "quick" | "exam" | "wrong" | "deep";

const objectiveTypes: QuestionType[] = ["multiple", "ox", "short", "blank", "tableChoice"];

const tabs: Array<{ id: StudyTrack; label: string; description: string }> = [
  { id: "quick", label: "빠른 학습", description: "객관식 · OX · 단답 · 빈칸" },
  { id: "exam", label: "실전 대비", description: "실전적합 문제만" },
  { id: "wrong", label: "오답 복습", description: "오답노트 기반" },
  { id: "deep", label: "심화 학습", description: "서술형 · 프롬프트 연습" },
];

const isObjective = (question: Question) => objectiveTypes.includes(question.type);
const isDeep = (question: Question) => question.examSuitability === "심화학습" || question.type === "essay" || question.type === "prompt";

export default function StudyModePage({ poolIds, title, onBack, onStored }: StudyModePageProps) {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([...DIFFICULTIES]);
  const [track, setTrack] = useState<StudyTrack>("quick");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const fixedPool = useMemo(() => poolIds?.map((id) => getQuestionById(id)).filter((question): question is Question => Boolean(question)), [poolIds]);
  const wrongIds = useMemo(() => new Set(storage.getWrongNotes().map((note) => note.questionId)), [track]);

  const pool = useMemo(() => {
    const base = fixedPool?.length
      ? fixedPool
      : questions.filter((question) => {
          if (track === "quick") return isObjective(question) && (question.examSuitability === "실전적합" || question.examSuitability === "학습적합");
          if (track === "exam") return isObjective(question) && question.examSuitability === "실전적합";
          if (track === "wrong") return wrongIds.has(question.id);
          return isDeep(question);
        });

    return base.filter((question) => {
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(question.category);
      const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(question.difficulty);
      return categoryMatch && difficultyMatch;
    });
  }, [fixedPool, selectedCategories, selectedDifficulties, track, wrongIds]);

  const pushToast = (toast: Omit<ToastMessage, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((items) => [...items, { ...toast, id }].slice(-3));
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3200);
  };

  const session = useStudyMode({
    pool,
    onStored,
    onToast: (toast) => pushToast({ message: toast.message, tone: toast.tone === "warning" ? "warning" : toast.tone }),
  });

  const current = session.current;
  const subjective = current?.type === "essay" || current?.type === "prompt";
  const showFeedback = Boolean(current && (session.grade || (subjective && session.answer.trim())));
  const heading = title ?? tabs.find((item) => item.id === track)?.label ?? "학습모드";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 rounded-lg px-2 py-2 text-sm font-black text-blue-700 outline-none transition hover:bg-blue-50 focus-visible:ring-4 focus-visible:ring-blue-200 dark:text-blue-300 dark:hover:bg-blue-950 dark:focus-visible:ring-blue-900">
          <ChevronLeft size={16} aria-hidden="true" />
          메인으로
        </button>
        <div className="text-right">
          <h1 className="text-xl font-black text-slate-950 dark:text-white">{heading}</h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">선택 즉시 피드백 · 출제 가능 {pool.length}문항</p>
        </div>
      </div>

      {!fixedPool?.length ? (
        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-2 md:grid-cols-4">
            {tabs.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTrack(item.id)}
                className={`rounded-lg border px-3 py-3 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-900 ${
                  track === item.id
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                }`}
              >
                <span className="block text-sm font-black">{item.label}</span>
                <span className={`mt-1 block text-xs font-semibold ${track === item.id ? "text-blue-50" : "text-slate-500 dark:text-slate-400"}`}>{item.description}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {!fixedPool?.length ? (
        <details className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <summary className="cursor-pointer text-sm font-black text-slate-800 outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:text-slate-100 dark:focus-visible:ring-blue-900">
            학습 범위 필터
          </summary>
          <div className="mt-4">
            <CategoryFilter
              selectedCategories={selectedCategories}
              onCategoriesChange={setSelectedCategories}
              selectedDifficulties={selectedDifficulties}
              onDifficultiesChange={setSelectedDifficulties}
            />
          </div>
        </details>
      ) : null}

      {current ? (
        <>
          <ExamHeader mode="study" question={current} currentIndex={session.sessionIndex} total={Math.max(pool.length, 1)} />

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
            <main className="space-y-4">
              <QuestionCard
                question={current}
                value={session.answer}
                onChange={current.type === "multiple" || current.type === "ox" || current.type === "tableChoice" ? session.selectChoice : session.updateAnswer}
                mode="study"
                grade={session.grade}
                revealAnswer={Boolean(session.grade)}
                onCommit={() => session.commitAnswer()}
                checklistState={session.checklist}
                onChecklistChange={session.setChecklist}
                matchedKeywords={session.matchedKeywords}
              />

              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-3 shadow-soft dark:border-slate-800 dark:bg-slate-900">
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={session.nextQuestion} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-black text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-900">
                    <Shuffle size={18} aria-hidden="true" />
                    다음 문제
                  </button>
                  <button type="button" onClick={session.retry} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 font-black text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-blue-900">
                    <RotateCcw size={18} aria-hidden="true" />
                    다시 풀기
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={session.toggleFavorite} className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-black text-amber-800 transition hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-amber-100 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100 dark:hover:bg-amber-900">
                    <Star size={16} aria-hidden="true" />
                    {session.favorite ? "즐겨찾기 해제" : "즐겨찾기"}
                  </button>
                  <button type="button" onClick={session.addWrong} className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-black text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200 dark:hover:bg-rose-900">
                    <BookmarkPlus size={16} aria-hidden="true" />
                    오답노트
                  </button>
                </div>
              </div>
            </main>

            <div className="xl:sticky xl:top-5 xl:self-start">
              {showFeedback ? (
                <FeedbackPanel question={current} grade={session.grade} userAnswer={session.answer} matchedKeywords={session.matchedKeywords} onOverride={session.override} onSameConcept={session.sameConcept} />
              ) : (
                <aside className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm font-semibold leading-7 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  객관식과 OX는 선택 즉시 피드백이 표시됩니다. 단답형과 빈칸은 Enter 또는 입력창 밖 클릭으로 자동 채점됩니다. 서술형과 프롬프트 작성형은 심화 학습 탭에서만 연습합니다.
                </aside>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          선택 조건에 맞는 문제가 없습니다. 학습 탭이나 필터를 조정하세요.
        </div>
      )}

      <Toast messages={toasts} onDismiss={(id) => setToasts((items) => items.filter((item) => item.id !== id))} />
    </div>
  );
}
