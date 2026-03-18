import React from 'react';

export function ProfileSnapshot() {
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-white/60 to-slate-50/20 p-6 gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-4xl font-light tracking-tight text-slate-900">Aanya</h2>
        <span className="text-sm font-medium text-slate-400 tracking-wide">Aanya Bhatt</span>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Preferred Name</span>
            <span className="text-sm font-medium text-slate-700">Aanya</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Email Address</span>
            <span className="text-sm font-medium text-slate-700">aanya.bhatt@emci.edu.au</span>
          </div>
        </div>

        <div className="h-px w-full bg-slate-200/60 my-2" />

        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] uppercase tracking-widest text-slate-900 font-bold mb-2">EMCI School</h3>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">School Name</span>
              <span className="text-sm font-medium text-slate-700">Ashwood School</span>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Morrisby ID</span>
              <span className="text-sm font-mono text-slate-700 tracking-tight">ASSM</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Status</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-sm font-medium text-slate-700">Active</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-200/60">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Last Updated</span>
            <span className="text-xs font-mono text-slate-500">2026-03-17 18:06 UTC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
