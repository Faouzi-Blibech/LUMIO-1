"""
test_rule_engine.py — Unit tests for the deterministic rule engine.

All 7 branches must be covered. Run with:
  pytest tests/test_rule_engine.py -v

Why test every branch?
  The rule engine makes the professional_referral decision — a flag that
  triggers a clinical alert for a child. A bug here has real-world consequences.
  Every branch is tested independently so any regression is caught immediately.
"""
import pytest
from app.services.rule_engine import classify_archetype


# ── Rule 1 ────────────────────────────────────────────────────────────────────

def test_rule1_persistent_adhd_risk():
    """High risk + many streak days → PERSISTENT_ADHD_RISK with referral."""
    result = classify_archetype(cause="fatigue", risk_score=0.8, streak_days=10)
    assert result.archetype == "PERSISTENT_ADHD_RISK"
    assert result.professional_referral == True
    assert result.urgency == "high"


def test_rule1_triggers_for_any_cause():
    """Rule 1 is cause-agnostic — triggers for 'unknown' too if risk+streak are high."""
    result = classify_archetype(cause="unknown", risk_score=0.9, streak_days=8)
    assert result.archetype == "PERSISTENT_ADHD_RISK"
    assert result.professional_referral == True


# ── Rule 2 ────────────────────────────────────────────────────────────────────

def test_rule2_sustained_fatigue():
    """Fatigue + high risk + long session → SUSTAINED_FATIGUE_HIGH_RISK."""
    result = classify_archetype(
        cause="fatigue",
        risk_score=0.6,
        session_duration_sec=6000,  # 100 minutes
        streak_days=2,
    )
    assert result.archetype == "SUSTAINED_FATIGUE_HIGH_RISK"
    assert result.professional_referral == False
    assert result.urgency == "high"


# ── Rule 3 ────────────────────────────────────────────────────────────────────

def test_rule3_subject_difficulty():
    """Difficulty + low homework grade → SUBJECT_DIFFICULTY_STRUGGLE."""
    result = classify_archetype(cause="difficulty", hw_grade=5.0, streak_days=1)
    assert result.archetype == "SUBJECT_DIFFICULTY_STRUGGLE"
    assert result.professional_referral == False
    assert result.urgency == "medium"


# ── Rule 4 ────────────────────────────────────────────────────────────────────

def test_rule4_simple_fatigue():
    """Fatigue + low risk → SIMPLE_FATIGUE (just tired, not alarming)."""
    result = classify_archetype(cause="fatigue", risk_score=0.2, streak_days=1)
    assert result.archetype == "SIMPLE_FATIGUE"
    assert result.professional_referral == False
    assert result.urgency == "low"


# ── Rule 5 ────────────────────────────────────────────────────────────────────

def test_rule5_environmental():
    """Environment cause → ENVIRONMENTAL_DISTRACTION."""
    result = classify_archetype(cause="environment", streak_days=1)
    assert result.archetype == "ENVIRONMENTAL_DISTRACTION"
    assert result.professional_referral == False
    assert result.urgency == "low"


# ── Rule 6 ────────────────────────────────────────────────────────────────────

def test_rule6_content_difficulty():
    """Difficulty + passing grade → CONTENT_DIFFICULTY (not a struggle, needs support)."""
    result = classify_archetype(cause="difficulty", hw_grade=14.0, streak_days=1)
    assert result.archetype == "CONTENT_DIFFICULTY"
    assert result.professional_referral == False
    assert result.urgency == "medium"


# ── Rule 7 ────────────────────────────────────────────────────────────────────

def test_rule7_fallback():
    """Unknown cause with low risk → GENERAL_DISTRACTION fallback."""
    result = classify_archetype(cause="unknown", risk_score=0.1, streak_days=0)
    assert result.archetype == "GENERAL_DISTRACTION"
    assert result.professional_referral == False
    assert result.urgency == "low"


# ── Safety invariant tests ────────────────────────────────────────────────────

def test_referral_never_true_except_rule1():
    """
    professional_referral is True ONLY for PERSISTENT_ADHD_RISK.
    This is a safety regression test — any change that accidentally sets
    referral=True in another branch will break this test immediately.
    """
    cases = [
        classify_archetype("fatigue", 0.6, 6000, None, 2),    # rule 2
        classify_archetype("difficulty", 0.3, 1800, 5.0, 1),  # rule 3
        classify_archetype("fatigue", 0.2, 1800, None, 1),    # rule 4
        classify_archetype("environment", 0.3, 1800, None, 1),# rule 5
        classify_archetype("difficulty", 0.3, 1800, 14.0, 1), # rule 6
        classify_archetype("unknown", 0.1, 600, None, 0),     # rule 7
    ]
    for result in cases:
        assert result.professional_referral == False, (
            f"Unexpected referral=True for archetype: {result.archetype}"
        )


def test_rag_seed_not_empty():
    """Every archetype result must carry a non-empty RAG query seed."""
    results = [
        classify_archetype("fatigue", 0.8, 0, None, 10),     # rule 1
        classify_archetype("fatigue", 0.6, 6000, None, 2),   # rule 2
        classify_archetype("difficulty", 0.3, 1800, 5.0, 1), # rule 3
        classify_archetype("fatigue", 0.2, 1800, None, 1),   # rule 4
        classify_archetype("environment", 0.3, 1800, None, 1),# rule 5
        classify_archetype("difficulty", 0.3, 1800, 14.0, 1),# rule 6
        classify_archetype("unknown", 0.1, 600, None, 0),    # rule 7
    ]
    for result in results:
        assert result.rag_query_seed, (
            f"Empty RAG seed for archetype: {result.archetype}"
        )
