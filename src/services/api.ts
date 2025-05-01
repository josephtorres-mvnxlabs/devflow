
import { Epic, Task, User, TABLES } from '../models/database';

// Base API URL - In a real app, this would come from environment variables
const API_BASE_URL = '/api';

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Epic related API calls
export const epicApi = {
  getAll: () => fetchAPI<Epic[]>(`/${TABLES.EPICS}`),
  
  getById: (id: string) => fetchAPI<Epic>(`/${TABLES.EPICS}/${id}`),
  
  create: (epic: Omit<Epic, 'id' | 'created_at' | 'updated_at' | 'status'>) => 
    fetchAPI<Epic>(`/${TABLES.EPICS}`, 'POST', {
      ...epic,
      status: 'planning',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }),
  
  update: (id: string, epic: Partial<Omit<Epic, 'id' | 'created_at' | 'created_by'>>) => 
    fetchAPI<Epic>(`/${TABLES.EPICS}/${id}`, 'PUT', {
      ...epic,
      updated_at: new Date().toISOString()
    }),
  
  delete: (id: string) => fetchAPI<void>(`/${TABLES.EPICS}/${id}`, 'DELETE'),
  
  getWithTasks: (id: string) => fetchAPI<Epic & { tasks: Task[] }>(`/${TABLES.EPICS}/${id}/tasks`)
};

// Task related API calls
export const taskApi = {
  getAll: () => fetchAPI<Task[]>(`/${TABLES.TASKS}`),
  
  getByEpic: (epicId: string) => fetchAPI<Task[]>(`/${TABLES.EPICS}/${epicId}/tasks`),
  
  getById: (id: string) => fetchAPI<Task>(`/${TABLES.TASKS}/${id}`),
  
  create: (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'status'>) => 
    fetchAPI<Task>(`/${TABLES.TASKS}`, 'POST', {
      ...task,
      status: task.is_product_idea ? 'backlog' : 'ready',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }),
  
  update: (id: string, task: Partial<Omit<Task, 'id' | 'created_at' | 'created_by'>>) => 
    fetchAPI<Task>(`/${TABLES.TASKS}/${id}`, 'PUT', {
      ...task,
      updated_at: new Date().toISOString()
    }),
  
  delete: (id: string) => fetchAPI<void>(`/${TABLES.TASKS}/${id}`, 'DELETE'),
  
  updateStatus: (id: string, status: Task['status']) => 
    fetchAPI<Task>(`/${TABLES.TASKS}/${id}/status`, 'PUT', { status })
};

// User related API calls
export const userApi = {
  getAll: () => fetchAPI<User[]>(`/${TABLES.USERS}`),
  
  getById: (id: string) => fetchAPI<User>(`/${TABLES.USERS}/${id}`),
  
  getWithTasks: (id: string) => fetchAPI<User & { assigned_tasks: Task[] }>(`/${TABLES.USERS}/${id}/tasks`),
  
  update: (id: string, user: Partial<Omit<User, 'id' | 'created_at'>>) => 
    fetchAPI<User>(`/${TABLES.USERS}/${id}`, 'PUT', user)
};

export default {
  epics: epicApi,
  tasks: taskApi,
  users: userApi,
};
