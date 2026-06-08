import Timer from "./Timer";
import ProgressBar from "./ProgressBar";
import type { Question } from "../types";

interface ExamHeaderProps {
  mode: "study" | "exam";
  question?: Question;
  currentIndex: number;
  total: number;
  answeredCount?: number;
  timerSeconds?: number;
  running?: boolean;
  onExpire?: () => void;
  actions?: React.ReactNode;
}

export default function ExamHeader({ mode, question, currentIndex, total, answeredCount, timerSeconds, running, onExpire, actions }: ExamHeaderProps) {
  const studyPosition = Math.min(currentIndex + 1, Math.max(total, 1));
  const progressValue = mode === "exam" ? answeredCount ?? 0 : studyPosition;
  const label = mode === "exam" ? `응답 ${answeredCount ?? 0}/${total}` : `문제 ${studyPosition}/${total}`;

  return (
    <header className="rounded-lg border border-slate-200 bg-white/95 p-4 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded-full bg-blue-600 px-3 py-1 font-black text-white">{mode === "exam" ? "실전모드" : "학습모드"}</span>
            {question ? (
              <>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{question.category}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{question.difficulty}</span>
              </>
            ) : null}
          </div>
          <div className="mt-3 min-w-64">
            <ProgressBar value={progressValue} max={Math.max(total, 1)} label={label} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {mode === "exam" && timerSeconds && onExpire ? <Timer initialSeconds={timerSeconds} running={Boolean(running)} onExpire={onExpire} /> : null}
          {actions}
        </div>
      </div>
    </header>
  );
}
