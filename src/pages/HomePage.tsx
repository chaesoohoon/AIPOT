import { BarChart3, BookOpen, ClipboardCheck, Database, FileText, NotebookTabs, Star, Trash2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import CreatorBanner from "../components/CreatorBanner";
import ProgressBar from "../components/ProgressBar";
import { questionCounts } from "../data/questionBank";
import { getLearningSnapshot, storage } from "../utils/storage";
import type { AppPage } from "../types";

interface HomePageProps {
  onNavigate: (page: AppPage) => void;
  onReset: () => void;
}

const secondaryMenu = [
  { page: "wrong" as const, label: "오답노트", icon: NotebookTabs },
  { page: "favorite" as const, label: "즐겨찾기", icon: Star },
  { page: "stats" as const, label: "학습통계", icon: BarChart3 },
  { page: "summary" as const, label: "핵심요약", icon: FileText },
  { page: "bank" as const, label: "문제은행", icon: Database },
];

export default function HomePage({ onNavigate, onReset }: HomePageProps) {
  const snapshot = getLearningSnapshot();
  const settings = storage.getSettings();
  const recommendation = snapshot.weak[0]?.category ?? "프롬프트 작성법";

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 md:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-black text-blue-700 dark:text-blue-300">AIPOT 2급 CBT 합격훈련소</p>
            <h1 className="mt-2 text-3xl font-black tracking-normal text-slate-950 dark:text-white md:text-4xl">오늘의 합격 루틴을 시작하세요</h1>
            <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
              문제은행 {questionCounts.total}문항 · 합격 기준 {settings.passScore}점 · 학습 기록은 브라우저에 자동 저장됩니다.
            </p>
          </div>
          <div className="grid min-w-full gap-3 sm:grid-cols-3 lg:min-w-[520px]">
            <Metric label="전체 정답률" value={`${snapshot.accuracy}%`} />
            <Metric label="최근 실전 점수" value={`${snapshot.recentScore}점`} />
            <Metric label="누적 오답" value={`${snapshot.wrongTotal}`} />
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <ModeCard
          icon={BookOpen}
          title="학습모드"
          subtitle="선택 즉시 피드백"
          description="정답·오답 표시, 핵심 해설, 오답노트 자동 저장까지 한 번에 처리합니다."
          action="학습 시작"
          onClick={() => onNavigate("study")}
        />
        <ModeCard
          icon={ClipboardCheck}
          title="실전모드"
          subtitle="CBT처럼 응시"
          description="제출 전까지 정답과 해설을 숨기고, 결과 화면에서 점수와 취약 영역을 분석합니다."
          action="실전 시작"
          onClick={() => onNavigate("exam")}
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_420px]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-black">오늘 추천 학습</h2>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700 dark:bg-blue-950 dark:text-blue-200">자동 추천</span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Recommendation step="1" title={recommendation} body="취약 영역 또는 핵심 프롬프트 파트를 먼저 10문항 풀이하세요." />
            <Recommendation step="2" title="오답노트 복습" body="최근 틀린 문제를 다시 풀고 최근 정답 상태로 바꾸세요." />
            <Recommendation step="3" title="실전 40분" body="한 회차를 CBT처럼 풀고 결과 화면에서 취약 영역을 확인하세요." />
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-4 text-lg font-black">취약 영역 TOP 3</h2>
          {snapshot.weak.length ? (
            <div className="space-y-3">
              {snapshot.weak.map((item) => (
                <div key={item.category} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-black">{item.category}</span>
                    <span className="font-bold text-rose-600 dark:text-rose-300">오답 {item.wrong}</span>
                  </div>
                  <ProgressBar value={item.accuracy} max={100} label="정답률" />
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-slate-50 p-4 text-sm font-semibold leading-6 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
              풀이 기록이 쌓이면 취약 영역을 자동으로 보여줍니다.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {secondaryMenu.map(({ page, label, icon: Icon }) => (
            <button
              key={page}
              type="button"
              onClick={() => onNavigate(page)}
              className="flex min-h-14 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:border-blue-700 dark:hover:bg-blue-950 dark:focus-visible:ring-blue-900"
            >
              <Icon size={17} aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-black text-rose-700 transition hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-100 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200"
      >
        <Trash2 size={18} aria-hidden="true" />
        학습 기록 초기화
      </button>

      <CreatorBanner placement="home" />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
      <div className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-black text-slate-950 dark:text-white">{value}</div>
    </div>
  );
}

function ModeCard({
  icon: Icon,
  title,
  subtitle,
  description,
  action,
  onClick,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group min-h-56 rounded-lg border border-slate-200 bg-white p-6 text-left shadow-soft outline-none transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50/50 focus-visible:ring-4 focus-visible:ring-blue-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-700 dark:hover:bg-blue-950/40 dark:focus-visible:ring-blue-900"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
        <Icon size={24} aria-hidden="true" />
      </span>
      <div className="mt-5 text-sm font-black text-blue-700 dark:text-blue-300">{subtitle}</div>
      <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">{description}</p>
      <div className="mt-6 inline-flex rounded-lg bg-slate-950 px-4 py-2 text-sm font-black text-white transition group-hover:bg-blue-600 dark:bg-white dark:text-slate-950 dark:group-hover:bg-blue-200">
        {action}
      </div>
    </button>
  );
}

function Recommendation({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
      <div className="text-xs font-black text-blue-700 dark:text-blue-300">STEP {step}</div>
      <div className="mt-2 font-black text-slate-950 dark:text-white">{title}</div>
      <p className="mt-2 text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">{body}</p>
    </div>
  );
}
