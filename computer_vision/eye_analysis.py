def analyze_eye_tracking(payload=None):
    payload = payload or {}
    tracking_score = float(payload.get("tracking_score", 78.0))
    consistency = float(payload.get("consistency", 81.0))
    response_delay = float(payload.get("response_delay", 240.0))
    horizontal_movement = float(payload.get("horizontal_movement", 24.0))
    vertical_movement = float(payload.get("vertical_movement", 18.0))
    status = payload.get("status", "DEMO MODE")

    if payload.get("tracking_mode") in {"demo", "fallback"} or payload.get("demo_mode"):
        status = "Eye tracking demo mode is active. Results are for prototype demonstration only."

    return {
        "tracking_mode": payload.get("tracking_mode", "demo"),
        "tracking_score": round(tracking_score, 2),
        "consistency": round(consistency, 2),
        "response_delay": round(response_delay, 2),
        "horizontal_movement": round(horizontal_movement, 2),
        "vertical_movement": round(vertical_movement, 2),
        "status": status,
        "demo_mode": True,
        "summary": "Prototype eye tracking results are for demonstration and educational purposes only.",
    }
