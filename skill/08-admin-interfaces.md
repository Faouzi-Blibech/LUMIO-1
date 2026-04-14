---
name: lumio-admin-interfaces
description: Admin dashboard with school-wide statistics, teacher/class management table with hover/click, settings, and AI chatbot. Read when building or modifying any admin-facing page.
---

# Admin Interfaces

## Overview

The admin experience provides a bird's-eye view of the entire school's performance, with drill-down into individual teachers and their classes. The admin role is designed for school administrators or institution leads.

**Sidebar navigation:** Dashboard · Teachers · Settings

---

## 1. Admin Dashboard (`/admin/dashboard`)

### Layout
```
Header: "School Dashboard" + school name + current date

KPI row (4 cards):
  - Total Students — icon Users, border-l-primary
  - Total Teachers — icon GraduationCap, border-l-secondary
  - Total Classes — icon Layers, border-l-warning
  - School Avg Focus — icon Brain, border-l-success

School-wide charts row (2 columns):
  ┌──────────────────────────────┐  ┌──────────────────────────────┐
  │ Focus Trend (school avg)     │  │ Focus Distribution           │
  │ AreaChart — 30 days          │  │ PieChart or Histogram:       │
  │                              │  │ - Excellent (≥80%): count    │
  │                              │  │ - Good (60-79%): count       │
  │                              │  │ - Needs Attention (<60%): c  │
  └──────────────────────────────┘  └──────────────────────────────┘

Statistics summary row:
  ┌──────────────────────────────────────────────────────────────┐
  │ Active Sessions Today: 45                                    │
  │ Avg Session Duration: 32 min                                 │
  │ Homework Completion Rate: 78%                                │
  │ At-Risk Students (school-wide): 12                           │
  │ Professional Referrals (30d): 3                              │
  └──────────────────────────────────────────────────────────────┘

Recent School Alerts:
  - severity dot + description + time
  - "3 new at-risk students identified this week"
  - "Focus score improved 5% across Grade 3"
  - "Teacher Ms. Trabelsi's class avg focus at 82% (highest)"
```

### Data sources
- `GET /admin/dashboard/summary` → school-wide KPIs
- `GET /admin/dashboard/focus-trend` → school average focus over time
- `GET /admin/dashboard/distribution` → focus distribution breakdown
- `GET /admin/dashboard/alerts` → recent school-wide alerts

---

## 2. Admin Teachers Table (`/admin/teachers`)

### Layout
```
Header: "Teachers" + count + "Add Teacher" button

Search bar + filter options

┌─── TEACHER TABLE ──────────────────────────────────────────────────┐
│ Teacher       │ Subject      │ Classes          │ Students │ Avg Focus │
│ ───────────── │ ──────────── │ ──────────────── │ ──────── │ ───────── │
│ Ms. Trabelsi  │ Mathematics  │ 3ème Sc A, B     │ 64       │ 78%       │
│ Mr. Riahi     │ Physics      │ 3ème Sc A, 4ème  │ 96       │ 71%       │
│ Ms. Mansouri  │ French       │ 3ème Sc B        │ 32       │ 85%       │
└────────────────────────────────────────────────────────────────────────┘
```

### Teacher Row — Hover Behavior (on class name)

When admin **hovers** over a class name in the Classes column, a popover shows:
```
┌──────────────────────────────────┐
│  3ème Sciences A                  │
│  Subject: Mathematics             │
│  ────────────────────────────── │
│  Students: 32                     │
│  Avg Focus: 78%                   │
│  At-Risk: 3 students              │
│  Homework pending: 5              │
│  Last live session: Today 10:00   │
└──────────────────────────────────┘
```

### Class Click Behavior

When admin **clicks** a class name, it navigates to `/admin/classes/:id` showing:

```
Header: "{Class Name}" + "Back to Teachers" link

Class KPI row:
  - Student count, Avg Focus, At-Risk count, Homework completion

Student table (same format as teacher's dashboard table):
  - Student name, focus %, sessions, risk badge, trend
  - Hover → student summary popover
  - Click → opens that student's dashboard view (read-only, same as teacher view)

Class Focus Trend chart (30 days)

Class Homework overview:
  - Active assignments, submission rates, grading progress
```

### Data sources
- `GET /admin/teachers` → teacher list with aggregated stats
- `GET /admin/classes/{id}` → class detail with student data
- `GET /analytics/class/{id}/summary` → class-level KPIs

---

## 3. Admin Settings (`/admin/settings`) — NEW PAGE

### Layout
```
Header: "Settings"
Sections:
  School Profile:
    - School name, address, academic year
    - Admin name, email
  Platform Configuration:
    - Focus alert threshold (school default)
    - Risk profiling frequency (daily/weekly)
    - Parent communication policy
  User Management:
    - View all users by role (student/teacher/parent counts)
    - Invite new teacher (email invite flow)
    - Link parent to student
  Notifications:
    - School-wide alert emails (toggle)
    - Weekly school report (toggle)
    - Professional referral notifications (toggle)
  Data & Privacy:
    - Data retention policy
    - Export school data (CSV)
    - GDPR compliance settings
  Language:
    - AR / FR / EN selector
  Account:
    - Change password
    - Logout
```

### Data sources
- `GET /admin/settings` → school settings
- `PUT /admin/settings` → update settings
- `GET /admin/users/summary` → user counts by role
- `POST /admin/invite` → send teacher invite

---

## Backend Requirements (minimal additions)

The admin role requires these backend additions (keep changes minimal):

### New router: `routers/admin.py`
```python
# GET /admin/dashboard/summary → aggregate from existing analytics
# GET /admin/teachers → query users WHERE role='teacher' + join classes
# GET /admin/classes/{id} → same as teacher class detail
# GET /admin/settings → school-level settings
# PUT /admin/settings → update school settings
```

### Database
- Add `role='admin'` to existing `users` table enum
- Add `schools` table: `id, name, address, admin_user_id, settings_json`
- No new ML models or services needed — admin consumes existing analytics
