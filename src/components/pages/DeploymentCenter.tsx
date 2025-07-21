import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DeploymentPipeline } from '@/components/ui/deployment-pipeline'
import { 
  Rocket, 
  Globe, 
  Server, 
  Cloud,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  Play,
  Pause,
  RotateCcw,
  ExternalLink,
  GitBranch,
  Monitor
} from 'lucide-react'

export function DeploymentCenter() {
  const deployments = [
    {
      id: 'prod-ecommerce',
      name: 'E-commerce Platform',
      environment: 'Production',
      status: 'running',
      url: 'https://shop.example.com',
      version: 'v2.1.3',
      lastDeploy: '2 hours ago',
      health: 98.5,
      requests: '12.4K',
      uptime: '99.9%',
      agents: ['GPT-4', 'Claude 3.5'],
      region: 'US-East'
    },
    {
      id: 'staging-cms',
      name: 'Content Management System',
      environment: 'Staging',
      status: 'deploying',
      url: 'https://cms-staging.example.com',
      version: 'v1.8.2',
      lastDeploy: 'Deploying...',
      health: null,
      requests: '2.1K',
      uptime: '99.2%',
      agents: ['Claude 3.5', 'Gemini Pro'],
      region: 'EU-West'
    },
    {
      id: 'dev-assistant',
      name: 'AI Assistant App',
      environment: 'Development',
      status: 'stopped',
      url: 'https://assistant-dev.example.com',
      version: 'v0.9.1',
      lastDeploy: '1 day ago',
      health: null,
      requests: '156',
      uptime: '95.1%',
      agents: ['GPT-4', 'Whisper'],
      region: 'US-West'
    }
  ]

  const environments = [
    {
      name: 'Production',
      deployments: 3,
      status: 'healthy',
      icon: Globe,
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Staging',
      deployments: 2,
      status: 'deploying',
      icon: Server,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Development',
      deployments: 5,
      status: 'mixed',
      icon: Monitor,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Testing',
      deployments: 1,
      status: 'idle',
      icon: Cloud,
      color: 'from-orange-500 to-red-500'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'bg-green-500'
      case 'deploying': return 'bg-blue-500 animate-pulse'
      case 'stopped': return 'bg-gray-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running': return CheckCircle
      case 'deploying': return Clock
      case 'stopped': return Pause
      case 'error': return AlertCircle
      default: return Clock
    }
  }

  const getEnvironmentStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400'
      case 'deploying': return 'text-blue-400'
      case 'mixed': return 'text-yellow-400'
      case 'idle': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Deployment Center</h1>
          <p className="text-muted-foreground">
            Manage and monitor your AI application deployments across all environments
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80">
          <Rocket className="w-4 h-4 mr-2" />
          Deploy New
        </Button>
      </div>

      <Tabs defaultValue="deployments" className="w-full">
        <TabsList className="grid w-full grid-cols-3 glass">
          <TabsTrigger value="deployments">Active Deployments</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="environments">Environments</TabsTrigger>
        </TabsList>

        <TabsContent value="deployments" className="space-y-6 mt-6">
          {/* Environment Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {environments.map((env, index) => {
              const Icon = env.icon
              return (
                <Card key={index} className="glass border-white/10 hover:border-primary/30 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${env.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <Badge variant="outline" className={`${getEnvironmentStatusColor(env.status)} border-current`}>
                        {env.status}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-white mb-1">{env.name}</h3>
                    <p className="text-sm text-muted-foreground">{env.deployments} deployments</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>

      {/* Active Deployments */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">Active Deployments</h2>
        <div className="space-y-4">
          {deployments.map((deployment) => {
            const StatusIcon = getStatusIcon(deployment.status)
            return (
              <Card key={deployment.id} className="glass border-white/10 hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(deployment.status)}`}></div>
                      <div>
                        <CardTitle className="text-primary">{deployment.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {deployment.environment}
                          </Badge>
                          <span>•</span>
                          <span>{deployment.version}</span>
                          <span>•</span>
                          <span>{deployment.region}</span>
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusIcon className={`w-4 h-4 ${
                        deployment.status === 'running' ? 'text-green-400' :
                        deployment.status === 'deploying' ? 'text-blue-400' :
                        deployment.status === 'error' ? 'text-red-400' :
                        'text-gray-400'
                      }`} />
                      <span className="text-sm capitalize">{deployment.status}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* URL */}
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    <a 
                      href={deployment.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      {deployment.url}
                    </a>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-lg font-bold text-primary">
                        {deployment.health ? `${deployment.health}%` : '--'}
                      </p>
                      <p className="text-xs text-muted-foreground">Health Score</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{deployment.requests}</p>
                      <p className="text-xs text-muted-foreground">Requests/day</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{deployment.uptime}</p>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{deployment.agents.length}</p>
                      <p className="text-xs text-muted-foreground">AI Agents</p>
                    </div>
                  </div>

                  {/* Health Progress */}
                  {deployment.health && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>System Health</span>
                        <span className="text-primary">{deployment.health}%</span>
                      </div>
                      <Progress value={deployment.health} className="h-2" />
                    </div>
                  )}

                  {/* AI Agents */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Connected AI Agents</p>
                    <div className="flex flex-wrap gap-1">
                      {deployment.agents.map((agent, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t border-white/10">
                    {deployment.status === 'running' ? (
                      <Button size="sm" variant="outline">
                        <Pause className="w-3 h-3 mr-1" />
                        Stop
                      </Button>
                    ) : deployment.status === 'stopped' ? (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    ) : null}
                    
                    <Button size="sm" variant="outline">
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Redeploy
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                    
                    <Button size="sm" variant="outline">
                      <Monitor className="w-3 h-3 mr-1" />
                      Logs
                    </Button>
                  </div>

                  {/* Last Deploy Info */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>Last deployed {deployment.lastDeploy}</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Quick Actions</CardTitle>
          <CardDescription>Common deployment tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 glass border-white/20">
              <Rocket className="w-6 h-6" />
              Quick Deploy
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 glass border-white/20">
              <RotateCcw className="w-6 h-6" />
              Rollback
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 glass border-white/20">
              <Monitor className="w-6 h-6" />
              View Logs
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 glass border-white/20">
              <Settings className="w-6 h-6" />
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-6 mt-6">
          <DeploymentPipeline 
            onDeploy={(pipeline) => {
              console.log('Pipeline deployed:', pipeline)
            }}
          />
        </TabsContent>

        <TabsContent value="environments" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {environments.map((env, index) => {
              const Icon = env.icon
              return (
                <Card key={index} className="glass border-white/10">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${env.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-primary">{env.name}</CardTitle>
                        <CardDescription>{env.deployments} active deployments</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Status</span>
                        <Badge variant="outline" className={`${getEnvironmentStatusColor(env.status)} border-current`}>
                          {env.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Settings className="w-3 h-3 mr-1" />
                          Configure
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Monitor className="w-3 h-3 mr-1" />
                          Monitor
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}