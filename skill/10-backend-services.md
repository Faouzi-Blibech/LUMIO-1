---
name: lumio-backend-services
description: Backend logic covering FastAPI routers, background ML pipeline, deterministic rule engine, RAG system, and n8n workflows. Read when modifying the backend.
---

# Backend Services

## Core Components

The backend is entirely Python (FastAPI) and controls all ML, RAG, and core business logic.

## 1. FastAPI Routers

Located in `app/routers/`:

- `auth.py`: Login/registration, issues JWTs containing `role` claims (15-min TTL).
- `sessions.py`: 
  - `POST /sessions/start`: Creates session
  - `WebSocket /ws/session`: Receives MediaPipe `focus_score` (~1/sec), saves to Redis
  - `POST /sessions/end`: Ends session, triggers sync to PostgreSQL
- `analytics.py`: Role-specific GET endpoints for dashboards (student KPIs, teacher tables, admin school-wide stats).
- `rag.py`: Handling chatbot queries (`POST /rag/query`).
- `homework.py`: CRUD for assignments and student submissions.
- `admin.py` *(New)*: Endpoints for school-wide stats, teacher list queries, and admin settings.

## 2. ML Pipeline (Background processing ONLY)

All ML runs via background jobs (n8n cron) — **never** on live requests.

### XGBoost Distraction Classifier
- **Input:** Aggregated 60s focus metrics (`avg_focus`, `blink_rate`, `head_pose`, `time_of_day`)
- **Output:** Predicted cause (`fatigue`, `difficulty`, `environment`, `unknown`) + confidence
- **Files:** `models/distraction_clf.joblib`

### RF/MLP ADHD Risk Profiler
- **Input:** 30-day aggregate metrics
- **Output:** `risk_score` (0-1), `risk_tier` (`low`, `moderate`, `needs_attention`), SHAP signals
- **Files:** `models/risk_profiler.joblib`

## 3. Rule Engine (`app/services/rule_engine.py`)

Deterministic logic dictating interventions. **ALWAYS overrides LLM predictions.**

Priority list (1 = highest):
1. `streak > 7d` + `risk > 0.75` → `PERSISTENT_ADHD_RISK` *(Referral = True)*
2. `session > 90min` + `risk > 0.5` + `cause=fatigue` → `SUSTAINED_FATIGUE` *(Referral = False)*
3. `hw_grade < 8` + `cause=difficulty` → `SUBJECT_DIFFICULTY` *(Referral = False)*
4. `risk < 0.5` + `cause=fatigue` → `SIMPLE_FATIGUE` *(Referral = False)*

## 4. Recommender & RAG Engine

Pipeline triggered upon risk profile creation:
```
Rule Engine Archetype → FAISS Search (top-4 chunks) → LangChain + Llama (Prompt Generation)
→ 4-step Validation → DB Store
```

### RAG Guidelines (`app/services/rag_service.py`)
- **Stack:** FAISS (in-memory) + `all-MiniLM-L6-v2` + LangChain + **Llama**
- **LLM Requirements:** Only use OpenAI-compat wrapper (`ChatOpenAI`) pointing to local/hosted Llama URL.
- **NO ANTHROPIC:** Never import `langchain_anthropic` or use Claude.

### 4-Step Validation Pipeline (Crucial)
1. **Pydantic Schema:** Validates JSON output structure.
2. **Grounding Check:** Jaccard similarity ensuring LLM output mentions FAISS source keywords.
3. **Diagnosis Regex Filter:** Rejects outputs containing `ADHD|disorder|diagnosis|condition|autism`.
4. **Referral Override:** Hardcodes `professional_referral` boolean based purely on Rule Engine, replacing LLM output.

## 5. n8n Automation Workflows

HTTP webhooks bridging backend logic with external services (email).

| Workflow | Trigger | Action |
|---|---|---|
| `focus_alert` | Streak ≥ 5min distraction | Email teacher (and parent if opted-in) |
| `weekly_report` | Cron (Sunday) | Llama summary → HTML email to parent |
| `referral` | Rule Engine Referral = True | Email teacher ONLY (14-day dedup, no "ADHD" in subject) |
| `homework` | Cron (Daily) | Reminder email to students |
