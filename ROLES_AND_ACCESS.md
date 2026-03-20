# EMCI — Roles & Access Levels

This document defines every user role in the EMCI Student Intelligence Interface, the access level assigned to each role, what they can see and do within the platform, and the data they interact with.

---

## Overview

EMCI operates across a multi-stakeholder ecosystem. Roles are organised into three tiers:

| Tier | Description |
|------|-------------|
| **Tier 1 — Operational** | Day-to-day users who interact directly with student data |
| **Tier 2 — Administrative** | Users who manage cohorts, schools, or counsellors |
| **Tier 3 — Oversight** | Government, departmental, or executive users with read-only programme visibility |

---

## Role Definitions

### 1. EMCI Counsellor
**Tier:** Operational  
**Access Level:** Standard Read / Write (scoped to assigned students)

EMCI Counsellors are the primary users of the platform. They are contracted or employed to deliver career guidance to students across one or more assigned schools.

#### What They Can Do
- View their own student roster (students assigned to them)
- View and update a student's stage progress (Referral & Consent → Career Guidance → Complete)
- Log new counselling sessions, referrals, consent records, and survey events on the student timeline
- View the student's full activity feed and event history
- Open the detailed event modal and add notes
- Generate and preview a student's PDF journey report
- View their own counsellor dashboard (KPI chips, completion rate, stage breakdown)
- View basic school information for their assigned schools

#### What They Cannot Do
- View students assigned to other counsellors
- View or manage students at schools they are not assigned to
- Add or remove schools from the network
- Access the Dataverse Developer Lab
- Modify programme-level configuration or system settings
- View other counsellors' workloads or performance data

#### Data Scope
| Data | Access |
|------|--------|
| Own student profiles | Read / Write |
| Other counsellors' students | No Access |
| School information (assigned schools) | Read Only |
| Network-wide statistics | Aggregated / Anonymised |
| PDF export | Own students only |

---

### 2. School Counsellor / Guidance Officer
**Tier:** Operational  
**Access Level:** Read Only (scoped to their school)

School Counsellors and Guidance Officers are employed by the school and work alongside EMCI Counsellors. They support the referral process and pastoral care but do not deliver the EMCI programme directly.

#### What They Can Do
- View a read-only list of their school's students enrolled in EMCI
- View a student's current stage and overall progress
- View the activity feed for students at their school
- View the school-level dashboard stats (Total, Active, In Progress, Completed)
- Filter and search students by name, stage, year level, or Morrisby ID

#### What They Cannot Do
- Edit student records or log counselling events
- Progress a student through stages
- View or generate PDF reports
- View students at other schools
- Access the Counsellor View or Network Overview
- Access the Dataverse Developer Lab

#### Data Scope
| Data | Access |
|------|--------|
| School's student profiles | Read Only |
| Student journey events | Read Only |
| Stage progress | Read Only |
| PDF export | No Access |
| Network-level data | No Access |

---

### 3. School Administrator / Principal
**Tier:** Administrative  
**Access Level:** Read (full school scope) + Limited Write (school details)

School Administrators and Principals are responsible for their school's participation in the EMCI programme. They oversee enrolment into the programme and monitor progress at a school level.

#### What They Can Do
- View the full School Dashboard for their school
- View all students enrolled in EMCI at their school
- View programme completion rates and stage breakdowns
- Filter and search the student list
- View high-level counsellor assignment information (which counsellor is assigned to which student)
- Update school contact details and principal information
- Receive programme summary exports for their school

#### What They Cannot Do
- Edit student journey data or log events
- View other schools' data
- Manage counsellor assignments across schools
- Access the Counsellor View
- Access the Dataverse Developer Lab or Network Overview

#### Data Scope
| Data | Access |
|------|--------|
| Own school's student list | Read Only |
| Programme completion stats | Read Only |
| Counsellor assignments (own school) | Read Only |
| Other schools | No Access |
| Network-wide data | No Access |

---

### 4. EMCI Programme Manager
**Tier:** Administrative  
**Access Level:** Full Read + Write (network-wide)

The EMCI Programme Manager oversees the delivery of the EMCI programme across all schools in the network. They manage counsellor assignments, school onboarding, and programme-level reporting.

#### What They Can Do
- Access the full Network Overview (all schools, all KPI cards)
- Drill into any School Dashboard
- View any student's journey regardless of assigned counsellor
- Access the full Counsellor View with workload and performance data for all counsellors
- Assign and reassign counsellors to students or schools
- Onboard new schools and manage their status (Active / Onboarding / Inactive)
- Generate PDF reports for any student
- Filter network data by region, status, school, counsellor, or stage
- Access the Dataverse Developer Lab for data troubleshooting
- Export programme-wide summary reports

#### What They Cannot Do
- Access system-level infrastructure or Dataverse configuration beyond the Developer Lab
- Modify Department of Education data or system records directly
- Create or delete user accounts (managed via Azure AD)

#### Data Scope
| Data | Access |
|------|--------|
| All schools | Read / Write |
| All students | Read / Write |
| All counsellor data | Read / Write |
| Network statistics | Full Access |
| PDF export | All students |
| Dataverse Developer Lab | Full Access |

---

### 5. Department of Education (DoE) User
**Tier:** Oversight  
**Access Level:** Aggregated Read Only (network-wide, anonymised where required)

Department of Education users are government stakeholders who monitor the EMCI programme at a policy and outcomes level. They do not interact with individual student records.

#### What They Can Do
- View aggregated Network Overview statistics (total students, completion rates, schools active, programme coverage)
- View per-school programme completion percentages and stage distributions
- Filter the network by region
- View high-level counsellor coverage (count of counsellors active, not individual data)
- Access summary programme health reports
- Export anonymised network-level data

