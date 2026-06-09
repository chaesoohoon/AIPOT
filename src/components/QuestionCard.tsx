import ChoiceOption from "./ChoiceOption";
import ResponsiveQuestionTable from "./ResponsiveQuestionTable";
import SubjectiveAnswerBox from "./SubjectiveAnswerBox";
import { QUESTION_TYPE_LABELS, type GradeResult, type Question } from "../types";

interface QuestionCardProps {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  mode?: "study" | "exam";
  grade?: GradeResult;
  revealAnswer?: boolean;
  onCommit?: () => void;
  checklistState?: string[];
  onChecklistChange?: (items: string[]) => void;
  matchedKeywords?: string[];
  disabled?: boolean;
}

const toggleChecklist = (items: string[], item: string) => (items.includes(item) ? items.filter((value) => value !== item) : [...items, item]);

export default function QuestionCard({
  question,
  value,
  onChange,
  mode = "study",
  grade,
  revealAnswer = false,
  onCommit,
  checklistState = [],
  onChecklistChange,
  matchedKeywords = [],
  disabled = false,
}: QuestionCardProps) {
  const isChoiceType = question.type === "multiple" || question.type === "ox" || question.type === "tableChoice";
  const isShortType = question.type === "short" || question.type === "blank";
  const subjective = question.type === "essay" || question.type === "prompt";
  const matchedSet = new Set(matchedKeywords);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 md:p-6">
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-black text-white">{QUESTION_TYPE_LABELS[question.type]}</span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200">{question.sourceType}</span>
        {grade && mode === "study" ? (
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-white dark:bg-white dark:text-slate-950">
            {grade.status === "correct" ? "정답" : grade.status === "partial" ? "부분정답" : "오답"}
          </span>
        ) : null}
      </div>

      <h2 className="whitespace-pre-line text-xl font-black leading-8 tracking-normal text-slate-950 dark:text-white md:text-2xl">{question.question}</h2>

      {question.table ? <ResponsiveQuestionTable table={question.table} /> : null}

      {isChoiceType ? (
        <div className="mt-6 grid gap-3">
          {question.choices.map((choice, index) => (
            <ChoiceOption
              key={`${question.id}-${index}`}
              choice={choice}
              index={index}
              selected={value === choice}
              correct={choice === question.answer}
              revealAnswer={revealAnswer}
              mode={mode}
              onSelect={onChange}
            />
          ))}
        </div>
      ) : null}

      {isShortType ? (
        <div className="mt-6 space-y-2">
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onBlur={onCommit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onCommit?.();
              }
            }}
            disabled={disabled}
            className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950 dark:disabled:bg-slate-800"
            placeholder="답안을 입력하고 Enter를 누르세요."
            aria-label="단답형 답안"
          />
          {mode === "study" ? <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Enter 또는 입력창 밖 클릭 시 자동 채점됩니다.</p> : null}
        </div>
      ) : null}

      {subjective ? (
        <div className="mt-6 space-y-4">
          <SubjectiveAnswerBox
            value={value}
            onChange={onChange}
            disabled={disabled}
            rows={question.type === "prompt" ? 7 : 6}
            placeholder={question.type === "prompt" ? "역할, 대상, 목적, 조건, 출력 형식을 포함해 작성하세요." : "핵심 키워드를 포함해 서술하세요."}
          />

          {mode === "study" ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="text-sm font-black text-slate-800 dark:text-slate-100">핵심 요소 점검</div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {matchedKeywords.length}/{question.keywords.length}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {question.keywords.map((keyword) => {
                  const matched = matchedSet.has(keyword);
                  return (
                    <span
                      key={keyword}
                      className={`rounded-full px-2.5 py-1 text-xs font-black ${
                        matched
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100"
                          : "bg-white text-slate-500 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:ring-slate-700"
                      }`}
                    >
                      {matched ? "포함 " : "보완 필요 "}
                      {keyword}
                    </span>
                  );
                })}
              </div>
            </div>
          ) : null}

          {question.type === "prompt" && mode === "study" && question.checklist ? (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
              <div className="mb-3 text-sm font-black text-blue-900 dark:text-blue-100">자기채점 체크리스트</div>
              <div className="grid gap-2 sm:grid-cols-2">
                {question.checklist.map((item) => (
                  <label key={item} className="flex min-h-11 items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-sm font-semibold text-blue-950 dark:bg-blue-900/40 dark:text-blue-50">
                    <input
                      type="checkbox"
                      checked={checklistState.includes(item)}
                      onChange={() => onChecklistChange?.(toggleChecklist(checklistState, item))}
                      className="h-4 w-4 accent-blue-600"
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
