import json
from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException

from app.computer_vision.eye_analysis import analyze_eye_tracking
from app.cognitive.tests import calculate_attention_score, calculate_memory_score, calculate_reaction_metrics
from app.database.db import fetch_assessment_by_id, fetch_assessment_history, get_connection, save_assessment
from app.schemas.assessment import AttentionPayload, EyeAnalysisPayload, MemoryPayload, ReactionPayload, ScreeningAnalyzeRequest
from app.schemas.profile import ProfilePayload
from app.schemas.symptoms import SymptomsPayload
from app.services.feature_extraction import extract_feature_vector
from app.services.report_service import build_report
from app.services.screening_service import analyze as screening_analyze

router = APIRouter()


def row_to_dict(row):
    if row is None:
        return None
    record = dict(row)
    for key in ["profile", "symptoms", "eye_analysis", "reaction", "memory", "attention", "feature_vector"]:
        value = record.get(key)
        if isinstance(value, str):
            try:
                record[key] = json.loads(value)
            except json.JSONDecodeError:
                record[key] = {}
    return record


@router.get("/health")
def health():
    return {"status": "ok"}


@router.post("/profile")
def submit_profile(payload: ProfilePayload):
    return {"status": "success", "profile": payload.model_dump()}


@router.post("/symptoms")
def submit_symptoms(payload: SymptomsPayload):
    return {
        "status": "success",
        "symptoms": {
            "selected_symptoms": payload.symptoms,
            "notes": payload.notes,
        },
    }


@router.post("/eye-analysis")
def submit_eye_analysis(payload: dict):
    result = analyze_eye_tracking(payload)
    return {"status": "success", "eye_analysis": result}


@router.post("/cognitive/reaction")
def submit_reaction(payload: ReactionPayload):
    metrics = {
        "average_reaction_ms": payload.average_reaction_ms,
        "fastest_reaction_ms": payload.fastest_reaction_ms,
        "slowest_reaction_ms": payload.slowest_reaction_ms,
        "consistency": payload.consistency,
        "reaction_score": payload.reaction_score,
        "rounds": payload.rounds,
    }
    return {"status": "success", "reaction": metrics}


@router.post("/cognitive/memory")
def submit_memory(payload: MemoryPayload):
    metrics = {
        "correct": payload.correct,
        "incorrect": payload.incorrect,
        "memory_score": payload.memory_score,
        "selected_items": payload.selected_items,
        "target_items": payload.target_items,
    }
    return {"status": "success", "memory": metrics}


@router.post("/cognitive/attention")
def submit_attention(payload: AttentionPayload):
    metrics = {
        "correct": payload.correct,
        "incorrect": payload.incorrect,
        "missed": payload.missed,
        "attention_score": payload.attention_score,
        "selected_targets": payload.selected_targets,
        "correct_targets": payload.correct_targets,
    }
    return {"status": "success", "attention": metrics}


@router.post("/screening/analyze")
def analyze_screening_route(payload: ScreeningAnalyzeRequest):
    feature_vector = extract_feature_vector(
        payload.eye_analysis,
        payload.reaction,
        payload.memory,
        payload.attention,
        payload.symptoms,
    )
    screening = screening_analyze(feature_vector)

    assessment_data = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "profile": payload.profile,
        "symptoms": payload.symptoms,
        "eye_analysis": payload.eye_analysis,
        "reaction": payload.reaction,
        "memory": payload.memory,
        "attention": payload.attention,
        "feature_vector": feature_vector,
        "screening_score": screening["screening_score"],
        "screening_indication": screening["screening_indication"],
    }

    assessment_id = save_assessment(assessment_data)
    assessment_data["id"] = assessment_id
    report_text = build_report(assessment_data)

    with get_connection() as conn:
        conn.execute(
            "UPDATE assessments SET report_text = ? WHERE id = ?",
            (report_text, assessment_id),
        )
        conn.commit()

    return {
        "status": "success",
        "assessment_id": assessment_id,
        "feature_vector": feature_vector,
        "screening_score": screening["screening_score"],
        "screening_indication": screening["screening_indication"],
        "report": report_text,
        "disclaimer": "This tool is for preliminary screening and educational purposes only. It does not replace professional medical evaluation.",
    }


@router.get("/assessment/history")
def get_assessment_history():
    rows = fetch_assessment_history()
    return {"status": "success", "assessments": [row_to_dict(r) for r in rows]}


@router.get("/assessment/{assessment_id}")
def get_assessment(assessment_id: int):
    row = fetch_assessment_by_id(assessment_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    return {"status": "success", "assessment": row_to_dict(row)}


@router.get("/report/{assessment_id}")
def get_report(assessment_id: int):
    row = fetch_assessment_by_id(assessment_id)
    if row is None:
        raise HTTPException(status_code=404, detail="Assessment not found.")
    assessment = row_to_dict(row)
    report_text = assessment.get("report_text") or build_report(assessment)
    return {
        "status": "success",
        "assessment_id": assessment_id,
        "filename": f"neuroguard-report-{assessment_id}.txt",
        "content": report_text,
    }
