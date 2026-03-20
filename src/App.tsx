import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Header } from './components/Header';
import { ProfileSnapshot } from './components/ProfileSnapshot';
import { TimelineCore } from './components/TimelineCore';
import { ContextPanel } from './components/ContextPanel';
import { SchoolDashboard } from './components/SchoolDashboard';
import { PdfPreview } from './components/PdfPreview';
import { NetworkOverview } from './components/NetworkOverview';
import { CounsellorView } from './components/CounsellorView';
import { DataverseLab } from './components/DataverseLab';
import { SurveySearch } from './components/SurveySearch';
import type { Student } from './data/studentsData';
import type { School } from './data/networkData';
import {
  fetchStudents,
  fetchSchools,
  fetchSessions,
  fetchAbsences,
  fetchInitialSurveys,
  fetchInitialSurveys2026,
  fetchEndOfPilotSurveysLegacy,
  fetchEndOfPilotSurveys2026,
  fetchMidPilotStudentSurveys,
  enrichStudents,
  deriveStudentEvents,
  type TimelineEvent,
  type RawSession,
  type RawInitialSurvey,
  type RawInitialSurvey2026,
  type RawEndOfPilotSurveyLegacy,
  type RawEndOfPilotSurvey2026,
  type RawMidPilotStudentSurvey,
} from './services/dataverse';
import { ChevronLeft, FileDown, ChevronRight, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// Navigation hierarchy:
// network → school → student → pdf
//         → counsellors
//         → devlab → surveysearch
type Page = 'network' | 'school' | 'student' | 'pdf' | 'counsellors' | 'devlab' | 'surveysearch';

const TOKEN_URL = '/devtoken';

export default function App() {
  // ── Auth + data state ────────────────────────────────────────
  const [token, setToken]               = useState('');
  const [tokenLoading, setTokenLoading] = useState(true);
  const [students, setStudents]         = useState<Student[]>([]);
  const [schools, setSchools]           = useState<School[]>([]);
  const [dataLoading, setDataLoading]   = useState(false);
  const [dataError, setDataError]       = useState<string | null>(null);
  const refreshTimerRef                 = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pre-computed per-student timeline events (keyed by student.id)
  const [studentEventsMap, setStudentEventsMap] = useState<Record<string, TimelineEvent[]>>({});

  // ── Navigation state ─────────────────────────────────────────
  const [page, setPage]                       = useState<Page>('network');
  const [selectedSchool, setSelectedSchool]   = useState<School | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedEvent, setSelectedEvent]     = useState<any | null>(null);

  // ── Token fetch (server-side via Vite /devtoken middleware) ──
  const fetchToken = useCallback(async (): Promise<string> => {
    const res  = await fetch(TOKEN_URL, { method: 'POST' });
    const data = await res.json();
    if (!res.ok || !data.access_token) {
      throw new Error(data.error_description ?? data.error ?? `Token fetch HTTP ${res.status}`);
    }
    const newToken = data.access_token as string;
    setToken(newToken);

    // Auto-refresh 5 min before expiry
    const expiresInSec = (data.expires_in ?? 3600) as number;
    const refreshIn    = Math.max((expiresInSec - 300) * 1000, 30_000);
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => fetchToken(), refreshIn);

    return newToken;
  }, []);

  // ── Fetch live students + schools + all related tables ───────
  const loadData = useCallback(async (tok: string) => {
    setDataLoading(true);
    setDataError(null);
    try {
      // Core tables — required; throw on failure
      const [fetchedStudents, fetchedSchools] = await Promise.all([
        fetchStudents(tok),
        fetchSchools(tok),
      ]);

      // Related tables — optional; don't block if they fail
      const [
        sessionsRes,
        absencesRes,
        initSurveysRes,
        initSurveys2026Res,
        endSurveysLegacyRes,
        endSurveys2026Res,
        midStudentSurveysRes,
      ] = await Promise.allSettled([
        fetchSessions(tok),
        fetchAbsences(tok),
        fetchInitialSurveys(tok),
        fetchInitialSurveys2026(tok),
        fetchEndOfPilotSurveysLegacy(tok),
        fetchEndOfPilotSurveys2026(tok),
        fetchMidPilotStudentSurveys(tok),
      ]);

      const sessions          = sessionsRes.status           === 'fulfilled' ? sessionsRes.value           : [] as RawSession[];
      const absences          = absencesRes.status           === 'fulfilled' ? absencesRes.value           : [];
      const initSurveys       = initSurveysRes.status        === 'fulfilled' ? initSurveysRes.value        : [] as RawInitialSurvey[];
      const initSurveys2026   = initSurveys2026Res.status    === 'fulfilled' ? initSurveys2026Res.value    : [] as RawInitialSurvey2026[];
      const endSurveysLegacy  = endSurveysLegacyRes.status   === 'fulfilled' ? endSurveysLegacyRes.value   : [] as RawEndOfPilotSurveyLegacy[];
      const endSurveys2026    = endSurveys2026Res.status     === 'fulfilled' ? endSurveys2026Res.value     : [] as RawEndOfPilotSurvey2026[];
      const midStudentSurveys = midStudentSurveysRes.status  === 'fulfilled' ? midStudentSurveysRes.value  : [] as RawMidPilotStudentSurvey[];

      // Enrich students with counsellor, riskLevel, lastActivity
      const enriched = enrichStudents(fetchedStudents, [], sessions, absences);

      // Pre-build per-student event maps
      const eventsMap: Record<string, TimelineEvent[]> = {};

      // Helper: match an activity record to a student.
      // Checks both the standard Activity "Regarding" field and common custom
      // EMCI student lookup fields, guarding against GUID case differences.
      const matchesStudent = (record: { [key: string]: unknown }, sid: string): boolean => {
        const normalize = (v: unknown) => typeof v === 'string' ? v.toLowerCase() : null;
        const target = sid.toLowerCase();
        return (
          normalize(record['_regardingobjectid_value']) === target ||
          normalize(record['_cr89a_wlpcstudent_value'])  === target ||
          normalize(record['_cr89a_student_value'])       === target ||
          normalize(record['cr89a_wlpcstudentid'])        === target
        );
      };

      for (const student of enriched) {
        const sid = student.id;
        eventsMap[sid] = deriveStudentEvents(
          student,
          sessions.filter(s => matchesStudent(s, sid)),
          initSurveys.filter(s => matchesStudent(s, sid)),
          initSurveys2026.filter(s => matchesStudent(s, sid)),
          endSurveysLegacy.filter(s => matchesStudent(s, sid)),
          endSurveys2026.filter(s => matchesStudent(s, sid)),
          midStudentSurveys.filter(s => matchesStudent(s, sid)),
        );
      }

      setStudents(enriched);
      setSchools(fetchedSchools);
      setStudentEventsMap(eventsMap);
    } catch (e: any) {
      setDataError(e.message ?? 'Failed to load data from Dataverse');
    } finally {
      setDataLoading(false);
    }
  }, []);

  // ── Bootstrap: fetch token then data on mount ────────────────
  useEffect(() => {
    (async () => {
      setTokenLoading(true);
      try {
        const tok = await fetchToken();
        await loadData(tok);
      } catch (e: any) {
        setDataError(e.message ?? 'Failed to initialise');
      } finally {
        setTokenLoading(false);
      }
    })();

    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Helpers ───────────────────────────────────────────────────
  function handleSelectSchool(school: School) {
    setSelectedSchool(school);
    setSelectedStudent(null);
    setSelectedEvent(null);
    setPage('school');
  }

  function handleSelectStudent(student: Student) {
    setSelectedStudent(student);
    setSelectedEvent(null);
    setPage('student');
  }

  function goTo(p: Page) {
    setSelectedEvent(null);
    setPage(p);
  }

  // School name for the selected student (look up from schools list)
  const studentSchoolName = selectedStudent
    ? (schools.find(s => s.id === (selectedStudent as any).schoolId)?.name ?? selectedSchool?.name ?? undefined)
    : undefined;

  // ── Loading screen ────────────────────────────────────────────
  if (tokenLoading || (dataLoading && students.length === 0)) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-medium text-slate-500 uppercase tracking-widest">
          {tokenLoading ? 'Connecting to Dataverse…' : 'Loading programme data…'}
        </p>
      </div>
    );
  }

  // ── Error banner helper (inline, shows on each page) ─────────
  const ErrorBanner = dataError ? (
    <div className="shrink-0 bg-red-50 border-b border-red-200 px-6 py-2 flex items-center gap-3">
      <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
      <p className="text-sm text-red-700 flex-1">{dataError}</p>
      <button
        onClick={() => token && loadData(token)}
        className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry
      </button>
    </div>
  ) : null;

  // ── Network overview ─────────────────────────────────────────
  if (page === 'network') {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden">
        {ErrorBanner}
        <NetworkOverview
          students={students}
          schools={schools}
          onSelectSchool={handleSelectSchool}
          onSelectStudent={handleSelectStudent}
          onGoToCounsellors={() => goTo('counsellors')}
          onGoToDevLab={() => goTo('devlab')}
        />
      </div>
    );
  }

  // ── Counsellor view ──────────────────────────────────────────
  if (page === 'counsellors') {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden">
        {ErrorBanner}
        <CounsellorView students={students} schools={schools} onBack={() => goTo('network')} />
      </div>
    );
  }

  // ── Dataverse Lab ────────────────────────────────────────────
  if (page === 'devlab') {
    return <DataverseLab onBack={() => goTo('network')} onGoToSurveySearch={() => goTo('surveysearch')} />;
  }

  // ── Survey Search ─────────────────────────────────────────────
  if (page === 'surveysearch') {
    return (
      <SurveySearch
        students={students}
        studentEventsMap={studentEventsMap}
        onBack={() => goTo('devlab')}
      />
    );
  }

  // ── School dashboard ─────────────────────────────────────────
  if (page === 'school') {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden">
        {ErrorBanner}
        <SchoolDashboard
          students={students}
          school={selectedSchool}
          onSelectStudent={handleSelectStudent}
          onBack={() => goTo('network')}
        />
      </div>
    );
  }

  // ── PDF preview ──────────────────────────────────────────────
  if (page === 'pdf') {
    return (
      <PdfPreview
        studentName={selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : '—'}
        morrisbyId={selectedStudent?.morrisbyId ?? '—'}
        schoolName={studentSchoolName ?? selectedSchool?.name ?? '—'}
        counsellor={selectedStudent?.counsellor ?? '—'}
        yearLevel={selectedStudent?.yearLevel ?? 0}
        currentStage={selectedStudent?.currentStage ?? null}
        stageProgress={selectedStudent?.stageProgress ?? 0}
        events={selectedStudent ? (studentEventsMap[selectedStudent.id] ?? []) : []}
        onBack={() => goTo('student')}
      />
    );
  }

  // ── Student journey view ─────────────────────────────────────
  return (
    <div className="h-screen w-screen flex flex-col bg-emci-bg text-emci-primary overflow-hidden">
      {/* Breadcrumb + Export */}
      <div className="shrink-0 bg-white border-b border-slate-100 px-6 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button onClick={() => goTo('network')}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-primary transition-colors font-medium group">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Network
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <button onClick={() => goTo('school')}
            className="text-sm text-slate-500 hover:text-primary transition-colors font-medium">
            {selectedSchool?.name ?? 'School'}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-sm text-slate-800 font-semibold">
            {selectedStudent ? `${selectedStudent.firstName} ${selectedStudent.lastName}` : 'Student Journey'}
          </span>
        </div>
        <button
          onClick={() => goTo('pdf')}
          className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-white bg-primary hover:bg-primary/90 active:scale-95 transition-all rounded-lg shadow-sm"
        >
          <FileDown className="w-4 h-4" />
          Export to PDF
        </button>
      </div>

      {ErrorBanner}

      <div className="flex-1 flex flex-row overflow-hidden">
        <div className="w-72 shrink-0 border-r border-slate-200 flex flex-col">
          <ProfileSnapshot student={selectedStudent} schoolName={studentSchoolName} />
        </div>
        <div className="flex-1 flex flex-col relative overflow-hidden">
          <TimelineCore student={selectedStudent} events={selectedStudent ? (studentEventsMap[selectedStudent.id] ?? []) : []} onSelectEvent={setSelectedEvent} />
        </div>
        <div className="w-[380px] shrink-0 border-l border-slate-200 flex flex-col">
          <ContextPanel student={selectedStudent} selectedEvent={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </div>
      </div>
    </div>
  );
}
