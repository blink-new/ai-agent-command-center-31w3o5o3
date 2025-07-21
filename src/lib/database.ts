import { blink } from './blink'
import type { Agent, Workflow, SystemPrompt, Project, ChatMessage } from './blink'

// Rate limiting and caching
const RATE_LIMIT_DELAY = 1000 // 1 second between requests
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>()

class RateLimiter {
  private lastRequest = 0
  private queue: Array<() => Promise<any>> = []
  private processing = false

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const now = Date.now()
          const timeSinceLastRequest = now - this.lastRequest
          
          if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
            await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest))
          }
          
          this.lastRequest = Date.now()
          const result = await fn()
          resolve(result)
        } catch (error) {
          if (error.status === 429) {
            // Rate limited - wait and retry
            const retryAfter = error.details?.reset ? 
              new Date(error.details.reset).getTime() - Date.now() : 
              60000 // Default 1 minute
            
            console.warn(`Rate limited. Retrying after ${Math.ceil(retryAfter / 1000)} seconds...`)
            await new Promise(resolve => setTimeout(resolve, retryAfter))
            
            try {
              const result = await fn()
              resolve(result)
            } catch (retryError) {
              reject(retryError)
            }
          } else {
            reject(error)
          }
        }
      })
      
      this.processQueue()
    })
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return
    
    this.processing = true
    
    while (this.queue.length > 0) {
      const task = this.queue.shift()!
      await task()
    }
    
    this.processing = false
  }
}

const rateLimiter = new RateLimiter()

function getCacheKey(operation: string, userId: string, params?: any): string {
  return `${operation}:${userId}:${params ? JSON.stringify(params) : ''}`
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  cache.delete(key)
  return null
}

