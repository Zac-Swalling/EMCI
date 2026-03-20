import React from 'react';
import type { Student } from '../data/studentsData';

interface ProfileSnapshotProps {
  student: Student | null;
  schoolName?: string;
}

const STATUS_LABEL: Record<string, string> = {
  Active:   'Active Guidance',
  Inactive: 'Inactive',
  Pending:  'Pending',
};

export function ProfileSnapshot({ student, schoolName }: ProfileSnapshotProps) {
  const firstName  = student?.firstName    ?? '—';
  const lastName   = student?.lastName     ?? '—';
  const preferred  = student?.preferredName ?? firstName;
  const morrisbyId = student?.morrisbyId   ?? '—';
  const counsellor = student?.counsellor   ?? '—';
  const status     = student?.status       ?? 'Active';
  const yearLevel  = student?.yearLevel    ?? 0;
  const avatar     = student?.avatar;

  return (
    <div className="flex flex-col h-full bg-white">

      {/* ── Profile section ─────────────────────────────── */}
      <div className="p-6 flex flex-col gap-6">

        {/* Avatar + name */}
        <div className="flex flex-col items-center text-center gap-4">
          <div
            className={`size-24 rounded-2xl border-4 border-white shadow-sm overflow-hidden
              ${avatar ? 'bg-cover bg-center' : 'bg-slate-100 flex items-center justify-center'}`}
            style={avatar ? { backgroundImage: `url(${avatar})` } : undefined}
          >
            {!avatar && (
              <span className="text-3xl font-bold text-slate-400 select-none">
                {firstName[0]}{lastName[0]}
              </span>
            )}
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">{firstName} {lastName}</h1>
            <p className="text-slate-500 text-sm">
              {preferred && preferred !== firstName ? `Preferred: ${preferred} | ` : ''}
              {yearLevel ? `Year ${yearLevel}` : '—'}
            </p>
          </div>
        </div>

        {/* Info card + nav */}
        <div className="flex flex-col gap-3">

          {/* Info card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase font-semibold tracking-wider">Morrisby ID</span>
                <span className="font-mono text-slate-700">{morrisbyId}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase font-semibold tracking-wider">Email</span>
                <span className="text-slate-700 text-right max-w-[150px] truncate leading-tight" title={student?.email ?? '—'}>
                  {student?.email ?? '—'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase font-semibold tracking-wider">Counsellor</span>
                <span className="text-slate-700 text-right max-w-[130px] truncate leading-tight" title={counsellor}>
                  {counsellor}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 uppercase font-semibold tracking-wider">Status</span>
                <span className="text-primary font-bold">{STATUS_LABEL[status] ?? status}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
