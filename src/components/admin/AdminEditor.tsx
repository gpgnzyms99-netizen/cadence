'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Workspace, Update, MediaTone } from '@/lib/types';
import { parseDocumentToSlides } from '@/lib/segmenter';
import { saveUpdate, saveWorkspace } from '@/lib/storage';
import DeckShell from '../slideware/DeckShell';
import { Layers, Play, CheckCircle2, Wand2, ArrowLeft, Upload, FileSpreadsheet, Sparkles, Edit3, Eye, FileText, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';

interface AdminEditorProps {
  initialUpdate: Update;
  initialWorkspace: Workspace;
}

export default function AdminEditor({ initialUpdate, initialWorkspace }: AdminEditorProps) {
  const [update, setUpdate] = useState<Update>(initialUpdate);
  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace);
  const [rawText, setRawText] = useState<string>(initialUpdate.rawContent || '');
  const [activeStep, setActiveStep] = useState<'upload' | 'preview' | 'edit'>('upload');
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadedFileName, setUploadedFileName] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-parse raw document into slides live as user edits
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadedFileName(file.name);
    setUploadStatus(`Analyzing and processing ${file.name} with Gemini AI...`);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/process-document', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (res.ok && data.success && data.markdown) {
        setRawText(data.markdown);
        setUploadStatus(`Slideware generated successfully! Transitioning to preview...`);
        setTimeout(() => {
          setActiveStep('preview');
        }, 1000);
      } else {
        setUploadStatus('Document processing failed. Please try again.');
      }
    } catch (err) {
      setUploadStatus('Upload error.');
    } finally {
      setUploading(false);
    }
  };

  const handleSlideToneChange = (index: number, tone: MediaTone) => {
    const updatedSlides = [...update.slides];
    if (updatedSlides[index]) {
      updatedSlides[index].tone = tone;
      setUpdate({ ...update, slides: updatedSlides });
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-[#090d16] text-white overflow-hidden font-sans">
      
      {/* Streamlined Workflow Header */}
      <header className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-slate-950/90 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          <Link href={`/${workspace.slug}`} className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2 font-semibold text-sm">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <span>Cadence Creator</span>
          </div>
        </div>

        {/* 3-Step Workflow Stepper Bar */}
        <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800/80 text-xs font-medium">
          <button
            onClick={() => setActiveStep('upload')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeStep === 'upload' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-mono">1</span>
            <span>Upload File</span>
          </button>

          <button
            onClick={() => setActiveStep('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeStep === 'preview' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-mono">2</span>
            <span>Preview Slideware</span>
          </button>

          <button
            onClick={() => setActiveStep('edit')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              activeStep === 'edit' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-mono">3</span>
            <span>Edit & Publish</span>
          </button>
        </div>

        {/* Publish Action Button */}
        <button
          onClick={handlePublish}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-lg shadow-emerald-600/20 transition-all"
        >
          {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isSaved ? 'Published Live!' : 'Publish Update'}</span>
        </button>
      </header>

      {/* Main Workflow View Surface */}
      <div className="flex-1 overflow-hidden relative">
        
        {/* STEP 1: UPLOAD INPUT FILES */}
        {activeStep === 'upload' && (
          <div className="w-full h-full flex items-center justify-center p-6 bg-[#090d16]">
            <div className="max-w-xl w-full text-center space-y-8 p-10 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-xl shadow-indigo-950/50">
                {uploading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Sparkles className="w-10 h-10" />}
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold tracking-tight text-white">Upload Executive Document</h2>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  Upload your PDF, Word document, Excel sheet, CSV, or PowerPoint file. Gemini AI will analyze and convert it into agency-grade slideware automatically.
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.docx,.doc,.csv,.xlsx,.xls,.pptx,.ppt,.txt"
                className="hidden"
              />

              <div className="pt-2 space-y-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 group"
                >
                  <Upload className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
                  <span>{uploading ? 'Processing with Gemini AI...' : 'Select Document File'}</span>
                </button>

                {uploadStatus && (
                  <p className="text-xs font-mono text-indigo-300 animate-pulse">{uploadStatus}</p>
                )}

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-4 text-[11px] font-mono text-slate-500">
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5 text-indigo-400" /> PDF & Word</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Excel & CSV</span>
                  <span>•</span>
                  <span>PPT Presentations</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PREVIEW SLIDEWARE */}
        {activeStep === 'preview' && (
          <div className="w-full h-full relative">
            <DeckShell update={update} workspace={workspace} allUpdates={[update]} />
          </div>
        )}

        {/* STEP 3: EDIT & PUBLISH */}
        {activeStep === 'edit' && (
          <div className="w-full h-full flex overflow-hidden">
            {/* Left Quick Editor Drawer */}
            <div className="w-full lg:w-1/2 h-full p-6 flex flex-col space-y-6 bg-slate-950/60 border-r border-white/10 overflow-y-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Refine Update Content</h3>
                  <p className="text-xs text-slate-400">Make quick adjustments to the generated text before publishing.</p>
                </div>
                <button
                  onClick={handlePublish}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Publish Now</span>
                </button>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase">Period Tag & Title</span>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={update.period}
                    onChange={(e) => setUpdate({ ...update, period: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-white outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    value={update.title}
                    onChange={(e) => setUpdate({ ...update, title: e.target.value })}
                    className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col space-y-2">
                <span className="text-xs font-mono text-slate-400 uppercase">Structured Prose Editor</span>
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  className="flex-1 min-h-[350px] w-full p-4 bg-slate-900/90 border border-slate-800 rounded-2xl text-sm font-mono text-slate-200 outline-none focus:border-indigo-500 resize-none leading-relaxed"
                />
              </div>
            </div>

            {/* Right Live Preview Pane */}
            <div className="hidden lg:block lg:w-1/2 h-full relative">
              <DeckShell update={update} workspace={workspace} allUpdates={[update]} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
