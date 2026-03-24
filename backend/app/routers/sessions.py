"""
sessions.py — Study session and real-time focus streaming router.

Manages the lifecycle of a study session (start → stream focus data → end)
and the WebSocket connections that carry live focus scores between
students and the teacher dashboard via Redis pub/sub.

TODO Day 3:
  POST /start                — create session row in DB, return session_id
  POST /end                  — update session: set ended_at, avg_focus_score, duration_sec
  GET  /                     — list sessions for authenticated student
  WS   /ws/focus/{student_id} — WebSocket: receive focus JSON, write to Redis, publish pubsub
  WS   /ws/class/{class_id}   — WebSocket: subscribe Redis pubsub, forward to teacher clients
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/ping")
async def ping():
    return {"message": "sessions router working"}
