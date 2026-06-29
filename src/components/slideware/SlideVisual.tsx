'use client';

import React from 'react';
import { MediaTone } from '@/lib/types';

interface SlideVisualProps {
  prompt?: string;
  tone?: MediaTone;
  archetype: string;
}

export default function SlideVisual({ prompt, tone = 'editorial', archetype }: SlideVisualProps) {
  // Generates high-end agency aesthetic geometric & ambient graphic backgrounds
  const isDark = true;

  return (
    <div className="relative w-full h-full min-h-[300px] lg:min-h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950/60 flex items-center justify-center p-8">
      {/* Dynamic ambient gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-950 to-sky-950/40" />
      
      {/* Animated glowing orbs based on tone */}
      {tone === 'editorial' && (
        <>
          <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-sky-400/15 rounded-full blur-3xl" />
        </>
      )}

      {tone === 'data-driven' && (
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293715_1px,transparent_1px),linear-gradient(to_bottom,#1f293715_1px,transparent_1px)] bg-[size:32px_32px]" />
      )}

      {/* Center visual graphic artwork */}
      <div className="relative z-10 w-full max-w-sm aspect-square flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-md shadow-inner">
        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center mb-4 text-indigo-300 shadow-lg shadow-indigo-500/10">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-xs font-mono tracking-wider uppercase text-indigo-400 mb-1">AGENCY MEDIA ENGINE</span>
        <h4 className="text-sm font-medium text-slate-200 line-clamp-2">{prompt || 'Editorial agency artwork'}</h4>
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
            {tone}
          </span>
          <span className="text-[10px] font-mono text-slate-400">Cached (SHA-256)</span>
        </div>
      </div>
    </div>
  );
}
