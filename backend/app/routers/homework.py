"""
homework.py — Homework assignment and submission router.

Teachers create assignments, students submit answers, teachers grade them.
When a grade < 8 (out of 20), the struggle_flag is automatically set —
this feeds into the ADHD risk profiler as a signal.

TODO Day 8:
  POST  /                     — teacher creates homework assignment
  GET   /{class_id}           — list assignments for a class
  POST  /{id}/submit          — student submits text answer
  PATCH /submissions/{id}/grade — teacher grades, auto-sets struggle_flag if grade < 8
  GET   /{id}/submissions     — teacher views all submissions for an assignment
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/ping")
async def ping():
    return {"message": "homework router working"}
