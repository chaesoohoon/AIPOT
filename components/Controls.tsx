import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
}

const Controls: React.FC<Props> = ({ current, total, onPrev, onNext }) => {
  return (
    <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 flex items-center gap-4 z-50">
      <div className="text-slate-500 font-light tracking-widest text-sm mr-4">
        {current + 1} <span className="text-slate-700">/</span> {total}
      </div>
      <button 
        onClick={onPrev}
        disabled={current === 0}
        className="p-3 rounded-full bg-slate-800/50 text-white hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-slate-800/50 transition-all border border-slate-700"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={onNext}
        disabled={current === total - 1}
        className="p-3 rounded-full bg-slate-800/50 text-white hover:bg-blue-600 disabled:opacity-30 disabled:hover:bg-slate-800/50 transition-all border border-slate-700"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Controls;