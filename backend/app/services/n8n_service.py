"""
n8n_service.py — Trigger n8n automation workflows via HTTP webhook.

n8n runs as a separate Docker container. FastAPI communicates with it
by posting JSON to webhook URLs. n8n then handles the email sending,
DB logging, and any other side effects — keeping that logic out of FastAPI.

Used by:
  - analytics router (Day 8): trigger focus_alert when distraction_streak >= 5min
  - recommender service (Day 7): trigger professional_referral when rule engine flags it
  - n8n cron handles: weekly_report_gen, homework_reminder (no FastAPI trigger needed)
"""
import httpx
from app.config import settings


async def trigger_n8n(workflow: str, payload: dict) -> bool:
    """
    POST a payload to an n8n webhook and return True if it succeeded.

    Args:
        workflow: webhook path suffix, e.g. "focus_alert", "professional_referral"
        payload: dict with the data n8n needs to process the workflow

    Returns:
        True if n8n responded with 2xx, False otherwise (never raises)

    Example:
        await trigger_n8n("focus_alert", {
            "student_id": "uuid-here",
            "teacher_id": "uuid-here",
            "focus_score": 0.18,
            "distraction_cause": "fatigue",
            "session_duration_min": 12,
        })
    """
    url = f"{settings.N8N_BASE_URL}/webhook/{workflow}"
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, timeout=5.0)
            return response.status_code < 300
    except Exception as e:
        # Never let n8n failures crash the main application
        print(f"[n8n] Failed to trigger '{workflow}': {e}")
        return False
