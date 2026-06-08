import { ChevronLeft } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import { CATEGORIES } from "../types";
import { getAccuracyByCategory, getAccuracyByDifficulty, getLearningSnapshot, getMostWrongConcepts, storage } from "../utils/storage";

interface StatsPageProps {
  onBack: () => void;
}

export default function StatsPage({ onBack }: StatsPageProps) {
  const snapshot = getLearningSnapshot();
  const categoryStats = getAccuracyByCategory();
  const difficultyStats = getAccuracyByDifficulty();
  const exams = storage.getExamResults().slice(0, 5).reverse();
  const wrongConcepts = getMostWrongConcepts();
  const recommended = categoryStats.length
    ? [...categoryStats].sort((a, b) => a.accuracy - b.accuracy || b.wrong - a.wrong).slice(0, 5).map((item) => item.category)
    : CATEGORIES.slice(0, 5);

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
        <ChevronLeft size={16} aria-hidden="true" />
        메인으로
      </button>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-black">학습통계</h1>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Stat label="전체 정답률" value={`${snapshot.accuracy}%`} />
          <Stat label="최근 시험 점수" value={`${snapshot.recentScore}점`} />
          <Stat label="합격 가능성" value={`${snapshot.passPossibility}%`} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ChartPanel title="카테고리별 정답률">
          {categoryStats.length ? (
            categoryStats.map((item) => <Bar key={item.category} label={item.category} value={item.accuracy} note={`${item.total}회 풀이`} />)
          ) : (
            <Empty />
          )}
        </ChartPanel>

        <ChartPanel title="난이도별 정답률">
          {difficultyStats.length ? (
            difficultyStats.map((item) => <Bar key={item.difficulty} label={item.difficulty} value={item.accuracy} note={`${item.total}회 풀이`} />)
          ) : (
            <Empty />
          )}
        </ChartPanel>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ChartPanel title="최근 5회 실전모드 점수 변화">
          {exams.length ? (
            <div className="flex h-56 items-end gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
              {exams.map((exam, index) => (
                <div key={exam.id} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center">
                    <div className="w-full rounded-t-lg bg-blue-600" style={{ height: `${Math.max(8, exam.score * 1.7)}px` }} />
                  </div>
                  <div className="text-xs font-bold">{exam.score}</div>
                  <div className="text-xs text-slate-500">{index + 1}회</div>
                </div>
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </ChartPanel>

        <ChartPanel title="가장 많이 틀린 개념 TOP 5">
          {wrongConcepts.length ? (
            <div className="space-y-3">
              {wrongConcepts.map((item, index) => (
                <div key={item.questionId} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{index + 1}. {item.label}</span>
                    <span className="text-sm text-rose-600 dark:text-rose-300">{item.retryCount}회</span>
                  </div>
                  <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.category}</div>
                </div>
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </ChartPanel>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-black">추천 학습 순서</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-5">
          {recommended.map((category, index) => (
            <div key={category} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
              <div className="text-sm font-black text-blue-700 dark:text-blue-300">{index + 1}</div>
              <div className="mt-2 font-semibold">{category}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
      <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-3xl font-black">{value}</div>
    </div>
  );
}

function ChartPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-lg font-black">{title}</h2>
      {children}
    </section>
  );
}

function Bar({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="space-y-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-semibold">{label}</span>
        <span>{value}% · {note}</span>
      </div>
      <ProgressBar value={value} max={100} />
    </div>
  );
}

function Empty() {
  return <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-500 dark:bg-slate-950 dark:text-slate-400">풀이 기록이 필요합니다.</div>;
}
