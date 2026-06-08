import { CheckCircle, Circle, XCircle } from "lucide-react";

interface ChoiceOptionProps {
  choice: string;
  index: number;
  selected: boolean;
  correct: boolean;
  revealAnswer: boolean;
  mode: "study" | "exam";
  onSelect: (choice: string) => void;
}

export default function ChoiceOption({ choice, index, selected, correct, revealAnswer, mode, onSelect }: ChoiceOptionProps) {
  const showCorrect = mode === "study" && revealAnswer && correct;
  const showWrong = mode === "study" && revealAnswer && selected && !correct;
  const examSelected = mode === "exam" && selected;

  const tone = showCorrect
    ? "border-emerald-300 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-100 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-50 dark:ring-emerald-900"
    : showWrong
      ? "border-rose-300 bg-rose-50 text-rose-950 ring-2 ring-rose-100 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-50 dark:ring-rose-900 animate-soft-shake"
      : examSelected
        ? "border-blue-500 bg-blue-50 text-blue-950 ring-2 ring-blue-100 dark:border-blue-600 dark:bg-blue-950 dark:text-blue-50 dark:ring-blue-900"
        : "border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50/70 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-blue-700 dark:hover:bg-blue-950/60";

  const icon = showCorrect ? (
    <CheckCircle className="text-emerald-600 dark:text-emerald-300" size={20} aria-hidden="true" />
  ) : showWrong ? (
    <XCircle className="text-rose-600 dark:text-rose-300" size={20} aria-hidden="true" />
  ) : (
    <Circle className={selected ? "text-blue-600 dark:text-blue-300" : "text-slate-300 dark:text-slate-600"} size={20} aria-hidden="true" />
  );

  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={`${index + 1}번 보기: ${choice}`}
      onClick={() => onSelect(choice)}
      className={`group flex min-h-16 w-full items-start gap-3 rounded-lg border p-4 text-left outline-none transition duration-200 focus-visible:ring-4 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-900 ${tone}`}
    >
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/70 text-sm font-black text-slate-500 ring-1 ring-inset ring-slate-200 dark:bg-slate-900/70 dark:text-slate-300 dark:ring-slate-700">
        {index + 1}
      </span>
      <span className="min-w-0 flex-1 leading-7">{choice}</span>
      <span className="flex shrink-0 items-center gap-2">
        {showCorrect ? <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100">정답</span> : null}
        {showWrong ? <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-black text-rose-700 dark:bg-rose-900 dark:text-rose-100">내 선택</span> : null}
        {icon}
      </span>
    </button>
  );
}
