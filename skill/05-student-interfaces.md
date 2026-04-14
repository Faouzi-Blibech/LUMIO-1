---
name: lumio-student-interfaces
description: Layout and components for the student portal. Read when modifying student views.
---

# Student Interfaces

The student view focuses on providing learning metrics, interactive sessions, and clear task overviews inside a glassmorphic dashboard framework.

## Pages

1. **`StudentDashboard`** (`/student/dashboard`)
   - Overview of the student's metrics. Note that specific design specifics depend heavily on `student-uni-flow-main` implementation.
   
2. **`LiveSession`** (`/student/session`)
   - Interactive focus timer with a pulsing svg timer component that tracks studying score.
   - Includes full-screen distraction boundaries and a "focus score" calculation mechanism.
   - Uses `bg-pattern-blue` mapped back to the background visual aesthetic.

3. **`SessionSummary`** (`/student/session/:id/summary`)
   - The result panel showing earned XP, focus stability, and feedback from the session that just closed.
   
4. **`StudentAnalytics`** (`/student/analytics`)
   - AreaChart graph over 30 days of standard focus trends, identifying peaks in focus score.
   - Breaks down distraction types through a pie chart (e.g. Fatigue, Difficulty, Environment).
   - Frequency heatmap representing active learning instances in a multi-grid block.

5. **`StudentHomework`** (`/student/homework`)
   - Simple cards layout of upcoming, pending, or graded tasks showing subjects, due dates, and focus impact estimation.

## UI Components Used

- `StudentLayout.tsx`: Includes logo, routing elements matching the application logic, and right-side interactive panels (notification, XP counter, avatar).
- `KpiCard.tsx`: Reusable widget block bounding a specific metric with an upward or downward comparative trend indicator.
- `RiskBadge.tsx`: Visual tag representing `low`, `moderate`, or `needs-attention` student states.

*Note: All elements animate using framer-motion inside their respective layout rendering cycle.*
