'use client';

import React from 'react';
import { Slide } from '@/lib/types';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Circle } from 'lucide-react';

interface SlideProps {
  slide: Slide;
}

export default function RoadmapSlide({ slide }: SlideProps) {
  const timeline = slide.content.timeline || [];

  return (
    <div className="relative w-full h-full min-h-[80vh] flex items-center p-8 lg:p-16 bg-[#090d16] text-white">
      <div className="max-w-6xl w-full mx-auto space-y-12">
        <div className="space-y-3">
          <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase">EXECUTION TIMELINE</span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {slide.content.title || slide.title}
          </h2>
          {slide.content.subtitle && (
            <p className="text-slate-400 text-base max-w-2xl">{slide.content.subtitle}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative pt-4">
          {timeline.map((item, idx) => {
            const isCompleted = item.status === 'completed';
            const isInProgress = item.status === 'in-progress';

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className={`p-6 rounded-3xl border ${
                  isInProgress
                    ? 'bg-indigo-950/40 border-indigo-500/40 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500/30'
                    : 'bg-slate-900/60 border-slate-800/80'
                } space-y-4 relative flex flex-col justify-between`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-indigo-400 px-2.5 py-1 rounded-full bg-indigo-950 border border-indigo-800/50">
                      {item.phase}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                      {isCompleted ? (
                        <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Done</span>
                      ) : isInProgress ? (
                        <span className="text-indigo-400 flex items-center gap-1 animate-pulse"><Clock className="w-3.5 h-3.5" /> Active</span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1"><Circle className="w-3.5 h-3.5" /> Upcoming</span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white leading-snug">{item.title}</h3>
                  {item.description && (
                    <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800/60 text-xs font-mono text-slate-400 flex justify-between">
                  <span>TARGET</span>
                  <span className="text-slate-300 font-semibold">{item.date}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
