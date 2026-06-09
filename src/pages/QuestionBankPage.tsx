import { ChevronLeft, Search } from "lucide-react";
import { useMemo, useState } from "react";
import ResponsiveQuestionTable from "../components/ResponsiveQuestionTable";
import { questions } from "../data/questionBank";
import { getQuestionAudit } from "../utils/questionAudit";
import {
  CATEGORIES,
  DIFFICULTIES,
  EXAM_SUITABILITIES,
  QUESTION_STATUSES,
  QUESTION_TYPE_LABELS,
  QUESTION_TYPES,
  SOURCE_TYPES,
  type Category,
  type Difficulty,
  type ExamSuitability,
  type QuestionStatus,
  type QuestionType,
  type SourceType,
} from "../types";

interface QuestionBankPageProps {
  onBack: () => void;
}

export default function QuestionBankPage({ onBack }: QuestionBankPageProps) {
  const audit = getQuestionAudit();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"전체" | QuestionStatus>("전체");
  const [suitability, setSuitability] = useState<"전체" | ExamSuitability>("전체");
  const [type, setType] = useState<"전체" | QuestionType>("전체");
  const [category, setCategory] = useState<"전체" | Category>("전체");
  const [difficulty, setDifficulty] = useState<"전체" | Difficulty>("전체");
  const [sourceType, setSourceType] = useState<"전체" | SourceType>("전체");
  const [tableOnly, setTableOnly] = useState(false);
  const [reviewOnly, setReviewOnly] = useState(false);
  const [unsuitableOnly, setUnsuitableOnly] = useState(false);
  const [fieldErrorOnly, setFieldErrorOnly] = useState(false);

  const fieldErrorSet = useMemo(() => new Set(audit.fieldErrorIds), [audit.fieldErrorIds]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return questions.filter((question) => {
      const haystack = [question.id, question.question, question.answer, question.explanation, question.relatedConcept, ...question.tags]
        .join(" ")
        .toLowerCase();
      if (normalizedQuery && !haystack.includes(normalizedQuery)) return false;
      if (status !== "전체" && question.status !== status) return false;
      if (suitability !== "전체" && question.examSuitability !== suitability) return false;
      if (type !== "전체" && question.type !== type) return false;
      if (category !== "전체" && question.category !== category) return false;
      if (difficulty !== "전체" && question.difficulty !== difficulty) return false;
      if (sourceType !== "전체" && question.sourceType !== sourceType) return false;
      if (tableOnly && question.type !== "tableChoice") return false;
      if (reviewOnly && question.status !== "review") return false;
      if (unsuitableOnly && question.examSuitability === "실전적합") return false;
      if (fieldErrorOnly && !fieldErrorSet.has(question.id)) return false;
      return true;
    });
  }, [category, difficulty, fieldErrorOnly, fieldErrorSet, query, reviewOnly, sourceType, status, suitability, tableOnly, type, unsuitableOnly]);

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
            <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
              삭제보다 상태 분류와 출제 필터링을 기준으로 관리합니다.
            </p>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-3 text-slate-400" size={18} aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="문제, 정답, 해설, 태그 검색"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:focus:ring-blue-950"
            />
          </div>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-4">
        <Metric label="전체 보유 문제" value={`${audit.total}`} note="삭제하지 않고 보존된 전체 데이터" />
        <Metric label="실전 출제 가능" value={`${audit.examReady}`} note="active + 실전적합 기준" />
        <Metric label="학습 출제 가능" value={`${audit.studyReady}`} note="active/review 기준" />
        <Metric label="심화학습 문제" value={`${audit.deepPractice}`} note="deepPractice 또는 심화학습" />
        <Metric label="검토 필요" value={`${audit.review}`} note="status=review" />
        <Metric label="비활성" value={`${audit.disabled}`} note="status=disabled" />
        <Metric label="표형 문제" value={`${audit.tableChoice}`} note="tableChoice 유형" />
        <Metric label="필드 오류" value={`${audit.fieldError}`} note="필수 필드/표 구조 누락" />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Select label="상태" value={status} onChange={(value) => setStatus(value as typeof status)} options={["전체", ...QUESTION_STATUSES]} />
          <Select label="실전 적합성" value={suitability} onChange={(value) => setSuitability(value as typeof suitability)} options={["전체", ...EXAM_SUITABILITIES]} />
          <Select label="유형" value={type} onChange={(value) => setType(value as typeof type)} options={["전체", ...QUESTION_TYPES]} getLabel={(value) => (value === "전체" ? value : QUESTION_TYPE_LABELS[value as QuestionType])} />
          <Select label="카테고리" value={category} onChange={(value) => setCategory(value as typeof category)} options={["전체", ...CATEGORIES]} />
          <Select label="난이도" value={difficulty} onChange={(value) => setDifficulty(value as typeof difficulty)} options={["전체", ...DIFFICULTIES]} />
          <Select label="출처 유형" value={sourceType} onChange={(value) => setSourceType(value as typeof sourceType)} options={["전체", ...SOURCE_TYPES]} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Toggle label="표형만" checked={tableOnly} onChange={setTableOnly} />
          <Toggle label="검토 필요만" checked={reviewOnly} onChange={setReviewOnly} />
          <Toggle label="실전 부적합만" checked={unsuitableOnly} onChange={setUnsuitableOnly} />
          <Toggle label="필드 오류만" checked={fieldErrorOnly} onChange={setFieldErrorOnly} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Breakdown title="유형별 문제 수" data={audit.byType} labeler={(key) => QUESTION_TYPE_LABELS[key as QuestionType] ?? key} />
        <Breakdown title="상태별 문제 수" data={audit.byStatus} />
        <Breakdown title="실전 적합성" data={audit.byExamSuitability} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black">검색 결과</h2>
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">{filtered.length}문항</span>
        </div>
        <div className="space-y-3">
          {filtered.map((question) => (
            <article key={question.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div className="mb-2 flex flex-wrap gap-2">
                <Badge>{question.id}</Badge>
                <Badge>{QUESTION_TYPE_LABELS[question.type]}</Badge>
                <Badge>{question.status}</Badge>
                <Badge>{question.examSuitability}</Badge>
                <Badge>{question.category}</Badge>
                <Badge>{question.difficulty}</Badge>
                <Badge>{question.sourceType}</Badge>
                {fieldErrorSet.has(question.id) ? <Badge tone="danger">필드 오류</Badge> : null}
              </div>
              <h3 className="whitespace-pre-line font-bold leading-7">{question.question}</h3>
              {question.table ? <ResponsiveQuestionTable table={question.table} /> : null}
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

function Metric({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-3xl font-black">{value}</div>
      <div className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">{note}</div>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
  getLabel = (item) => item,
}: {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
  getLabel?: (value: string) => string;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-black text-slate-500 dark:text-slate-400">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold dark:border-slate-700 dark:bg-slate-950">
        {options.map((item) => (
          <option key={item} value={item}>
            {getLabel(item)}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-black dark:border-slate-700">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-blue-600" />
      {label}
    </label>
  );
}

function Breakdown({ title, data, labeler = (value) => value }: { title: string; data: Record<string, number>; labeler?: (value: string) => string }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-3 text-lg font-black">{title}</h2>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm dark:bg-slate-950">
            <span className="font-semibold">{labeler(key)}</span>
            <span className="font-black">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Badge({ children, tone = "default" }: { children: React.ReactNode; tone?: "default" | "danger" }) {
  const style = tone === "danger" ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-200" : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
  return <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${style}`}>{children}</span>;
}
