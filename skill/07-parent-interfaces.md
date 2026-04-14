---
name: lumio-parent-interfaces
description: Parent dashboard, homework consultation view, settings, and AI chatbot. Read when building or modifying any parent-facing page.
---

# Parent Interfaces

## Overview

The parent experience provides visibility into their child's academic progress, homework status, and AI-powered support suggestions — without exposing raw risk scores or clinical data.

**Sidebar navigation:** Dashboard · Homework · Settings

**Privacy constraint:** Parent API endpoints NEVER return `risk_score` or `risk_tier`. Only `for_parent` suggestions are shown.

---

## 1. Parent Dashboard (`/parent/dashboard`)

### Layout
```
Header: "Welcome back, {parent_name}" + child name badge

Child Summary Card:
  ┌──────────────────────────────────────────┐
  │  👤 {child_name}                          │
  │  Class: 3ème Sciences A                   │
  │  Teacher: Ms. Trabelsi                    │
  │  Last session: 2 hours ago                │
  └──────────────────────────────────────────┘

KPI row (3 cards):
  - Avg Focus (7 days) — border-l-primary
  - Study Time this week — border-l-secondary
  - Homework Completion Rate — border-l-success

Focus Trend Chart:
  - AreaChart showing child's focus over last 7/30 days
  - Range selector pills (7d / 30d)
  - No risk tier shown — only focus percentage

Session History:
  - Recent sessions list (subject, date, duration, focus %)
  - Similar to student's recent sessions view

AI Parent Tips panel:
  ┌──────────────────────────────────────────┐
  │ 🧠 Home Support Suggestions              │
  │ ──────────────────────────────────────── │
  │ • Maintain a consistent evening routine   │
  │ • Limit screen time 1 hour before bed     │
  │ • Encourage 5-min movement breaks         │
  │ • Praise effort over results              │
  └──────────────────────────────────────────┘
  - Tips are from `for_parent` field in RAG suggestions
  - Grounded in clinical notes (screen time, sleep, diet)
  - Never contains risk scores or diagnostic language
```

### Data sources
- `GET /analytics/parent/{parent_id}/child-summary` → child info + KPIs
- `GET /analytics/student/{student_id}/focus-trend?range=7d` → chart data (filtered for parent)
- `GET /sessions/recent/{student_id}` → session history
- `GET /rag/parent-tips/{student_id}` → `for_parent` suggestions only

---

## 2. Parent Homework Consultation (`/parent/homework`)

### Layout
```
Header: "Homework" + "{child_name}'s assignments"

Assignment list:
  Each row: icon + title + subject + due date + status + grade (if graded)

Status badges:
  - pending: "Pending" — Clock, warning
  - submitted: "Submitted" — CheckCircle, secondary
  - graded: "Graded" — CheckCircle, success + grade %
  - overdue: "Overdue" — AlertCircle, destructive

Filter tabs: All / Pending / Submitted / Graded

NOTE: Parents can VIEW homework status but CANNOT submit work.
```

### Features
- Read-only view of child's homework assignments
- Status and grade visibility
- Due date tracking with overdue highlighting
- Subject-based filtering
- No submission/upload capability (student-only action)

### Data source
- `GET /homework/student/{student_id}` → same endpoint as student, but read-only display

---

## 3. Parent Settings (`/parent/settings`) — NEW PAGE

### Layout
```
Header: "Settings"
Sections:
  Profile: name, email, linked child
  Notifications:
    - Session alerts (when child's focus drops significantly) — toggle
    - Weekly progress report emails — toggle
    - Homework deadline reminders — toggle
  Communication:
    - Teacher messaging preferences
    - Preferred contact method (email / in-app)
  Privacy:
    - Data sharing consent
    - If child is 14–15: note that child controls access visibility
  Language:
    - AR / FR / EN selector
  Account:
    - Change password
    - Logout
```

### Data source
- `GET /users/{id}/settings` → current settings
- `PUT /users/{id}/settings` → update settings

---

## Privacy Rules (enforced in all parent views)

1. **No `risk_score` display** — parent sees focus percentages and trends, never raw risk scores
2. **No `risk_tier` display** — no "needs attention" / "moderate" badges shown to parents
3. **No diagnostic language** — all text is positive, supportive, and action-oriented
4. **`for_parent` only** — RAG suggestions show only the parent-appropriate tips
5. **Ages 14–15** — child can toggle parent dashboard visibility in their settings
6. **No submission capability** — homework view is read-only (view status/grades only)
