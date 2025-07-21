import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Activity, 
  Bot, 
  Zap, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Play,
  Pause,
  Settings,
  ExternalLink
} from 'lucide-react'

const stats = [
  { label: 'Connected Models', value: '13', icon: Bot, color: 'text-primary' },
  { label: 'AI Providers', value: '6', icon: Zap, color: 'text-accent' },
  { label: 'Active Workflows', value: '8', icon: Activity, color: 'text-green-400' },
  { label: 'Uptime', value: '99.9%', icon: TrendingUp, color: 'text-blue-400' },
]

const agents = [
  {
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    status: 'connected',
    accuracy: 9.5,
    speed: '42ms',
    context: '200K',
    capabilities: ['Text Analysis', 'Code Generation', 'Reasoning', 'Creative Writing'],
    icon: 'C',
    color: 'from-red-500 to-orange-500'
  },
  {
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    status: 'connected',
    accuracy: 8.9,
    speed: '48ms',
    context: '128K',
    capabilities: ['Multimodal', 'Code Generation', 'Function Calling', 'JSON Mode'],
    icon: 'G',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Gemini Pro',
    provider: 'Google',
    status: 'connected',
    accuracy: 8.5,
    speed: '51ms',
    context: '1M',
    capabilities: ['Multimodal', 'Long Context', 'Code Generation', 'Reasoning'],
    icon: 'G',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'DeepSeek Coder',
    provider: 'DeepSeek',
    status: 'available',
    accuracy: 8.7,
    speed: '62ms',
    context: '16K',
    capabilities: ['Code Generation', 'Debugging', 'Code Review', 'Architecture'],
    icon: 'D',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'KIMI K2',
    provider: 'Moonshot AI',
    status: 'connected',
    accuracy: 8.8,
    speed: '45ms',
    context: '200K',
    capabilities: ['Long Context', 'Multilingual', 'Text Analysis', 'Free Tier'],
    icon: 'K',
    color: 'from-purple-500 to-pink-500'
  }
]

const recentActivity = [
  { action: 'Workflow "Data Analysis Pipeline" completed', time: '2 minutes ago', status: 'success' },
  { action: 'Claude 3.5 Sonnet generated code review', time: '5 minutes ago', status: 'success' },
  { action: 'New prompt template created', time: '12 minutes ago', status: 'info' },
  { action: 'GPT-4 Turbo processing batch request', time: '15 minutes ago', status: 'pending' },
  { action: 'Deployment to staging environment', time: '1 hour ago', status: 'success' },
]

export function Dashboard() {
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">AI Agent Command Center</h1>
          <p className="text-muted-foreground">
            Comprehensive platform for multi-modal brainstorming, workflow management, and AI agent orchestration
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80">
          <Play className="w-4 h-4 mr-2" />
          Quick Start
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="glass border-white/10 hover:border-primary/30 transition-all duration-300 hover:glow-primary">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-primary mb-4">Connected Agents</h2>
          {agents.map((agent, index) => (
            <Card key={index} className="glass border-white/10 hover:border-primary/30 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${agent.color} flex items-center justify-center text-white font-bold`}>
                      {agent.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg text-primary">{agent.name}</CardTitle>
                      <CardDescription>{agent.provider}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      agent.status === 'connected' ? 'status-connected' : 'status-available'
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
                    <p className="text-primary font-semibold">{agent.speed}</p>
                    <p className="text-muted-foreground">Speed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-primary font-semibold">{agent.context}</p>
                    <p className="text-muted-foreground">Context</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map((capability, capIndex) => (
                    <Badge key={capIndex} variant="outline" className="text-xs border-primary/30 text-primary">
                      {capability}
                    </Badge>
                  ))}
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
          ))}
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
    </div>
  )
}