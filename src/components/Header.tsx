import React from 'react';
import { Shield, CheckCircle2 } from 'lucide-react';
import type { Student } from '../data/studentsData';

interface HeaderProps {
  student: Student | null;
}

const STATUS_COLORS: Record<string, string> = {
  Active:   'bg-primary/10 border-primary/20 text-primary',
  Inactive: 'bg-slate-100 border-slate-200/50 text-slate-500',
  Pending:  'bg-amber-50 border-amber-200/50 text-amber-700',
};

export function Header({ student }: HeaderProps) {
  const fullName   = student ? `${student.firstName} ${student.lastName}`.trim() : '—';
  const counsellor = student?.counsellor || '—';
  const status     = student?.status ?? 'Active';

  return (
    <header className="h-14 border-b border-slate-200/60 flex items-center justify-between px-6 shrink-0 bg-white/80 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <Shield className="w-4 h-4" />
          <span className="text-xs font-medium tracking-widest uppercase">EMCI Students</span>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <h1 className="text-base font-semibold tracking-tight text-slate-900">{fullName}</h1>
        <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[status]}`}>
          <CheckCircle2 className="w-3 h-3" />
          <span className="text-xs font-medium uppercase tracking-wider">{status}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="h-4 w-px bg-slate-200" />
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Assigned Counsellor</span>
            <span className="text-sm font-medium text-slate-700">{counsellor}</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
            <img src="https://picsum.photos/seed/counsellor/100/100" alt="Counsellor" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </header>
  );
}
