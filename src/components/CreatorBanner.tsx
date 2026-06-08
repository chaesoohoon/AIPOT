interface CreatorBannerProps {
  compact?: boolean;
  placement?: "home" | "result" | "summary" | "wrong" | "study" | "footer";
  className?: string;
}

const CREATOR_EMAIL = "tmxbvlem@gmail.com";
const BRAND_LINE = "\ub514\uc790\uc778, \uc601\uc0c1, \ubc14\uc774\ube0c\ucf54\ub529\uc740!";
const CREATOR_NAME = "\ucc44\uc218\ud6c8";
const SUPPORT_LINE = "\uc218\uc5c5 \u00b7 \ucf58\ud150\uce20 \uc81c\uc791 \u00b7 AI \ud65c\uc6a9 \uad50\uc721 \ubb38\uc758";
const CONTACT_LABEL = "\ubb38\uc758\ud558\uae30";
const CONTACT_ARIA = "\ucc44\uc218\ud6c8\uc5d0\uac8c AIPOT CBT \uc6f9\uc571 \ubb38\uc758 \uba54\uc77c \ubcf4\ub0b4\uae30";
const FOOTER_PREFIX =
  "AIPOT 2\uae09 CBT \ud569\uaca9\ud6c8\ub828\uc18c \u00b7 \ub514\uc790\uc778/\uc601\uc0c1/\ubc14\uc774\ube0c\ucf54\ub529 ";
const MAIL_QUERY =
  "subject=AIPOT%20CBT%20%EC%9B%B9%EC%95%B1%20%EB%AC%B8%EC%9D%98&body=%EC%95%88%EB%85%95%ED%95%98%EC%84%B8%EC%9A%94.%20AIPOT%20CBT%20%EC%9B%B9%EC%95%B1%EC%9D%84%20%EB%B3%B4%EA%B3%A0%20%EB%AC%B8%EC%9D%98%EB%93%9C%EB%A6%BD%EB%8B%88%EB%8B%A4.";

export const CREATOR_CONTACT_HREF = `mailto:${CREATOR_EMAIL}?${MAIL_QUERY}`;

export default function CreatorBanner({ compact = false, placement = "home", className = "" }: CreatorBannerProps) {
  if (compact) {
    return (
      <footer className={`no-print ${className}`} data-placement={placement}>
        <div className="border-t border-slate-200 py-4 text-center text-xs font-semibold text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <span>{FOOTER_PREFIX}</span>
          <a
            href={CREATOR_CONTACT_HREF}
            aria-label={CONTACT_ARIA}
            className="font-black text-slate-700 underline decoration-slate-300 underline-offset-4 transition hover:text-blue-700 hover:decoration-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:text-slate-200 dark:decoration-slate-600 dark:hover:text-blue-300 dark:focus-visible:ring-blue-900"
          >
            {CREATOR_NAME}
          </a>
        </div>
      </footer>
    );
  }

  return (
    <section
      className={`no-print rounded-lg border border-blue-100 bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-4 shadow-soft dark:border-blue-900/60 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/50 md:p-5 ${className}`}
      data-placement={placement}
      aria-label={CONTACT_ARIA}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-black text-blue-700 dark:text-blue-300">{BRAND_LINE}</p>
          <a
            href={CREATOR_CONTACT_HREF}
            aria-label={CONTACT_ARIA}
            className="mt-1 inline-flex text-2xl font-black text-slate-950 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:text-white dark:hover:text-blue-300 dark:focus-visible:ring-blue-900"
          >
            {CREATOR_NAME}
          </a>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-600 dark:text-slate-300">{SUPPORT_LINE}</p>
        </div>

        <a
          href={CREATOR_CONTACT_HREF}
          aria-label={CONTACT_ARIA}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-black text-blue-700 transition hover:border-blue-600 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 dark:border-blue-800 dark:bg-slate-950 dark:text-blue-200 dark:hover:border-blue-500 dark:hover:bg-blue-600 dark:hover:text-white dark:focus-visible:ring-blue-900"
        >
          {CONTACT_LABEL}
        </a>
      </div>
    </section>
  );
}
