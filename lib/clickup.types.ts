// ClickUp API Types for Lead Management Integration

export interface ClickUpTask {
  id: string
  name: string
  description?: string
  status: {
    status: string
    color: string
    type: string
    orderindex: number
  }
  orderindex: string
  date_created: string
  date_updated: string
  date_closed?: string
  creator: {
    id: number
    username: string
    email: string
  }
  assignees: Array<{
    id: number
    username: string
    email: string
  }>
  watchers: Array<{
    id: number
    username: string
    email: string
  }>
  checklists: any[]
  tags: Array<{
    name: string
    tag_fg: string
    tag_bg: string
  }>
  parent?: string
  priority?: {
    priority: string
    color: string
  }
  due_date?: string
  start_date?: string
  points?: number
  time_estimate?: number
  custom_fields: Array<{
    id: string
    name: string
    type: string
    value?: any
  }>
  dependencies: any[]
  linked_tasks: any[]
  team_id: string
  url: string
}

export interface CreateTaskParams {
  name: string
  description?: string
  assignees?: number[]
  tags?: string[]
  status?: string
  priority?: number
  due_date?: number
  due_date_time?: boolean
  time_estimate?: number
  start_date?: number
  start_date_time?: boolean
  notify_all?: boolean
  parent?: string
  links_to?: string
  check_required_custom_fields?: boolean
  custom_fields?: Array<{
    id: string
    value: any
  }>
}

export interface ClickUpApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  statusCode?: number
}

export interface ClickUpConfig {
  apiKey: string
  listId: string
  baseUrl?: string
}

export interface LeadTaskData {
  leadId: number
  firstName: string
  email: string
  phone?: string
  question: string
  source: string
  leadDate: string
}

// Custom field mappings for lead data
export interface ClickUpCustomFields {
  EMAIL_FIELD_ID?: string
  PHONE_FIELD_ID?: string
  SOURCE_FIELD_ID?: string
  LEAD_DATE_FIELD_ID?: string
  LEAD_ID_FIELD_ID?: string
}

export interface ClickUpTaskResult {
  success: boolean
  taskId?: string
  taskUrl?: string
  error?: string
} 