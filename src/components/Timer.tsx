import { Clock } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TimerProps {
  initialSeconds: number;
  running: boolean;
  onExpire: () => void;
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remain = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remain).padStart(2, "0")}`;
};

export default function Timer({ initialSeconds, running, onExpire }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    setSeconds(initialSeconds);
    expiredRef.current = false;
  }, [initialSeconds]);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpire();
      }
      return;
    }

    const timer = window.setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [onExpire, running, seconds]);

  const warning = seconds <= 300;

  return (
    <div
      className={`inline-flex min-w-28 items-center justify-center gap-2 rounded-lg border px-3 py-2 font-semibold ${
        warning
          ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950 dark:text-rose-200"
          : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-200"
      }`}
      aria-live="polite"
    >
      <Clock size={18} aria-hidden="true" />
      {formatTime(seconds)}
    </div>
  );
}
