"""
rule_engine.py — Deterministic rule engine for distraction archetype classification.

Maps (distraction_cause + risk_score + context) to a situation archetype.
This is pure Python if/else — no ML, fully auditable, always consistent.

CRITICAL: The professional_referral field returned here ALWAYS overrides
any value the LLM produces. Never trust the LLM for medical referrals.

Why deterministic rules instead of ML here?
  ML models can be biased, unpredictable, and hard to audit.
  A professional_referral=True could trigger a clinical process for a child.
  That decision must be explainable to parents, teachers, and regulators.
  A pure if/else rule table is: testable, auditable, and legally defensible.

Archetypes and their RAG query seeds:
  PERSISTENT_ADHD_RISK         → 'sustained attention difficulties ADHD intervention strategies children'
  SUSTAINED_FATIGUE_HIGH_RISK  → 'chronic fatigue learning performance student intervention'
  SUBJECT_DIFFICULTY_STRUGGLE  → 'learning difficulties subject specific support strategies classroom'
  SIMPLE_FATIGUE               → 'student fatigue classroom management rest strategies recovery'
  ENVIRONMENTAL_DISTRACTION    → 'classroom environment distraction management focus strategies'
  CONTENT_DIFFICULTY           → 'academic difficulty content support scaffolding strategies'
  GENERAL_DISTRACTION          → 'student attention management classroom engagement strategies'
"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class ArchetypeResult:
    """
    Result from the rule engine — one record per classification event.

    archetype:             the situation label (drives RAG query + LLM prompt)
    professional_referral: True ONLY for PERSISTENT_ADHD_RISK — triggers alert to teacher
    rag_query_seed:        pre-built search string for FAISS similarity search
    urgency:               'low' | 'medium' | 'high' — controls dashboard color
    description:           human-readable explanation of why this archetype was chosen
    """
    archetype: str
    professional_referral: bool
    rag_query_seed: str
    urgency: str
    description: str


# ── Archetype metadata ────────────────────────────────────────────────────────
# RAG query seeds are crafted to retrieve the most relevant PDF chunks for each
# situation. They use clinical/pedagogical terminology that matches the KB PDFs.

ARCHETYPE_RAG_SEEDS = {
    "PERSISTENT_ADHD_RISK":
        "sustained attention difficulties ADHD intervention strategies children",
    "SUSTAINED_FATIGUE_HIGH_RISK":
        "chronic fatigue learning performance student intervention",
    "SUBJECT_DIFFICULTY_STRUGGLE":
        "learning difficulties subject specific support strategies classroom",
    "SIMPLE_FATIGUE":
        "student fatigue classroom management rest strategies recovery",
    "ENVIRONMENTAL_DISTRACTION":
        "classroom environment distraction management focus strategies",
    "CONTENT_DIFFICULTY":
        "academic difficulty content support scaffolding strategies",
    "GENERAL_DISTRACTION":
        "student attention management classroom engagement strategies",
}

ARCHETYPE_DESCRIPTIONS = {
    "PERSISTENT_ADHD_RISK":
        "Student shows persistent attention difficulties across multiple sessions — professional review recommended",
    "SUSTAINED_FATIGUE_HIGH_RISK":
        "Student shows sustained fatigue with elevated risk indicators — intervention needed",
    "SUBJECT_DIFFICULTY_STRUGGLE":
        "Student is struggling with specific subject content — academic support needed",
    "SIMPLE_FATIGUE":
        "Student is tired — likely needs a break or rest",
    "ENVIRONMENTAL_DISTRACTION":
        "Student is distracted by external environment — space adjustment may help",
    "CONTENT_DIFFICULTY":
        "Student finds the content challenging — targeted scaffolding recommended",
    "GENERAL_DISTRACTION":
        "Student is generally distracted — cause unclear, continue monitoring",
}


# ── Main classification function ──────────────────────────────────────────────

def classify_archetype(
    cause: str,
    risk_score: float = 0.0,
    session_duration_sec: float = 0.0,
    hw_grade: Optional[float] = None,
    streak_days: int = 0,
) -> ArchetypeResult:
    """
    Classify a distraction event into an archetype using deterministic rules.

    Priority order — first matching rule wins:

      Rule 1: Any cause + risk > 0.75 + streak > 7 days
              → PERSISTENT_ADHD_RISK (referral=True, urgency=high)
              Reason: pattern persisting across 7+ days suggests systemic issue

      Rule 2: Fatigue + risk > 0.5 + session > 90 min (5400s)
              → SUSTAINED_FATIGUE_HIGH_RISK (urgency=high)
              Reason: physical exhaustion during very long study = health concern

      Rule 3: Difficulty + hw_grade < 8 (Tunisian fail threshold)
              → SUBJECT_DIFFICULTY_STRUGGLE (urgency=medium)
              Reason: classifier + low grade = confirmed academic problem

      Rule 4: Fatigue + risk < 0.5
              → SIMPLE_FATIGUE (urgency=low)
              Reason: tired but low risk = just needs a break

      Rule 5: Environment cause
              → ENVIRONMENTAL_DISTRACTION (urgency=low)
              Reason: external distraction, teacher can address the space

      Rule 6: Difficulty (no low grade)
              → CONTENT_DIFFICULTY (urgency=medium)
              Reason: struggling with content but grades OK — needs support, not alarm

      Rule 7: Fallback (unknown or no rule matched)
              → GENERAL_DISTRACTION (urgency=low)

    Args:
        cause:                'fatigue' | 'difficulty' | 'environment' | 'unknown'
        risk_score:           0.0-1.0 (from risk profiler, default 0.0 if not yet computed)
        session_duration_sec: current session length in seconds
        hw_grade:             latest homework grade on 0-20 scale, None if no homework
        streak_days:          consecutive days this student has triggered a distraction flag

    Returns:
        ArchetypeResult with all fields populated
    """

    # ── Rule 1 ──────────────────────────────────────────────────────────────
    # Most serious rule — triggers regardless of cause.
    # Requires: elevated risk AND persistent pattern across many days.
    if risk_score > 0.75 and streak_days > 7:
        archetype = "PERSISTENT_ADHD_RISK"
        return ArchetypeResult(
            archetype=archetype,
            professional_referral=True,   # ← the ONLY rule that sets this True
            rag_query_seed=ARCHETYPE_RAG_SEEDS[archetype],
            urgency="high",
            description=ARCHETYPE_DESCRIPTIONS[archetype],
        )

    # ── Rule 2 ──────────────────────────────────────────────────────────────
    # Fatigue that has gone on too long in a single session with elevated risk.
    # 5400 seconds = 90 minutes — the threshold where fatigue becomes a concern.
    if cause == "fatigue" and risk_score > 0.5 and session_duration_sec > 5400:
        archetype = "SUSTAINED_FATIGUE_HIGH_RISK"
        return ArchetypeResult(
            archetype=archetype,
            professional_referral=False,
            rag_query_seed=ARCHETYPE_RAG_SEEDS[archetype],
            urgency="high",
            description=ARCHETYPE_DESCRIPTIONS[archetype],
        )

    # ── Rule 3 ──────────────────────────────────────────────────────────────
    # Difficulty + confirmed poor grade = real academic struggle, not random.
    # Tunisian grading system: passing grade is 10/20, but 8 is the threshold
    # where intervention becomes urgent.
    if cause == "difficulty" and hw_grade is not None and hw_grade < 8:
        archetype = "SUBJECT_DIFFICULTY_STRUGGLE"
        return ArchetypeResult(
            archetype=archetype,
            professional_referral=False,
            rag_query_seed=ARCHETYPE_RAG_SEEDS[archetype],
            urgency="medium",
            description=ARCHETYPE_DESCRIPTIONS[archetype],
        )

    # ── Rule 4 ──────────────────────────────────────────────────────────────
    # Mild fatigue with low overall risk — simplest case, just tired.
    if cause == "fatigue" and risk_score < 0.5:
        archetype = "SIMPLE_FATIGUE"
        return ArchetypeResult(
            archetype=archetype,
            professional_referral=False,
            rag_query_seed=ARCHETYPE_RAG_SEEDS[archetype],
            urgency="low",
            description=ARCHETYPE_DESCRIPTIONS[archetype],
        )

    # ── Rule 5 ──────────────────────────────────────────────────────────────
    # Environmental distractions — teacher can act on the physical space.
    if cause == "environment":
        archetype = "ENVIRONMENTAL_DISTRACTION"
        return ArchetypeResult(
            archetype=archetype,
            professional_referral=False,
            rag_query_seed=ARCHETYPE_RAG_SEEDS[archetype],
            urgency="low",
            description=ARCHETYPE_DESCRIPTIONS[archetype],
        )

    # ── Rule 6 ──────────────────────────────────────────────────────────────
    # Difficulty without a confirmed low grade — needs content support but no alarm.
    if cause == "difficulty":
        archetype = "CONTENT_DIFFICULTY"
        return ArchetypeResult(
            archetype=archetype,
            professional_referral=False,
            rag_query_seed=ARCHETYPE_RAG_SEEDS[archetype],
            urgency="medium",
            description=ARCHETYPE_DESCRIPTIONS[archetype],
        )

    # ── Rule 7: Fallback ─────────────────────────────────────────────────────
    # Unknown cause or no rule matched — monitor and collect more data.
    archetype = "GENERAL_DISTRACTION"
    return ArchetypeResult(
        archetype=archetype,
        professional_referral=False,
        rag_query_seed=ARCHETYPE_RAG_SEEDS[archetype],
        urgency="low",
        description=ARCHETYPE_DESCRIPTIONS[archetype],
    )


def get_archetype_rag_seed(archetype: str) -> str:
    """Get the RAG query seed for a given archetype name."""
    return ARCHETYPE_RAG_SEEDS.get(archetype, ARCHETYPE_RAG_SEEDS["GENERAL_DISTRACTION"])
