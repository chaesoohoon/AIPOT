import { CATEGORIES, DIFFICULTIES, QUESTION_TYPE_LABELS, QUESTION_TYPES, type Category, type Difficulty, type QuestionType } from "../types";

interface CategoryFilterProps {
  selectedCategories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  selectedDifficulties?: Difficulty[];
  onDifficultiesChange?: (difficulties: Difficulty[]) => void;
  selectedTypes?: QuestionType[];
  onTypesChange?: (types: QuestionType[]) => void;
}

const toggle = <T extends string>(items: T[], item: T) => (items.includes(item) ? items.filter((value) => value !== item) : [...items, item]);

export default function CategoryFilter({ selectedCategories, onCategoriesChange, selectedDifficulties, onDifficultiesChange, selectedTypes, onTypesChange }: CategoryFilterProps) {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">카테고리</div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategoriesChange(toggle(selectedCategories, category))}
              className={`rounded-lg border px-3 py-2 text-sm transition ${
                selectedCategories.includes(category)
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {selectedDifficulties && onDifficultiesChange ? (
        <div>
          <div className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">난이도</div>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                onClick={() => onDifficultiesChange(toggle(selectedDifficulties, difficulty))}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  selectedDifficulties.includes(difficulty)
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {selectedTypes && onTypesChange ? (
        <div>
          <div className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">문제 유형</div>
          <div className="flex flex-wrap gap-2">
            {QUESTION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onTypesChange(toggle(selectedTypes, type))}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  selectedTypes.includes(type)
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                }`}
              >
                {QUESTION_TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
