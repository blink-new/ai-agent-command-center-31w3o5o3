import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WorkflowCanvas } from '@/components/ui/workflow-canvas'
import { 
  Plus, 
  Play, 
  Save, 
  Share, 
  GitBranch,
  Zap,
  Bot,
  FileText,
  Database,
  Globe,
  ArrowRight,
  Settings,
  Copy
} from 'lucide-react'

export function WorkflowBuilder() {
  const [selectedWorkflow, setSelectedWorkflow] = useState<string | null>(null)

  const workflows = [
    {
      id: 'data-analysis',
      name: 'Data Analysis Pipeline',
      description: 'Automated data processing and insights generation',
      status: 'active',
      nodes: 5,
      lastRun: '2 hours ago',
      success_rate: 98.5,
      agents: ['Claude 3.5', 'GPT-4'],
      category: 'Analytics'
    },
    {
      id: 'content-generation',
      name: 'Content Generation Flow',
      description: 'Multi-step content creation with review and optimization',
      status: 'draft',
      nodes: 7,
      lastRun: 'Never',
      success_rate: null,
      agents: ['GPT-4', 'Claude 3.5', 'Gemini Pro'],
      category: 'Content'
    },
    {
      id: 'code-review',
      name: 'Code Review Automation',
      description: 'Automated code analysis, testing, and documentation',
      status: 'active',
      nodes: 4,
      lastRun: '30 minutes ago',
      success_rate: 94.2,
      agents: ['DeepSeek Coder', 'GPT-4'],
      category: 'Development'
    }
  ]

  const nodeTypes = [
    { type: 'input', label: 'Input', icon: FileText, color: 'from-blue-500 to-cyan-500' },
    { type: 'agent', label: 'AI Agent', icon: Bot, color: 'from-purple-500 to-pink-500' },
    { type: 'process', label: 'Process', icon: Zap, color: 'from-green-500 to-emerald-500' },
    { type: 'database', label: 'Database', icon: Database, color: 'from-orange-500 to-red-500' },
    { type: 'output', label: 'Output', icon: Globe, color: 'from-indigo-500 to-purple-500' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500'
      case 'draft': return 'bg-yellow-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Workflow Builder</h1>
          <p className="text-muted-foreground">
            Design and orchestrate complex AI workflows with visual drag-and-drop interface
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass border-white/20">
            <Copy className="w-4 h-4 mr-2" />
            Templates
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80">
            <Plus className="w-4 h-4 mr-2" />
            New Workflow
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workflow List */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-primary">Workflows</CardTitle>
              <CardDescription>Manage your automation pipelines</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                    selectedWorkflow === workflow.id
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-white/10 bg-white/5 hover:border-primary/30'
                  }`}
                  onClick={() => setSelectedWorkflow(workflow.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-white">{workflow.name}</h3>
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(workflow.status)}`}></div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{workflow.description}</p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <Badge variant="outline" className="border-primary/30 text-primary">
                      {workflow.category}
                    </Badge>
                    <span className="text-muted-foreground">{workflow.nodes} nodes</span>
                  </div>
                  
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Last run: {workflow.lastRun}</span>
                      {workflow.success_rate && (
                        <span className="text-green-400">{workflow.success_rate}% success</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Node Palette */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-primary">Node Palette</CardTitle>
              <CardDescription>Drag to add to workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {nodeTypes.map((node) => {
                const Icon = node.icon
                return (
                  <div
                    key={node.type}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 cursor-grab hover:border-primary/30 transition-all duration-300"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${node.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium">{node.label}</span>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>

        {/* Workflow Canvas */}
        <div className="lg:col-span-2">
          <Card className="glass border-white/10 h-[600px]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-primary">
                    {selectedWorkflow ? workflows.find(w => w.id === selectedWorkflow)?.name : 'Workflow Canvas'}
                  </CardTitle>
                  <CardDescription>
                    {selectedWorkflow ? 'Design your workflow by connecting nodes' : 'Select a workflow to edit'}
                  </CardDescription>
                </div>
                {selectedWorkflow && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline">
                      <Play className="w-3 h-3 mr-1" />
                      Test
                    </Button>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                      <Share className="w-3 h-3 mr-1" />
                      Deploy
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="h-full p-0">
              {selectedWorkflow ? (
                <WorkflowCanvas 
                  workflowId={selectedWorkflow}
                  onSave={(nodes, connections) => {
                    console.log('Saving workflow:', { nodes, connections })
                    // Handle workflow save
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <GitBranch className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No workflow selected</p>
                    <p className="text-sm">Choose a workflow from the list to start editing</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Workflow Templates */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Workflow Templates</CardTitle>
          <CardDescription>Pre-built workflows to get you started quickly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-primary/30 transition-all duration-300 cursor-pointer">
              <h3 className="font-medium text-primary mb-2">Content Pipeline</h3>
              <p className="text-sm text-muted-foreground mb-3">Research → Write → Review → Publish</p>
              <Badge variant="outline" className="border-primary/30 text-primary">4 nodes</Badge>
            </div>
            <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-primary/30 transition-all duration-300 cursor-pointer">
              <h3 className="font-medium text-primary mb-2">Data Analysis</h3>
              <p className="text-sm text-muted-foreground mb-3">Ingest → Clean → Analyze → Report</p>
              <Badge variant="outline" className="border-primary/30 text-primary">5 nodes</Badge>
            </div>
            <div className="p-4 rounded-lg border border-white/10 bg-white/5 hover:border-primary/30 transition-all duration-300 cursor-pointer">
              <h3 className="font-medium text-primary mb-2">Code Review</h3>
              <p className="text-sm text-muted-foreground mb-3">Scan → Test → Review → Deploy</p>
              <Badge variant="outline" className="border-primary/30 text-primary">6 nodes</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}