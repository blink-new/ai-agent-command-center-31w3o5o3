import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from './button'
import { Textarea } from './textarea'
import { Card } from './card'
import { Badge } from './badge'
import { ScrollArea } from './scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { AIService } from '@/lib/ai-services'
import { db } from '@/lib/database'
import type { ChatMessage } from '@/lib/blink'

interface ChatInterfaceProps {
  user: any
  className?: string
}

const availableAgents = [
  { id: 'gpt-4', name: 'GPT-4 Turbo', provider: 'OpenAI' },
  { id: 'claude', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'gemini', name: 'Gemini Pro', provider: 'Google' },
  { id: 'kimi', name: 'KIMI K2', provider: 'Moonshot AI' },
  { id: 'llama', name: 'Llama 3 70B', provider: 'Meta' },
  { id: 'deepseek', name: 'DeepSeek Coder', provider: 'DeepSeek' }
]

export function ChatInterface({ user, className }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [selectedAgent, setSelectedAgent] = useState('gpt-4')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Load chat history
  useEffect(() => {
    if (user) {
      loadChatHistory()
    }
  }, [user, loadChatHistory])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const loadChatHistory = useCallback(async () => {
    if (!user?.id) return
    try {
      const history = await db.getChatMessages(user.id, 50)
      setMessages(history)
    } catch (error) {
      console.error('Failed to load chat history:', error)
    } finally {
      setLoadingMessages(false)
    }
  }, [user?.id])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
      userId: user.id
    }

    // Add user message to UI immediately
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Save user message to database
      await db.createChatMessage(userMessage)

      // Get AI response
      const response = await AIService.callAgent(selectedAgent, userMessage.content)

      const assistantMessage: ChatMessage = {
        id: `msg_${Date.now()}_assistant`,
        role: 'assistant',
        content: response.content || response.error || 'No response received',
        agentId: selectedAgent,
        timestamp: new Date().toISOString(),
        userId: user.id
      }

      // Add assistant message to UI
      setMessages(prev => [...prev, assistantMessage])

      // Save assistant message to database
      await db.createChatMessage(assistantMessage)

    } catch (error) {
      console.error('Failed to send message:', error)
      
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now()}_error`,
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        agentId: selectedAgent,
        timestamp: new Date().toISOString(),
        userId: user.id
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = async () => {
    setMessages([])
    // Note: In a real app, you might want to keep chat history in the database
    // and just clear the UI, or provide an option to delete chat history
  }

  const selectedAgentInfo = availableAgents.find(agent => agent.id === selectedAgent)

  if (loadingMessages) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading chat history...</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-semibold">AI Chat Interface</h3>
              <p className="text-sm text-muted-foreground">
                Chat with {selectedAgentInfo?.name} ({selectedAgentInfo?.provider})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedAgent} onValueChange={setSelectedAgent}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableAgents.map(agent => (
                  <SelectItem key={agent.id} value={agent.id}>
                    <div className="flex items-center gap-2">
                      <span>{agent.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        {agent.provider}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" onClick={clearChat}>
              Clear
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Start a conversation with your AI agent!</p>
              <p className="text-sm mt-2">Ask questions, request code, or get creative assistance.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-70">
                      <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                      {message.agentId && (
                        <Badge variant="secondary" className="text-xs">
                          {availableAgents.find(a => a.id === message.agentId)?.name || message.agentId}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    {selectedAgentInfo?.name} is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Message ${selectedAgentInfo?.name}...`}
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send, Shift+Enter for new line
        </p>
      </div>
    </Card>
  )
}