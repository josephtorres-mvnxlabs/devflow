# backend/src/api/epics.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid

from src.database import get_db
from src.models.models import Epic, Task, User, EpicStatus
from src.schemas.epic import Epic as EpicSchema, EpicCreate, EpicUpdate, TaskSimple

router = APIRouter()

@router.get("/epics", response_model=List[EpicSchema])
async def get_epics(db: AsyncSession = Depends(get_db)):
    """Gets a list of all epics."""
    try:
        result = await db.execute(select(Epic))
        epics = result.scalars().all()
        return epics
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error retrieving epics: {e}")

@router.get("/epics/{epic_id}", response_model=EpicSchema)
async def get_epic(epic_id: str, db: AsyncSession = Depends(get_db)):
    """Gets details of a specific epic."""
    try:
        result = await db.execute(select(Epic).where(Epic.id == epic_id))
        epic = result.scalars().first()
        if epic is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Epic not found")
        return epic
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error retrieving epic {epic_id}: {e}")

@router.post("/epics", response_model=EpicSchema, status_code=status.HTTP_201_CREATED)
async def create_epic(epic_data: EpicCreate, db: AsyncSession = Depends(get_db)):
    """Creates a new epic."""
    # Validate created_by user exists
    user_check = await db.execute(select(User.id).where(User.id == epic_data.created_by))
    if user_check.scalars().first() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Creator user with id {epic_data.created_by} not found.")

    try:
        new_epic = Epic(**epic_data.model_dump(), id=str(uuid.uuid4()))
        db.add(new_epic)
        # Commit handled by get_db dependency
        await db.flush() # Flush to get the object state before commit
        await db.refresh(new_epic)
        return new_epic
    except Exception as e:
        # Rollback handled by get_db
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating epic: {e}")

@router.put("/epics/{epic_id}", response_model=EpicSchema)
async def update_epic(epic_id: str, epic_update: EpicUpdate, db: AsyncSession = Depends(get_db)):
    """Updates an existing epic."""
    try:
        result = await db.execute(select(Epic).where(Epic.id == epic_id))
        epic = result.scalars().first()
        if epic is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Epic not found")

        update_data = epic_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(epic, key, value)

        # Commit handled by get_db
        await db.flush()
        await db.refresh(epic)
        return epic
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        # Rollback handled by get_db
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating epic {epic_id}: {e}")

@router.delete("/epics/{epic_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_epic(epic_id: str, db: AsyncSession = Depends(get_db)):
    """Deletes an epic."""
    try:
        result = await db.execute(select(Epic).where(Epic.id == epic_id))
        epic = result.scalars().first()
        if epic is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Epic not found")

        # Handle related tasks: Option 1: Check if tasks exist and prevent deletion
        task_check = await db.execute(select(Task.id).where(Task.epic_id == epic_id).limit(1))
        if task_check.scalars().first() is not None:
             raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot delete epic with associated tasks. Please reassign or delete tasks first.")
        # Option 2: Delete associated tasks (use with caution)
        # await db.execute(delete(Task).where(Task.epic_id == epic_id))
        # Option 3: Set epic_id to NULL in tasks (if model allows nullable epic_id)
        # await db.execute(update(Task).where(Task.epic_id == epic_id).values(epic_id=None))

        await db.delete(epic)
        # Commit handled by get_db
        return None # Return None for 204 No Content
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        # Rollback handled by get_db
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting epic {epic_id}: {e}")

@router.get("/epics/{epic_id}/tasks", response_model=List[TaskSimple])
async def get_epic_tasks(epic_id: str, db: AsyncSession = Depends(get_db)):
    """Gets all tasks associated with a specific epic."""
    # Check if epic exists
    epic_check = await db.execute(select(Epic.id).where(Epic.id == epic_id))
    if epic_check.scalars().first() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Epic not found")

    try:
        result = await db.execute(select(Task).where(Task.epic_id == epic_id))
        tasks = result.scalars().all()
        return tasks
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error retrieving tasks for epic {epic_id}: {e}")

