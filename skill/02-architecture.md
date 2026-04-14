---
name: lumio-architecture
description: Full system architecture, data flow, deploy topology. Read when implementing any backend service, API route, or infrastructure change.
---

# System Architecture

## Layer Map

```
LAYER 1 — FRONTEND      React + TypeScript + Tailwind CSS (web only — no React Native)
                        MediaPipe FaceMesh CDN (CV, browser-only, zero video transmitted)
                        Native WebSocket, react-i18next (AR / FR / EN)

LAYER 2 — API GATEWAY   FastAPI + JWT (15-min tokens) + slowapi rate limiting
                        CORS + native Starlette WebSocket

LAYER 3 — BACKEND       Session Analytics : XGBoost + RF/MLP + Rule Engine + Recommender
                        RAG Engine        : FAISS + LangChain + Llama (LLM)
                        Automation        : n8n (4 HTTP-webhook workflows)

LAYER 4 — DATA          PostgreSQL via Supabase (relational)
                        Redis via Upstash (live state + pub/sub)
                        FAISS in-memory (vector index)
                        Supabase Storage (files)

LAYER 5 — DEPLOY        Docker + Railway (backend + n8n)
                        Vercel (frontend)
```

## Critical Design Rules

- **CV runs browser-side only** — MediaPipe processes and discards every frame locally. Zero video transmitted. Only numerical `focus_score` JSON (~40 bytes/sec) sent to server.
- **All other AI runs server-side** — XGBoost, RF/MLP, Rule Engine, FAISS, LangChain, Llama API calls — all Python backend.
- **Data layer = storage only** — FAISS loaded into RAG service memory at startup. PostgreSQL/Redis never run inference.
- **LLM is Llama** — Never use `langchain-anthropic`, `anthropic`, or Claude anywhere in the codebase.

## Data Flow (step by step)

```
[01] Student navigates to homepage → clicks role button → goes to /login?role=student
[02] Login completes → JWT issued → redirected to /student/dashboard
[03] Student opens Session page → sets timer duration → starts session
[04] React loads MediaPipe via CDN; webcam access requested
[05] MediaPipe reads webcam → gaze_x, gaze_y, blink_rate, head_pose_deg → frame discarded
[06] focus_score = 0.4*gaze + 0.3*(1-blink_norm) + 0.3*(1-pose_norm)
[07] focus_score JSON sent via WebSocket ~1/sec
[08] FastAPI: SET Redis session:live:{student_id} = payload (TTL 7200s)
[09] FastAPI: PUBLISH to Redis pubsub:class:{class_id}
[10] Teacher dashboard: SUBSCRIBE pubsub:class:{class_id} → receives update ~1ms
[11] Every 60s: batch INSERT 60 rows into focus_events (PostgreSQL)
[12] XGBoost classifier: labels cause (fatigue / difficulty / environment / unknown)
[13] IF distraction_streak >= 5min → POST to n8n /webhook/focus_alert
[14] n8n: teacher email (SendGrid) → parent email if opted in → log notification
[15] Nightly (n8n cron): RF+MLP batch runs on 30-day aggregates → writes adhd_risk_profiles
[16] Rule engine: (cause + risk_score) → archetype → FAISS top-4 → LangChain → Llama
[17] Pydantic validation + grounding check + diagnosis filter → store → dispatch
```

## File Structure

```
backend/
  app/
    main.py
    config.py               # pydantic settings — LLAMA_BASE_URL, LLAMA_MODEL, LLAMA_API_KEY
    database.py             # async SQLAlchemy
    routers/
      auth.py               # login, register, JWT
      sessions.py           # start/end session, WebSocket, focus events
      analytics.py          # student analytics, risk profiles
      rag.py                # chatbot queries
      homework.py           # CRUD homework + submissions
    services/
      rule_engine.py        # deterministic — no ML
      recommender.py        # rule → FAISS → Llama → DB
      rag_service.py        # FAISS + LangChain + Llama
      n8n_service.py        # trigger_n8n() helper
      redis_service.py      # Redis pub/sub + live state
    models/
      distraction_clf.joblib
      risk_profiler.joblib
    schemas/
      user.py               # User create/read schemas
      session.py            # Session create/read/focus-event schemas
      analytics.py          # Analytics response schemas
      rag.py                # Chatbot request/response
  scripts/
    generate_training_data.py
    train_classifier.py
    train_profiler.py
    ingest_kb.py
    seed_demo.py
  tests/

frontend/
  src/
    App.tsx                  # Main router with all role-based routes
    main.tsx                 # Entry point
    index.css                # Global CSS + design tokens
    pages/
      HomePage.tsx           # Landing page
      LoginPage.tsx          # reads ?role= from URL
      RegisterPage.tsx       # registration form
      student/               # All student pages
      teacher/               # All teacher pages
      parent/                # All parent pages
      admin/                 # All admin pages (NEW)
    components/
      CVModule.tsx           # MediaPipe wrapper + canvas overlay
      FocusBar.tsx           # Real-time focus bar
      ChatInterface.tsx      # Chat UI for RAG assistant
      ProtectedRoute.tsx     # Role-based route guard
      LumioAIButton.tsx      # Floating AI assistant circle (NEW)
    layouts/
      StudentLayout.tsx      # Student sidebar + nav
      TeacherLayout.tsx      # Teacher sidebar + nav
      ParentLayout.tsx       # Parent sidebar + nav
      AdminLayout.tsx        # Admin sidebar + nav (NEW)
    context/
      AuthContext.tsx         # Auth state + JWT management
    hooks/
      useAuth.ts
      useFocusStream.ts      # WebSocket → focus_score state
    types/
      index.ts               # Shared TypeScript types
```
