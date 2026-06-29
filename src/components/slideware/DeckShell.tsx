'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Update, Workspace, Slide } from '@/lib/types';
import CoverSlide from './CoverSlide';
import MetricSlide from './MetricSlide';
import NarrativeSlide from './NarrativeSlide';
import ComparisonSlide from './ComparisonSlide';
import RoadmapSlide from './RoadmapSlide';
import QuoteSlide from './QuoteSlide';
import ClosingSlide from './ClosingSlide';
import { ChevronLeft, ChevronRight, Share2, Download, Layers, Check, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeckShellProps {
  update: Update;
  workspace: Workspace;
  allUpdates: Update[];
  currentSlideSlug?: string;
  isPreview?: boolean;
}

export default function DeckShell({ update, workspace, allUpdates, currentSlideSlug, isPreview = false }: DeckShellProps) {
  const router = useRouter();
  const slides = update.slides || [];
  
  // Find index based on deep link slug if provided
  const initialIndex = currentSlideSlug
    ? Math.max(0, slides.findIndex((s) => s.slug.toLowerCase() === currentSlideSlug.toLowerCase()))
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [copied, setCopied] = useState(false);
  const [showPeriodDropdown, setShowPeriodDropdown] = useState(false);

  // Keep index within bounds if slides length changes dynamically
  useEffect(() => {
    if (currentIndex >= slides.length && slides.length > 0) {
      setCurrentIndex(slides.length - 1);
    }
  }, [slides.length, currentIndex]);

  const currentSlide = slides[currentIndex] || slides[0];

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentIndex(index);
      const targetSlide = slides[index];
      if (targetSlide && !isPreview) {
        // Update URL slug cleanly without full page refresh only in live viewer
        window.history.replaceState(null, '', `/${workspace.slug}/${update.period}/${targetSlide.slug}`);
      }
    }
  }, [slides, workspace.slug, update.period, isPreview]);

  const nextSlide = useCallback(() => {
    if (currentIndex < slides.length - 1) goToSlide(currentIndex + 1);
  }, [currentIndex, slides.length, goToSlide]);

  const prevSlide = useCallback(() => {
    if (currentIndex > 0) goToSlide(currentIndex - 1);
  }, [currentIndex, goToSlide]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleShare = () => {
    const liveUrl = `${window.location.origin}/${workspace.slug}/${update.period}/${currentSlide?.slug || ''}`;
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const renderSlideContent = (slide: Slide) => {
    if (!slide) return null;
    switch (slide.archetype) {
      case 'cover':
        return <CoverSlide slide={slide} brand={workspace.brand} period={update.period} />;
      case 'headline-metric':
        return <MetricSlide slide={slide} />;
      case 'narrative':
        return <NarrativeSlide slide={slide} />;
      case 'comparison':
        return <ComparisonSlide slide={slide} />;
      case 'roadmap':
        return <RoadmapSlide slide={slide} />;
      case 'quote':
        return <QuoteSlide slide={slide} />;
      case 'closing':
        return <ClosingSlide slide={slide} />;
      default:
        return <NarrativeSlide slide={slide} />;
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-[#090d16] text-white flex flex-col font-sans select-none">
      
      {/* Header Minimal Chrome */}
      <header className="relative z-50 w-full h-16 px-6 flex items-center justify-between border-b border-white/10 bg-slate-950/80 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-semibold text-sm text-white">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Layers className="w-4 h-4" />
            </div>
            <span className="tracking-tight">{workspace.name}</span>
          </div>

          <span className="text-slate-600">|</span>

          {/* Period switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPeriodDropdown(!showPeriodDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-mono text-slate-300 transition-colors"
            >
              <span>{update.period.toUpperCase()}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showPeriodDropdown && (
              <div className="absolute top-full left-0 mt-2 w-48 py-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50">
                <div className="px-3 py-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-wider">Historical Archives</div>
                {allUpdates.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => {
                      setShowPeriodDropdown(false);
                      if (!isPreview) router.push(`/${workspace.slug}/${u.period}`);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-mono flex items-center justify-between hover:bg-indigo-600/20 transition-colors ${
                      u.period === update.period ? 'text-indigo-400 font-bold bg-indigo-950/40' : 'text-slate-300'
                    }`}
                  >
                    <span>{u.period.toUpperCase()}</span>
                    {u.period === update.period && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-xs font-medium text-white transition-all shadow-md shadow-indigo-600/20"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Share Live Link'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            title="Export PDF"
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Slide Viewing Surface */}
      <main className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center">
        {currentSlide ? renderSlideContent(currentSlide) : (
          <div className="text-slate-500 text-sm">No slides available</div>
        )}
      </main>

      {/* Bottom Footer Navigation Bar */}
      <footer className="relative z-50 w-full h-16 px-6 flex items-center justify-between border-t border-white/10 bg-slate-950/80 backdrop-blur-xl shrink-0">
        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span>SLIDE {currentIndex + 1} OF {slides.length}</span>
          <span>•</span>
          <span className="text-indigo-400 font-medium truncate max-w-[200px] sm:max-w-xs">{currentSlide?.title}</span>
        </div>

        {/* Slide navigation dots */}
        <div className="hidden sm:flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-indigo-500' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Arrow controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex === slides.length - 1}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 border border-slate-800 text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </footer>

    </div>
  );
}
