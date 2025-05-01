# backend/src/api/tasks.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
import uuid

from src.database import get_db
from src.models.models import Task, User, Epic, TaskStatus, TaskPriority
from src.schemas.task import Task as TaskSchema, TaskCreate, TaskUpdate, TaskStatusUpdate

router = APIRouter()

@router.get("/tasks", response_model=List[TaskSchema])
async def get_tasks(db: AsyncSession = Depends(get_db)):
    """Gets a list of all tasks."""
    try:
        result = await db.execute(select(Task))
        tasks = result.scalars().all()
        return tasks
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error retrieving tasks: {e}")

@router.get("/tasks/{task_id}", response_model=TaskSchema)
async def get_task(task_id: str, db: AsyncSession = Depends(get_db)):
    """Gets details of a specific task."""
    try:
        result = await db.execute(select(Task).where(Task.id == task_id))
        task = result.scalars().first()
        if task is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        return task
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error retrieving task {task_id}: {e}")

@router.post("/tasks", response_model=TaskSchema, status_code=status.HTTP_201_CREATED)
async def create_task(task_data: TaskCreate, db: AsyncSession = Depends(get_db)):
    """Creates a new task."""
    # Validate foreign keys
    user_check = await db.execute(select(User.id).where(User.id == task_data.created_by))
    if user_check.scalars().first() is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Creator user with id {task_data.created_by} not found.")
    if task_data.epic_id:
        epic_check = await db.execute(select(Epic.id).where(Epic.id == task_data.epic_id))
        if epic_check.scalars().first() is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Epic with id {task_data.epic_id} not found.")
    if task_data.assignee_id:
        assignee_check = await db.execute(select(User.id).where(User.id == task_data.assignee_id))
        if assignee_check.scalars().first() is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Assignee user with id {task_data.assignee_id} not found.")

    try:
        new_task = Task(**task_data.model_dump(), id=str(uuid.uuid4()))
        db.add(new_task)
        # Commit handled by get_db
        await db.flush()
        await db.refresh(new_task)
        return new_task
    except Exception as e:
        # Rollback handled by get_db
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error creating task: {e}")

@router.put("/tasks/{task_id}", response_model=TaskSchema)
async def update_task(task_id: str, task_update: TaskUpdate, db: AsyncSession = Depends(get_db)):
    """Updates an existing task."""
    try:
        result = await db.execute(select(Task).where(Task.id == task_id))
        task = result.scalars().first()
        if task is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

        update_data = task_update.model_dump(exclude_unset=True)

        # Validate foreign keys if changed
        if "epic_id" in update_data and update_data["epic_id"]:
            epic_check = await db.execute(select(Epic.id).where(Epic.id == update_data["epic_id"]))
            if epic_check.scalars().first() is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Epic with id {update_data["epic_id"]} not found.")
        if "assignee_id" in update_data and update_data["assignee_id"]:
            assignee_check = await db.execute(select(User.id).where(User.id == update_data["assignee_id"]))
            if assignee_check.scalars().first() is None:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Assignee user with id {update_data["assignee_id"]} not found.")

        for key, value in update_data.items():
            setattr(task, key, value)

        # Commit handled by get_db
        await db.flush()
        await db.refresh(task)
        return task
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        # Rollback handled by get_db
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating task {task_id}: {e}")

@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: str, db: AsyncSession = Depends(get_db)):
    """Deletes a task."""
    try:
        result = await db.execute(select(Task).where(Task.id == task_id))
        task = result.scalars().first()
        if task is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

        await db.delete(task)
        # Commit handled by get_db
        return None # Return None for 204 No Content
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        # Rollback handled by get_db
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error deleting task {task_id}: {e}")

@router.put("/tasks/{task_id}/status", response_model=TaskSchema)
async def update_task_status(task_id: str, status_update: TaskStatusUpdate, db: AsyncSession = Depends(get_db)):
    """Updates only the status of a specific task."""
    try:
        result = await db.execute(select(Task).where(Task.id == task_id))
        task = result.scalars().first()
        if task is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

        task.status = status_update.status
        # Commit handled by get_db
        await db.flush()
        await db.refresh(task)
        return task
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        # Rollback handled by get_db
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error updating status for task {task_id}: {e}")

