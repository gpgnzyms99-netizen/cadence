'use client';

import React from 'react';
import { Slide } from '@/lib/types';
import { motion } from 'framer-motion';
import SlideVisual from './SlideVisual';

interface SlideProps {
  slide: Slide;
}

export default function NarrativeSlide({ slide }: SlideProps) {
  return (
    <div className="relative w-full h-full min-h-[80vh] flex items-center p-8 lg:p-16 bg-[#090d16] text-white">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-6 space-y-6">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-mono tracking-widest text-indigo-400 uppercase"
          >
            STRATEGIC NARRATIVE
          </motion.span>

          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight"
          >
            {slide.content.title || slide.title}
          </motion.h2>

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal space-y-4"
          >
            {slide.content.body?.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            )) || <p>Executive update narrative body content goes here.</p>}
          </motion.div>
        </div>

        <div className="lg:col-span-6 h-[380px] lg:h-[500px]">
          <SlideVisual prompt={slide.mediaPrompt} tone={slide.tone} archetype={slide.archetype} />
        </div>

      </div>
    </div>
  );
}
