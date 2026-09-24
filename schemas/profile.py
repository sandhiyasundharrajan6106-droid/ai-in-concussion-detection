from pydantic import BaseModel, Field, field_validator


class ProfilePayload(BaseModel):
    name: str = Field(..., min_length=1, max_length=120)
    age: int = Field(..., ge=1, le=120)
    athlete_status: str = Field(..., min_length=3, max_length=40)
    sport_activity: str = Field(..., min_length=1, max_length=120)
    assessment_date: str = Field(..., min_length=1)

    @field_validator("athlete_status")
    @classmethod
    def validate_athlete_status(cls, value):
        normalized = value.strip()
        if normalized.lower() not in {"athlete", "non-athlete"}:
            raise ValueError("athlete_status must be 'Athlete' or 'Non-athlete'.")
        return normalized
