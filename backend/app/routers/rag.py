"""
rag.py — RAG-powered AI assistant endpoints.

POST /rag/teacher  — teacher asks about a student or general strategy
POST /rag/parent   — parent asks about supporting their child
POST /rag/student  — student asks for study help

Each endpoint uses a different system prompt and safety filter so the LLM
gives age/role-appropriate responses. risk_score is NEVER returned to parents.
"""
import io

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from langchain.text_splitter import RecursiveCharacterTextSplitter
from pypdf import PdfReader
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.database import get_db, User
from app.routers.auth import get_current_user
from app.services.rag_service import add_texts_to_index, query_rag, is_index_loaded
from app.services.rule_engine import classify_archetype, ARCHETYPE_RAG_SEEDS
from app.schemas.rag import RAGRequest, RAGResponse

router = APIRouter()


def _index_guard():
    """Raise 503 if the FAISS index hasn't loaded yet."""
    if not is_index_loaded():
        raise HTTPException(status_code=503, detail="RAG index not ready")


@router.post("/upload")
async def rag_upload(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    """Index a PDF or .txt document into the live FAISS knowledge base."""
    if current_user.role not in ("teacher", "admin"):
        raise HTTPException(status_code=403, detail="Only teachers or admins can upload documents")

    filename = file.filename or "upload"
    lower = filename.lower()
    raw = await file.read()
    if not raw:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    if lower.endswith(".pdf"):
        try:
            reader = PdfReader(io.BytesIO(raw))
            text = "\n".join((page.extract_text() or "") for page in reader.pages)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to parse PDF: {e}")
    elif lower.endswith(".txt"):
        try:
            text = raw.decode("utf-8", errors="replace")
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read text file: {e}")
    else:
        raise HTTPException(status_code=400, detail="Unsupported file type — use PDF or .txt")

    text = text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="No extractable text in file")

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_text(text)
    if not chunks:
        raise HTTPException(status_code=400, detail="No chunks produced from file")

    added = add_texts_to_index(chunks, source=filename)
    return {"chunks_added": added, "filename": filename}


@router.post("/teacher", response_model=RAGResponse)
async def rag_teacher(
    body: RAGRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _index_guard()

    if body.student_id:
        try:
            student_uuid = UUID(body.student_id)
        except (ValueError, AttributeError):
            raise HTTPException(status_code=422, detail="Invalid student_id format")
        result_row = await db.execute(
            select(User).where(User.id == student_uuid)
        )
        student = result_row.scalar_one_or_none()
        if student is None:
            raise HTTPException(status_code=404, detail="Student not found")

        student_context = {
            "full_name": student.full_name,
            "avg_focus_7d": 0.5,
            "distraction_cause": "unknown",
        }
        rule_result = classify_archetype("unknown", risk_score=0.0)
        archetype = rule_result.archetype
        referral = rule_result.professional_referral
        seed = rule_result.rag_query_seed
    else:
        archetype = "GENERAL_DISTRACTION"
        seed = ARCHETYPE_RAG_SEEDS["GENERAL_DISTRACTION"]
        student_context = {}
        referral = False

    rag_result = await query_rag(archetype, seed, student_context, referral, "teacher", user_question=body.message)

    return RAGResponse(
        answer=rag_result["summary"],
        for_teacher=rag_result["for_teacher"],
        for_student=rag_result["for_student"],
        for_parent=rag_result["for_parent"],
        sources=rag_result["sources"],
        archetype=archetype,
        urgency=rag_result["urgency"],
        professional_referral=rag_result["professional_referral"],
    )


@router.post("/parent", response_model=RAGResponse)
async def rag_parent(
    body: RAGRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _index_guard()

    if current_user.role != "parent":
        raise HTTPException(status_code=403, detail="Only parents can use this endpoint")

    if not body.student_id:
        raise HTTPException(status_code=422, detail="student_id is required for parent endpoint")

    try:
        student_uuid = UUID(body.student_id)
    except (ValueError, AttributeError):
        raise HTTPException(status_code=422, detail="Invalid student_id format")
    result_row = await db.execute(
        select(User).where(User.id == student_uuid)
    )
    student = result_row.scalar_one_or_none()
    if student is None:
        raise HTTPException(status_code=404, detail="Student not found")

    student_context = {
        "full_name": student.full_name,
        "avg_focus_7d": 0.5,
        "distraction_cause": "unknown",
    }
    rule_result = classify_archetype("unknown", risk_score=0.0)
    archetype = rule_result.archetype
    referral = rule_result.professional_referral
    seed = rule_result.rag_query_seed

    rag_result = await query_rag(archetype, seed, student_context, referral, "parent", user_question=body.message)

    # RAGResponse has no risk_score field — parent never sees it
    return RAGResponse(
        answer=rag_result["summary"],
        for_teacher=rag_result["for_teacher"],
        for_student=rag_result["for_student"],
        for_parent=rag_result["for_parent"],
        sources=rag_result["sources"],
        archetype=archetype,
        urgency=rag_result["urgency"],
        professional_referral=rag_result["professional_referral"],
    )


@router.post("/student", response_model=RAGResponse)
async def rag_student(
    body: RAGRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    _index_guard()

    if current_user.role != "student":
        raise HTTPException(status_code=403, detail="Only students can use this endpoint")

    student_context = {"full_name": current_user.full_name}
    archetype = "GENERAL_DISTRACTION"
    seed = ARCHETYPE_RAG_SEEDS["GENERAL_DISTRACTION"]

    rag_result = await query_rag(archetype, seed, student_context, False, "student", user_question=body.message)

    return RAGResponse(
        answer=rag_result["summary"],
        for_teacher=rag_result["for_teacher"],
        for_student=rag_result["for_student"],
        for_parent=rag_result["for_parent"],
        sources=rag_result["sources"],
        archetype=archetype,
        urgency=rag_result["urgency"],
        professional_referral=rag_result["professional_referral"],
    )
