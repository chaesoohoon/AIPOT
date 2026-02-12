import React from 'react';
import { motion } from 'framer-motion';
import { SlideContent, SlideType } from '../types';
import { 
  ArrowRight, Check, Star, ArrowUpRight, Minus, Award, PenTool, MonitorPlay
} from 'lucide-react';

interface Props {
  data: SlideContent;
}

const contentVariants = {
  hidden: { opacity: 0, filter: "blur(5px)" },
  visible: { 
    opacity: 1, 
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  },
  exit: { opacity: 0, filter: "blur(5px)", transition: { duration: 0.3 } }
};

const SlideRenderer: React.FC<Props> = ({ data }) => {
  const { type, title, subtitle, body, highlight, items, image } = data;

  // Reusable Minimal Header with break-keep
  const Header = () => (
    <div className="mb-20 w-full max-w-7xl">
      <div className="flex items-center gap-4 mb-8">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full">
          {subtitle || "SECTION"}
        </span>
      </div>
      <h2 className="text-5xl md:text-6xl font-semibold tracking-tighter text-white leading-[1.1] break-keep">
        {title}
      </h2>
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case SlideType.COVER:
        return (
          <div className="flex flex-col justify-between h-full w-full max-w-7xl py-12">
            <div className="flex justify-start">
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
                 className="px-4 py-2 bg-blue-600/20 text-blue-400 text-xs font-bold tracking-[0.2em] uppercase border border-blue-500/20"
               >
                 Education Proposal 2025
               </motion.div>
            </div>

            <div className="flex flex-col gap-8">
              <motion.h1 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-7xl md:text-9xl font-extrabold tracking-tighter text-white leading-[0.9] break-keep"
              >
                AI-POT<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white opacity-90">
                  CREATOR
                </span>
              </motion.h1>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="w-24 h-1 bg-blue-500"
              />
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-2xl text-slate-300 font-light max-w-2xl leading-relaxed tracking-tight break-keep"
              >
                {highlight}
              </motion.p>
            </div>

            <div className="flex justify-between items-end border-t border-white/10 pt-8">
               <div className="text-sm text-slate-500 font-mono tracking-widest">
                  AI-POT CERTIFICATION & VIDEO PRODUCTION
               </div>
               <div className="text-right">
                  <div className="text-sm text-slate-400 font-medium">Presented by</div>
                  <div className="text-white font-bold">The국제직업전문학교</div>
               </div>
            </div>
          </div>
        );

      case SlideType.SECTION_HEADER:
        return (
          <div className="flex flex-col justify-center items-center h-full w-full text-center">
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="w-32 h-[2px] bg-blue-500 mb-12"
            />
            <h2 className="text-lg font-medium text-blue-400 tracking-[0.5em] mb-8 uppercase">
              {subtitle}
            </h2>
            <h1 className="text-6xl md:text-8xl font-black text-white whitespace-pre-line leading-[1.05] tracking-tight break-keep">
              {highlight || title}
            </h1>
          </div>
        );

      case SlideType.PROFILE:
        return (
          <div className="h-full flex items-center justify-center w-full max-w-7xl gap-8 md:gap-20">
            {/* Image Section */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="w-[45%] h-[80vh] relative hidden md:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent mix-blend-overlay z-10" />
              <div className="absolute inset-0 border border-white/10 z-20" />
              <img 
                src={image} 
                alt={title}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-90"
              />
            </motion.div>

            {/* Text Content */}
            <div className="flex-1 flex flex-col justify-center">
               <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-4 mb-6"
               >
                 <div className="w-12 h-[1px] bg-blue-500"></div>
                 <span className="text-blue-400 text-sm font-bold tracking-[0.3em] uppercase">
                   {subtitle}
                 </span>
               </motion.div>

               <motion.h1 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-6xl md:text-8xl font-bold text-white mb-8 tracking-tighter break-keep"
               >
                 {title}
               </motion.h1>

               <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-xl md:text-2xl text-slate-300 font-light mb-12 border-l-2 border-white/20 pl-6 leading-relaxed break-keep"
               >
                 "{highlight}"
               </motion.p>

               <div className="space-y-8">
                  {/* Specialties */}
                  <div className="flex gap-4">
                     <div className="p-3 bg-white/5 rounded-full h-fit">
                        <PenTool className="text-blue-400 w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="text-white font-bold mb-1 tracking-wide">Specialty</h4>
                        <p className="text-slate-400 text-sm break-keep">Gen AI Design • Video Editing • Digital Publishing</p>
                     </div>
                  </div>

                  {/* Career & Awards - Dynamic mapping from body */}
                  <div className="flex gap-4">
                     <div className="p-3 bg-white/5 rounded-full h-fit">
                        <Award className="text-blue-400 w-5 h-5" />
                     </div>
                     <div className="flex-1">
                        <h4 className="text-white font-bold mb-3 tracking-wide">Career & Awards</h4>
                        <div className="space-y-2">
                           {body?.map((item, idx) => (
                             <motion.div 
                               key={idx}
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ delay: 0.6 + (idx * 0.05) }}
                               className="flex items-start gap-3"
                             >
                                <div className="w-1 h-1 bg-slate-500 rounded-full mt-2 shrink-0"></div>
                                <span className="text-slate-400 font-light text-sm md:text-base break-keep">{item}</span>
                             </motion.div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        );

      case SlideType.BULLET_LIST:
        return (
          <div className="h-full flex flex-col justify-center w-full max-w-6xl">
            <Header />
            <div className="grid gap-1">
              {body?.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="group flex items-start gap-6 py-8 border-b border-white/10 hover:border-blue-500/50 transition-colors"
                >
                  <div className="text-blue-500 mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                  <span className="text-3xl md:text-4xl font-light tracking-tight text-slate-200 group-hover:text-white transition-colors break-keep">
                    {item}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case SlideType.PROCESS_FLOW:
        return (
          <div className="h-full flex flex-col justify-center w-full max-w-7xl">
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10 bg-white/[0.02]">
              {items?.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="relative group p-10 h-80 flex flex-col justify-between hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-4xl font-light text-slate-700 group-hover:text-blue-500/50 transition-colors">
                      0{idx + 1}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{item.title}</h3>
                    <p className="text-slate-400 font-light text-sm leading-relaxed break-keep">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case SlideType.GRID_CARDS:
        return (
          <div className="h-full flex flex-col justify-center w-full max-w-7xl">
            <Header />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {items?.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="group p-10 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 hover:border-blue-500/40 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-8">
                     <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-6 h-6" />
                     </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-blue-300 transition-colors break-keep">
                    {item.title}
                  </h3>
                  <p className="text-lg text-slate-400 font-light leading-relaxed break-keep">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case SlideType.TIMELINE:
        return (
          <div className="h-full flex flex-col justify-center w-full max-w-6xl">
            <Header />
            <div className="relative space-y-0">
              {items?.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (idx * 0.1) }}
                  className="flex group"
                >
                  <div className="w-24 md:w-32 py-8 border-r border-white/10 text-right pr-8 text-blue-500/50 group-hover:text-blue-400 font-mono text-sm transition-colors">
                    PHASE {idx + 1}
                  </div>
                  <div className="flex-1 py-8 pl-8 md:pl-16 border-b border-white/5 group-hover:bg-white/[0.02] transition-colors">
                    <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-lg text-slate-400 font-light break-keep">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case SlideType.BIG_NUMBER:
        return (
          <div className="h-full flex flex-col justify-center items-center text-center w-full max-w-5xl">
            <h2 className="text-sm font-bold tracking-[0.4em] text-blue-400 mb-16 uppercase border border-blue-500/30 px-6 py-2 rounded-full">
              {title}
            </h2>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              className="text-[12rem] md:text-[18rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 tracking-tighter mix-blend-overlay"
            >
              {highlight}
            </motion.div>
            
            <p className="text-2xl md:text-3xl text-white mt-8 max-w-3xl font-light leading-relaxed break-keep">
              {subtitle}
            </p>
            
            <div className="flex flex-wrap gap-4 mt-16 justify-center">
              {body?.map((text, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-400 font-light tracking-wide px-4 py-2 bg-white/5 rounded-sm break-keep">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  {text}
                </div>
              ))}
            </div>
          </div>
        );

      case SlideType.CLOSING:
        return (
          <div className="h-full flex flex-col justify-center items-center text-center max-w-6xl w-full relative z-10">
            {/* Background enhancement */}
             <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-16"
            >
               <div className="px-6 py-2 border border-blue-500/30 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold tracking-[0.3em] uppercase">
                  Final Vision
               </div>
            </motion.div>
            
            <h2 className="text-2xl md:text-3xl font-light leading-relaxed text-slate-300 mb-12 tracking-wide break-keep max-w-3xl opacity-80">
              {subtitle}
            </h2>
            
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-white whitespace-pre-line leading-[1.1] tracking-tighter break-keep drop-shadow-2xl"
            >
              {highlight}
            </motion.h1>
            
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1 }}
               className="mt-24 pt-12 border-t border-white/10 w-full max-w-lg flex justify-between items-center text-[10px] md:text-xs tracking-[0.3em] text-slate-500 uppercase font-medium"
            >
              <span>The International Vocational Training Institute</span>
              <span>2025 Education Plan</span>
            </motion.div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      variants={contentVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full h-full px-8 md:px-24 flex flex-col items-center justify-center relative z-10"
    >
      {renderContent()}
    </motion.div>
  );
};

export default SlideRenderer;