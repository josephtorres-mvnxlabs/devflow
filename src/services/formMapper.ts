
import { Epic, Task } from '../models/database';

// Map EpicSubmissionForm data to Epic database model
export function mapEpicFormToDatabase(formData: {
  title: string;
  description: string;
  estimation: number;
}, userId: string): Omit<Epic, 'id' | 'created_at' | 'updated_at' | 'status'> {
  return {
    title: formData.title,
    description: formData.description,
    estimation: formData.estimation,
    created_by: userId,
  };
}

// Map TaskSubmissionForm data to Task database model
export function mapTaskFormToDatabase(formData: {
  title: string;
  description: string;
  epic?: string;
  assignee?: string;
  estimation: number;
  priority: 'low' | 'medium' | 'high';
}, userId: string, isProductIdea: boolean = false): Omit<Task, 'id' | 'created_at' | 'updated_at' | 'status'> {
  return {
    title: formData.title,
    description: formData.description,
    epic_id: formData.epic,
    assignee_id: formData.assignee,
    estimation: formData.estimation,
    priority: formData.priority,
    is_product_idea: isProductIdea,
    created_by: userId,
  };
}

// Map database Epic model to form data
export function mapDatabaseToEpicForm(epic: Epic): {
  title: string;
  description: string;
  estimation: number;
} {
  return {
    title: epic.title,
    description: epic.description,
    estimation: epic.estimation,
  };
}

// Map database Task model to form data
export function mapDatabaseToTaskForm(task: Task): {
  title: string;
  description: string;
  epic?: string;
  assignee?: string;
  estimation: number;
  priority: 'low' | 'medium' | 'high';
} {
  return {
    title: task.title,
    description: task.description,
    epic: task.epic_id,
    assignee: task.assignee_id,
    estimation: task.estimation,
    priority: task.priority,
  };
}
