interface SubjectiveAnswerBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export default function SubjectiveAnswerBox({ value, onChange, placeholder, disabled, rows = 6 }: SubjectiveAnswerBoxProps) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      disabled={disabled}
      rows={rows}
      className="w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-base leading-7 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-blue-950 dark:disabled:bg-slate-800"
      placeholder={placeholder ?? "답안을 입력하세요."}
    />
  );
}
