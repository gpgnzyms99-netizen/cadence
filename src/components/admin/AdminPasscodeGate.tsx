'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface AdminPasscodeGateProps {
  children: React.ReactNode;
}

export default function AdminPasscodeGate({ children }: AdminPasscodeGateProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const localAuth = sessionStorage.getItem('cadence_author_authenticated') === 'true';
    if (localAuth) {
      setIsAuthenticated(true);
      return;
    }

    fetch('/api/admin-auth')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          sessionStorage.setItem('cadence_author_authenticated', 'true');
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
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('cadence_author_authenticated', 'true');
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
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <span>Verifying Studio access credentials...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-900/90 backdrop-blur-2xl border border-slate-800/80 p-8 rounded-3xl shadow-2xl shadow-indigo-950/50 relative z-10"
      >
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 mb-6 mx-auto shadow-lg shadow-indigo-500/10">
          <ShieldAlert className="w-7 h-7" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Cadence Studio Gate</h1>
          <p className="text-xs text-slate-400">
            Authoring portal access restricted. Enter your author password to create and publish executive updates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter Author Studio Password..."
              required
              className={`w-full px-4 py-3.5 bg-slate-950/80 border ${
                error ? 'border-rose-500/80 ring-2 ring-rose-500/20' : 'border-slate-800 focus:border-indigo-500'
              } rounded-xl text-white placeholder-slate-500 text-sm outline-none transition-all`}
            />
            {error && <p className="text-xs text-rose-400 mt-2">Incorrect author password. Try again.</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
          >
            {loading ? 'Authenticating...' : 'Unlock Authoring Studio'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
          <p className="text-[11px] text-slate-500">
            Protected by <code className="text-indigo-300 bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/50">AUTHOR_PASSCODE</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
