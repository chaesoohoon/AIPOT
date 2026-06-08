import { CheckCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  message: string;
  tone?: "info" | "success" | "warning";
}

interface ToastProps {
  messages: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ messages, onDismiss }: ToastProps) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-40 grid max-w-sm gap-2">
      {messages.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto animate-feedback-in rounded-lg border border-slate-200 bg-white p-3 shadow-soft dark:border-slate-800 dark:bg-slate-900"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {toast.tone === "success" ? <CheckCircle className="mt-0.5 text-emerald-600" size={18} aria-hidden="true" /> : <Info className="mt-0.5 text-blue-600" size={18} aria-hidden="true" />}
            <p className="min-w-0 flex-1 text-sm font-semibold leading-6 text-slate-800 dark:text-slate-100">{toast.message}</p>
            <button type="button" onClick={() => onDismiss(toast.id)} className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200" aria-label="알림 닫기">
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
