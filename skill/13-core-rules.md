---
name: lumio-core-rules
description: Inviolable rules regarding privacy, ethics, language filters, and RAG referral overrides. NEVER violate these rules when generating backend code, AI output, or database responses.
---

# Core Rules — NEVER VIOLATE

## Privacy & Clinical Data

1. **No Video Stored or Transmitted:** MediaPipe FaceMesh runs entirely in the browser. It discards every frame locally. It only transmits the derived numerical `focus_score` JSON (~40 bytes/sec) to the server via WebSocket.
2. **No Biometric Data Storage:** We do not store face mappings or camera images, only the numerical values (gaze score, blink rate).
3. **Parent Data Gating:** The Parent API endpoints MUST NEVER return raw `risk_score` values or `risk_tier` classifications (`needs_attention`, etc.). The Parent dashboard only shows the child's focus percentages, timelines, and the `for_parent` AI suggestions.

## Ethics & AI Output Generation

4. **Regex Diagnosis Filter:** All LLM output must be checked against the blacklist regex: `ADHD|disorder|diagnosis|condition|autism`. If a match is found in the output, the RAG engine must regenerate the response or fallback. Lumio is an assistive tool, not a diagnostic one.
5. **No Diagnosis Claim:** The platform output is always formulated as a "risk score" or a "needs attention flag". It never offers a diagnosis.
6. **Teacher-First Referral:** If a professional referral is triggered, the notification goes to the **Teacher only**, never directly to the parent. The teacher acts as the professional mediator.

## Pipeline Architecture Logic

7. **Rule Engine Override:** Only the deterministic `rule_engine.py` is allowed to set `professional_referral = True`. If the LLM output sets it to True, it is hard-overridden and ignored by the system.
8. **14-Day Deduplication:** The professional referral webhook checks if a referral was sent for that student within the last 14 days before firing.
9. **Rule Engine Precedence:** The Rule Engine operates before RAG generation to classify the student into an archetype. If the LLM generates instructions contrary to the archetype logic, the system should catch it during grounding checks.

## Development Constraints

10. **LLM Identity:** The project strictly uses **Llama**. Never use `langchain-anthropic`, `anthropic`, `Claude`, or `OpenAI` models. You must use the LangChain OpenAI-compatible wrapper pointing at the Llama endpoint (`ChatOpenAI(base_url=settings.LLAMA_BASE_URL, ...)`).
11. **React Web Only:** The frontend is strictly React Web. No React Native. No Expo. No `StyleSheet`.
12. **Role URL Parameter:** The Login page authenticates the user based on the `?role=` query parameter (e.g., `/login?role=student`). The UI must never display a dropdown "Select your role" on the login screen.
13. **Design Tokens:** Always use the design system tokens (`--primary`, `--accent`, etc.) defined in `03-design-system.md` for any new component styling.
