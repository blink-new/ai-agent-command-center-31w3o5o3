import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Plus, 
  Code, 
  Globe, 
  Smartphone, 
  Database,
  GitBranch,
  Play,
  Settings,
  ExternalLink,
  Clock,
  Users,
  Star
} from 'lucide-react'

export function ProjectDevelopment() {
  const projects = [
    {
      id: 'ecommerce-ai',
      name: 'AI-Powered E-commerce Platform',
      description: 'Intelligent product recommendations and customer service automation',
      status: 'active',
      progress: 75,
      type: 'Web Application',
      tech: ['React', 'Node.js', 'PostgreSQL', 'OpenAI'],
      team: 3,
      lastUpdate: '2 hours ago',
      agents: ['GPT-4', 'Claude 3.5'],
      features: ['Product Recommendations', 'Chat Support', 'Inventory Management']
    },
    {
      id: 'content-cms',
      name: 'Content Management System',
      description: 'AI-assisted content creation and optimization platform',
      status: 'development',
      progress: 45,
      type: 'Web Application',
      tech: ['Next.js', 'Prisma', 'Supabase', 'Anthropic'],
      team: 2,
      lastUpdate: '1 day ago',
      agents: ['Claude 3.5', 'Gemini Pro'],
      features: ['Content Generation', 'SEO Optimization', 'Multi-language Support']
    },
    {
      id: 'mobile-assistant',
      name: 'Personal AI Assistant App',
      description: 'Cross-platform mobile app with voice and text interactions',
      status: 'planning',
      progress: 20,
      type: 'Mobile Application',
      tech: ['React Native', 'Firebase', 'OpenAI', 'Google Cloud'],
      team: 4,
      lastUpdate: '3 days ago',
      agents: ['GPT-4', 'Whisper'],
      features: ['Voice Commands', 'Task Management', 'Calendar Integration']
    }
  ]

  const templates = [
    {
      name: 'AI Chatbot',
      description: 'Intelligent conversational interface',
      type: 'Web Component',
      icon: Globe,
      color: 'from-blue-500 to-cyan-500',
      complexity: 'Beginner',
      estimatedTime: '2-4 hours',
      agents: ['GPT-4', 'Claude 3.5']
    },
    {
      name: 'Data Analytics Dashboard',
      description: 'Real-time data visualization and insights',
      type: 'Web Application',
      icon: Database,
      color: 'from-green-500 to-emerald-500',
      complexity: 'Intermediate',
      estimatedTime: '1-2 weeks',
      agents: ['Claude 3.5', 'Gemini Pro']
    },
    {
      name: 'Mobile AI Camera',
      description: 'Image recognition and processing app',
      type: 'Mobile App',
      icon: Smartphone,
      color: 'from-purple-500 to-pink-500',
      complexity: 'Advanced',
      estimatedTime: '3-4 weeks',
      agents: ['GPT-4 Vision', 'Claude 3.5']
    },
    {
      name: 'Code Review Bot',
      description: 'Automated code analysis and suggestions',
      type: 'Integration',
      icon: Code,
      color: 'from-orange-500 to-red-500',
      complexity: 'Intermediate',
      estimatedTime: '1 week',
      agents: ['DeepSeek Coder', 'GPT-4']
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'development': return 'bg-blue-500'
      case 'planning': return 'bg-yellow-500'
      case 'completed': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Beginner': return 'text-green-400 border-green-400/30'
      case 'Intermediate': return 'text-yellow-400 border-yellow-400/30'
      case 'Advanced': return 'text-red-400 border-red-400/30'
      default: return 'text-gray-400 border-gray-400/30'
    }
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Project Development</h1>
          <p className="text-muted-foreground">
            Build and deploy AI-powered applications with integrated agent workflows
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Active Projects */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">Active Projects</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="glass border-white/10 hover:border-primary/30 transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-primary">{project.name}</CardTitle>
                    <CardDescription className="mt-1">{project.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`}></div>
                    <Badge variant="outline" className="capitalize">
                      {project.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="text-primary">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="text-white font-medium">{project.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Team Size</p>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span className="text-white font-medium">{project.team}</span>
                    </div>
                  </div>
                </div>

                {/* Tech Stack */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Tech Stack</p>
                  <div className="flex flex-wrap gap-1">
                    {project.tech.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-primary/30 text-primary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* AI Agents */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">AI Agents</p>
                  <div className="flex flex-wrap gap-1">
                    {project.agents.map((agent, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {agent}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Key Features</p>
                  <div className="space-y-1">
                    {project.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-1 h-1 rounded-full bg-primary"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-white/10">
                  <Button size="sm" className="flex-1">
                    <Play className="w-3 h-3 mr-1" />
                    Continue
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-3 h-3 mr-1" />
                    Settings
                  </Button>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>

                {/* Last Update */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Last updated {project.lastUpdate}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Project Templates */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-primary">Project Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template, index) => {
            const Icon = template.icon
            return (
              <Card key={index} className="glass border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-white">{template.name}</h3>
                      <Badge variant="outline" className="text-xs border-primary/30 text-primary mt-1">
                        {template.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Complexity</span>
                      <Badge variant="outline" className={`text-xs ${getComplexityColor(template.complexity)}`}>
                        {template.complexity}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Est. Time</span>
                      <span className="text-white">{template.estimatedTime}</span>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Required Agents</p>
                      <div className="flex flex-wrap gap-1">
                        {template.agents.map((agent, agentIndex) => (
                          <Badge key={agentIndex} variant="secondary" className="text-xs">
                            {agent}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 border border-primary/30">
                    Use Template
                  </Button>
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
          <CardDescription>Common development tasks and utilities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2 glass border-white/20">
              <Code className="w-6 h-6" />
              Generate Code
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 glass border-white/20">
              <GitBranch className="w-6 h-6" />
              Create Workflow
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 glass border-white/20">
              <Database className="w-6 h-6" />
              Setup Database
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 glass border-white/20">
              <Globe className="w-6 h-6" />
              Deploy App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}