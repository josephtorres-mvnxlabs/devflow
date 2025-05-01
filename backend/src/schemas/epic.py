# backend/src/schemas/epic.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

# Import Enum definitions from models
from src.models.models import EpicStatus

# Re-use or define TaskSimple schema
class TaskSimple(BaseModel):
    id: str
    title: str
    status: Optional[str] = None # Assuming TaskStatus enum value

    class Config:
        from_attributes = True

# Base model for common epic attributes
class EpicBase(BaseModel):
    title: str
    description: Optional[str] = None
    estimation: Optional[int] = None
    status: EpicStatus = EpicStatus.PLANNING
    created_by: str # User ID

# Schema for creating an epic
class EpicCreate(EpicBase):
    pass

# Schema for updating an epic
class EpicUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    estimation: Optional[int] = None
    status: Optional[EpicStatus] = None
    # created_by should likely not be updated

# Schema for reading epic data (response model)
class Epic(EpicBase):
    id: str
    created_at: datetime
    updated_at: datetime
    # tasks: List[TaskSimple] = [] # Optionally include tasks directly

    class Config:
        from_attributes = True

# Schema for epic with its tasks
class EpicWithTasks(Epic):
    tasks: List[TaskSimple] = []

