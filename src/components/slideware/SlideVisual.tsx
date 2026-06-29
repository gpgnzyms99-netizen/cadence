'use client';

import React from 'react';
import { MediaTone } from '@/lib/types';
import { Sparkles } from 'lucide-react';

interface SlideVisualProps {
  prompt?: string;
  tone?: MediaTone;
  archetype: string;
  mediaUrl?: string;
}

export default function SlideVisual({ prompt, tone = 'editorial', archetype, mediaUrl }: SlideVisualProps) {
  return (
    <div className="relative w-full h-full min-h-[300px] lg:min-h-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950/60 flex items-center justify-center p-8 group">
      {/* Background graphic image or gradient */}
      {mediaUrl ? (
        <img
          src={mediaUrl}
          alt={prompt || 'Gemini Generated Agency Media'}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-950 to-sky-950/40" />
      )}

      {/* Animated glowing ambient aura */}
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

      {/* Gemini Engine Overlay Badge */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center text-center p-6 rounded-2xl border border-white/15 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-sky-400 p-0.5 mb-3 shadow-lg shadow-indigo-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-indigo-400">
            <Sparkles className="w-6 h-6 animate-spin-slow" />
          </div>
        </div>
        <span className="text-[10px] font-mono tracking-widest uppercase text-indigo-300 font-bold mb-1 flex items-center gap-1">
          <span>GEMINI IMAGEN 3 ENGINE</span>
        </span>
        <h4 className="text-xs font-medium text-slate-200 line-clamp-2">{prompt || 'Executive agency visual artwork'}</h4>
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">
            {tone}
          </span>
          <span className="text-[10px] font-mono text-slate-400">Cached (SHA-256)</span>
        </div>
      </div>
    </div>
  );
}
