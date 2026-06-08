import { ChevronLeft, ClipboardCheck, StarOff } from "lucide-react";
import { useMemo, useState } from "react";
import { getQuestionById } from "../data/questionBank";
import { CATEGORIES, type Category, type Question } from "../types";
import { storage } from "../utils/storage";

interface FavoritePageProps {
  onBack: () => void;
  onPractice: (ids: string[], title: string) => void;
  onMockExam: (ids: string[]) => void;
  onStored: () => void;
}

export default function FavoritePage({ onBack, onPractice, onMockExam, onStored }: FavoritePageProps) {
  const [category, setCategory] = useState<Category | "전체">("전체");
  const [version, setVersion] = useState(0);
  const favorites = storage.getFavorites();
  const favoriteQuestions = useMemo(
    () => favorites.map((favorite) => getQuestionById(favorite.questionId)).filter((question): question is Question => Boolean(question)),
    [favorites, version],
  );
  const filtered = favoriteQuestions.filter((question) => category === "전체" || question.category === category);

  const remove = (id: string) => {
    storage.toggleFavorite(id);
    setVersion((value) => value + 1);
    onStored();
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
          <ChevronLeft size={16} aria-hidden="true" />
          메인으로
        </button>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onPractice(filtered.map((question) => question.id), "즐겨찾기 집중 연습")} disabled={!filtered.length} className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white disabled:opacity-40">
            즐겨찾기 풀기
          </button>
          <button type="button" onClick={() => onMockExam(filtered.map((question) => question.id))} disabled={!filtered.length} className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 font-bold text-blue-700 disabled:opacity-40 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200">
            <ClipboardCheck size={18} aria-hidden="true" />
            모의고사 만들기
          </button>
        </div>
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black">즐겨찾기 문제</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">총 {favoriteQuestions.length}문항</p>
          </div>
          <select value={category} onChange={(event) => setCategory(event.target.value as Category | "전체")} className="rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
            <option value="전체">전체 카테고리</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3">
          {filtered.length ? (
            filtered.map((question) => (
              <article key={question.id} className="rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {question.category} · {question.difficulty} · {question.sourceType}
                    </div>
                    <h2 className="mt-2 font-bold leading-7">{question.question}</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{question.memoryTip}</p>
                  </div>
                  <button type="button" onClick={() => remove(question.id)} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-bold text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200">
                    <StarOff size={16} aria-hidden="true" />
                    해제
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-lg bg-slate-50 p-8 text-center text-slate-500 dark:bg-slate-950 dark:text-slate-400">즐겨찾기 문제가 없습니다.</div>
          )}
        </div>
      </section>
    </div>
  );
}
