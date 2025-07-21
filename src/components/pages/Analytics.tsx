import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Activity, 
  Zap,
  Clock,
  DollarSign,
  Users,
  Bot,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter
} from 'lucide-react'

export function Analytics() {
  const metrics = [
    { 
      label: 'Total Requests', 
      value: '847.2K', 
      change: '+12.5%', 
      trend: 'up', 
      icon: Activity,
      color: 'text-primary'
    },
    { 
      label: 'Active Agents', 
      value: '12', 
      change: '+2', 
      trend: 'up', 
      icon: Bot,
      color: 'text-green-400'
    },
    { 
      label: 'Avg Response Time', 
      value: '245ms', 
      change: '-15ms', 
      trend: 'up', 
      icon: Clock,
      color: 'text-blue-400'
    },
    { 
      label: 'Monthly Cost', 
      value: '$2,847', 
      change: '+8.2%', 
      trend: 'down', 
      icon: DollarSign,
      color: 'text-yellow-400'
    }
  ]

  const agentPerformance = [
    {
      name: 'Claude 3.5 Sonnet',
      requests: 245680,
      accuracy: 95.8,
      avgTime: 42,
      cost: 1247.50,
      status: 'excellent'
    },
    {
      name: 'GPT-4 Turbo',
      requests: 189234,
      accuracy: 92.4,
      avgTime: 48,
      cost: 892.30,
      status: 'good'
    },
    {
      name: 'Gemini Pro',
      requests: 156789,
      accuracy: 89.7,
      avgTime: 51,
      cost: 634.20,
      status: 'good'
    },
    {
      name: 'DeepSeek Coder',
      requests: 98456,
      accuracy: 94.2,
      avgTime: 62,
      cost: 423.80,
      status: 'excellent'
    }
  ]

  const recentAlerts = [
    {
      type: 'warning',
      message: 'High API usage detected for GPT-4 Turbo',
      time: '5 minutes ago',
      severity: 'medium'
    },
    {
      type: 'success',
      message: 'Claude 3.5 Sonnet performance improved by 15%',
      time: '1 hour ago',
      severity: 'low'
    },
    {
      type: 'error',
      message: 'Rate limit exceeded for Gemini Pro',
      time: '2 hours ago',
      severity: 'high'
    },
    {
      type: 'info',
      message: 'New deployment completed successfully',
      time: '4 hours ago',
      severity: 'low'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400 border-green-400/30'
      case 'good': return 'text-blue-400 border-blue-400/30'
      case 'warning': return 'text-yellow-400 border-yellow-400/30'
      case 'error': return 'text-red-400 border-red-400/30'
      default: return 'text-gray-400 border-gray-400/30'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return AlertTriangle
      case 'warning': return AlertTriangle
      case 'success': return CheckCircle
      default: return Activity
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-400'
      case 'warning': return 'text-yellow-400'
      case 'success': return 'text-green-400'
      default: return 'text-blue-400'
    }
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Monitor performance, usage, and costs across your AI agent ecosystem
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass border-white/20">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="glass border-white/20">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon
          const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown
          return (
            <Card key={index} className="glass border-white/10 hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 ${metric.color}`} />
                  <div className={`flex items-center gap-1 text-sm ${
                    metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <TrendIcon className="w-4 h-4" />
                    <span>{metric.change}</span>
                  </div>
                </div>
                <div>
                  <p className={`text-2xl font-bold ${metric.color}`}>{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-primary">Performance Overview</CardTitle>
              <CardDescription>Request volume and response times over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="requests" className="w-full">
                <TabsList className="grid w-full grid-cols-3 glass">
                  <TabsTrigger value="requests">Requests</TabsTrigger>
                  <TabsTrigger value="response-time">Response Time</TabsTrigger>
                  <TabsTrigger value="costs">Costs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="requests" className="mt-6">
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-black/20 to-black/40 rounded-lg border border-white/10">
                    <div className="text-center">
                      <BarChart3 className="w-16 h-16 mx-auto mb-4 text-primary opacity-50" />
                      <p className="text-muted-foreground">Request volume chart would be displayed here</p>
                      <p className="text-sm text-muted-foreground mt-2">Peak: 45.2K requests/day</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="response-time" className="mt-6">
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-black/20 to-black/40 rounded-lg border border-white/10">
                    <div className="text-center">
                      <Clock className="w-16 h-16 mx-auto mb-4 text-blue-400 opacity-50" />
                      <p className="text-muted-foreground">Response time trends would be displayed here</p>
                      <p className="text-sm text-muted-foreground mt-2">Avg: 245ms (15% improvement)</p>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="costs" className="mt-6">
                  <div className="h-64 flex items-center justify-center bg-gradient-to-br from-black/20 to-black/40 rounded-lg border border-white/10">
                    <div className="text-center">
                      <DollarSign className="w-16 h-16 mx-auto mb-4 text-yellow-400 opacity-50" />
                      <p className="text-muted-foreground">Cost breakdown would be displayed here</p>
                      <p className="text-sm text-muted-foreground mt-2">Monthly trend: +8.2%</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Recent Alerts */}
        <div>
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-primary">Recent Alerts</CardTitle>
              <CardDescription>System notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentAlerts.map((alert, index) => {
                const Icon = getAlertIcon(alert.type)
                return (
                  <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-start gap-3">
                      <Icon className={`w-4 h-4 mt-0.5 ${getAlertColor(alert.type)}`} />
                      <div className="flex-1">
                        <p className="text-sm text-white">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          alert.severity === 'high' ? 'border-red-400/30 text-red-400' :
                          alert.severity === 'medium' ? 'border-yellow-400/30 text-yellow-400' :
                          'border-gray-400/30 text-gray-400'
                        }`}
                      >
                        {alert.severity}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Agent Performance */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Agent Performance</CardTitle>
          <CardDescription>Detailed metrics for each AI agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentPerformance.map((agent, index) => (
              <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-white">{agent.name}</h3>
                    <Badge variant="outline" className={getStatusColor(agent.status)}>
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {agent.requests.toLocaleString()} requests
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Accuracy</p>
                    <div className="flex items-center gap-2">
                      <Progress value={agent.accuracy} className="h-2 flex-1" />
                      <span className="text-sm font-medium text-primary">{agent.accuracy}%</span>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Avg Time</p>
                    <p className="text-lg font-bold text-primary">{agent.avgTime}ms</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p className="text-lg font-bold text-primary">${agent.cost}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="text-lg font-bold text-primary">
                      {Math.round((agent.accuracy / agent.avgTime) * 100) / 100}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Usage Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-primary">Top Use Cases</CardTitle>
            <CardDescription>Most common agent interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Code Generation', percentage: 35, requests: '295K' },
              { name: 'Content Creation', percentage: 28, requests: '237K' },
              { name: 'Data Analysis', percentage: 22, requests: '186K' },
              { name: 'Code Review', percentage: 15, requests: '127K' }
            ].map((useCase, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{useCase.name}</span>
                    <span className="text-primary">{useCase.percentage}%</span>
                  </div>
                  <Progress value={useCase.percentage} className="h-2" />
                </div>
                <span className="text-sm text-muted-foreground ml-4">{useCase.requests}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass border-white/10">
          <CardHeader>
            <CardTitle className="text-primary">Cost Breakdown</CardTitle>
            <CardDescription>Monthly spending by provider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { provider: 'Anthropic', cost: 1247.50, percentage: 44 },
              { provider: 'OpenAI', cost: 892.30, percentage: 31 },
              { provider: 'Google', cost: 634.20, percentage: 22 },
              { provider: 'DeepSeek', cost: 73.00, percentage: 3 }
            ].map((provider, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{provider.provider}</span>
                    <span className="text-primary">${provider.cost}</span>
                  </div>
                  <Progress value={provider.percentage} className="h-2" />
                </div>
                <span className="text-sm text-muted-foreground ml-4">{provider.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}