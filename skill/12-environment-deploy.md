---
name: lumio-environment-deploy
description: Environment variables, Docker configuration, and free tier resources used for deployment. Read when deploying or setting up the dev environment.
---

# Environment & Deployment

## Environment Variables

Require these variables in the `.env` file (local) and deployment platforms.

```bash
# ── LLM (Llama) ──────────────────────────────────────────────
LLAMA_BASE_URL=http://localhost:11434/v1   # Local Ollama or Hosted URL
LLAMA_MODEL=llama3.1:8b                   # Meta Llama model version
LLAMA_API_KEY=ollama                       # "ollama" for local; real key for hosted

# ── Database ─────────────────────────────────────────────────
DATABASE_URL=postgresql://...             # Supabase connection string
REDIS_URL=redis://...                     # Upstash Redis URL

# ── Services ─────────────────────────────────────────────────
N8N_BASE_URL=http://n8n:5678              # n8n webhook listener base URL
SENDGRID_API_KEY=                         # SendGrid API key for emails
JWT_SECRET_KEY=                           # 32+ char random string
SUPABASE_URL=                             # Supabase project URL
SUPABASE_ANON_KEY=                        # Supabase anon key
```

## Local Setup (`docker-compose.yml`)

The local setup uses Docker Compose to run all backing services.
The frontend is run locally via `npm run dev`.

```yaml
version: '3.8'
services:
  fastapi:
    build: ./backend
    ports: ["8000:8000"]
    depends_on: [postgres, redis]
    env_file: .env

  ollama:
    image: ollama/ollama
    ports: ["11434:11434"]
    volumes: ["ollama_data:/root/.ollama"]

  n8n:
    image: n8nio/n8n
    ports: ["5678:5678"]
    environment:
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=lumio_dev
    ports: ["5432:5432"]

  redis:
    image: redis:7
    ports: ["6379:6379"]

volumes:
  ollama_data:
```

## Production Architecture (Free/Low-Cost Tiers)

| Service | Platform | Tier/Cost | Notes |
|---|---|---|---|
| Frontend | Vercel | Free | Connects to GitHub repo for auto-deploy. |
| Backend (FastAPI) | Railway | $5/mo credit | Docker container deployment. Mount FAISS index volume. |
| LLM (Llama) | Together AI / Groq | Free credits | Blazing fast hosted inference API using OpenAI format. |
| DB (PostgreSQL) | Supabase | Free (500MB) | Also provides storage buckets for homework files. |
| Redis | Upstash | Free (10k/day) | Perfect for serverless environments. |
| Automation (n8n) | Railway | (Shares credit) | Separate container on Railway. |
| Emails | SendGrid | Free (100/day) | Connected via n8n nodes. |

## Deployment Checklist
1. Export `.env` variables to Vercel and Railway.
2. Ensure Vercel connects frontend to `https://<railway-domain>.up.railway.app` (FastAPI).
3. Ensure FastAPI connects to Together AI/Groq (don't try to run Ollama on Railway).
4. Run DB migrations on Supabase.
5. Create Supabase buckets (`homework-attachments`, `homework-submissions`) and set public access policies.
6. Import n8n workflow JSONs.
