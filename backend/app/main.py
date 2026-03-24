"""
main.py — FastAPI application entry point.
This file wires everything together: middleware, routers, startup events.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import init_db
from app.routers import auth, sessions, analytics, rag, homework


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager handles startup and shutdown.
    On startup: create all DB tables if they don't exist yet.
    """
    print("Lumio API starting up...")
    await init_db()
    print("Database ready.")
    yield
    print("Lumio API shutting down.")


app = FastAPI(
    title="Lumio API",
    description="AI-powered ADHD early detection — IEEE CODE2CURE 2026",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router,      prefix="/auth",      tags=["auth"])
app.include_router(sessions.router,  prefix="/sessions",  tags=["sessions"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(rag.router,       prefix="/rag",       tags=["rag"])
app.include_router(homework.router,  prefix="/homework",  tags=["homework"])


@app.get("/", tags=["health"])
async def health_check():
    return {
        "status": "ok",
        "service": "Lumio API",
        "version": "0.1.0",
    }
