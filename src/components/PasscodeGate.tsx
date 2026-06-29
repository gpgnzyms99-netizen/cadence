'use client';

import React, { useState, useEffect } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface PasscodeGateProps {
  children: React.ReactNode;
}

export default function PasscodeGate({ children }: PasscodeGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check client session or cookie
    const localAuth = sessionStorage.getItem('cadence_authenticated') === 'true';
    if (localAuth) {
      setIsAuthenticated(true);
      return;
    }

    fetch('/api/passcode')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          sessionStorage.setItem('cadence_authenticated', 'true');
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => setIsAuthenticated(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch('/api/passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('cadence_authenticated', 'true');
        setIsAuthenticated(true);
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center">
        <div className="animate-pulse flex items-center gap-3 text-slate-400">
          <ShieldCheck className="w-6 h-6 text-indigo-400" />
          <span>Verifying security credentials...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background glowing ambient graphics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl shadow-indigo-950/40 relative z-10"
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-6 mx-auto">
          <Lock className="w-7 h-7" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-2">Cadence Executive Security</h1>
          <p className="text-sm text-slate-400">
            This update is protected. Please enter the workspace passcode to access executive slideware.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter workspace passcode..."
                required
                className={`w-full px-4 py-3.5 bg-slate-950/60 border ${
                  error ? 'border-rose-500/80 ring-2 ring-rose-500/20' : 'border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20'
                } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all duration-200`}
              />
            </div>
            {error && (
              <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                <span>Incorrect passcode. Please try again.</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'Authenticating...' : 'Access Executive Update'}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
          <p className="text-xs text-slate-500">
            Passcode is set via <code className="text-indigo-300 bg-indigo-950/50 px-1.5 py-0.5 rounded border border-indigo-800/40">VIEWER_PASSCODE</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
