import ProgressBar from "./ProgressBar";
import type { ExamResult } from "../types";

interface ResultSummaryProps {
  result: ExamResult;
}

export default function ResultSummary({ result }: ResultSummaryProps) {
  return (
    <section className={`rounded-lg border p-5 shadow-soft ${result.passed ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950" : "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-950"}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-black">{result.passed ? "합격권입니다" : "보완이 필요합니다"}</h1>
          <p className="mt-2 text-sm">응시일 {new Date(result.date).toLocaleString("ko-KR")}</p>
        </div>
        <div className="text-5xl font-black">{result.score}점</div>
      </div>
      <div className="mt-5">
        <ProgressBar value={result.score} max={100} label={`합격 기준 ${result.passScore}점`} />
      </div>
    </section>
  );
}
