import { ChevronLeft } from "lucide-react";
import CreatorBanner from "../components/CreatorBanner";

interface SummaryPageProps {
  onBack: () => void;
}

const top15 = [
  "AI > 머신러닝 > 딥러닝 포함 관계",
  "지도학습: 정답 라벨 있음",
  "비지도학습: 라벨 없이 패턴 탐색",
  "강화학습: 보상 기반 행동 학습",
  "생성형 AI: 새 콘텐츠 생성",
  "LLM: 대규모 언어 모델",
  "RAG: 검색 후 근거 기반 생성",
  "환각: 사실 아닌 답을 그럴듯하게 제시",
  "Temperature: 창의성·무작위성 조절",
  "Max Tokens: 응답 길이 제한",
  "Few-shot: 예시 몇 개 제공",
  "OCR/STT/TTS 구분",
  "GAN: 생성자와 판별자 경쟁",
  "Diffusion: 노이즈 제거 기반 생성",
  "개인정보·기밀정보 입력 금지",
];

const comparisons = [
  ["지도학습", "정답 라벨 있음", "분류, 회귀"],
  ["비지도학습", "정답 라벨 없음", "군집화, 패턴 탐색"],
  ["강화학습", "보상·벌점 있음", "게임, 로봇 제어"],
  ["Zero-shot", "예시 없음", "간단한 지시"],
  ["Few-shot", "예시 몇 개", "형식 따라 하기"],
  ["RAG", "외부 근거 검색", "환각 감소"],
];

export default function SummaryPage({ onBack }: SummaryPageProps) {
  return (
    <div className="space-y-5">
      <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
        <ChevronLeft size={16} aria-hidden="true" />
        메인으로
      </button>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-black">시험 핵심 요약</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">AIPOT 2급 직전 압축 정리</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Panel title="시험 직전 10분 암기">
          <div className="grid gap-2">
            {top15.slice(0, 10).map((item) => (
              <div key={item} className="rounded-lg bg-blue-50 p-3 text-sm font-semibold text-blue-900 dark:bg-blue-950 dark:text-blue-100">
                {item}
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="무조건 잡아야 할 TOP 15">
          <ol className="grid gap-2">
            {top15.map((item, index) => (
              <li key={item} className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950">
                <span className="font-black text-blue-700 dark:text-blue-300">{index + 1}. </span>
                {item}
              </li>
            ))}
          </ol>
        </Panel>
      </section>

      <Panel title="헷갈리는 개념 비교표">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-left dark:bg-slate-800">
                <th className="border border-slate-200 p-3 dark:border-slate-700">개념</th>
                <th className="border border-slate-200 p-3 dark:border-slate-700">구분 포인트</th>
                <th className="border border-slate-200 p-3 dark:border-slate-700">대표 사례</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map(([concept, point, example]) => (
                <tr key={concept}>
                  <td className="border border-slate-200 p-3 font-bold dark:border-slate-700">{concept}</td>
                  <td className="border border-slate-200 p-3 dark:border-slate-700">{point}</td>
                  <td className="border border-slate-200 p-3 dark:border-slate-700">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <section className="grid gap-5 lg:grid-cols-2">
        <Panel title="주관식 예상 답안 템플릿">
          <div className="space-y-3 text-sm leading-7">
            <Template label="개념 설명형" text="[개념]은 [핵심 정의]를 의미한다. 대표 사례는 [사례]이며, [비교 개념]과의 차이는 [차이점]이다." />
            <Template label="비교형" text="A는 [기준 1]이고 B는 [기준 2]이다. 시험에서는 [구분 단서]로 판단한다." />
            <Template label="윤리형" text="개인정보와 기밀정보를 입력하지 않고, 출처와 저작권을 확인하며, 사람이 최종 검토해야 한다." />
          </div>
        </Panel>

        <Panel title="프롬프트 작성 공식">
          <div className="rounded-lg bg-amber-50 p-4 text-lg font-bold leading-8 text-amber-950 dark:bg-amber-950 dark:text-amber-50">
            너는 [역할]이야. [대상]을 위해 [목표]를 수행해줘. 조건은 [조건]이고, 결과는 [출력형식]으로 작성해줘.
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            {["역할", "대상", "목표", "맥락", "조건", "출력형식", "예시", "제약사항"].map((item) => (
              <span key={item} className="rounded-lg bg-slate-50 p-2 font-semibold dark:bg-slate-950">
                {item}
              </span>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <Panel title="AI 윤리 체크리스트">
          {["개인정보를 익명화했는가", "회사 기밀을 제거했는가", "저작권 침해 가능성을 확인했는가", "출처와 사실성을 검증했는가", "편향이나 차별 표현을 점검했는가", "사람이 최종 책임을 지는가"].map((item) => (
            <label key={item} className="flex items-center gap-2 rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-950">
              <input type="checkbox" className="h-4 w-4 accent-blue-600" readOnly />
              {item}
            </label>
          ))}
        </Panel>

        <Panel title="이미지 프롬프트 공식">
          <div className="rounded-lg bg-blue-50 p-4 text-sm font-semibold leading-7 text-blue-950 dark:bg-blue-950 dark:text-blue-50">
            [주제]를 [스타일]로, [구도]와 [조명]을 적용해, [색감] 분위기로 생성해줘. 비율은 [비율]이고, 제외할 요소는 [네거티브 프롬프트]야.
          </div>
          <div className="mt-3 grid gap-2 text-sm">
            {["주제", "스타일", "구도", "조명", "색감", "비율", "네거티브 프롬프트"].map((item) => (
              <span key={item} className="rounded-lg bg-slate-50 p-2 font-semibold dark:bg-slate-950">
                {item}
              </span>
            ))}
          </div>
        </Panel>
      </section>

      <CreatorBanner placement="summary" />
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-lg font-black">{title}</h2>
      {children}
    </section>
  );
}

function Template({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
      <div className="font-black text-blue-700 dark:text-blue-300">{label}</div>
      <div>{text}</div>
    </div>
  );
}
