import { blink } from './blink'

export interface AIResponse {
  content: string
  model: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  error?: string
}

export class AIService {
  // OpenAI via OpenRouter
  static async callOpenAI(prompt: string, model: string = 'openai/gpt-4-turbo'): Promise<AIResponse> {
    try {
      const response = await blink.data.fetch({
        url: 'https://openrouter.ai/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer {{OPENROUTER_API_KEY}}',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-agent-command-center-31w3o5o3.sites.blink.new',
          'X-Title': 'AI Agent Command Center'
        },
        body: {
          model,
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.7
        }
      })

      if (response.status === 200) {
        const data = response.body
        return {
          content: data.choices[0].message.content,
          model,
          usage: data.usage
        }
      } else {
        throw new Error(`OpenAI API error: ${response.status}`)
      }
    } catch (error) {
      return {
        content: '',
        model,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Google Gemini
  static async callGemini(prompt: string, model: string = 'google/gemini-pro'): Promise<AIResponse> {
    try {
      const response = await blink.data.fetch({
        url: 'https://openrouter.ai/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer {{OPENROUTER_API_KEY}}',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-agent-command-center-31w3o5o3.sites.blink.new',
          'X-Title': 'AI Agent Command Center'
        },
        body: {
          model,
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.7
        }
      })

      if (response.status === 200) {
        const data = response.body
        return {
          content: data.choices[0].message.content,
          model,
          usage: data.usage
        }
      } else {
        throw new Error(`Gemini API error: ${response.status}`)
      }
    } catch (error) {
      return {
        content: '',
        model,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // KIMI K2
  static async callKimi(prompt: string): Promise<AIResponse> {
    try {
      const response = await blink.data.fetch({
        url: 'https://openrouter.ai/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer {{KIMI}}',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-agent-command-center-31w3o5o3.sites.blink.new',
          'X-Title': 'AI Agent Command Center'
        },
        body: {
          model: 'moonshotai/kimi-k2:free',
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.7
        }
      })

      if (response.status === 200) {
        const data = response.body
        return {
          content: data.choices[0].message.content,
          model: 'moonshotai/kimi-k2:free',
          usage: data.usage
        }
      } else {
        throw new Error(`KIMI API error: ${response.status}`)
      }
    } catch (error) {
      return {
        content: '',
        model: 'moonshotai/kimi-k2:free',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Claude via OpenRouter
  static async callClaude(prompt: string, model: string = 'anthropic/claude-3.5-sonnet'): Promise<AIResponse> {
    try {
      const response = await blink.data.fetch({
        url: 'https://openrouter.ai/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer {{OPENROUTER_API_KEY}}',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-agent-command-center-31w3o5o3.sites.blink.new',
          'X-Title': 'AI Agent Command Center'
        },
        body: {
          model,
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.7
        }
      })

      if (response.status === 200) {
        const data = response.body
        return {
          content: data.choices[0].message.content,
          model,
          usage: data.usage
        }
      } else {
        throw new Error(`Claude API error: ${response.status}`)
      }
    } catch (error) {
      return {
        content: '',
        model,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Meta Llama
  static async callLlama(prompt: string, model: string = 'meta-llama/llama-3-70b-instruct'): Promise<AIResponse> {
    try {
      const response = await blink.data.fetch({
        url: 'https://openrouter.ai/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer {{OPENROUTER_API_KEY}}',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-agent-command-center-31w3o5o3.sites.blink.new',
          'X-Title': 'AI Agent Command Center'
        },
        body: {
          model,
          messages: [
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.7
        }
      })

      if (response.status === 200) {
        const data = response.body
        return {
          content: data.choices[0].message.content,
          model,
          usage: data.usage
        }
      } else {
        throw new Error(`Llama API error: ${response.status}`)
      }
    } catch (error) {
      return {
        content: '',
        model,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // DeepSeek
  static async callDeepSeek(prompt: string): Promise<AIResponse> {
    try {
      const response = await blink.data.fetch({
        url: 'https://openrouter.ai/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer {{OPENROUTER_API_KEY}}',
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-agent-command-center-31w3o5o3.sites.blink.new',
          'X-Title': 'AI Agent Command Center'
        },
        body: {
          model: 'deepseek/deepseek-coder',
          messages: [
            { role: 'system', content: 'You are an expert programmer. Provide clean, efficient code solutions.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 1000,
          temperature: 0.1
        }
      })

      if (response.status === 200) {
        const data = response.body
        return {
          content: data.choices[0].message.content,
          model: 'deepseek/deepseek-coder',
          usage: data.usage
        }
      } else {
        throw new Error(`DeepSeek API error: ${response.status}`)
      }
    } catch (error) {
      return {
        content: '',
        model: 'deepseek/deepseek-coder',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Route to appropriate AI service based on agent
  static async callAgent(agentName: string, prompt: string): Promise<AIResponse> {
    switch (agentName.toLowerCase()) {
      case 'gpt-4':
      case 'gpt-4-turbo':
        return this.callOpenAI(prompt, 'openai/gpt-4-turbo')
      case 'claude':
      case 'claude-3.5-sonnet':
        return this.callClaude(prompt)
      case 'gemini':
      case 'gemini-pro':
        return this.callGemini(prompt)
      case 'kimi':
      case 'kimi-k2':
        return this.callKimi(prompt)
      case 'llama':
      case 'llama-3-70b':
        return this.callLlama(prompt)
      case 'deepseek':
      case 'deepseek-coder':
        return this.callDeepSeek(prompt)
      default:
        throw new Error(`Unknown agent: ${agentName}`)
    }
  }
}