function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export class DatabaseService {
  // Agent operations
  static async createAgent(agent: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>): Promise<Agent> {
    return rateLimiter.execute(async () => {
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
        userId: newAgent.userId, // Blink SDK will convert to user_id
        createdAt: newAgent.createdAt, // Blink SDK will convert to created_at
        updatedAt: newAgent.updatedAt // Blink SDK will convert to updated_at
      })

      // Clear cache
      const cacheKey = getCacheKey('agents', newAgent.userId)
      cache.delete(cacheKey)

      return newAgent
    })
  }

  static async getAgents(userId: string): Promise<Agent[]> {
    const cacheKey = getCacheKey('agents', userId)
    const cached = getFromCache<Agent[]>(cacheKey)
    if (cached) return cached

    return rateLimiter.execute(async () => {
      const agents = await blink.db.agents.list({
        where: { userId }, // Blink SDK will convert to user_id
        orderBy: { createdAt: 'desc' } // Blink SDK will convert to created_at
      })

      const result = agents.map(agent => ({
        ...agent,
        capabilities: JSON.parse(agent.capabilities || '[]')
      }))

      setCache(cacheKey, result)
      return result
    })
  }

  static async updateAgent(id: string, updates: Partial<Agent>): Promise<void> {
    return rateLimiter.execute(async () => {
      const updateData: any = {
        ...updates,
        updatedAt: new Date().toISOString() // Blink SDK will convert to updated_at
      }

      if (updates.capabilities) {
        updateData.capabilities = JSON.stringify(updates.capabilities)
      }

      await blink.db.agents.update(id, updateData)

      // Clear cache for this user
      if (updates.userId) {
        const cacheKey = getCacheKey('agents', updates.userId)
        cache.delete(cacheKey)
      }
    })
  }

  static async deleteAgent(id: string): Promise<void> {
    return rateLimiter.execute(async () => {
      await blink.db.agents.delete(id)
      // Clear all agent caches (we don't know which user this belongs to)
      for (const key of cache.keys()) {
        if (key.startsWith('agents:')) {
          cache.delete(key)
        }
      }
    })
  }

  // Workflow operations
  static async createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workflow> {
    return rateLimiter.execute(async () => {
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

      const cacheKey = getCacheKey('workflows', newWorkflow.userId)
      cache.delete(cacheKey)

      return newWorkflow
    })
  }

  static async getWorkflows(userId: string): Promise<Workflow[]> {
    const cacheKey = getCacheKey('workflows', userId)
    const cached = getFromCache<Workflow[]>(cacheKey)
    if (cached) return cached

    return rateLimiter.execute(async () => {
      const workflows = await blink.db.workflows.list({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })

      const result = workflows.map(workflow => ({
        ...workflow,
        agents: JSON.parse(workflow.agents || '[]'),
        steps: JSON.parse(workflow.steps || '[]')
      }))

      setCache(cacheKey, result)
      return result
    })
  }

  static async updateWorkflow(id: string, updates: Partial<Workflow>): Promise<void> {
    return rateLimiter.execute(async () => {
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

      if (updates.userId) {
        const cacheKey = getCacheKey('workflows', updates.userId)
        cache.delete(cacheKey)
      }
    })
  }

  static async deleteWorkflow(id: string): Promise<void> {
    return rateLimiter.execute(async () => {
      await blink.db.workflows.delete(id)
      for (const key of cache.keys()) {
        if (key.startsWith('workflows:')) {
          cache.delete(key)
        }
      }
    })
  }

  // System Prompt operations
  static async createSystemPrompt(prompt: Omit<SystemPrompt, 'id' | 'createdAt' | 'updatedAt'>): Promise<SystemPrompt> {
    return rateLimiter.execute(async () => {
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

      const cacheKey = getCacheKey('systemPrompts', newPrompt.userId)
      cache.delete(cacheKey)

      return newPrompt
    })
  }

  static async getSystemPrompts(userId: string): Promise<SystemPrompt[]> {
    const cacheKey = getCacheKey('systemPrompts', userId)
    const cached = getFromCache<SystemPrompt[]>(cacheKey)
    if (cached) return cached

    return rateLimiter.execute(async () => {
      const prompts = await blink.db.systemPrompts.list({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })

      const result = prompts.map(prompt => ({
        ...prompt,
        tags: JSON.parse(prompt.tags || '[]')
      }))

      setCache(cacheKey, result)
      return result
    })
  }

  static async updateSystemPrompt(id: string, updates: Partial<SystemPrompt>): Promise<void> {
    return rateLimiter.execute(async () => {
      const updateData: any = {
        ...updates,
        updatedAt: new Date().toISOString()
      }

      if (updates.tags) {
        updateData.tags = JSON.stringify(updates.tags)
      }

      await blink.db.systemPrompts.update(id, updateData)

      if (updates.userId) {
        const cacheKey = getCacheKey('systemPrompts', updates.userId)
        cache.delete(cacheKey)
      }
    })
  }

  static async deleteSystemPrompt(id: string): Promise<void> {
    return rateLimiter.execute(async () => {
      await blink.db.systemPrompts.delete(id)
      for (const key of cache.keys()) {
        if (key.startsWith('systemPrompts:')) {
          cache.delete(key)
        }
      }
    })
  }

  // Project operations
  static async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    return rateLimiter.execute(async () => {
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

      const cacheKey = getCacheKey('projects', newProject.userId)
      cache.delete(cacheKey)

      return newProject
    })
  }

  static async getProjects(userId: string): Promise<Project[]> {
    const cacheKey = getCacheKey('projects', userId)
    const cached = getFromCache<Project[]>(cacheKey)
    if (cached) return cached

    return rateLimiter.execute(async () => {
      const projects = await blink.db.projects.list({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })

      const result = projects.map(project => ({
        ...project,
        agents: JSON.parse(project.agents || '[]'),
        workflows: JSON.parse(project.workflows || '[]')
      }))

      setCache(cacheKey, result)
      return result
    })
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    return rateLimiter.execute(async () => {
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

      if (updates.userId) {
        const cacheKey = getCacheKey('projects', updates.userId)
        cache.delete(cacheKey)
      }
    })
  }

  static async deleteProject(id: string): Promise<void> {
    return rateLimiter.execute(async () => {
      await blink.db.projects.delete(id)
      for (const key of cache.keys()) {
        if (key.startsWith('projects:')) {
          cache.delete(key)
        }
      }
    })
  }

  // Chat Message operations
  static async createChatMessage(message: Omit<ChatMessage, 'id'>): Promise<ChatMessage> {
    return rateLimiter.execute(async () => {
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

      const cacheKey = getCacheKey('chatMessages', newMessage.userId)
      cache.delete(cacheKey)

      return newMessage
    })
  }

  static async getChatMessages(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    const cacheKey = getCacheKey('chatMessages', userId, { limit })
    const cached = getFromCache<ChatMessage[]>(cacheKey)
    if (cached) return cached

    return rateLimiter.execute(async () => {
      const messages = await blink.db.chatMessages.list({
        where: { userId },
        orderBy: { timestamp: 'desc' },
        limit
      })

      const result = messages.reverse() // Return in chronological order
      setCache(cacheKey, result)
      return result
    })
  }

  static async deleteChatMessage(id: string): Promise<void> {
    return rateLimiter.execute(async () => {
      await blink.db.chatMessages.delete(id)
      for (const key of cache.keys()) {
        if (key.startsWith('chatMessages:')) {
          cache.delete(key)
        }
      }
    })
  }

  // Initialize default data with better error handling
  static async initializeDefaultData(userId: string): Promise<void> {
    const initCacheKey = `initialized:${userId}`
    
    // Check if already initialized recently
    if (getFromCache(initCacheKey)) {
      return
    }

    try {
      // Check if user already has data
      const existingAgents = await this.getAgents(userId)
      if (existingAgents.length > 0) {
        setCache(initCacheKey, true)
        return
      }

      console.log('Initializing default data for user:', userId)

      // Create default agents with delay between each
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

      // Create agents one by one with delays
      for (const agent of defaultAgents) {
        await this.createAgent(agent)
        await new Promise(resolve => setTimeout(resolve, 500)) // 500ms delay between creates
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
        await new Promise(resolve => setTimeout(resolve, 500)) // 500ms delay between creates
      }

      // Mark as initialized
      setCache(initCacheKey, true)
      console.log('Default data initialization completed for user:', userId)

    } catch (error) {
      console.error('Failed to initialize default data:', error)
      
      // If it's a rate limit error, don't retry immediately
      if (error.status === 429) {
        console.warn('Rate limited during initialization. Will retry on next app load.')
        return
      }
      
      throw error
    }
  }
}