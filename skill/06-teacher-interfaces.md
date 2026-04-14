---
name: lumio-teacher-interfaces
description: Layout and components for the teacher portal. Read when modifying teacher views.
---

# Teacher Interfaces

The teacher interface prioritizes quick discovery of struggling students, bulk management of assignments, and real-time monitoring of live classes.

## Pages

1. **`TeacherDashboard`** (`/teacher/dashboard`)
   - Central overview with aggregate statistics on the teacher's classes.
   - Summarizes overall class focus, pending assignments, and quick links.

2. **`LiveClass`** (`/teacher/live`)
   - Represents a monitoring hub for an actively engaged session.
   - Real-time display mapping out student focus statuses simultaneously across the whole roster.

3. **`TeacherStudents`** (`/teacher/students`)
   - Complete grid or tabular view of the entire student roster.
   - Facilitates sorting, filtering, and identification of critical risk scenarios.

4. **`StudentDetail`** (`/teacher/students/:id`)
   - Deep dive into an individual's historical metrics, session performance, and qualitative focus drops over time.

5. **`TeacherHomework`** (`/teacher/homework`)
   - Interface for distributing assignments and observing completion rates or focus correlations across active tasks.

## UI Components Used

- `TeacherLayout.tsx`: Wraps all routes in a clean top-nav framework with a specific "Teacher" role indicator badge next to the logo.
- Charts utilizing `recharts` to expose class-wide trends.

*Note: The interface utilizes `shadcn` components to generate robust tables and modular cards.*
