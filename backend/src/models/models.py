from sqlalchemy import create_engine, Column, String, Text, Integer, DateTime, Boolean, ForeignKey, Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.dialects.postgresql import UUID # Use UUID type if IDs are actual UUIDs
from datetime import datetime
import enum
import uuid # Import uuid if generating IDs in Python

Base = declarative_base()

class UserRole(str, enum.Enum):
    ADMIN = 'admin'
    MEMBER = 'member'
    VIEWER = 'viewer'

class EpicStatus(str, enum.Enum):
    PLANNING = 'planning'
    IN_PROGRESS = 'in_progress'
    COMPLETED = 'completed'

class TaskPriority(str, enum.Enum):
    LOW = 'low'
    MEDIUM = 'medium'
    HIGH = 'high'

class TaskStatus(str, enum.Enum):
    BACKLOG = 'backlog'
    READY = 'ready'
    IN_PROGRESS = 'in_progress'
    REVIEW = 'review'
    DONE = 'done'

class User(Base):
    __tablename__ = 'users'
    # Using String(36) for UUIDs stored as strings. Consider using postgresql.UUID if the DB column is UUID type.
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    avatar_url = Column(String(255), nullable=True)
    role = Column(SQLAlchemyEnum(UserRole, name='userrole'), nullable=False, default=UserRole.MEMBER)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships remain similar, but adjust backref/back_populates as needed for standard SQLAlchemy
    created_epics = relationship('Epic', back_populates='creator', foreign_keys='Epic.created_by')
    created_tasks = relationship('Task', back_populates='creator', foreign_keys='Task.created_by')
    assigned_tasks = relationship('Task', back_populates='assignee', foreign_keys='Task.assignee_id')

    def __repr__(self):
        return f'<User {self.email}>'

class Epic(Base):
    __tablename__ = 'epics'
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    estimation = Column(Integer, nullable=True)
    status = Column(SQLAlchemyEnum(EpicStatus, name='epicstatus'), nullable=False, default=EpicStatus.PLANNING)
    created_by = Column(String(36), ForeignKey('users.id'), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    creator = relationship('User', back_populates='created_epics')
    tasks = relationship('Task', back_populates='epic', foreign_keys='Task.epic_id')

    def __repr__(self):
        return f'<Epic {self.title}>'

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    epic_id = Column(String(36), ForeignKey('epics.id'), nullable=True, index=True)
    assignee_id = Column(String(36), ForeignKey('users.id'), nullable=True, index=True)
    estimation = Column(Integer, nullable=True)
    priority = Column(SQLAlchemyEnum(TaskPriority, name='taskpriority'), nullable=False, default=TaskPriority.MEDIUM)
    status = Column(SQLAlchemyEnum(TaskStatus, name='taskstatus'), nullable=False, default=TaskStatus.BACKLOG)
    is_product_idea = Column(Boolean, default=False)
    created_by = Column(String(36), ForeignKey('users.id'), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    epic = relationship('Epic', back_populates='tasks')
    assignee = relationship('User', back_populates='assigned_tasks', foreign_keys=[assignee_id])
    creator = relationship('User', back_populates='created_tasks', foreign_keys=[created_by])

    def __repr__(self):
        return f'<Task {self.title}>'

