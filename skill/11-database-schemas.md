---
name: lumio-database-schemas
description: PostgreSQL tables, Redis keys, and Supabase storage structure. Read when querying data or creating new entity models.
---

# Database & Storage

## 1. PostgreSQL (via Supabase)

### Core User Data
```sql
users
  id (UUID PK)
  role (ENUM: 'student', 'teacher', 'parent', 'admin')
  full_name, email, hashed_password
  school_id (FK to schools)
  class_id (FK to classes, nullable)
  linked_student_id (FK to users, for parents)
  language_pref (ENUM: 'ar', 'fr', 'en')
  xp_points (INT)
  streak_days (INT)
  created_at (TIMESTAMP)

schools
  id (UUID PK)
  name, address
  admin_user_id (FK to users)
  settings_json (JSONB)
```

### Session & Analytics Data
```sql
classes
  id (UUID PK)
  teacher_id (FK to users)
  name (e.g., '3ème Sciences A')
  subject_id, schedule_info

sessions
  id (UUID PK)
  student_id (FK to users)
  subject_id (VARCHAR)
  started_at, ended_at
  duration_sec (INT)
  avg_focus_score (FLOAT)
  focus_variance (FLOAT)
  distraction_count (INT)

focus_events
  id (BIGSERIAL PK)
  session_id (FK to sessions)
  student_id (FK to users)
  ts (TIMESTAMP)
  gaze_score (FLOAT)
  blink_rate (INT)
  head_pose_deg (JSONB)
  focus_score (FLOAT)
  predicted_cause (VARCHAR)
  -- Index: (student_id, ts DESC)

adhd_risk_profiles
  id (UUID PK)
  student_id (FK to users)
  computed_at (TIMESTAMP)
  risk_score (FLOAT -- TEACHER ONLY)
  risk_tier (ENUM: 'low', 'moderate', 'needs_attention')
  top_signals (JSONB)
  suggested_actions (JSONB containing for_teacher, for_student, for_parent)
  professional_referral (BOOLEAN)
```

### Academic Data
```sql
homework
  id (UUID PK)
  teacher_id (FK to users)
  class_id (FK to classes)
  title, description
  due_date (TIMESTAMP)
  difficulty_level (INT 1-5)
  attachment_url (VARCHAR)

homework_submissions
  id (UUID PK)
  homework_id (FK to homework)
  student_id (FK to users)
  file_url (VARCHAR)
  submitted_at (TIMESTAMP)
  grade (FLOAT 0-20, nullable)
  status (ENUM: 'pending', 'submitted', 'graded')
```

## 2. Redis (Live State via Upstash)

Used strictly for ephemeral live data and pub/sub.

| Key | Value Pattern | TTL | Usage |
|---|---|---|---|
| `session:live:{student_id}` | `{focus_score: 0.85, streak: 0, session_id: "uuid"}` | 2 hours | Current student focus state tracking |
| `pubsub:class:{class_id}` | (Channel) | N/A | Broadcasts live focus updates to teacher dashboard |
| `ratelimit:{user_id}:{path}`| Integer counter | 60s | slowapi rate limiting |

## 3. Storage (Supabase)

Handles file uploads (no code stored here, just user files).

- **Bucket `homework-attachments`**: Teacher-uploaded PDFs/docs.
- **Bucket `homework-submissions`**: Student-uploaded assignment work.
