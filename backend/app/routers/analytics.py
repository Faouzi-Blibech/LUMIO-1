"""
analytics.py — ML analytics and focus event querying router.

Provides the XGBoost distraction classifier endpoint and paginated
access to historical focus event data for dashboards and reports.

TODO Day 4:
  POST /classify      — input list of focus_events → XGBoost → return {cause, confidence}
  GET  /focus-events   — paginated list of focus_events for a student
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/ping")
async def ping():
    return {"message": "analytics router working"}
