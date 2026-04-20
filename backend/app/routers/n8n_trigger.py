"""
n8n_trigger.py — Manual trigger endpoint to fire all 3 n8n alert workflows.

POST /n8n/trigger-all  → fires struggle_detected, high_risk, and weekly_summary
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from datetime import datetime, timedelta, timezone

from app.database import get_db, User, FocusEvent, Session as StudySession
from app.routers.auth import get_current_user
from app.services.alerts import fire_alert

router = APIRouter()


@router.post("/trigger-all", summary="Fire all 3 n8n workflows for demo/testing")
async def trigger_all_alerts(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role != "teacher":
        raise HTTPException(status_code=403, detail="Only teachers can trigger alerts")

    parent_result = await db.execute(
        select(User).where(
            User.role == "parent",
            User.linked_student_id.isnot(None),
        ).limit(1)
    )
    parent = parent_result.scalar_one_or_none()

    if parent and parent.linked_student_id:
        student_result = await db.execute(
            select(User).where(User.id == parent.linked_student_id)
        )
        student = student_result.scalar_one_or_none()
    else:
        student_result = await db.execute(
            select(User).where(User.role == "student").limit(1)
        )
        student = student_result.scalar_one_or_none()

    if not student:
        raise HTTPException(status_code=404, detail="No student found in DB")

    teacher_email = current_user.email or "unblur.lumio@gmail.com"
    parent_email = parent.email if parent else teacher_email
    student_name = student.full_name

    results = {}

    # 1. Struggle detected
    await fire_alert("struggle_detected", {
        "student_name": student_name,
        "homework_title": "Maths — Algebra Chapter 3",
        "subject": "Mathematics",
        "parent_email": parent_email,
        "teacher_email": teacher_email,
    })
    results["struggle_detected"] = "fired"

    # 2. High risk
    await fire_alert("high_risk", {
        "student_name": student_name,
        "student_id": str(student.id),
        "risk_level": "high",
        "risk_score": 0.82,
        "parent_email": parent_email,
        "teacher_email": teacher_email,
    })
    results["high_risk"] = "fired"

    # 3. Weekly summary
    session_count_result = await db.execute(
        select(func.count(StudySession.id)).where(
            StudySession.student_id == student.id
        )
    )
    session_count = session_count_result.scalar() or 0

    focus_result = await db.execute(
        select(func.avg(FocusEvent.focus_score)).where(
            FocusEvent.student_id == student.id
        )
    )
    avg_focus = focus_result.scalar()

    await fire_alert("weekly_summary", {
        "student_name": student_name,
        "student_id": str(student.id),
        "week_start": (datetime.now(timezone.utc) - timedelta(days=7)).strftime("%Y-%m-%d"),
        "week_end": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "total_sessions": session_count,
        "avg_focus_score": round(avg_focus, 2) if avg_focus else 0.45,
        "top_distraction": "fatigue",
        "improvement_trend": "+5%",
        "parent_email": parent_email,
        "teacher_email": teacher_email,
    })
    results["weekly_summary"] = "fired"

    return {
        "status": "all 3 alerts fired",
        "student": student_name,
        "teacher_email": teacher_email,
        "parent_email": parent_email,
        "results": results,
    }
