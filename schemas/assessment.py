from pydantic import BaseModel, Field


class EyeAnalysisPayload(BaseModel):
    tracking_mode: str = Field(default="demo")
    tracking_score: float = Field(default=0.0, ge=0.0, le=100.0)
    consistency: float = Field(default=0.0, ge=0.0, le=100.0)
    response_delay: float = Field(default=0.0, ge=0.0)
    horizontal_movement: float = Field(default=0.0, ge=0.0)
    vertical_movement: float = Field(default=0.0, ge=0.0)
    target_sequence: list[str] | None = None
    status: str | None = None


class ReactionPayload(BaseModel):
    average_reaction_ms: float = Field(..., ge=0.0)
    fastest_reaction_ms: float = Field(..., ge=0.0)
    slowest_reaction_ms: float = Field(..., ge=0.0)
    consistency: float = Field(..., ge=0.0, le=100.0)
    reaction_score: float = Field(..., ge=0.0, le=100.0)
    rounds: list[float] = Field(default_factory=list)


class MemoryPayload(BaseModel):
    correct: int = Field(..., ge=0)
    incorrect: int = Field(..., ge=0)
    memory_score: float = Field(..., ge=0.0, le=100.0)
    selected_items: list[str] = Field(default_factory=list)
    target_items: list[str] = Field(default_factory=list)


class AttentionPayload(BaseModel):
    correct: int = Field(..., ge=0)
    incorrect: int = Field(..., ge=0)
    missed: int = Field(..., ge=0)
    attention_score: float = Field(..., ge=0.0, le=100.0)
    selected_targets: list[str] = Field(default_factory=list)
    correct_targets: list[str] = Field(default_factory=list)


class ScreeningAnalyzeRequest(BaseModel):
    profile: dict
    symptoms: dict
    eye_analysis: dict
    reaction: dict
    memory: dict
    attention: dict
