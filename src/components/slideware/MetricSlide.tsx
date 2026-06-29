'use client';

import React from 'react';
import { Slide } from '@/lib/types';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUpRight } from 'lucide-react';
import SlideVisual from './SlideVisual';

interface SlideProps {
  slide: Slide;
}

export default function MetricSlide({ slide }: SlideProps) {
  const metrics = slide.content.metrics || [];

  return (
    <div className="relative w-full h-full min-h-[80vh] flex items-center p-8 lg:p-16 bg-[#090d16] text-white">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left metrics content */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase">HEADLINE METRICS</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mt-2">
              {slide.content.title || slide.title}
            </h2>
            {slide.content.subtitle && (
              <p className="text-base text-slate-400 mt-3 max-w-xl leading-relaxed">
                {slide.content.subtitle}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors"
              >
                <div className="flex items-center justify-between text-slate-400 mb-4">
                  <span className="text-xs font-medium uppercase tracking-wider">{metric.label}</span>
                  <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>{metric.delta}</span>
                  </div>
                </div>

                <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 font-mono">
                  {metric.value}
                </div>

                {/* Sparkline visualization */}
                {metric.sparkline && (
                  <div className="h-10 w-full flex items-end gap-1.5 pt-2">
                    {metric.sparkline.map((val, i) => {
                      const max = Math.max(...metric.sparkline!);
                      const heightPct = Math.max(15, Math.round((val / max) * 100));
                      return (
                        <div
                          key={i}
                          style={{ height: `${heightPct}%` }}
                          className="flex-1 rounded-t bg-indigo-500/40 group-hover:bg-indigo-400 transition-colors"
                        />
                      );
                    })}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right agency visual */}
        <div className="lg:col-span-5 h-[360px] lg:h-[480px]">
          <SlideVisual prompt={slide.mediaPrompt} tone={slide.tone} archetype={slide.archetype} />
        </div>

      </div>
    </div>
  );
}
