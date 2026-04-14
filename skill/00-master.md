---
name: lumio-master
description: Master skill for the LUMIO AI-powered ADHD learning platform. Loads all sub-skills. Triggers on any mention of Lumio, Unblur, focus tracker, CV module, distraction classifier, RAG engine, dashboard, parent interface, admin panel, or any component of the platform.
---

# LUMIO — Master Skill Index

> Read this file first. It bootstraps every sub-skill.

## Sub-skill files (read in order)

| File | Scope |
|---|---|
| `01-project-identity.md` | Product identity, team, event, timeline, problem statement, SDG alignment |
| `02-architecture.md` | Full system architecture, data flow, deploy topology |
| `03-design-system.md` | CSS tokens, typography, components, brand guidelines, design rules |
| `04-frontend-routing.md` | All routes, layouts, page inventory, role-based navigation |
| `05-student-interfaces.md` | Student session (with timer clock), dashboard, homework, classes, settings, AI chatbot |
| `06-teacher-interfaces.md` | Teacher dashboard (student table with hover/click), classes, homework, settings, AI chatbot |
| `07-parent-interfaces.md` | Parent dashboard, homework consultation, settings, AI chatbot |
| `08-admin-interfaces.md` | Admin dashboard (school stats), teacher/class table (hover/click), settings, AI chatbot |
| `09-ai-chatbot.md` | Floating LUMIO logo circle, AI assistant, per-role behavior |
| `10-backend-services.md` | FastAPI routers, services, ML pipeline, rule engine, RAG, n8n workflows |
| `11-database-schemas.md` | PostgreSQL tables, Redis keys, Supabase storage |
| `12-environment-deploy.md` | Env vars, Docker, Railway, Vercel, free tier resources |
| `13-core-rules.md` | Inviolable rules — privacy, ethics, language filters, referral overrides |

## How to use

1. When working on **any** part of LUMIO, read `00-master.md` first.
2. Then read the sub-skill(s) relevant to your task.
3. If you are unsure which sub-skill applies, read all of them — they are designed to be concise.
4. **Never contradict** anything in `13-core-rules.md`.

## Quick reference — four user roles

| Role | Landing | Post-login home | Sidebar items |
|---|---|---|---|
| **Student** | `/` → `/login?role=student` | `/student/dashboard` | Dashboard · Session · Classes · Homework · Settings |
| **Teacher** | `/` → `/login?role=teacher` | `/teacher/dashboard` | Dashboard · Classes · Homework · Settings |
| **Parent** | `/` → `/login?role=parent` | `/parent/dashboard` | Dashboard · Homework · Settings |
| **Admin** | `/signup` → institution admin | `/admin/dashboard` | Dashboard · Teachers · Settings |

## Reference projects (read-only — do NOT modify)

| Directory | Purpose |
|---|---|
| `frontend/student-uni-flow-main/` | UI reference for all interface patterns, components, and layouts (shadcn/ui + Tailwind) |
| `frontend/front-sources/` | Brand assets: logos, fonts, graphic chart, brand guidelines PDF |

> **Delete list:** All old `StudentDemo`, `TeacherDemo`, `QAChecklist`, `Pricing`, and `Signup` pages from `student-uni-flow-main` are reference-only. Do NOT port demo-specific pages to production.
