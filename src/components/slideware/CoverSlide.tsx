'use client';

import React from 'react';
import { Slide, WorkspaceBrand } from '@/lib/types';
import { motion } from 'framer-motion';
import { Calendar, Layers } from 'lucide-react';

interface SlideProps {
  slide: Slide;
  brand: WorkspaceBrand;
  period: string;
}

export default function CoverSlide({ slide, brand, period }: SlideProps) {
  return (
    <div className="relative w-full h-full min-h-[80vh] flex items-center justify-center p-8 lg:p-16 overflow-hidden bg-[#090d16]">
      {/* Ambient background glowing layers */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-[#090d16] to-sky-950/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl w-full text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium tracking-wide"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{brand.name} • Executive Slideware</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
          >
            {slide.content.title || slide.title}
          </motion.h1>

          {slide.content.subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-300 font-normal max-w-2xl leading-relaxed"
            >
              {slide.content.subtitle}
            </motion.p>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs font-mono text-slate-400"
          >
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>PERIOD: {period.toUpperCase()}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              LIVE DELIVERABLE
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
