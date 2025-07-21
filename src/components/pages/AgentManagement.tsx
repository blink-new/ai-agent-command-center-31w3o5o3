import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Search, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  MoreVertical,
  Zap,
  Brain,
  Code,
  Image,
  MessageSquare
} from 'lucide-react'

export function AgentManagement() {
  const [searchQuery, setSearchQuery] = useState('')

  const agents = [
    {
      id: 'claude-3.5',
      name: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      status: 'active',
      type: 'General Purpose',
      capabilities: ['Text', 'Code', 'Analysis', 'Creative'],
      usage: { requests: 1247, tokens: '2.3M', cost: '$45.67' },
      performance: { accuracy: 9.5, speed: 42, reliability: 99.2 },
      icon: 'C',
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'OpenAI',
      status: 'active',
      type: 'Multimodal',
      capabilities: ['Text', 'Vision', 'Code', 'Functions'],
      usage: { requests: 892, tokens: '1.8M', cost: '$38.92' },
      performance: { accuracy: 8.9, speed: 48, reliability: 98.7 },
      icon: 'G',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'Google',
      status: 'active',
      type: 'Long Context',
      capabilities: ['Text', 'Vision', 'Code', 'Long Context'],
      usage: { requests: 634, tokens: '4.1M', cost: '$28.45' },
      performance: { accuracy: 8.5, speed: 51, reliability: 97.9 },
      icon: 'G',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'deepseek-coder',
      name: 'DeepSeek Coder',
      provider: 'DeepSeek',
      status: 'standby',
      type: 'Code Specialist',
      capabilities: ['Code', 'Debug', 'Review', 'Architecture'],
      usage: { requests: 423, tokens: '890K', cost: '$12.34' },
      performance: { accuracy: 8.7, speed: 62, reliability: 96.5 },
      icon: 'D',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'kimi-k2',
      name: 'KIMI K2',
      provider: 'Moonshot AI',
      status: 'active',
      type: 'Long Context',
      capabilities: ['Text', 'Long Context', 'Multilingual', 'Analysis'],
      usage: { requests: 567, tokens: '3.2M', cost: '$0.00' },
      performance: { accuracy: 8.8, speed: 45, reliability: 98.1 },
      icon: 'K',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'standby': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getCapabilityIcon = (capability: string) => {
    switch (capability.toLowerCase()) {
      case 'text': return MessageSquare
      case 'code': return Code
      case 'vision': return Image
      case 'analysis': return Brain
      default: return Zap
    }
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Agent Management</h1>
          <p className="text-muted-foreground">
            Configure, monitor, and manage your AI agents across multiple providers
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80">
          <Plus className="w-4 h-4 mr-2" />
          Add Agent
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 glass border-white/20"
          />
        </div>
        <Button variant="outline" className="glass border-white/20">
          Filter
        </Button>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="glass border-white/10 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {agent.icon}
                  </div>
                  <div>
                    <CardTitle className="text-primary">{agent.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {agent.provider}
                      <Badge variant="outline" className="text-xs">
                        {agent.type}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`}></div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Capabilities */}
              <div>
                <p className="text-sm font-medium mb-2">Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((capability, index) => {
                    const Icon = getCapabilityIcon(capability)
                    return (
                      <Badge key={index} variant="outline" className="border-primary/30 text-primary">
                        <Icon className="w-3 h-3 mr-1" />
                        {capability}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* Performance Metrics */}
              <Tabs defaultValue="performance" className="w-full">
                <TabsList className="grid w-full grid-cols-2 glass">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                </TabsList>
                
                <TabsContent value="performance" className="space-y-3 mt-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-primary">{agent.performance.accuracy}</p>
                      <p className="text-xs text-muted-foreground">Accuracy</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{agent.performance.speed}ms</p>
                      <p className="text-xs text-muted-foreground">Avg Speed</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{agent.performance.reliability}%</p>
                      <p className="text-xs text-muted-foreground">Reliability</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="space-y-3 mt-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-primary">{agent.usage.requests}</p>
                      <p className="text-xs text-muted-foreground">Requests</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{agent.usage.tokens}</p>
                      <p className="text-xs text-muted-foreground">Tokens</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{agent.usage.cost}</p>
                      <p className="text-xs text-muted-foreground">Cost</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant={agent.status === 'active' ? 'outline' : 'default'}
                  className="flex-1"
                >
                  {agent.status === 'active' ? (
                    <>
                      <Pause className="w-3 h-3 mr-1" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 mr-1" />
                      Activate
                    </>
                  )}
                </Button>
                <Button size="sm" variant="outline">
                  <Settings className="w-3 h-3 mr-1" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Quick Actions</CardTitle>
          <CardDescription>Common agent management tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 glass border-white/20">
              <Plus className="w-6 h-6" />
              Add New Agent
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 glass border-white/20">
              <Settings className="w-6 h-6" />
              Bulk Configure
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 glass border-white/20">
              <Zap className="w-6 h-6" />
              Performance Test
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}