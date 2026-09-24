from pydantic import BaseModel, Field


class SymptomsPayload(BaseModel):
    symptoms: list[str] = Field(..., min_length=1)
    notes: str | None = None
