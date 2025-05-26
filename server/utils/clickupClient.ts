/**
 * clickupClient.ts
 *
 * This module initializes the ClickUp client using the official ClickUp API.
 * It provides functions to create tasks and manage them.
 *
 * Prerequisites:
 *  - Ensure the environment variable CLICKUP_API_TOKEN is set.
 *  - Ensure the environment variable CLICKUP_LIST_ID is set.
 */

import axios from 'axios';

const CLICKUP_API_TOKEN = process.env.CLICKUP_API_TOKEN;
const CLICKUP_LIST_ID = process.env.CLICKUP_LIST_ID;

if (!CLICKUP_API_TOKEN || !CLICKUP_LIST_ID) {
  console.warn('ClickUp configuration is missing. Task creation will be disabled.');
}

const clickupClient = axios.create({
  baseURL: 'https://api.clickup.com/api/v2',
  headers: {
    'Authorization': CLICKUP_API_TOKEN,
    'Content-Type': 'application/json'
  }
});

export interface TaskData {
  name: string;
  description: string;
  assignees?: number[];
  tags?: string[];
  status: string;
  priority: number;
  due_date: number | null;
  start_date: number | null;
  time_estimate?: number;
  custom_fields?: any[];
}

export interface TaskResponse {
  id: string;
  name: string;
  status: {
    id: string;
    status: string;
    color: string;
    orderindex: number;
    type: string;
  };
  url: string;
}

export class ClickUpError extends Error {
  constructor(
    message: string,
    public type: 'API' | 'NETWORK' | 'VALIDATION' | 'UNEXPECTED',
    public details?: any
  ) {
    super(message);
    this.name = 'ClickUpError';
  }
}

export async function createTask(taskData: TaskData): Promise<TaskResponse> {
  if (!CLICKUP_API_TOKEN || !CLICKUP_LIST_ID) {
    throw new ClickUpError(
      'ClickUp configuration is missing',
      'VALIDATION',
      { missing: { token: !CLICKUP_API_TOKEN, listId: !CLICKUP_LIST_ID } }
    );
  }

  try {
    console.log('🔍 ClickUp Configuration:', {
      hasToken: true,
      tokenLength: CLICKUP_API_TOKEN.length,
      tokenPrefix: CLICKUP_API_TOKEN.substring(0, 4),
      listId: CLICKUP_LIST_ID,
      listIdFormat: 'Valid'
    });

    console.log('📝 Creating ClickUp task with data:', {
      listId: CLICKUP_LIST_ID,
      taskData
    });

    const response = await clickupClient.post(`/list/${CLICKUP_LIST_ID}/task`, taskData);
    
    console.log('✅ ClickUp task created successfully:', {
      taskId: response.data.id,
      taskName: response.data.name,
      status: response.data.status,
      url: response.data.url
    });

    return response.data;
  } catch (error: any) {
    // API Error (response received but status code indicates error)
    if (error.response) {
      console.error('API Error:', error.response.data);
      throw new ClickUpError(
        `API Error: ${error.response.data.err || 'Something went wrong'}`,
        'API',
        error.response.data
      );
    }
    // Network Error (no response received)
    else if (error.request) {
      console.error('Network Error:', error.request);
      throw new ClickUpError(
        'Network Error: Unable to reach the server',
        'NETWORK',
        error.request
      );
    }
    // Other errors (e.g., coding issues)
    else {
      console.error('Unexpected Error:', error.message);
      throw new ClickUpError(
        `Unexpected Error: ${error.message}`,
        'UNEXPECTED',
        error
      );
    }
  }
}

export async function getTask(taskId: string): Promise<TaskResponse> {
  if (!CLICKUP_API_TOKEN) {
    throw new ClickUpError('ClickUp API token is missing', 'VALIDATION');
  }

  try {
    const response = await clickupClient.get(`/task/${taskId}`);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new ClickUpError(
        `API Error: ${error.response.data.err || 'Failed to get task'}`,
        'API',
        error.response.data
      );
    } else if (error.request) {
      throw new ClickUpError('Network Error: Unable to reach the server', 'NETWORK');
    } else {
      throw new ClickUpError(`Unexpected Error: ${error.message}`, 'UNEXPECTED');
    }
  }
}

export async function updateTask(taskId: string, updates: Partial<TaskData>): Promise<TaskResponse> {
  if (!CLICKUP_API_TOKEN) {
    throw new ClickUpError('ClickUp API token is missing', 'VALIDATION');
  }

  try {
    const response = await clickupClient.put(`/task/${taskId}`, updates);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new ClickUpError(
        `API Error: ${error.response.data.err || 'Failed to update task'}`,
        'API',
        error.response.data
      );
    } else if (error.request) {
      throw new ClickUpError('Network Error: Unable to reach the server', 'NETWORK');
    } else {
      throw new ClickUpError(`Unexpected Error: ${error.message}`, 'UNEXPECTED');
    }
  }
} 