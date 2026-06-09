import { ChevronLeft } from "lucide-react";
import ProgressBar from "../components/ProgressBar";
import { CATEGORIES, QUESTION_TYPE_LABELS, type QuestionType } from "../types";
import { getAccuracyByCategory, getAccuracyByDifficulty, getAccuracyByType, getLearningSnapshot, getMostWrongConcepts, storage } from "../utils/storage";

interface StatsPageProps {
  onBack: () => void;
}

export default function StatsPage({ onBack }: StatsPageProps) {
  const snapshot = getLearningSnapshot();
  const categoryStats = getAccuracyByCategory();
  const typeStats = getAccuracyByType();
  const difficultyStats = getAccuracyByDifficulty();
  const exams = storage.getExamResults().slice(0, 5).reverse();
  const wrongConcepts = getMostWrongConcepts();
  const weakSource = categoryStats.filter((item) => item.total >= 5);
  const weakCategories = weakSource.length ? [...weakSource].sort((a, b) => a.accuracy - b.accuracy || b.wrong - a.wrong).slice(0, 5) : [];
  const recommended = weakCategories.length ? weakCategories.map((item) => item.category) : CATEGORIES.slice(0, 5);

  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
        <ChevronLeft size={16} aria-hidden="true" />
        메인으로
      </button>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-black">학습통계</h1>
        <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-400">응답 기록과 실전모드 제출 결과를 기준으로 계산합니다.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Stat label="전체 풀이 수" value={`${snapshot.total}`} basis="학습모드 응답 + 실전모드 제출 문항 수" />
          <Stat label="고유 풀이 문제 수" value={`${snapshot.uniqueSolved}`} basis="한 번 이상 푼 고유 questionId 개수" />
          <Stat label="전체 정답률" value={`${snapshot.accuracy}%`} basis="정답 처리된 응답 수 / 전체 응답 수" />
          <Stat label="최근 정답률" value={`${snapshot.recentAccuracy}%`} basis="최근 30문항 기준" />
          <Stat label="실전 평균 점수" value={`${snapshot.examAverage}점`} basis="제출 완료된 실전모드 점수 평균" />
          <Stat label="최근 실전 점수" value={`${snapshot.recentScore}점`} basis="가장 최근 제출한 실전모드 점수" />
          <Stat label="오답 재발률" value={`${snapshot.relapseRate}%`} basis="오답노트 등록 문제를 다시 풀었을 때 또 틀린 비율" />
          <Stat label="복습 완료율" value={`${snapshot.reviewComplete}%`} basis="오답노트 문제 중 이후 정답 처리된 비율" />
          <Stat label="합격 가능성" value={snapshot.passReadiness.label} basis={snapshot.passReadiness.basis} />
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ChartPanel title="카테고리별 정답률" basis="해당 카테고리 정답 점수 / 해당 카테고리 풀이 수">
          {categoryStats.length ? categoryStats.map((item) => <Bar key={item.category} label={item.category} value={item.accuracy} note={`${item.total}문항 풀이`} />) : <Empty />}
        </ChartPanel>

        <ChartPanel title="문제 유형별 정답률" basis="객관식, OX, 단답형, 표형 등 유형별 정답 점수 / 유형별 풀이 수">
          {typeStats.length ? (
            typeStats.map((item) => <Bar key={item.type} label={QUESTION_TYPE_LABELS[item.type as QuestionType]} value={item.accuracy} note={`${item.total}문항 풀이`} />)
          ) : (
            <Empty />
          )}
        </ChartPanel>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ChartPanel title="난이도별 정답률" basis="난이도별 정답 점수 / 난이도별 풀이 수">
          {difficultyStats.length ? difficultyStats.map((item) => <Bar key={item.difficulty} label={item.difficulty} value={item.accuracy} note={`${item.total}문항 풀이`} />) : <Empty />}
        </ChartPanel>

        <ChartPanel title="취약 영역" basis="최소 5문항 이상 푼 카테고리만 낮은 정답률 순으로 집계">
          {weakCategories.length ? weakCategories.map((item) => <Bar key={item.category} label={item.category} value={item.accuracy} note={`${item.total}문항 · 오답 ${item.wrong}`} />) : <DataShortage />}
        </ChartPanel>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ChartPanel title="최근 5회 실전모드 점수" basis="제출 완료된 실전모드 시험만 집계">
          {exams.length ? (
            <div className="flex h-56 items-end gap-3 rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
              {exams.map((exam, index) => (
                <div key={exam.id} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center">
                    <div className="w-full rounded-t-lg bg-blue-600" style={{ height: `${Math.max(8, exam.score * 1.7)}px` }} />
                  </div>
                  <div className="text-xs font-bold">{exam.score}점</div>
                  <div className="text-xs text-slate-500">{index + 1}회</div>
                </div>
              ))}
            </div>
          ) : (
            <Empty />
          )}
        </ChartPanel>

        <ChartPanel title="가장 많이 틀린 개념 TOP 5" basis="오답노트 retryCount 기준">
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
        <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">취약 영역 데이터가 부족하면 기본 핵심 범위를 우선 추천합니다.</p>
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

function Stat({ label, value, basis }: { label: string; value: string; basis: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
      <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 text-3xl font-black">{value}</div>
      <div className="mt-2 text-xs font-semibold leading-5 text-slate-500 dark:text-slate-400">계산 기준: {basis}</div>
    </div>
  );
}

function ChartPanel({ title, basis, children }: { title: string; basis: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-black">{title}</h2>
      <p className="mb-4 mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">계산 기준: {basis}</p>
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
  return <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-500 dark:bg-slate-950 dark:text-slate-400">저장된 기록이 필요합니다.</div>;
}

function DataShortage() {
  return <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-500 dark:bg-slate-950 dark:text-slate-400">데이터 부족: 카테고리별 최소 5문항 이상 풀이 후 분석 가능합니다.</div>;
}
