import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';

export function Header() {
  return (
    <header className="h-14 border-b border-slate-200/60 flex items-center justify-between px-6 shrink-0 bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Shield className="w-4 h-4" />
          <span className="text-xs font-medium tracking-widest uppercase">EMCI Students</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <h1 className="text-lg font-medium tracking-tight text-slate-900">Eleanor Vance</h1>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/50 text-emerald-700">
          <CheckCircle2 className="w-3 h-3" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Active</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs uppercase tracking-wider">School</span>
          <span className="font-medium text-slate-700">St. Jude's Academy</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 text-xs uppercase tracking-wider">Year</span>
          <span className="font-medium text-slate-700">11</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Assigned Counsellor</span>
            <span className="text-xs font-medium text-slate-700">Dr. Aris Thorne</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
            <img src="https://picsum.photos/seed/counsellor/100/100" alt="Counsellor" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
