import type { QuestionTable } from "../types";

interface ResponsiveQuestionTableProps {
  table: QuestionTable;
}

export default function ResponsiveQuestionTable({ table }: ResponsiveQuestionTableProps) {
  return (
    <div className="mt-5 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-950">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-100">
            {table.headers.map((header) => (
              <th key={header} scope="col" className="border-b border-slate-200 px-3 py-3 font-black dark:border-slate-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${row.join("-")}`} className="bg-white odd:bg-white even:bg-slate-50 dark:bg-slate-900 dark:even:bg-slate-950">
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className="border-t border-slate-100 px-3 py-3 font-semibold text-slate-700 dark:border-slate-800 dark:text-slate-200">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
