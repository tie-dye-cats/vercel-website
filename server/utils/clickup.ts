/**
 * clickup.ts
 *
 * This module provides utility functions for creating ClickUp tasks from form submissions.
 * It uses the clickupClient for API interactions.
 */

import { createTask, TaskData, ClickUpError } from './clickupClient';
import type { TaskResponse } from './clickupClient';

export interface FormSubmissionParams {
  submissionId?: string;
  firstName: string;
  email: string;
  phone: string;
  question: string;
  marketingConsent?: boolean;
  communicationConsent?: boolean;
  company?: string;
}

export async function createTaskFromForm(params: FormSubmissionParams): Promise<TaskResponse> {
  if (!process.env.CLICKUP_API_TOKEN || !process.env.CLICKUP_LIST_ID) {
    throw new Error('CLICKUP_API_TOKEN or CLICKUP_LIST_ID environment variable is not set');
  }

  try {
    const taskName = `New Lead: ${params.firstName}`;
    const taskDescription = `**Lead Details:**
- Name: ${params.firstName}
- Email: ${params.email}
- Phone: ${params.phone || 'Not provided'}
- Company: ${params.company || 'Not provided'}
- Submission ID: ${params.submissionId}

**Question:**
${params.question}

Marketing Consent: ${params.marketingConsent ? 'Yes' : 'No'}
Communication Consent: ${params.communicationConsent ? 'Yes' : 'No'}

Submitted: ${new Date().toLocaleDateString()}`;

    return await createTask({
      name: taskName,
      description: taskDescription,
      status: 'to do',
      priority: 3,
      due_date: null,
      start_date: null,
      assignees: [],
      tags: [],
      custom_fields: []
    });
  } catch (error: any) {
    console.error('Error creating ClickUp task:', error);
    throw new Error(error.message || 'Failed to create ClickUp task');
  }
} 