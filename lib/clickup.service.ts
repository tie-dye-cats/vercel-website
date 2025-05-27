import { 
  ClickUpTask, 
  CreateTaskParams, 
  ClickUpApiResponse, 
  ClickUpConfig, 
  LeadTaskData, 
  ClickUpTaskResult,
  ClickUpCustomFields 
} from './clickup.types'

export class ClickUpService {
  private apiKey: string
  private listId: string
  private baseUrl: string
  private customFields: ClickUpCustomFields

  constructor(config: ClickUpConfig, customFields: ClickUpCustomFields = {}) {
    this.apiKey = config.apiKey
    this.listId = config.listId
    this.baseUrl = config.baseUrl || 'https://api.clickup.com/api/v2'
    this.customFields = customFields
  }

  /**
   * Create a task in ClickUp for a new lead
   */
  async createLeadTask(leadData: LeadTaskData): Promise<ClickUpTaskResult> {
    try {
      const taskData: CreateTaskParams = {
        name: `New Lead: ${leadData.firstName} - ${leadData.email}`,
        description: this.formatLeadDescription(leadData),
        tags: [leadData.source, 'lead', 'new'],
        priority: 3, // Normal priority
        notify_all: false,
        custom_fields: this.buildCustomFields(leadData)
      }

      const response = await this.createTask(taskData)
      
      if (response.success && response.data) {
        return {
          success: true,
          taskId: response.data.id,
          taskUrl: response.data.url
        }
      } else {
        return {
          success: false,
          error: response.error || 'Failed to create task'
        }
      }
    } catch (error) {
      console.error('ClickUp createLeadTask error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Create a task in ClickUp
   */
  async createTask(params: CreateTaskParams): Promise<ClickUpApiResponse<ClickUpTask>> {
    try {
      const url = `${this.baseUrl}/list/${this.listId}/task`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.err || data.error || `HTTP ${response.status}`,
          statusCode: response.status
        }
      }

      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('ClickUp API error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  /**
   * Get a task by ID
   */
  async getTask(taskId: string, includeSubtasks: boolean = false): Promise<ClickUpApiResponse<ClickUpTask>> {
    try {
      const url = `${this.baseUrl}/task/${taskId}${includeSubtasks ? '?include_subtasks=true' : ''}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.err || data.error || `HTTP ${response.status}`,
          statusCode: response.status
        }
      }

      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('ClickUp getTask error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  /**
   * Update a task
   */
  async updateTask(taskId: string, params: Partial<CreateTaskParams>): Promise<ClickUpApiResponse<ClickUpTask>> {
    try {
      const url = `${this.baseUrl}/task/${taskId}`
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.err || data.error || `HTTP ${response.status}`,
          statusCode: response.status
        }
      }

      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('ClickUp updateTask error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  /**
   * Add a comment to a task
   */
  async addTaskComment(taskId: string, comment: string): Promise<ClickUpApiResponse> {
    try {
      const url = `${this.baseUrl}/task/${taskId}/comment`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          comment_text: comment
        })
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.err || data.error || `HTTP ${response.status}`,
          statusCode: response.status
        }
      }

      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('ClickUp addTaskComment error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }

  /**
   * Format lead data into a readable task description
   */
  private formatLeadDescription(leadData: LeadTaskData): string {
    const lines = [
      `**New Lead Submission**`,
      ``,
      `**Contact Information:**`,
      `• Name: ${leadData.firstName}`,
      `• Email: ${leadData.email}`,
    ]

    if (leadData.phone) {
      lines.push(`• Phone: ${leadData.phone}`)
    }

    lines.push(
      ``,
      `**Lead Details:**`,
      `• Source: ${leadData.source}`,
      `• Date: ${new Date(leadData.leadDate).toLocaleDateString()}`,
      `• Lead ID: ${leadData.leadId}`,
      ``,
      `**Question/Message:**`,
      `${leadData.question}`,
      ``,
      `---`,
      `*This task was automatically created from a lead form submission.*`
    )

    return lines.join('\n')
  }

  /**
   * Build custom fields array for the task
   */
  private buildCustomFields(leadData: LeadTaskData): Array<{ id: string; value: any }> {
    const customFields: Array<{ id: string; value: any }> = []

    // Add custom fields if IDs are configured
    if (this.customFields.EMAIL_FIELD_ID) {
      customFields.push({
        id: this.customFields.EMAIL_FIELD_ID,
        value: leadData.email
      })
    }

    if (this.customFields.PHONE_FIELD_ID && leadData.phone) {
      customFields.push({
        id: this.customFields.PHONE_FIELD_ID,
        value: leadData.phone
      })
    }

    if (this.customFields.SOURCE_FIELD_ID) {
      customFields.push({
        id: this.customFields.SOURCE_FIELD_ID,
        value: leadData.source
      })
    }

    if (this.customFields.LEAD_DATE_FIELD_ID) {
      customFields.push({
        id: this.customFields.LEAD_DATE_FIELD_ID,
        value: leadData.leadDate
      })
    }

    if (this.customFields.LEAD_ID_FIELD_ID) {
      customFields.push({
        id: this.customFields.LEAD_ID_FIELD_ID,
        value: leadData.leadId.toString()
      })
    }

    return customFields
  }

  /**
   * Test the ClickUp connection
   */
  async testConnection(): Promise<ClickUpApiResponse> {
    try {
      const url = `${this.baseUrl}/user`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.err || data.error || `HTTP ${response.status}`,
          statusCode: response.status
        }
      }

      return {
        success: true,
        data: data
      }
    } catch (error) {
      console.error('ClickUp testConnection error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      }
    }
  }
} 