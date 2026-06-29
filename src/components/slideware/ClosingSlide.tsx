'use client';

import React from 'react';
import { Slide } from '@/lib/types';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface SlideProps {
  slide: Slide;
}

export default function ClosingSlide({ slide }: SlideProps) {
  return (
    <div className="relative w-full h-full min-h-[80vh] flex items-center justify-center p-8 lg:p-16 bg-[#090d16] text-white text-center">
      <div className="max-w-3xl w-full mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto"
        >
          <CheckCircle2 className="w-8 h-8" />
        </motion.div>

        <div className="space-y-4">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            {slide.content.title || slide.title}
          </h2>
          {slide.content.body && (
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto leading-relaxed">
              {slide.content.body}
            </p>
          )}
        </div>

        {slide.content.cta && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-4"
          >
            <a
              href={slide.content.cta.link || '#'}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-base font-medium shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <span>{slide.content.cta.text}</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}
