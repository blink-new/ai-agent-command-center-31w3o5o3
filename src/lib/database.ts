import { blink } from './blink'
import type { Agent, Workflow, SystemPrompt, Project, ChatMessage } from './blink'

export class DatabaseService {
  // Agent operations
  static async createAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agent> {
    const id = `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    const newAgent: Agent = {
      ...agent,
      id,
      createdAt: now,
      updatedAt: now
    }

    await blink.db.agents.create({
      id: newAgent.id,
      name: newAgent.name,
      provider: newAgent.provider,
      model: newAgent.model,
      status: newAgent.status,
      accuracy: newAgent.accuracy,
      speed: newAgent.speed,
      context: newAgent.context,
      capabilities: JSON.stringify(newAgent.capabilities),
      cost: newAgent.cost,
      reliability: newAgent.reliability,
      userId: newAgent.userId,
      createdAt: newAgent.createdAt,
      updatedAt: newAgent.updatedAt
    })

    return newAgent
  }

  static async getAgents(userId: string): Promise<Agent[]> {
    const agents = await blink.db.agents.list({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return agents.map(agent => ({
      ...agent,
      capabilities: JSON.parse(agent.capabilities || '[]')
    }))
  }

  static async updateAgent(id: string, updates: Partial<Agent>): Promise<void> {
    const updateData: any = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    if (updates.capabilities) {
      updateData.capabilities = JSON.stringify(updates.capabilities)
    }

    await blink.db.agents.update(id, updateData)
  }

  static async deleteAgent(id: string): Promise<void> {
    await blink.db.agents.delete(id)
  }

  // Workflow operations
  static async createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workflow> {
    const id = `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    const newWorkflow: Workflow = {
      ...workflow,
      id,
      createdAt: now,
      updatedAt: now
    }

    await blink.db.workflows.create({
      id: newWorkflow.id,
      name: newWorkflow.name,
      description: newWorkflow.description || '',
      agents: JSON.stringify(newWorkflow.agents),
      steps: JSON.stringify(newWorkflow.steps),
      status: newWorkflow.status,
      userId: newWorkflow.userId,
      createdAt: newWorkflow.createdAt,
      updatedAt: newWorkflow.updatedAt
    })

    return newWorkflow
  }