#### What They Cannot Do
- View individual student names, IDs, or journey details
- Access the School Dashboard student table
- Access the Student Journey view (any student)
- Access the Counsellor View with individual counsellor performance
- Access the Dataverse Developer Lab
- Modify any data in the system

#### Data Scope
| Data | Access |
|------|--------|
| Network KPI totals | Read Only (aggregated) |
| Per-school completion stats | Read Only (aggregated) |
| Individual student records | No Access |
| Counsellor performance detail | No Access |
| Dataverse / system data | No Access |

---

### 6. EMCI Executive / Executive Sponsor
**Tier:** Oversight  
**Access Level:** Aggregated Read Only (programme-level summary)

Executive sponsors and EMCI leadership have strategic oversight of the programme. They receive high-level visibility of programme performance without granular student or counsellor detail.

#### What They Can Do
- View the Network Overview landing page (all KPI cards, school cards with completion bars)
- View programme trends (total students enrolled, stages completed, active schools)
- View high-level regional breakdowns
- Access executive summary PDF exports

#### What They Cannot Do
- Drill into individual schools or students
- View counsellor performance data
- Edit any programme data
- Access the Dataverse Developer Lab

#### Data Scope
| Data | Access |
|------|--------|
| Network-level KPIs | Read Only |
| Regional summaries | Read Only |
| School / student / counsellor detail | No Access |
| System or Dataverse data | No Access |

---

### 7. System Administrator / Developer
**Tier:** Administrative (Technical)  
**Access Level:** Full System Access

System Administrators and Developers are responsible for the technical operation of the EMCI platform, including the Dataverse integration, Azure AD configuration, and platform deployment.

#### What They Can Do
- Full access to all views and components
- Access the Dataverse Developer Lab for API testing, query building, and connection management
- Configure the Vite proxy, OAuth2 client-credentials flow, and token refresh settings
- Manage environment variables and Azure AD app registrations
- Review API responses, headers, and request history
- Deploy updates and manage the build pipeline

#### What They Cannot Do
- Modify student or counsellor records outside of approved data management processes
- Bypass audit logging for production data access

#### Data Scope
| Data | Access |
|------|--------|
| All views and pages | Full Access |
| Dataverse Developer Lab | Full Access |
| System configuration | Full Access |
| Raw API responses & headers | Full Access |

---

## Access Matrix Summary

The table below summarises which pages and features are accessible per role.

| Feature / View | Counsellor | School Counsellor | School Admin | Programme Manager | DoE User | Executive | Sys Admin |
|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Network Overview (KPI cards) | — | — | — | ✅ | ✅ (agg.) | ✅ (agg.) | ✅ |
| Network Overview (school cards) | — | — | — | ✅ | ✅ (agg.) | ✅ (agg.) | ✅ |
| School Dashboard (own school) | ✅ | ✅ | ✅ | ✅ | — | — | ✅ |
| School Dashboard (other schools) | — | — | — | ✅ | — | — | ✅ |
| Student Journey (assigned students) | ✅ | ✅ (read) | ✅ (read) | ✅ | — | — | ✅ |
| Student Journey (all students) | — | — | — | ✅ | — | — | ✅ |
| Log / Edit Timeline Events | ✅ | — | — | ✅ | — | — | ✅ |
| Progress Student Stage | ✅ | — | — | ✅ | — | — | ✅ |
| PDF Export (own students) | ✅ | — | — | ✅ | — | — | ✅ |
| PDF Export (any student) | — | — | — | ✅ | — | — | ✅ |
| Counsellor View (own data) | ✅ | — | — | ✅ | — | — | ✅ |
| Counsellor View (all counsellors) | — | — | — | ✅ | — | — | ✅ |
| School onboarding / management | — | — | ✅ (own) | ✅ | — | — | ✅ |
| Dataverse Developer Lab | — | — | — | ✅ | — | — | ✅ |
| System configuration | — | — | — | — | — | — | ✅ |

> **Legend:** ✅ = Accessible, — = No Access, (agg.) = Aggregated data only, (read) = Read only, (own) = Own school only

---

## Role Assignment

Roles are managed through **Azure Active Directory (Azure AD)** security groups. When a user authenticates via the OAuth2 client-credentials flow, their role is derived from their AAD group membership and embedded in the bearer token claims.

| Role | AAD Group (suggested) |
|------|-----------------------|
| EMCI Counsellor | `EMCI-Counsellors` |
| School Counsellor / Guidance Officer | `EMCI-SchoolCounsellors` |
| School Administrator / Principal | `EMCI-SchoolAdmins` |
| EMCI Programme Manager | `EMCI-ProgrammeManagers` |
| Department of Education User | `EMCI-DoE` |
| EMCI Executive | `EMCI-Executive` |
| System Administrator / Developer | `EMCI-SysAdmins` |

---

## Data Privacy & Compliance Considerations

- **Student PII** (names, Morrisby IDs, emails, year levels) is restricted to Tier 1 and Tier 2 roles with a legitimate operational need.
- **DoE and Executive users** receive only aggregated, non-identifiable statistics.
- All data access is mediated through the Dataverse API layer. No direct database access is permitted for any user-facing role.
- The EMCI platform stores no student data locally — all student records reside in the connected **Microsoft Dataverse** environment (`mcicrm.crm6.dynamics.com`).
- Access logs are maintained by Azure AD and Dataverse audit trails.
- In scope for the **Australian Privacy Act 1988** and relevant state-level education data governance frameworks.

---

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a full history of platform changes.
