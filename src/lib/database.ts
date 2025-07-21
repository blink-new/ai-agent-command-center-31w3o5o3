import { createClient } from '@blinkdotnew/sdk'

const blink = createClient({
  projectId: 'ai-agent-command-center-31w3o5o3',
  authRequired: true
})

export interface Agent {
  id: string
  name: string
  provider: string
  model: string
  status: 'connected' | 'available' | 'error'
  capabilities: string[]
  stats: {
    accuracy: number
    speed: number
    context: string
  }
  apiKey?: string
  systemPrompt?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Workflow {
  id: string
  name: string
  description: string
  nodes: any[]
  connections: any[]
  status: 'draft' | 'active' | 'paused'
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  name: string
  description: string
  type: string
  status: 'planning' | 'development' | 'testing' | 'deployed'
  agents: string[]
  workflows: string[]
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Prompt {
  id: string
  name: string
  content: string
  category: string
  tags: string[]
  userId: string
  createdAt: string
  updatedAt: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  agentId?: string
  timestamp: string
  userId: string
}

class DatabaseService {
  async getAgents(): Promise<Agent[]> {
    try {
      const agents = await blink.db.agents.list({
        where: { userId: (await blink.auth.me()).id },
        orderBy: { createdAt: 'desc' }
      })
      return agents
    } catch (error) {
      console.error('Error fetching agents:', error)
      return []
    }
  }

  async createAgent(agent: Omit<Agent, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Agent> {
    const user = await blink.auth.me()
    const newAgent = {
      ...agent,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return await blink.db.agents.create(newAgent)
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
    const updatedAgent = {
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return await blink.db.agents.update(id, updatedAgent)
  }

  async deleteAgent(id: string): Promise<void> {
    await blink.db.agents.delete(id)
  }

  async getWorkflows(): Promise<Workflow[]> {
    try {
      const workflows = await blink.db.workflows.list({
        where: { userId: (await blink.auth.me()).id },
        orderBy: { createdAt: 'desc' }
      })
      return workflows
    } catch (error) {
      console.error('Error fetching workflows:', error)
      return []
    }
  }

  async createWorkflow(workflow: Omit<Workflow, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Workflow> {
    const user = await blink.auth.me()
    const newWorkflow = {
      ...workflow,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return await blink.db.workflows.create(newWorkflow)
  }

  async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<Workflow> {
    const updatedWorkflow = {
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return await blink.db.workflows.update(id, updatedWorkflow)
  }

  async deleteWorkflow(id: string): Promise<void> {
    await blink.db.workflows.delete(id)
  }

  async getProjects(): Promise<Project[]> {
    try {
      const projects = await blink.db.projects.list({
        where: { userId: (await blink.auth.me()).id },
        orderBy: { createdAt: 'desc' }
      })
      return projects
    } catch (error) {
      console.error('Error fetching projects:', error)
      return []
    }
  }

  async createProject(project: Omit<Project, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const user = await blink.auth.me()
    const newProject = {
      ...project,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return await blink.db.projects.create(newProject)
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const updatedProject = {
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return await blink.db.projects.update(id, updatedProject)
  }

  async deleteProject(id: string): Promise<void> {
    await blink.db.projects.delete(id)
  }

  async getPrompts(): Promise<Prompt[]> {
    try {
      const prompts = await blink.db.prompts.list({
        where: { userId: (await blink.auth.me()).id },
        orderBy: { createdAt: 'desc' }
      })
      return prompts
    } catch (error) {
      console.error('Error fetching prompts:', error)
      return []
    }
  }

  async createPrompt(prompt: Omit<Prompt, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Prompt> {
    const user = await blink.auth.me()
    const newPrompt = {
      ...prompt,
      userId: user.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    return await blink.db.prompts.create(newPrompt)
  }

  async updatePrompt(id: string, updates: Partial<Prompt>): Promise<Prompt> {
    const updatedPrompt = {
      ...updates,
      updatedAt: new Date().toISOString()
    }
    return await blink.db.prompts.update(id, updatedPrompt)
  }

  async deletePrompt(id: string): Promise<void> {
    await blink.db.prompts.delete(id)
  }

  async getChatMessages(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    try {
      const messages = await blink.db.chatMessages.list({
        where: { userId },
        orderBy: { timestamp: 'asc' },
        limit
      })
      return messages
    } catch (error) {
      console.error('Error fetching chat messages:', error)
      return []
    }
  }

  async createChatMessage(message: ChatMessage): Promise<ChatMessage> {
    return await blink.db.chatMessages.create(message)
  }

  async initializeDefaultData(): Promise<void> {
    try {
      const user = await blink.auth.me()
      
      // Check if user already has data
      const existingAgents = await this.getAgents()
      if (existingAgents.length > 0) {
        return // User already has data, don't initialize
      }

      // Create default agents
      const defaultAgents = [
        {
          name: 'Claude 3.5 Sonnet',
          provider: 'Anthropic',
          model: 'claude-3-5-sonnet-20241022',
          status: 'connected' as const,
          capabilities: ['Text Analysis', 'Code Generation', 'Reasoning', 'Creative Writing'],
          stats: { accuracy: 9.5, speed: 42, context: '200K' },
          systemPrompt: 'You are Claude, a helpful AI assistant created by Anthropic.'
        },
        {
          name: 'GPT-4 Turbo',
          provider: 'OpenAI',
          model: 'gpt-4-turbo-preview',
          status: 'connected' as const,
          capabilities: ['Multimodal', 'Code Generation', 'Function Calling', 'JSON Mode'],
          stats: { accuracy: 8.9, speed: 48, context: '128K' },
          systemPrompt: 'You are GPT-4, a large language model trained by OpenAI.'
        },
        {
          name: 'Gemini Pro',
          provider: 'Google',
          model: 'gemini-pro',
          status: 'connected' as const,
          capabilities: ['Multimodal', 'Long Context', 'Code Generation', 'Reasoning'],
          stats: { accuracy: 8.5, speed: 51, context: '1M' },
          systemPrompt: 'You are Gemini, a helpful AI assistant created by Google.'
        }
      ]

      for (const agent of defaultAgents) {
        await this.createAgent(agent)
      }

      // Create default workflow
      await this.createWorkflow({
        name: 'Multi-Agent Research Pipeline',
        description: 'A workflow that uses multiple AI agents to research, analyze, and synthesize information',
        nodes: [],
        connections: [],
        status: 'draft'
      })

      // Create default project
      await this.createProject({
        name: 'AI Content Generator',
        description: 'A project to build an AI-powered content generation system',
        type: 'Web Application',
        status: 'planning',
        agents: [],
        workflows: []
      })

      // Create default prompts
      const defaultPrompts = [
        {
          name: 'Code Review Assistant',
          content: 'You are an expert code reviewer. Analyze the provided code for:\n1. Code quality and best practices\n2. Potential bugs or security issues\n3. Performance improvements\n4. Readability and maintainability\n\nProvide specific, actionable feedback.',
          category: 'Development',
          tags: ['code-review', 'development', 'quality-assurance']
        },
        {
          name: 'Creative Writing Helper',
          content: 'You are a creative writing assistant. Help the user with:\n1. Story development and plot structure\n2. Character development\n3. Dialogue improvement\n4. Writing style and tone\n\nBe encouraging and provide constructive feedback.',
          category: 'Creative',
          tags: ['writing', 'creative', 'storytelling']
        }
      ]

      for (const prompt of defaultPrompts) {
        await this.createPrompt(prompt)
      }

    } catch (error) {
      console.error('Error initializing default data:', error)
    }
  }
}

export const db = new DatabaseService()