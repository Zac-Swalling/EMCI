# EMCI — Student Intelligence Interface

A purpose-built dashboard for EMCI counsellors and program administrators to track, manage, and report on student career guidance journeys across a network of schools.

---

## What Is EMCI?

EMCI (Early and Meaningful Career Intelligence) is a program that guides secondary school students (Year 9–10) through a structured career readiness journey. The program operates across multiple schools and is delivered by assigned EMCI counsellors.

This interface gives counsellors and administrators a single place to:

- View the entire school network at a glance
- Drill into individual schools and their student cohorts
- Track each student's progress through the EMCI programme stages
- Log and review counselling activities and sessions
- Export a student journey summary report (PDF preview)
- Monitor counsellor workloads and programme completion rates

---

## Programme Stages

Each student moves through three stages:

| Stage | Name | Description |
|-------|------|-------------|
| 1 | Referral & Consent | School refers the student; parental consent is obtained |
| 2 | Career Guidance | Active counselling sessions, Morrisby unpacking, career planning |
| 3 | Complete | Student has completed the full EMCI programme |

---

## Navigation Structure

```
Network Overview
├── School Dashboard  (select any school)
│   └── Student Journey  (select any student)
│       └── PDF Export Preview
└── Counsellor View
```

### Network Overview
The landing page. Shows all schools in the network with:
- Global KPI cards (Total Schools, Total Students, Active Students, In Progress, Counsellors)
- Per-school cards with programme completion bar, student counts, and region
- Filter by status (Active / Onboarding / Inactive) and region
- Text search across school name, region, and Morrisby ID

### School Dashboard
Shows the full student cohort for a selected school with:
- Summary stat cards (Total, Active, In Progress, Completed)
- Student table with stage badges and progress bars
- Filter by stage, year level, and counsellor
- Search by name or Morrisby ID

### Student Journey
A three-panel view for a single student:
- **Left panel** — student profile (name, year, Morrisby ID, counsellor, student type)
- **Centre panel** — stage progress tracker + clickable activity feed; clicking an activity opens a detail modal
- **Right panel** — context panel showing event details or student overview

### PDF Export Preview
A styled A4-format report showing:
- Student summary KPIs
- Stage timeline
- Academic and attendance charts
- Activity log
- Work Readiness checklist (industry immersion, career interest tags, industry exposure)
- Counsellor insights

### Counsellor View
Analytics page for programme administrators showing:
- Counsellor roster sidebar
- KPI chips per counsellor (Total / Active / Completed / In Progress)
- Completion rate progress bar
- Students-by-stage breakdown
- Full student roster table for each counsellor

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Animation | Motion (Framer Motion) |
| Icons | Lucide React |
| Date handling | date-fns |
| Charts | D3 (used in PDF preview) |

---

## Project Structure

```
src/
├── components/
│   ├── NetworkOverview.tsx    # All-schools landing page
│   ├── CounsellorView.tsx     # Counsellor analytics page
│   ├── SchoolDashboard.tsx    # School-level student list
│   ├── Header.tsx             # Student journey top bar
│   ├── ProfileSnapshot.tsx    # Left-hand student profile panel
│   ├── TimelineCore.tsx       # Stage tracker + activity feed + event modal
│   ├── ContextPanel.tsx       # Right-hand event/student detail panel
│   └── PdfPreview.tsx         # PDF export preview page
├── data/
│   ├── networkData.ts         # Schools, counsellors, and all network students
│   ├── studentsData.ts        # Ashwood School student records
│   └── timelineData.ts        # Student journey events and academic data
└── App.tsx                    # Root component — navigation state machine
```

---

## Running Locally

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the development server (runs on port 3000)
npm run dev
```

The app will be available at `http://localhost:3000`.

```bash
# Type-check the project
npm run lint

# Build for production
npm run build
```

---

## Data & Mock Data

All data in this interface is currently **mock data** — no live database connection. Data is defined in `src/data/`:

- **`networkData.ts`** — 6 schools, 4 counsellors, 25 students across the network
- **`studentsData.ts`** — 8 students for Ashwood School (used by `SchoolDashboard`)
- **`timelineData.ts`** — 4 journey events (referral, consent, session, survey) with academic and attendance data series

When connecting to a real backend, these files are the source of truth for the expected data shapes (TypeScript interfaces).

---

## Key Data Interfaces

```typescript
// A school in the EMCI network
interface School {
  id: string;
  name: string;
  morrisbyId: string;      // Morrisby platform identifier
  region: string;
  principalContact: string;
  status: 'Active' | 'Onboarding' | 'Inactive';
  joinedYear: number;
}

// A student in the programme
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  yearLevel: number;       // 9 or 10
  morrisbyId: string;
  counsellor: string;
  currentStage: 'referral' | 'consent' | 'career_guidance' | 'complete' | null;
  stageProgress: number;   // 0–4
  status: 'Active' | 'Inactive' | 'Pending';
  studentType: 'Standard' | 'At Risk';
  interviewed: boolean;
  hasProfile: boolean;
}
```

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a full history of changes.
