import { createClient } from '@blinkdotnew/sdk'

export const blink = createClient({
  projectId: 'ai-agent-command-center-31w3o5o3',
  authRequired: true
})

// Database types
export interface Agent {
  id: string
  name: string
  provider: string
  model: string
  status: 'connected' | 'available' | 'error'
  accuracy: number
  speed: number
  context: string
  capabilities: string[]
  cost: number
  reliability: number
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  agents: string[]
  steps: WorkflowStep[]
  status: 'draft' | 'active' | 'paused'
  userId: string
  createdAt: string
  updatedAt: string
}

export interface WorkflowStep {
  id: string
  type: 'prompt' | 'agent_call' | 'condition' | 'merge'
  agentId?: string
  prompt?: string
  conditions?: any
  position: { x: number; y: number }
}

export interface SystemPrompt {
  id: string
  name: string
  description: string
  template: string
  category: string
  tags: string[]
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  type: 'web_app' | 'api' | 'chatbot' | 'automation'
  agents: string[]
  workflows: string[]
  status: 'planning' | 'development' | 'testing' | 'deployed'
  userId: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  agentId?: string
  timestamp: string
  userId: string
}