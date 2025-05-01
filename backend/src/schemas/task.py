# backend/src/schemas/task.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

# Import Enum definitions from models
from src.models.models import TaskStatus, TaskPriority

# Base model for common task attributes
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    epic_id: Optional[str] = None
    assignee_id: Optional[str] = None
    estimation: Optional[int] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.BACKLOG
    is_product_idea: bool = False
    created_by: str # User ID

# Schema for creating a task
class TaskCreate(TaskBase):
    pass

# Schema for updating a task (full update)
class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    epic_id: Optional[str] = None
    assignee_id: Optional[str] = None
    estimation: Optional[int] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    is_product_idea: Optional[bool] = None
    # created_by should likely not be updated

# Schema for updating only the task status
class TaskStatusUpdate(BaseModel):
    status: TaskStatus

# Schema for reading task data (response model)
class Task(TaskBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

