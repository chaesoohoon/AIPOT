import { AlertTriangle, Database, Home, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import CreatorBanner from "./components/CreatorBanner";
import ExamModePage from "./pages/ExamModePage";
import FavoritePage from "./pages/FavoritePage";
import HomePage from "./pages/HomePage";
import QuestionBankPage from "./pages/QuestionBankPage";
import ResultPage from "./pages/ResultPage";
import StatsPage from "./pages/StatsPage";
import StudyModePage from "./pages/StudyModePage";
import SummaryPage from "./pages/SummaryPage";
import WrongNotePage from "./pages/WrongNotePage";
import { storage } from "./utils/storage";
import type { AppPage, ExamResult } from "./types";

export default function App() {
  const [page, setPage] = useState<AppPage>("home");
  const [result, setResult] = useState<ExamResult | undefined>();
  const [studyPoolIds, setStudyPoolIds] = useState<string[] | undefined>();
  const [studyTitle, setStudyTitle] = useState<string | undefined>();
  const [examPoolIds, setExamPoolIds] = useState<string[] | undefined>();
  const [settings, setSettings] = useState(storage.getSettings());
  const [resetOpen, setResetOpen] = useState(false);
  const [, setStorageVersion] = useState(0);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
    storage.saveSettings(settings);
  }, [settings]);

  const refreshStorage = () => setStorageVersion((version) => version + 1);

  const navigate = (next: AppPage) => {
    if (next === "study") {
      setStudyPoolIds(undefined);
      setStudyTitle(undefined);
    }
    if (next === "exam") {
      setExamPoolIds(undefined);
    }
    setPage(next);
  };

  const practice = (ids: string[], title: string) => {
    if (!ids.length) return;
    setStudyPoolIds(ids);
    setStudyTitle(title);
    setPage("study");
  };

  const mockExam = (ids: string[]) => {
    if (!ids.length) return;
    setExamPoolIds(ids);
    setPage("exam");
  };

  const resetAll = () => {
    storage.resetAll();
    setResetOpen(false);
    refreshStorage();
  };

  const completeExam = (nextResult: ExamResult) => {
    setResult(nextResult);
    setPage("result");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <header className="no-print border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4">
          <button type="button" onClick={() => navigate("home")} className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Database size={20} aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-black">AIPOT 2급 CBT 합격훈련소</span>
              <span className="block text-xs font-semibold text-slate-500 dark:text-slate-400">정적 웹앱 · localStorage 저장</span>
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button type="button" onClick={() => navigate("home")} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold dark:border-slate-700">
              <Home size={16} aria-hidden="true" />
              홈
            </button>
            <button
              type="button"
              onClick={() => setSettings((value) => ({ ...value, darkMode: !value.darkMode }))}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold dark:border-slate-700"
            >
              {settings.darkMode ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
              다크모드
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        {page === "home" ? <HomePage onNavigate={navigate} onReset={() => setResetOpen(true)} /> : null}
        {page === "study" ? <StudyModePage poolIds={studyPoolIds} title={studyTitle} onBack={() => navigate("home")} onStored={refreshStorage} /> : null}
        {page === "exam" ? <ExamModePage initialPoolIds={examPoolIds} onBack={() => navigate("home")} onComplete={completeExam} onStored={refreshStorage} /> : null}
        {page === "result" && result ? <ResultPage result={result} onBackHome={() => navigate("home")} onPracticeWrong={(ids) => practice(ids, "실전모드 오답 복습")} /> : null}
        {page === "wrong" ? <WrongNotePage onBack={() => navigate("home")} onPractice={practice} onStored={refreshStorage} /> : null}
        {page === "favorite" ? <FavoritePage onBack={() => navigate("home")} onPractice={practice} onMockExam={mockExam} onStored={refreshStorage} /> : null}
        {page === "stats" ? <StatsPage onBack={() => navigate("home")} /> : null}
        {page === "bank" ? <QuestionBankPage onBack={() => navigate("home")} /> : null}
        {page === "summary" ? <SummaryPage onBack={() => navigate("home")} /> : null}
      </main>

      {page !== "exam" ? <CreatorBanner compact placement="footer" className="mx-auto max-w-7xl px-4 pb-6" /> : null}

      {resetOpen ? (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft dark:bg-slate-900">
            <div className="flex items-center gap-2 text-lg font-black">
              <AlertTriangle className="text-rose-500" aria-hidden="true" />
              학습 기록 초기화
            </div>
            <p className="mt-3 leading-7 text-slate-700 dark:text-slate-200">
              풀이 기록, 오답노트, 즐겨찾기, 시험 결과를 모두 삭제합니다.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button type="button" onClick={() => setResetOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 font-bold dark:border-slate-700">
                취소
              </button>
              <button type="button" onClick={resetAll} className="rounded-lg bg-rose-600 px-4 py-2 font-bold text-white">
                초기화
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
