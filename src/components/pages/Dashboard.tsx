import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ChatInterface } from '@/components/ui/chat-interface'
import { DatabaseService } from '@/lib/database'
import type { Agent } from '@/lib/blink'
import { 
  Activity, 
  Bot, 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Settings,
  ExternalLink,
  MessageSquare
} from 'lucide-react'

const recentActivity = [
  { action: 'Workflow "Data Analysis Pipeline" completed', time: '2 minutes ago', status: 'success' },
  { action: 'Claude 3.5 Sonnet generated code review', time: '5 minutes ago', status: 'success' },
  { action: 'New prompt template created', time: '12 minutes ago', status: 'info' },
  { action: 'GPT-4 Turbo processing batch request', time: '15 minutes ago', status: 'pending' },
  { action: 'Deployment to staging environment', time: '1 hour ago', status: 'success' },
]

interface DashboardProps {
  user?: any
}

export function Dashboard({ user }: DashboardProps) {
  const [realAgents, setRealAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return
    try {
      const agents = await DatabaseService.getAgents(user.id)
      setRealAgents(agents)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user, loadDashboardData])

  const connectedAgents = realAgents.filter(agent => agent.status === 'connected')
  const totalProviders = [...new Set(realAgents.map(agent => agent.provider))].length

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">AI Agent Command Center</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.displayName || user?.email || 'Agent Commander'}! Your AI agents are ready.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setActiveTab('chat')}
            className="border-primary/30 hover:bg-primary/10"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            AI Chat
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80">
            <Play className="w-4 h-4 mr-2" />
            Quick Start
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Dashboard Overview</TabsTrigger>
          <TabsTrigger value="chat">AI Chat Interface</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="glass border-white/10 hover:border-primary/30 transition-all duration-300 hover:glow-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Connected Models</p>
                    <p className="text-2xl font-bold text-primary">{loading ? '...' : connectedAgents.length}</p>
                  </div>
                  <Bot className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/10 hover:border-primary/30 transition-all duration-300 hover:glow-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">AI Providers</p>
                    <p className="text-2xl font-bold text-accent">{loading ? '...' : totalProviders}</p>
                  </div>
                  <Zap className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/10 hover:border-primary/30 transition-all duration-300 hover:glow-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Agents</p>
                    <p className="text-2xl font-bold text-green-400">{loading ? '...' : realAgents.length}</p>
                  </div>
                  <Activity className="w-8 h-8 text-green-400" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-white/10 hover:border-primary/30 transition-all duration-300 hover:glow-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="text-2xl font-bold text-blue-400">99.9%</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-blue-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Real Agent Status */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-primary mb-4">Your AI Agents</h2>
              {loading ? (
                <Card className="glass border-white/10">
                  <CardContent className="p-6 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-muted-foreground">Loading your agents...</p>
                  </CardContent>
                </Card>
              ) : realAgents.length === 0 ? (
                <Card className="glass border-white/10">
                  <CardContent className="p-6 text-center">
                    <Bot className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">No agents configured yet</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Default agents are being initialized...
                    </p>
                  </CardContent>
                </Card>
              ) : (
                realAgents.slice(0, 3).map((agent, index) => (
                  <Card key={agent.id} className="glass border-white/10 hover:border-primary/30 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
                            {agent.name[0]}
                          </div>
                          <div>
                            <CardTitle className="text-lg text-primary">{agent.name}</CardTitle>
                            <CardDescription>{agent.provider}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            agent.status === 'connected' ? 'bg-green-400' : 'bg-yellow-400'
                          }`}></div>
                          <Badge variant={agent.status === 'connected' ? 'default' : 'secondary'}>
                            {agent.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-primary font-semibold">{agent.accuracy}/10</p>
                          <p className="text-muted-foreground">Accuracy</p>
                        </div>
                        <div className="text-center">
                          <p className="text-primary font-semibold">{agent.speed}ms</p>
                          <p className="text-muted-foreground">Speed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-primary font-semibold">{agent.context}</p>
                          <p className="text-muted-foreground">Context</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {agent.capabilities.slice(0, 3).map((capability, capIndex) => (
                          <Badge key={capIndex} variant="outline" className="text-xs border-primary/30 text-primary">
                            {capability}
                          </Badge>
                        ))}
                        {agent.capabilities.length > 3 && (
                          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
                            +{agent.capabilities.length - 3} more
                          </Badge>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="w-3 h-3 mr-1" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Recent Activity & System Health */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-primary">Recent Activity</CardTitle>
                  <CardDescription>Latest actions and events across your AI agents</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-green-400' :
                        activity.status === 'pending' ? 'bg-yellow-400' :
                        'bg-blue-400'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-white">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                      {activity.status === 'success' && <CheckCircle className="w-4 h-4 text-green-400" />}
                      {activity.status === 'pending' && <Clock className="w-4 h-4 text-yellow-400" />}
                      {activity.status === 'info' && <AlertCircle className="w-4 h-4 text-blue-400" />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* System Performance */}
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-primary">System Performance</CardTitle>
                  <CardDescription>Real-time metrics and health status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>CPU Usage</span>
                        <span className="text-primary">23%</span>
                      </div>
                      <Progress value={23} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Memory Usage</span>
                        <span className="text-primary">67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>API Rate Limit</span>
                        <span className="text-primary">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Active Connections</span>
                        <span className="text-primary">12/50</span>
                      </div>
                      <Progress value={24} className="h-2" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">System Status</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span className="text-sm text-green-400">Operational</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="space-y-6">
          <ChatInterface user={user} className="h-[600px]" />
        </TabsContent>
      </Tabs>
    </div>
  )
}