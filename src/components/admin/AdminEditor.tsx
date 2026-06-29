'use client';

import React, { useState, useEffect } from 'react';
import { Workspace, Update, Slide, MediaTone } from '@/lib/types';
import { parseDocumentToSlides } from '@/lib/segmenter';
import { saveUpdate, saveWorkspace } from '@/lib/storage';
import DeckShell from '../slideware/DeckShell';
import { Layers, Play, CheckCircle2, Sliders, RefreshCw, Sparkles, Wand2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface AdminEditorProps {
  initialUpdate: Update;
  initialWorkspace: Workspace;
}

export default function AdminEditor({ initialUpdate, initialWorkspace }: AdminEditorProps) {
  const [update, setUpdate] = useState<Update>(initialUpdate);
  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace);
  const [rawText, setRawText] = useState<string>(initialUpdate.rawContent || '');
  const [activeTab, setActiveTab] = useState<'editor' | 'branding'>('editor');
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Auto-parse raw document into slides live as user types (§4.2 requirement)
  useEffect(() => {
    const parsedSlides = parseDocumentToSlides(rawText, update.id);
    setUpdate((prev) => ({
      ...prev,
      rawContent: rawText,
      slides: parsedSlides,
      updatedAt: new Date().toISOString()
    }));
  }, [rawText, update.id]);

  const handlePublish = () => {
    const publishedUpdate: Update = {
      ...update,
      status: 'published',
      publishedAt: new Date().toISOString()
    };
    saveUpdate(publishedUpdate);
    saveWorkspace(workspace);
    setUpdate(publishedUpdate);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSlideToneChange = (index: number, tone: MediaTone) => {
    const updatedSlides = [...update.slides];
    if (updatedSlides[index]) {
      updatedSlides[index].tone = tone;
      setUpdate({ ...update, slides: updatedSlides });
    }
  };

  const handleSlidePromptChange = (index: number, prompt: string) => {
    const updatedSlides = [...update.slides];
    if (updatedSlides[index]) {
      updatedSlides[index].mediaPrompt = prompt;
      setUpdate({ ...update, slides: updatedSlides });
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#090d16] text-white overflow-hidden font-sans">
      
      {/* Top Admin Header Bar */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-slate-950/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <Link href={`/${workspace.slug}`} className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 font-semibold text-sm">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span>Cadence Studio</span>
            <span className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              {workspace.slug}/{update.period}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'editor' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Document Editor
            </button>
            <button
              onClick={() => setActiveTab('branding')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${activeTab === 'branding' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Workspace Branding
            </button>
          </div>

          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            <span>{isSaved ? 'Published!' : 'Publish Update'}</span>
          </button>
        </div>
      </header>

      {/* Editor & Live Split View */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Control Column (Editor or Branding) */}
        <div className="w-full lg:w-1/2 h-full flex flex-col border-r border-white/10 bg-slate-950/40">
          {activeTab === 'editor' ? (
            <div className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
              
              <div className="space-y-2">
                <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Update Details</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-slate-500">Period Tag</span>
                    <input
                      type="text"
                      value={update.period}
                      onChange={(e) => setUpdate({ ...update, period: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">Update Title</span>
                    <input
                      type="text"
                      value={update.title}
                      onChange={(e) => setUpdate({ ...update, title: e.target.value })}
                      className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Document Block Editor Input */}
              <div className="flex-1 flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">Structured Prose Document</label>
                  <span className="text-[11px] font-mono text-indigo-400">Live Auto-Segmenter Active</span>
                </div>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Type your executive update prose here..."
                  className="flex-1 min-h-[300px] w-full p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-sm font-mono text-slate-200 placeholder-slate-600 outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>

              {/* Media & Slide Art Direction Overrides */}
              <div className="space-y-3 pt-4 border-t border-slate-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-indigo-400" /> Slide Art Direction & Tone
                  </span>
                  <span className="text-xs text-slate-500">{update.slides.length} Slides Generated</span>
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                  {update.slides.map((s, idx) => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedSlideIndex(idx)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        selectedSlideIndex === idx ? 'bg-indigo-950/50 border-indigo-500/50' : 'bg-slate-900 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-white">Slide {idx + 1}: {s.title}</span>
                        <span className="font-mono text-[10px] text-indigo-300 uppercase px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800">
                          {s.archetype}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-500">Visual Tone</span>
                          <select
                            value={s.tone || 'editorial'}
                            onChange={(e) => handleSlideToneChange(idx, e.target.value as MediaTone)}
                            className="w-full mt-1 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-300 outline-none"
                          >
                            <option value="editorial">Editorial</option>
                            <option value="corporate">Corporate</option>
                            <option value="abstract">Abstract</option>
                            <option value="data-driven">Data-Driven</option>
                          </select>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-500">Prompt Override</span>
                          <input
                            type="text"
                            value={s.mediaPrompt || ''}
                            onChange={(e) => handleSlidePromptChange(idx, e.target.value)}
                            className="w-full mt-1 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] text-slate-300 outline-none truncate"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Workspace Branding Tab (§4.2 requirement) */
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-bold text-white">Workspace Brand Configuration</h3>
              <p className="text-xs text-slate-400">
                Configure brand attributes globally so every executive update renders on-brand across all slide archetypes.
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <label className="text-xs text-slate-400">Company Name</label>
                  <input
                    type="text"
                    value={workspace.brand.name}
                    onChange={(e) => setWorkspace({ ...workspace, brand: { ...workspace.brand, name: e.target.value } })}
                    className="w-full mt-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400">Primary Palette</label>
                    <input
                      type="color"
                      value={workspace.brand.palette.primary}
                      onChange={(e) => setWorkspace({ ...workspace, brand: { ...workspace.brand, palette: { ...workspace.brand.palette, primary: e.target.value } } })}
                      className="w-full mt-1 h-10 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400">Accent Color</label>
                    <input
                      type="color"
                      value={workspace.brand.palette.accent}
                      onChange={(e) => setWorkspace({ ...workspace, brand: { ...workspace.brand, palette: { ...workspace.brand.palette, accent: e.target.value } } })}
                      className="w-full mt-1 h-10 bg-slate-900 border border-slate-800 rounded-xl cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Split View — Live Rendered Slideware Pane (§4.2 requirement) */}
        <div className="hidden lg:block lg:w-1/2 h-full relative">
          <DeckShell update={update} workspace={workspace} allUpdates={[update]} />
        </div>

      </div>
    </div>
  );
}
