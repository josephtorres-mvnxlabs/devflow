
# DevFlow Database Schema

This document outlines the database schema for the DevFlow application.

## Tables

### Users

| Column Name | Type | Description |
|-------------|------|-------------|
| id | string | Primary key |
| name | string | User's full name |
| email | string | User's email address (unique) |
| avatar_url | string | URL to user's avatar image (optional) |
| role | enum | User role: 'admin', 'member', or 'viewer' |
| created_at | timestamp | When the user was created |

### Epics

| Column Name | Type | Description |
|-------------|------|-------------|
| id | string | Primary key |
| title | string | Epic title |
| description | string | Detailed description of the epic |
| estimation | number | Estimated duration in days |
| status | enum | Current status: 'planning', 'in_progress', 'completed' |
| created_by | string | Foreign key to users.id |
| created_at | timestamp | When the epic was created |
| updated_at | timestamp | When the epic was last updated |

### Tasks

| Column Name | Type | Description |
|-------------|------|-------------|
| id | string | Primary key |
| title | string | Task title |
| description | string | Detailed description of the task |
| epic_id | string | Foreign key to epics.id (optional) |
| assignee_id | string | Foreign key to users.id (optional) |
| estimation | number | Estimated duration in days |
| priority | enum | Priority level: 'low', 'medium', 'high' |
| status | enum | Current status: 'backlog', 'ready', 'in_progress', 'review', 'done' |
| is_product_idea | boolean | Indicates if this is a product idea |
| created_by | string | Foreign key to users.id |
| created_at | timestamp | When the task was created |
| updated_at | timestamp | When the task was last updated |

## Relationships

- One user can create many epics and tasks (one-to-many)
- One user can be assigned to many tasks (one-to-many)
- One epic can contain many tasks (one-to-many)

## Views

### EpicWithTasks

Combines epic data with associated tasks and calculates progress metrics.

### UserWithTasks

Combines user data with their assigned tasks and calculates workload metrics.

## API Endpoints

### Epics

- `GET /api/epics` - Get all epics
- `GET /api/epics/:id` - Get a specific epic
- `POST /api/epics` - Create a new epic
- `PUT /api/epics/:id` - Update an epic
- `DELETE /api/epics/:id` - Delete an epic
- `GET /api/epics/:id/tasks` - Get all tasks for an epic

### Tasks

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `PUT /api/tasks/:id/status` - Update task status

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `GET /api/users/:id/tasks` - Get all tasks assigned to a user
- `PUT /api/users/:id` - Update user information
