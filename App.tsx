import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SLIDES } from './constants';
import SlideRenderer from './components/SlideRenderer';
import Controls from './components/Controls';

const App: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.min(prev + 1, SLIDES.length - 1));
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for Space/Arrow keys
      if (['Space', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const currentSlideData = SLIDES[currentSlideIndex];
  const progress = ((currentSlideIndex + 1) / SLIDES.length) * 100;

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020617] text-white font-sans selection:bg-blue-500/30 selection:text-white">
      
      {/* Background Noise Texture for 'Paper' feel */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* Deep Atmospheric Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[180px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-slate-800/10 rounded-full blur-[180px]" />
      </div>

      {/* Main Slide Area */}
      <main className="w-full h-full flex items-center justify-center max-w-[2400px] mx-auto z-10">
        <AnimatePresence mode="wait">
          <SlideRenderer key={currentSlideIndex} data={currentSlideData} />
        </AnimatePresence>
      </main>

      {/* Navigation & Progress */}
      <Controls 
        current={currentSlideIndex} 
        total={SLIDES.length} 
        onNext={nextSlide} 
        onPrev={prevSlide} 
      />

      {/* Minimal Progress Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-white/5 z-50">
        <div 
          className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Brand Watermark */}
      <div className="absolute top-10 left-10 z-40">
         <div className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity duration-500">
            <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-[0.3em] text-white uppercase leading-none mb-1">AI-POT</span>
              <span className="text-[8px] font-medium tracking-[0.1em] text-slate-400 uppercase leading-none">Education</span>
            </div>
         </div>
      </div>
    </div>
  );
};

export default App;