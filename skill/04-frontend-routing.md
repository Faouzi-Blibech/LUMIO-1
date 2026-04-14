---
name: lumio-frontend-routing
description: All routes, layouts, page inventory, and role-based navigation. Read when adding pages, modifying routing, or working on navigation.
---

# Frontend Routing & Navigation

## Route Map

The application routing exactly matches the configuration in `student-uni-flow-main/src/App.tsx`.

### Public Routes

| Path | Page | Description |
|---|---|---|
| `/` | `Index` | Landing page |
| `/login` | `Login` | Login form |
| `/signup` | `Signup` | Registration form |
| `/dashboard` | `Dashboard` | Generic dashboard selector |
| `/pricing` | `Pricing` | Pricing information |

### Student Routes (`/student/*`)

| Path | Page | Description |
|---|---|---|
| `/student/dashboard` | `StudentDashboard` | Main student overview |
| `/student/session` | `LiveSession` | Focus timer session page |
| `/student/session/:id/summary` | `SessionSummary` | Post-session recap |
| `/student/analytics` | `StudentAnalytics` | Focus trend and stats |
| `/student/homework` | `StudentHomework` | Tasks and assignments |

### Teacher Routes (`/teacher/*`)

| Path | Page | Description |
|---|---|---|
| `/teacher/dashboard` | `TeacherDashboard` | Main teacher overview |
| `/teacher/live` | `LiveClass` | Live monitoring of students |
| `/teacher/students` | `TeacherStudents` | Class roster and at-risk students |
| `/teacher/students/:id` | `StudentDetail` | Deep link to student performance |
| `/teacher/homework` | `TeacherHomework` | Assignment management |

### Phase 2 Routes (Parent / Admin)

**Note:** Parent and Admin routes are not present in the current `student-uni-flow-main` implementation and have been postponed.

## Layout Structure

Each role has a dedicated layout component wrapping all its pages:

```
StudentLayout  → Top nav bar with: Logo · Dashboard · Session · Analytics · Homework · XP badge · Notifications · Avatar
TeacherLayout  → Top nav bar with: Logo · [Teacher badge] · Dashboard · Live Class · Students · Homework · Notifications · Avatar
```

### Layout Features
- Sticky top bar with `bg-card/80 backdrop-blur-lg`
- Active nav item highlighting
- Role-specific actions
- Unique User interface navigation styling.

## Navigation System

The navigation uses standard `react-router-dom` `<BrowserRouter>` with `<Routes>` and `<Route>`.

```tsx
<BrowserRouter>
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    <Route path="/student/dashboard" element={<StudentDashboard />} />
    {/* ... */}
  </Routes>
</BrowserRouter>
```
