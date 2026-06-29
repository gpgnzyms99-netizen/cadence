'use client';

import React from 'react';
import { Slide } from '@/lib/types';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SlideProps {
  slide: Slide;
}

export default function ComparisonSlide({ slide }: SlideProps) {
  const comp = slide.content.comparison;

  return (
    <div className="relative w-full h-full min-h-[80vh] flex items-center p-8 lg:p-16 bg-[#090d16] text-white">
      <div className="max-w-6xl w-full mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase">STRATEGIC SHIFT</span>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {slide.content.title || slide.title}
          </h2>
        </div>

        {comp && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            {/* Left side (Prior / Before) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md space-y-6"
            >
              <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">PRIOR STATE</span>
                <h3 className="text-2xl font-semibold text-slate-300">{comp.left.title}</h3>
                {comp.left.subtitle && <p className="text-sm text-slate-400">{comp.left.subtitle}</p>}
              </div>

              <ul className="space-y-3 pt-2">
                {comp.left.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                    <XCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right side (Current / After) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 rounded-3xl bg-indigo-950/30 border border-indigo-500/30 backdrop-blur-xl space-y-6 relative overflow-hidden shadow-2xl shadow-indigo-950/50"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="space-y-1">
                <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider">CADENCE ADVANTAGE</span>
                <h3 className="text-2xl font-semibold text-white">{comp.right.title}</h3>
                {comp.right.subtitle && <p className="text-sm text-indigo-200/80">{comp.right.subtitle}</p>}
              </div>

              <ul className="space-y-3 pt-2">
                {comp.right.points.map((pt, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-200 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
