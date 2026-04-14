# LUMIO — Feature Overview & User Expectations

## What is LUMIO?

LUMIO is an **AI-powered ADHD early detection and learning support platform** designed for Tunisian school children. It connects students, teachers, and parents in a unified real-time ecosystem to identify attention patterns and deliver personalized learning interventions.

**Built for:** IEEE CODE2CURE SIGHT Day Congress 4.0  
**Date:** April 2026 | **Version:** 1.0

---

## Core Value Proposition

- **Real-time focus monitoring** via computer vision - no video transmitted (privacy-first)
- **Intelligent distraction analysis** - understand _why_ students lose focus, not just _if_
- **Role-based AI recommendations** - tailored guidance for teachers, parents, and students
- **Professional referral detection** - flags when specialist consultation may be needed
- **Homework struggle tracking** - automatic detection of academic difficulties

---

## What Users Will Find

### 🎓 **For Students**

| Feature                    | What It Does                                                      | User Expectation                                  |
| -------------------------- | ----------------------------------------------------------------- | ------------------------------------------------- |
| **Live Focus Tracking**    | Browser-based eye tracking during study sessions                  | See real-time focus score (0–100%) while studying |
| **Session Analytics**      | Automatic session end, focus stats computed                       | Understand how focused they stayed per session    |
| **Self-Help Tips**         | AI-generated study strategies personalized to their focus pattern | Receive actionable study tips in plain language   |
| **Homework Submissions**   | Submit assignments directly in the platform                       | Easy file upload + receive grades from teachers   |
| **Progress Visualization** | Charts showing focus trends over time                             | Track improvement in focus and engagement         |
| **Gamification (XP)**      | Earn points for consistent study sessions                         | Motivation through achievement badges             |

---

### 👨‍🏫 **For Teachers**

| Feature                           | What It Does                                                         | User Expectation                                       |
| --------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------ |
| **Live Class Dashboard**          | Real-time focus bars for each student in the class                   | Monitor the whole class's attention instantly          |
| **Focus Analytics**               | 30-day focus trends + distraction cause breakdown                    | Identify struggling students at a glance               |
| **AI Risk Assessment**            | Automatic student risk scoring (low/moderate/needs attention)        | Prioritize students who need intervention              |
| **Distraction Insights**          | ML classification: fatigue vs. difficulty vs. environment            | Understand _why_ students are distracted (data-driven) |
| **Homework Assignment & Grading** | Create assignments, view submissions, grade with auto-struggle flags | Unified homework management                            |
| **Professional Referral Alerts**  | System flags when a student needs specialist evaluation              | Informed conversations with parents & counselors       |
| **Personalized Recommendations**  | AI-generated classroom strategies + observation tips                 | Evidence-based intervention ideas                      |
| **Email Alerts**                  | High-risk alerts + weekly summary reports                            | Stay informed without constant platform checking       |

---

### 👨‍👩‍👧 **For Parents**

| Feature                         | What It Does                                               | User Expectation                                     |
| ------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| **Child's Focus Overview**      | Risk tier (low/moderate/needs attention) + focus trends    | Simple, non-technical summary of their child's focus |
| **Home Support Suggestions**    | AI-generated, age-appropriate advice for home support      | Actionable steps to help their child at home         |
| **Homework Notifications**      | Alerts when struggles are detected + grades                | Know immediately if their child is struggling        |
| **NO Raw Risk Scores**          | Parents see risk tier, never the 0–1 technical score       | Avoid unnecessary anxiety from raw metrics           |
| **Professional Referral Alert** | Clear guidance when specialist consultation is recommended | Informed next steps without overwhelming data        |

---

## Technical Features (Transparent to Users)

### Real-Time Data Pipeline

**Stage 1 – Browser-Side CV**

- MediaPipe FaceMesh runs in the browser (JavaScript)
- Computes focus_score from gaze tracking, blink rate, head pose
- **Zero privacy risk:** No video, images, or biometric data leaves the browser

**Stage 2 – Real-Time Ingestion**

- Focus scores arrive at backend every 1 second via WebSocket
- Instant Redis cache + class-level pub/sub broadcast
- Teachers see live updates on their dashboard with <1 second latency

**Stage 3 – Intelligent ML Classification**

- **XGBoost distraction classifier** categorizes _why_ focus dropped
  - Fatigue (student is tired or session too long)
  - Difficulty (content is too hard)
  - Environment (external noise/movement)
  - Unknown (monitor, needs teacher observation)

**Stage 4 – Risk Profiling** (Nightly)

- RandomForest scores student risk on a 0–1 scale
- Aggregates 30-day focus data + homework grades + focus streaks
- Outputs risk tier: Low / Moderate / Needs Attention
- Detects persistent patterns (Rule 1: >7-day streak + risk >0.75 = professional referral)

**Stage 5 – AI-Powered Recommendations**

- Rule engine maps (distraction cause + risk score) to an archetype
- FAISS vector search retrieves relevant clinical/educational PDF chunks
- Groq LLM generates role-specific suggestions with safety rails
- Multiple safety checks prevent AI from using diagnosis language

---

## Key Safety & Ethical Features

✅ **Privacy-First**

- No video/image transmission (browser-side CV only)
- JWT tokens in httpOnly cookies (XSS-resistant)
- Role-based data filtering (parents never see raw risk_score)