  static async getWorkflows(userId: string): Promise<Workflow[]> {
    const workflows = await blink.db.workflows.list({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return workflows.map(workflow => ({
      ...workflow,
      agents: JSON.parse(workflow.agents || '[]'),
      steps: JSON.parse(workflow.steps || '[]')
    }))
  }

  static async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<void> {
    const updateData: any = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    if (updates.agents) {
      updateData.agents = JSON.stringify(updates.agents)
    }
    if (updates.steps) {
      updateData.steps = JSON.stringify(updates.steps)
    }

    await blink.db.workflows.update(id, updateData)
  }

  static async deleteWorkflow(id: string): Promise<void> {
    await blink.db.workflows.delete(id)
  }

  // System Prompt operations
  static async createSystemPrompt(prompt: Omit<SystemPrompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<SystemPrompt> {
    const id = `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    const newPrompt: SystemPrompt = {
      ...prompt,
      id,
      createdAt: now,
      updatedAt: now
    }

    await blink.db.systemPrompts.create({
      id: newPrompt.id,
      name: newPrompt.name,
      description: newPrompt.description || '',
      template: newPrompt.template,
      category: newPrompt.category,
      tags: JSON.stringify(newPrompt.tags),
      userId: newPrompt.userId,
      createdAt: newPrompt.createdAt,
      updatedAt: newPrompt.updatedAt
    })

    return newPrompt
  }

  static async getSystemPrompts(userId: string): Promise<SystemPrompt[]> {
    const prompts = await blink.db.systemPrompts.list({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return prompts.map(prompt => ({
      ...prompt,
      tags: JSON.parse(prompt.tags || '[]')
    }))
  }

  static async updateSystemPrompt(id: string, updates: Partial<SystemPrompt>): Promise<void> {
    const updateData: any = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    if (updates.tags) {
      updateData.tags = JSON.stringify(updates.tags)
    }

    await blink.db.systemPrompts.update(id, updateData)
  }

  static async deleteSystemPrompt(id: string): Promise<void> {
    await blink.db.systemPrompts.delete(id)
  }

  // Project operations
  static async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    const id = `project_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    
    const newProject: Project = {
      ...project,
      id,
      createdAt: now,
      updatedAt: now
    }

    await blink.db.projects.create({
      id: newProject.id,
      name: newProject.name,
      description: newProject.description || '',
      type: newProject.type,
      agents: JSON.stringify(newProject.agents),
      workflows: JSON.stringify(newProject.workflows),
      status: newProject.status,
      userId: newProject.userId,
      createdAt: newProject.createdAt,
      updatedAt: newProject.updatedAt
    })

    return newProject
  }

  static async getProjects(userId: string): Promise<Project[]> {
    const projects = await blink.db.projects.list({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return projects.map(project => ({
      ...project,
      agents: JSON.parse(project.agents || '[]'),
      workflows: JSON.parse(project.workflows || '[]')
    }))
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    const updateData: any = {
      ...updates,
      updatedAt: new Date().toISOString()
    }

    if (updates.agents) {
      updateData.agents = JSON.stringify(updates.agents)
    }
    if (updates.workflows) {
      updateData.workflows = JSON.stringify(updates.workflows)
    }

    await blink.db.projects.update(id, updateData)
  }

  static async deleteProject(id: string): Promise<void> {
    await blink.db.projects.delete(id)
  }

  // Chat Message operations
  static async createChatMessage(message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> {
    const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const newMessage: ChatMessage = {
      ...message,
      id
    }

    await blink.db.chatMessages.create({
      id: newMessage.id,
      role: newMessage.role,
      content: newMessage.content,
      agentId: newMessage.agentId || null,
      timestamp: newMessage.timestamp,
      userId: newMessage.userId
    })

    return newMessage
  }

  static async getChatMessages(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    const messages = await blink.db.chatMessages.list({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      limit
    })

    return messages.reverse() // Return in chronological order
  }

  static async deleteChatMessage(id: string): Promise<void> {
    await blink.db.chatMessages.delete(id)
  }

  // Initialize default data
  static async initializeDefaultData(userId: string): Promise<void> {
    // Check if user already has data
    const existingAgents = await this.getAgents(userId)
    if (existingAgents.length > 0) return

    // Create default agents
    const defaultAgents = [
      {
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        model: 'openai/gpt-4-turbo',
        status: 'connected' as const,
        accuracy: 8.9,
        speed: 48,
        context: '128K',
        capabilities: ['Multimodal', 'Code Generation', 'Function Calling', 'JSON Mode'],
        cost: 0.03,
        reliability: 99.2,
        userId
      },
      {
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        model: 'anthropic/claude-3.5-sonnet',
        status: 'connected' as const,
        accuracy: 9.5,
        speed: 42,
        context: '200K',
        capabilities: ['Text Analysis', 'Code Generation', 'Reasoning', 'Creative Writing'],
        cost: 0.015,
        reliability: 99.5,
        userId
      },
      {
        name: 'Gemini Pro',
        provider: 'Google',
        model: 'google/gemini-pro',
        status: 'connected' as const,
        accuracy: 8.5,
        speed: 51,
        context: '1M',
        capabilities: ['Multimodal', 'Long Context', 'Code Generation', 'Reasoning'],
        cost: 0.0005,
        reliability: 98.8,
        userId
      },
      {
        name: 'KIMI K2',
        provider: 'Moonshot AI',
        model: 'moonshotai/kimi-k2:free',
        status: 'connected' as const,
        accuracy: 8.8,
        speed: 45,
        context: '200K',
        capabilities: ['Long Context', 'Multilingual', 'Text Analysis', 'Free Tier'],
        cost: 0.0,
        reliability: 98.1,
        userId
      }
    ]

    for (const agent of defaultAgents) {
      await this.createAgent(agent)
    }

    // Create default system prompts
    const defaultPrompts = [
      {
        name: 'Code Assistant',
        description: 'Expert programming assistant for code generation and review',
        template: 'You are an expert programmer. Provide clean, efficient, and well-documented code solutions. Always include error handling and follow best practices.',
        category: 'development',
        tags: ['coding', 'programming', 'development'],
        userId
      },
      {
        name: 'Creative Writer',
        description: 'Creative writing assistant for stories, articles, and content',
        template: 'You are a creative writing assistant. Help users craft engaging stories, articles, and creative content with vivid descriptions and compelling narratives.',
        category: 'creative',
        tags: ['writing', 'creative', 'content'],
        userId
      },
      {
        name: 'Data Analyst',
        description: 'Data analysis and insights generation assistant',
        template: 'You are a data analyst expert. Analyze data, identify patterns, generate insights, and provide actionable recommendations based on the information provided.',
        category: 'analysis',
        tags: ['data', 'analysis', 'insights'],
        userId
      }
    ]

    for (const prompt of defaultPrompts) {
      await this.createSystemPrompt(prompt)
    }
  }
}