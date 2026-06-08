import type { Question } from "../types";

interface QuestionNavigatorProps {
  questions: Question[];
  currentIndex: number;
  answers: Record<string, string>;
  flaggedIds: Set<string>;
  onSelect: (index: number) => void;
}

export default function QuestionNavigator({ questions, currentIndex, answers, flaggedIds, onSelect }: QuestionNavigatorProps) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-8 md:grid-cols-10" aria-label="문제 번호 네비게이션">
      {questions.map((question, index) => {
        const answered = Boolean(answers[question.id]?.trim());
        const flagged = flaggedIds.has(question.id);
        const current = index === currentIndex;
        return (
          <button
            key={question.id}
            type="button"
            onClick={() => onSelect(index)}
            className={`aspect-square rounded-lg border text-sm font-semibold transition ${
              current
                ? "border-blue-600 bg-blue-600 text-white"
                : flagged
                  ? "border-amber-300 bg-amber-100 text-amber-800 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-100"
                  : answered
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            }`}
            aria-current={current ? "step" : undefined}
            title={`${index + 1}번${answered ? ", 응답 완료" : ", 미응답"}${flagged ? ", 체크됨" : ""}`}
          >
            {index + 1}
          </button>
        );
      })}
    </div>
  );
}
