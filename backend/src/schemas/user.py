# backend/src/schemas/user.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
import uuid

# Import Enum definitions from models
from src.models.models import UserRole

# Base model for common user attributes
class UserBase(BaseModel):
    name: str
    email: EmailStr
    avatar_url: Optional[str] = None
    role: UserRole = UserRole.MEMBER

# Schema for creating a user (if needed, though not in original API spec)
# class UserCreate(UserBase):
#     pass # Add password field if implementing user creation with auth

# Schema for updating a user
class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    role: Optional[UserRole] = None

# Schema for reading user data (response model)
class User(UserBase):
    id: str # Keep as string if DB stores UUIDs as strings
    created_at: datetime

    class Config:
        from_attributes = True # For SQLAlchemy model compatibility (formerly orm_mode)

# Simplified Task schema for embedding in User response (if needed)
# Or reuse/create a dedicated Task schema file
class TaskSimple(BaseModel):
    id: str
    title: str
    status: Optional[str] = None # Assuming TaskStatus enum value

    class Config:
        from_attributes = True

# Schema for user with their assigned tasks
class UserWithTasks(User):
    assigned_tasks: List[TaskSimple] = []

