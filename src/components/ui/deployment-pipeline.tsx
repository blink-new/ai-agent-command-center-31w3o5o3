import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  GitBranch,
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Settings,
  Monitor,
  FileText,
  Database,
  Globe,
  ArrowRight
} from 'lucide-react'

interface PipelineStage {
  id: string
  name: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped'
  duration?: number
  logs?: string[]
  startTime?: Date
  endTime?: Date
}

interface Pipeline {
  id: string
  name: string
  branch: string
  commit: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled'
  stages: PipelineStage[]
  startTime: Date
  endTime?: Date
  triggeredBy: string
}

interface DeploymentPipelineProps {
  onDeploy?: (pipeline: Pipeline) => void
}

export function DeploymentPipeline({ onDeploy }: DeploymentPipelineProps) {
  const [activePipeline, setActivePipeline] = useState<Pipeline | null>(null)
  const [pipelineHistory, setPipelineHistory] = useState<Pipeline[]>([
    {
      id: 'pipeline-1',
      name: 'Production Deploy',
      branch: 'main',
      commit: 'a1b2c3d',
      status: 'success',
      stages: [
        { id: 'build', name: 'Build', status: 'success', duration: 45000 },
        { id: 'test', name: 'Test', status: 'success', duration: 32000 },
        { id: 'security', name: 'Security Scan', status: 'success', duration: 18000 },
        { id: 'deploy', name: 'Deploy', status: 'success', duration: 28000 }
      ],
      startTime: new Date(Date.now() - 3600000),
      endTime: new Date(Date.now() - 3480000),
      triggeredBy: 'john.doe@example.com'
    },
    {
      id: 'pipeline-2',
      name: 'Staging Deploy',
      branch: 'develop',
      commit: 'x9y8z7w',
      status: 'failed',
      stages: [
        { id: 'build', name: 'Build', status: 'success', duration: 42000 },
        { id: 'test', name: 'Test', status: 'failed', duration: 15000 },
        { id: 'security', name: 'Security Scan', status: 'skipped' },
        { id: 'deploy', name: 'Deploy', status: 'skipped' }
      ],
      startTime: new Date(Date.now() - 7200000),
      endTime: new Date(Date.now() - 7143000),
      triggeredBy: 'jane.smith@example.com'
    }
  ])

  const defaultStages: PipelineStage[] = [
    { id: 'build', name: 'Build', status: 'pending' },
    { id: 'test', name: 'Test', status: 'pending' },
    { id: 'security', name: 'Security Scan', status: 'pending' },
    { id: 'deploy', name: 'Deploy', status: 'pending' }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return CheckCircle
      case 'failed': return AlertCircle
      case 'running': return Clock
      case 'pending': return Clock
      default: return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400'
      case 'failed': return 'text-red-400'
      case 'running': return 'text-blue-400'
      case 'pending': return 'text-gray-400'
      case 'skipped': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const startPipeline = async () => {
    const newPipeline: Pipeline = {
      id: `pipeline-${Date.now()}`,
      name: 'Production Deploy',
      branch: 'main',
      commit: Math.random().toString(36).substr(2, 7),
      status: 'running',
      stages: defaultStages.map(stage => ({ ...stage })),
      startTime: new Date(),
      triggeredBy: 'current.user@example.com'
    }

    setActivePipeline(newPipeline)
    
    // Simulate pipeline execution
    for (let i = 0; i < newPipeline.stages.length; i++) {
      const stage = newPipeline.stages[i]
      
      // Start stage
      stage.status = 'running'
      stage.startTime = new Date()
      setActivePipeline({ ...newPipeline })
      
      // Simulate stage duration
      const duration = Math.random() * 30000 + 10000 // 10-40 seconds
      await new Promise(resolve => setTimeout(resolve, duration))
      
      // Complete stage (90% success rate)
      const success = Math.random() > 0.1
      stage.status = success ? 'success' : 'failed'
      stage.endTime = new Date()
      stage.duration = duration
      
      if (!success) {
        // Mark remaining stages as skipped
        for (let j = i + 1; j < newPipeline.stages.length; j++) {
          newPipeline.stages[j].status = 'skipped'
        }
        newPipeline.status = 'failed'
        break
      }
      
      setActivePipeline({ ...newPipeline })
    }
    
    // Complete pipeline
    if (newPipeline.status !== 'failed') {
      newPipeline.status = 'success'
    }
    newPipeline.endTime = new Date()
    
    setPipelineHistory(prev => [newPipeline, ...prev])
    setActivePipeline(null)
    onDeploy?.(newPipeline)
  }

  const cancelPipeline = () => {
    if (activePipeline) {
      activePipeline.status = 'cancelled'
      activePipeline.endTime = new Date()
      setPipelineHistory(prev => [activePipeline, ...prev])
      setActivePipeline(null)
    }
  }

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`
    }
    return `${seconds}s`
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Controls */}
      <Card className="glass border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-primary">Deployment Pipeline</CardTitle>
              <CardDescription>Automated CI/CD workflow for your AI applications</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={startPipeline}
                disabled={!!activePipeline}
                className="bg-gradient-to-r from-primary to-accent"
              >
                <Play className="w-4 h-4 mr-2" />
                Deploy
              </Button>
              {activePipeline && (
                <Button 
                  onClick={cancelPipeline}
                  variant="destructive"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        {activePipeline && (
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="border-blue-400/30 text-blue-400">
                  Running
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GitBranch className="w-4 h-4" />
                  <span>{activePipeline.branch}</span>
                  <span>•</span>
                  <span>{activePipeline.commit}</span>
                  <span>•</span>
                  <span>Started {activePipeline.startTime.toLocaleTimeString()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {activePipeline.stages.map((stage, index) => {
                  const StatusIcon = getStatusIcon(stage.status)
                  const isActive = stage.status === 'running'
                  
                  return (
                    <div key={stage.id} className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${
                        isActive 
                          ? 'border-blue-400 bg-blue-400/20 animate-pulse' 
                          : stage.status === 'success'
                          ? 'border-green-400 bg-green-400/20'
                          : stage.status === 'failed'
                          ? 'border-red-400 bg-red-400/20'
                          : 'border-gray-400 bg-gray-400/20'
                      }`}>
                        <StatusIcon className={`w-5 h-5 ${getStatusColor(stage.status)}`} />
                      </div>
                      <span className="text-sm font-medium text-center">{stage.name}</span>
                      {stage.duration && (
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(stage.duration)}
                        </span>
                      )}
                      {index < activePipeline.stages.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground absolute translate-x-8" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Pipeline History */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Pipeline History</CardTitle>
          <CardDescription>Recent deployment pipeline executions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineHistory.map((pipeline) => (
              <div key={pipeline.id} className="p-4 rounded-lg bg-black/20 border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={pipeline.status === 'success' ? 'default' : 'destructive'}
                      className={pipeline.status === 'success' ? 'border-green-400/30 text-green-400' : ''}
                    >
                      {pipeline.status}
                    </Badge>
                    <span className="font-medium">{pipeline.name}</span>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GitBranch className="w-3 h-3" />
                      <span>{pipeline.branch}</span>
                      <span>•</span>
                      <span>{pipeline.commit}</span>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pipeline.endTime && formatDuration(pipeline.endTime.getTime() - pipeline.startTime.getTime())}
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {pipeline.stages.map((stage) => {
                    const StatusIcon = getStatusIcon(stage.status)
                    return (
                      <div key={stage.id} className="flex items-center gap-2 p-2 rounded bg-black/20">
                        <StatusIcon className={`w-3 h-3 ${getStatusColor(stage.status)}`} />
                        <span className="text-xs">{stage.name}</span>
                        {stage.duration && (
                          <span className="text-xs text-muted-foreground ml-auto">
                            {formatDuration(stage.duration)}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Triggered by {pipeline.triggeredBy}</span>
                  <span>{pipeline.startTime.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Configuration */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Pipeline Configuration</CardTitle>
          <CardDescription>Configure your deployment pipeline stages and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stages" className="w-full">
            <TabsList className="grid w-full grid-cols-3 glass">
              <TabsTrigger value="stages">Stages</TabsTrigger>
              <TabsTrigger value="triggers">Triggers</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stages" className="space-y-4 mt-4">
              <div className="space-y-3">
                {defaultStages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-medium">{stage.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Enabled
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Settings className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Add Stage
              </Button>
            </TabsContent>
            
            <TabsContent value="triggers" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <span className="font-medium">Push to main branch</span>
                    <p className="text-sm text-muted-foreground">Automatically deploy when code is pushed to main</p>
                  </div>
                  <Badge variant="default" className="bg-green-600">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <span className="font-medium">Pull request merge</span>
                    <p className="text-sm text-muted-foreground">Deploy when PR is merged to main</p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <span className="font-medium">Manual trigger</span>
                    <p className="text-sm text-muted-foreground">Allow manual deployment triggers</p>
                  </div>
                  <Badge variant="default" className="bg-green-600">Enabled</Badge>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4 mt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <span className="font-medium">Email notifications</span>
                    <p className="text-sm text-muted-foreground">Send email on deployment success/failure</p>
                  </div>
                  <Badge variant="default" className="bg-green-600">Enabled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <span className="font-medium">Slack integration</span>
                    <p className="text-sm text-muted-foreground">Post deployment status to Slack</p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/10">
                  <div>
                    <span className="font-medium">Webhook notifications</span>
                    <p className="text-sm text-muted-foreground">Send HTTP webhooks on status changes</p>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}