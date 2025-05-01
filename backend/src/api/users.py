# backend/src/api/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from src.database import get_db
from src.models.models import User, Task
from src.schemas.user import User as UserSchema, UserUpdate, TaskSimple

router = APIRouter()

@router.get("/users", response_model=List[UserSchema])
async def get_users(db: AsyncSession = Depends(get_db)):
    """Gets a list of all users."""
    try:
        result = await db.execute(select(User))
        users = result.scalars().all()
        return users
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving users: {e}")

@router.get("/users/{user_id}", response_model=UserSchema)
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    """Gets details of a specific user."""
    try:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        return user
    except HTTPException as http_exc:
        raise http_exc # Re-raise HTTPException
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user {user_id}: {e}")

@router.get("/users/{user_id}/tasks", response_model=List[TaskSimple])
async def get_user_tasks(user_id: str, db: AsyncSession = Depends(get_db)):
    """Gets all tasks assigned to a specific user."""
    # First check if user exists
    user_check = await db.execute(select(User.id).where(User.id == user_id))
    if user_check.scalars().first() is None:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        result = await db.execute(select(Task).where(Task.assignee_id == user_id))
        tasks = result.scalars().all()
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving tasks for user {user_id}: {e}")

@router.put("/users/{user_id}", response_model=UserSchema)
async def update_user(user_id: str, user_update: UserUpdate, db: AsyncSession = Depends(get_db)):
    """Updates information for a specific user."""
    try:
        result = await db.execute(select(User).where(User.id == user_id))
        user = result.scalars().first()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        update_data = user_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(user, key, value)

        # No explicit commit needed here due to get_db dependency structure
        # await db.commit() # Commit handled by get_db
        await db.refresh(user)
        return user
    except HTTPException as http_exc:
        raise http_exc # Re-raise HTTPException
    except Exception as e:
        # Rollback handled by get_db
        # await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating user {user_id}: {e}")

# Note: User creation (POST) and deletion (DELETE) are omitted as per original API spec.

