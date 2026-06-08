import { ChevronLeft, Printer, Star, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import CreatorBanner from "../components/CreatorBanner";
import { getQuestionById } from "../data/questionBank";
import { CATEGORIES, type Category } from "../types";
import { storage } from "../utils/storage";

interface WrongNotePageProps {
  onBack: () => void;
  onPractice: (ids: string[], title: string) => void;
  onStored: () => void;
}

export default function WrongNotePage({ onBack, onPractice, onStored }: WrongNotePageProps) {
  const [category, setCategory] = useState<Category | "전체">("전체");
  const [version, setVersion] = useState(0);
  const notes = storage.getWrongNotes();
  const filtered = useMemo(() => notes.filter((note) => category === "전체" || note.category === category), [category, notes, version]);

  const refresh = () => {
    setVersion((value) => value + 1);
    onStored();
  };

  const remove = (id: string) => {
    storage.deleteWrongNote(id);
    refresh();
  };

  const markCorrect = (id: string) => {
    storage.markWrongAsCorrect(id);
    refresh();
  };

  const practiceMany = () => onPractice(filtered.map((note) => note.questionId), "오답노트 집중 연습");
  const practiceFrequent = () => {
    const frequent = filtered.filter((note) => note.retryCount >= 2).sort((a, b) => b.retryCount - a.retryCount);
    onPractice((frequent.length ? frequent : filtered).map((note) => note.questionId), "많이 틀린 문제 연습");
  };

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
          <ChevronLeft size={16} aria-hidden="true" />
          메인으로
        </button>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={practiceMany} disabled={!filtered.length} className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white disabled:opacity-40">
            오답만 다시 풀기
          </button>
          <button type="button" onClick={practiceFrequent} disabled={!filtered.length} className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 font-bold text-blue-700 disabled:opacity-40 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
            많이 틀린 문제만
          </button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 font-bold dark:border-slate-700 dark:bg-slate-900">
            <Printer size={18} aria-hidden="true" />
            인쇄
          </button>
        </div>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">오답노트</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">총 {notes.length}문항 저장됨</p>
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as Category | "전체")}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="전체">전체 카테고리</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          {filtered.length ? (
            filtered.map((note) => {
              const question = getQuestionById(note.questionId);
              return (
                <article key={note.questionId} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        {note.category} · {note.difficulty} · 다시 틀린 횟수 {note.retryCount}
                      </div>
                      <h2 className="mt-2 font-bold leading-7">{question?.question ?? note.questionId}</h2>
                    </div>
                    <div className="no-print flex shrink-0 flex-wrap gap-2">
                      <button type="button" onClick={() => storage.toggleFavorite(note.questionId)} className="inline-flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-bold text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
                        <Star size={16} aria-hidden="true" />
                        즐겨찾기
                      </button>
                      <button type="button" onClick={() => markCorrect(note.questionId)} className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                        정답 처리
                      </button>
                      <button type="button" onClick={() => remove(note.questionId)} className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200">
                        <Trash2 size={16} aria-hidden="true" />
                        삭제
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <Info label="내가 고른 답" value={note.userAnswer || "미입력"} />
                    <Info label="정답" value={note.correctAnswer} />
                    <Info label="틀린 날짜" value={new Date(note.wrongAt).toLocaleString("ko-KR")} />
                    <Info label="마지막 풀이 결과" value={note.lastResult} />
                  </div>
                  <div className="mt-3 rounded-lg bg-amber-50 p-3 text-sm leading-6 dark:bg-amber-950">{note.explanation}</div>
                  <div className="mt-2 text-sm font-semibold text-blue-700 dark:text-blue-300">{note.memoryTip}</div>
                </article>
              );
            })
          ) : (
            <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-500 dark:bg-slate-950 dark:text-slate-400">저장된 오답이 없습니다.</div>
          )}
        </div>
      </section>

      <CreatorBanner placement="wrong" />
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</div>
      <div className="mt-1 whitespace-pre-line text-sm font-semibold">{value}</div>
    </div>
  );
}
