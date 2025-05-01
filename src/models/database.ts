
// This file defines our database schema and models

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role: 'admin' | 'member' | 'viewer';
  created_at: string;
}

export interface Epic {
  id: string;
  title: string;
  description: string;
  estimation: number; // in days
  status: 'planning' | 'in_progress' | 'completed';
  created_by: string; // user_id
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  epic_id?: string; // Optional as some tasks might not be part of an epic
  assignee_id?: string; // Optional as tasks can be unassigned
  estimation: number; // in days
  priority: 'low' | 'medium' | 'high';
  status: 'backlog' | 'ready' | 'in_progress' | 'review' | 'done';
  is_product_idea: boolean; // To differentiate between regular tasks and product ideas
  created_by: string; // user_id
  created_at: string;
  updated_at: string;
}

// Database Views / Aggregations
export interface EpicWithTasks extends Epic {
  tasks: Task[];
  completion_percentage: number;
  total_estimation: number;
}

export interface UserWithTasks extends User {
  assigned_tasks: Task[];
  total_workload: number;
}

// Define the table names for use in API calls
export const TABLES = {
  USERS: 'users',
  EPICS: 'epics',
  TASKS: 'tasks'
};
