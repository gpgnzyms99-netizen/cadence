'use client';

import React from 'react';
import { Slide } from '@/lib/types';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

interface SlideProps {
  slide: Slide;
}

export default function QuoteSlide({ slide }: SlideProps) {
  const quote = slide.content.quote;

  return (
    <div className="relative w-full h-full min-h-[80vh] flex items-center justify-center p-8 lg:p-16 bg-[#090d16] text-white">
      <div className="max-w-4xl w-full mx-auto text-center space-y-8 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-xl shadow-indigo-950/40">
          <Quote className="w-8 h-8" />
        </div>

        {quote && (
          <motion.blockquote
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <p className="text-2xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white leading-tight font-serif italic">
              “{quote.text}”
            </p>

            <div className="pt-4 space-y-1 font-sans">
              <div className="text-lg font-bold text-indigo-400">{quote.author}</div>
              {quote.role && <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">{quote.role}</div>}
            </div>
          </motion.blockquote>
        )}
      </div>
    </div>
  );
}
