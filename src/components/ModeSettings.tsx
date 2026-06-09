import { Play } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import { DIFFICULTIES, type ExamSettings } from "../types";

interface ModeSettingsProps {
  value: ExamSettings;
  onChange: (settings: ExamSettings) => void;
  onStart: () => void;
  availableCount?: number;
}

export default function ModeSettings({ value, onChange, onStart, availableCount }: ModeSettingsProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">문제 수</span>
          <input
            type="number"
            min={5}
            max={80}
            value={value.questionCount}
            onChange={(event) => onChange({ ...value, questionCount: Number(event.target.value) })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">제한시간(분)</span>
          <input
            type="number"
            min={5}
            max={120}
            value={value.minutes}
            onChange={(event) => onChange({ ...value, minutes: Number(event.target.value) })}
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      </div>

      <div className="mt-5">
        <CategoryFilter
          selectedCategories={value.categories}
          onCategoriesChange={(categories) => onChange({ ...value, categories })}
          selectedDifficulties={value.difficulties}
          onDifficultiesChange={(difficulties) => onChange({ ...value, difficulties: difficulties.length ? difficulties : [...DIFFICULTIES] })}
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Toggle label="표형 문제 포함하기" checked={value.includeTable} onChange={(checked) => onChange({ ...value, includeTable: checked })} />
        <Toggle label="서술형 포함하기" checked={value.includeEssay} onChange={(checked) => onChange({ ...value, includeEssay: checked })} />
        <Toggle label="프롬프트 작성형 포함하기" checked={value.includePrompt} onChange={(checked) => onChange({ ...value, includePrompt: checked })} />
        <Toggle label="오답 우선" checked={value.wrongFirst} onChange={(checked) => onChange({ ...value, wrongFirst: checked })} />
        <Toggle label="즐겨찾기만" checked={value.favoriteOnly} onChange={(checked) => onChange({ ...value, favoriteOnly: checked })} />
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-500 dark:text-slate-400">
          {availableCount !== undefined ? `출제 가능 문제 ${availableCount}문항` : "기본 구성: 객관식 30 · OX 5 · 단답 5 · 서술/프롬프트 제외"}
        </div>
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700"
        >
          <Play size={18} aria-hidden="true" />
          실전모드 시작
        </button>
      </div>
    </section>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-blue-600" />
      <span className="font-semibold">{label}</span>
    </label>
  );
}
