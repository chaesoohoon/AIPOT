import { Copy, ExternalLink, Mail, X } from "lucide-react";
import { useState } from "react";

interface CreatorBannerProps {
  compact?: boolean;
  placement?: "home" | "result" | "summary" | "wrong" | "study" | "footer";
  className?: string;
}

const CREATOR_EMAIL = "tmxbvlem@gmail.com";
const BRAND_LINE = "디자인, 영상, 바이브코딩은!";
const CREATOR_NAME = "채수훈";
const SUPPORT_LINE = "AI 활용 교육 · 디자인 수업 · 영상 콘텐츠 · 바이브코딩 문의";
const CONTACT_LABEL = "문의하기";
const MAIL_SUBJECT = "AIPOT CBT 웹앱 문의";
const MAIL_BODY = "안녕하세요. AIPOT CBT 웹앱을 보고 문의드립니다.";
const CONTACT_ARIA = "채수훈에게 AIPOT CBT 웹앱 문의하기";
const FOOTER_PREFIX = "AIPOT 2급 CBT 합격훈련소 · 제작 ";

export const CREATOR_CONTACT_HREF = `mailto:${CREATOR_EMAIL}?subject=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`;
const GMAIL_HREF = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CREATOR_EMAIL)}&su=${encodeURIComponent(MAIL_SUBJECT)}&body=${encodeURIComponent(MAIL_BODY)}`;

export default function CreatorBanner({ compact = false, placement = "home", className = "" }: CreatorBannerProps) {
  const [open, setOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  const openPanel = () => {
    setCopyMessage("");
    setOpen(true);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CREATOR_EMAIL);
      setCopyMessage("이메일 주소가 복사되었습니다.");
    } catch {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = CREATOR_EMAIL;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.left = "-9999px";
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopyMessage(copied ? "이메일 주소가 복사되었습니다." : `복사에 실패했습니다. ${CREATOR_EMAIL} 주소를 직접 복사해 주세요.`);
      } catch {
        setCopyMessage(`복사에 실패했습니다. ${CREATOR_EMAIL} 주소를 직접 복사해 주세요.`);
      }
    }
  };

  return (
    <>
      {compact ? (
        <footer className={`no-print ${className}`} data-placement={placement}>
          <div className="border-t border-slate-200 py-4 text-center text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <span>{FOOTER_PREFIX}</span>
            <button
              type="button"
              onClick={openPanel}
              aria-label={CONTACT_ARIA}
              className="font-black text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-blue-700 hover:decoration-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:text-slate-200 dark:decoration-slate-600 dark:hover:text-blue-300 dark:focus-visible:ring-blue-900"
            >
              {CREATOR_NAME}
            </button>
          </div>
        </footer>
      ) : (
        <section
          className={`no-print rounded-lg border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-4 shadow-soft dark:border-blue-900/60 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/50 md:p-5 ${className}`}
          data-placement={placement}
          aria-label={CONTACT_ARIA}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-black text-blue-700 dark:text-blue-300">{BRAND_LINE}</p>
              <button
                type="button"
                onClick={openPanel}
                aria-label={CONTACT_ARIA}
                className="mt-1 inline-flex text-2xl font-black text-slate-950 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:text-white dark:hover:text-blue-300 dark:focus-visible:ring-blue-900"
              >
                {CREATOR_NAME}
              </button>
              <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{SUPPORT_LINE}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">{CREATOR_EMAIL}</p>
            </div>

            <button
              type="button"
              onClick={openPanel}
              aria-label={CONTACT_ARIA}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-black text-blue-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:border-blue-800 dark:bg-slate-950 dark:text-blue-200 dark:hover:border-blue-500 dark:hover:bg-blue-600 dark:hover:text-white dark:focus-visible:ring-blue-900"
            >
              {CONTACT_LABEL}
            </button>
          </div>
        </section>
      )}

      {open ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-slate-950/50 p-4 sm:items-center">
          <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-soft dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-blue-700 dark:text-blue-300">{BRAND_LINE}</p>
                <h2 className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{CREATOR_NAME}</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{SUPPORT_LINE}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="문의 패널 닫기"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus-visible:ring-blue-900"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-sm font-semibold text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              {CREATOR_EMAIL}
            </div>

            <div className="mt-4 grid gap-2">
              <a
                href={GMAIL_HREF}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Gmail 새 탭으로 문의하기"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:focus-visible:ring-blue-900"
              >
                <ExternalLink size={17} aria-hidden="true" />
                Gmail로 문의하기
              </a>
              <a
                href={CREATOR_CONTACT_HREF}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-blue-900"
              >
                <Mail size={17} aria-hidden="true" />
                이메일 앱으로 열기
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-800 dark:focus-visible:ring-blue-900"
              >
                <Copy size={17} aria-hidden="true" />
                이메일 주소 복사
              </button>
            </div>

            {copyMessage ? <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">{copyMessage}</div> : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
