import { ChevronLeft, Search } from "lucide-react";
import { useMemo, useState } from "react";
import CategoryFilter from "../components/CategoryFilter";
import { questionCounts, questions } from "../data/questionBank";
import { DIFFICULTIES, QUESTION_TYPE_LABELS, QUESTION_TYPES, type Category, type Difficulty, type QuestionType } from "../types";

interface QuestionBankPageProps {
  onBack: () => void;
}

export default function QuestionBankPage({ onBack }: QuestionBankPageProps) {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([...DIFFICULTIES]);
  const [types, setTypes] = useState<QuestionType[]>([...QUESTION_TYPES]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return questions.filter((question) => {
      const categoryMatch = categories.length === 0 || categories.includes(question.category);
      const difficultyMatch = difficulties.length === 0 || difficulties.includes(question.difficulty);
      const typeMatch = types.length === 0 || types.includes(question.type);
      const haystack = [question.id, question.question, question.answer, question.explanation, question.relatedConcept, ...question.tags].join(" ").toLowerCase();
      const queryMatch = !normalizedQuery || haystack.includes(normalizedQuery);
      return categoryMatch && difficultyMatch && typeMatch && queryMatch;
    });
  }, [categories, difficulties, query, types]);

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
        <ChevronLeft size={16} aria-hidden="true" />
        메인으로
      </button>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-black">문제은행 관리</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              총 {questionCounts.total}문항 · 객관식 {questionCounts.multiple} · OX {questionCounts.ox} · 단답 {questionCounts.short} · 빈칸 {questionCounts.blank} · 서술/프롬프트 {(questionCounts.essay ?? 0) + (questionCounts.prompt ?? 0)}
            </p>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="문제, 정답, 태그 검색"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-950"
            />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <CategoryFilter
          selectedCategories={categories}
          onCategoriesChange={setCategories}
          selectedDifficulties={difficulties}
          onDifficultiesChange={setDifficulties}
          selectedTypes={types}
          onTypesChange={setTypes}
        />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black">검색 결과</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">{filtered.length}문항</span>
        </div>
        <div className="space-y-3">
          {filtered.map((question) => (
            <article key={question.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge>{question.id}</Badge>
                <Badge>{QUESTION_TYPE_LABELS[question.type]}</Badge>
                <Badge>{question.category}</Badge>
                <Badge>{question.difficulty}</Badge>
                <Badge>{question.sourceType}</Badge>
              </div>
              <h3 className="whitespace-pre-line font-bold leading-7">{question.question}</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-emerald-50 p-3 text-sm dark:bg-emerald-950">
                  <span className="font-bold text-emerald-700 dark:text-emerald-200">정답 </span>
                  {question.answer}
                </div>
                <div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950">
                  <span className="font-bold">관련 개념 </span>
                  {question.relatedConcept}
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{question.explanation}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">{children}</span>;
}
