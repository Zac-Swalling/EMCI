import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Loader2, AlertCircle, Shield } from 'lucide-react';
import { signInWithMicrosoft } from '../services/supabase';

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    try {
      await signInWithMicrosoft();
      // Browser redirects to Microsoft — loading state stays until redirect
    } catch (e: any) {
      setError(e.message ?? 'Sign-in failed. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-[#F8FAFC] overflow-hidden">

      {/* ── Background decoration ────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-primary/5" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-primary/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-slate-200/60" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-slate-200/60" />
      </div>

      {/* ── Card ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-sm overflow-hidden"
        >
          {/* Orange top accent */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/80 to-primary/40" />

          <div className="px-8 py-10">
            {/* Logo + branding */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-[2px]" />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-base font-black tracking-tight text-slate-900 leading-none">EMCI</p>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold leading-none mt-0.5">Platform</p>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">
              Welcome back
            </h1>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Sign in with your SecureLogic Microsoft account to access the EMCI programme dashboard.
            </p>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5"
              >
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700 leading-relaxed">{error}</p>
              </motion.div>
            )}

            {/* Microsoft sign-in button */}
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-[#2F2F2F] hover:bg-[#1a1a1a] active:scale-[0.98] text-white rounded-xl font-semibold text-sm transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                /* Microsoft logo SVG */
                <svg width="18" height="18" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="9" height="9" fill="#F35325"/>
                  <rect x="11" y="1" width="9" height="9" fill="#81BC06"/>
                  <rect x="1" y="11" width="9" height="9" fill="#05A6F0"/>
                  <rect x="11" y="11" width="9" height="9" fill="#FFBA08"/>
                </svg>
              )}
              {loading ? 'Redirecting to Microsoft…' : 'Sign in with Microsoft'}
            </button>

            {/* Divider + info */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>
                Secured via Microsoft SSO — your credentials are never stored by EMCI.
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <div className="shrink-0 text-center py-4 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
        EMCI Platform · SecureLogic Solutions · {new Date().getFullYear()}
      </div>
    </div>
  );
}