✅ **AI Safety Rails**

- Hardcoded blacklist: ADHD, disorder, diagnosis, condition, autism (forbidden)
- Two-strike retry: LLM gets one more chance with stricter prompt
- Static fallback: if LLM fails twice, safe pre-written response delivered
- Rule engine supremacy: deterministic logic always overrides AI on professional referrals

✅ **Support, Not Diagnosis**

- LUMIO identifies attention patterns, never claims to diagnose ADHD
- Professional referral only when persistent difficulties detected
- Teachers make final intervention decisions (teacher-in-the-loop)

---

## User Workflows at a Glance

### **Student Study Session**

1. Student clicks "Start Session"
2. Browser requests camera permission → MediaPipe begins tracking
3. Student studies; focus score updates live on their screen
4. System captures gaze, blink, head movements every 1 second
5. Session ends; analytics computed automatically
6. Student sees: avg focus, focus variance, how long they stayed focused
7. AI suggests self-help tips based on their patterns

### **Teacher Class Monitoring**

1. Teacher opens class dashboard
2. Sees live focus bars for all students in the class
3. Clicks on a student → sees detailed 30-day analytics
4. System shows: distraction causes, risk tier, top signals (SHAP)
5. Teacher receives email if a student's risk crosses threshold
6. Teacher reads AI-generated strategies + creates homework assignment
7. When student submits low-grade homework → system auto-flags struggle

### **Parent Daily Check-In**

1. Parent logs in, sees child's risk tier at a glance
2. No raw numbers, just clear risk category (Low / Moderate / Needs Attention)
3. Views home support tips tailored to child's latest patterns
4. Receives email when: (a) homework grade is low, (b) professional referral recommended
5. Can contact teacher with links to relevant insights

---

## What to Expect in the Final Product

### Dashboard Screens

- **Student Dashboard:** Session history, focus trends chart, current XP points, AI tips
- **Teacher Dashboard:** Live class focus grid, individual student profiles, homework assignment interface, risk alerts
- **Parent Dashboard:** Child's performance summary, support suggestions, homework updates

### Integrations

- **n8n Email Alerts:** Struggle-detected alerts, high-risk notifications, weekly summaries (all via Gmail OAuth)
- **Real-Time WebSocket:** <1 second latency for teacher dashboard updates
- **Batch Processing:** Events persisted to PostgreSQL every 60 seconds (not per-second to avoid database overload)

### Mobile & Accessibility

- **Web-only platform** (React + Tailwind)
- Responsive design for tablets + laptops
- No native mobile app; browser-based only
- Design tokens: warm off-white (#f5f4f0), burnt orange accents (#ff5c00), accessible typography

### Performance

- **CV Module:** ~5ms inference per batch (XGBoost classification)
- **LLM Inference:** ~2–3 seconds per suggestion (Groq llama3-70b-8192)
- **Real-Time Dashboard:** Sub-second latency via Redis pub/sub
- **Database Queries:** Optimized for 30-day rolling windows (indexed on student_id, timestamp)

---

## Roles & Permissions Summary

| Action                | Student | Teacher           | Parent             |
| --------------------- | ------- | ----------------- | ------------------ |
| View own profile      | ✅      | ✅ (all students) | ✅ (own child)     |
| Start/end session     | ✅      | —                 | —                  |
| Create homework       | —       | ✅                | —                  |
| Grade homework        | —       | ✅                | —                  |
| Submit homework       | ✅      | —                 | —                  |
| View own analytics    | ✅      | —                 | —                  |
| View class analytics  | —       | ✅                | —                  |
| View risk_score (raw) | ❌      | ✅                | ❌ (see tier only) |
| Receive alerts        | ✅      | ✅                | ✅                 |
| AI recommendations    | ✅      | ✅                | ✅ (role-specific) |

---

## Data Everything Powers

- **Focus Events:** 1 per second per student (high-frequency telemetry for live dashboards)
- **Sessions:** Start/end timestamps, aggregate focus stats, distraction count
- **Homework Submissions:** File URL, grade (0–20), struggle flag auto-set when grade < 8
- **Risk Profiles:** Risk score (0–1), tier, SHAP feature importances, role-specific suggestions, professional referral flag

---

## Getting Started: Minimum Viable Experience

**Day 1 — Student Perspective:**

- Register → Login → Start a 5-minute study session → See focus score update in real time → Session ends → View stats

**Day 1 — Teacher Perspective:**

- Register → Create a class → Add students → View live focus dashboard → See a student's 30-day profile → Send AI-recommended tips via email

**Day 1 — Parent Perspective:**

- Register (link to child) → View child's risk tier → Read home support tips → Set language preference

---

## Summary

LUMIO delivers **intelligent, privacy-first, real-time attention monitoring** for schools. It turns raw focus data into actionable insights via an AI pipeline that respects student dignity, supports teachers' decision-making, and keeps parents informed—all while maintaining the highest standards of data privacy and ethical AI use.

**The final product is a complete, production-ready platform** with real-time dashboards, ML-driven recommendations, email notifications, and a seamless experience across student, teacher, and parent interfaces.

---

**Contact & Support:** IEEE CODE2CURE SIGHT Day Congress 4.0  
**License:** Confidential — Educational Use Only
