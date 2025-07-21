import { useState, useRef, useCallback, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  FileText, 
  Bot, 
  Zap, 
  Database, 
  Globe, 
  ArrowRight,
  Settings,
  Play,
  Trash2,
  Copy,
  Plus
} from 'lucide-react'

interface WorkflowNode {
  id: string
  type: 'input' | 'agent' | 'process' | 'database' | 'output' | 'condition'
  position: { x: number; y: number }
  data: {
    label: string
    config?: any
  }
}

interface WorkflowConnection {
  id: string
  source: string
  target: string
  sourceHandle?: string
  targetHandle?: string
}

interface WorkflowCanvasProps {
  workflowId: string | null
  onSave?: (nodes: WorkflowNode[], connections: WorkflowConnection[]) => void
}

export function WorkflowCanvas({ workflowId, onSave }: WorkflowCanvasProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'input-1',
      type: 'input',
      position: { x: 100, y: 200 },
      data: { label: 'Input Data' }
    },
    {
      id: 'agent-1',
      type: 'agent',
      position: { x: 300, y: 200 },
      data: { label: 'Claude 3.5', config: { model: 'claude-3.5-sonnet', temperature: 0.7 } }
    },
    {
      id: 'process-1',
      type: 'process',
      position: { x: 500, y: 200 },
      data: { label: 'Process Data' }
    },
    {
      id: 'output-1',
      type: 'output',
      position: { x: 700, y: 200 },
      data: { label: 'Output Result' }
    }
  ])

  const [connections, setConnections] = useState<WorkflowConnection[]>([
    { id: 'conn-1', source: 'input-1', target: 'agent-1' },
    { id: 'conn-2', source: 'agent-1', target: 'process-1' },
    { id: 'conn-3', source: 'process-1', target: 'output-1' }
  ])

  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null)
  const [draggedNode, setDraggedNode] = useState<WorkflowNode | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const nodeTypes = useMemo(() => ({
    input: { icon: FileText, color: 'from-blue-500 to-cyan-500', label: 'Input' },
    agent: { icon: Bot, color: 'from-purple-500 to-pink-500', label: 'AI Agent' },
    process: { icon: Zap, color: 'from-green-500 to-emerald-500', label: 'Process' },
    database: { icon: Database, color: 'from-orange-500 to-red-500', label: 'Database' },
    output: { icon: Globe, color: 'from-indigo-500 to-purple-500', label: 'Output' }
  }), [])

  const handleNodeDrag = useCallback((nodeId: string, newPosition: { x: number; y: number }) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, position: newPosition } : node
    ))
  }, [])

  const handleNodeClick = useCallback((node: WorkflowNode) => {
    setSelectedNode(node)
  }, [])

  const addNode = useCallback((type: keyof typeof nodeTypes, position: { x: number; y: number }) => {
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: { label: nodeTypes[type].label }
    }
    setNodes(prev => [...prev, newNode])
  }, [nodeTypes])

  const deleteNode = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId))
    setConnections(prev => prev.filter(conn => conn.source !== nodeId && conn.target !== nodeId))
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null)
    }
  }, [selectedNode])

  const updateNodeConfig = useCallback((nodeId: string, config: any) => {
    setNodes(prev => prev.map(node => 
      node.id === nodeId 
        ? { ...node, data: { ...node.data, config: { ...node.data.config, ...config } } }
        : node
    ))
  }, [])

  const renderNode = (node: WorkflowNode) => {
    const nodeType = nodeTypes[node.type]
    const Icon = nodeType.icon
    const isSelected = selectedNode?.id === node.id

    return (
      <div
        key={node.id}
        className={`absolute cursor-pointer transition-all duration-200 ${
          isSelected ? 'scale-110 z-10' : 'hover:scale-105'
        }`}
        style={{
          left: node.position.x,
          top: node.position.y,
          transform: 'translate(-50%, -50%)'
        }}
        onClick={() => handleNodeClick(node)}
        onMouseDown={(e) => {
          setDraggedNode(node)
          e.preventDefault()
        }}
      >
        <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${nodeType.color} flex items-center justify-center shadow-lg ${
          isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
        } ${node.type === 'agent' ? 'animate-pulse-glow' : ''}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <div className="text-center mt-2">
          <span className="text-xs font-medium text-white block">{node.data.label}</span>
          {node.type === 'agent' && node.data.config?.model && (
            <span className="text-xs text-muted-foreground">{node.data.config.model}</span>
          )}
        </div>
      </div>
    )
  }

  const renderConnection = (connection: WorkflowConnection) => {
    const sourceNode = nodes.find(n => n.id === connection.source)
    const targetNode = nodes.find(n => n.id === connection.target)
    
    if (!sourceNode || !targetNode) return null

    const startX = sourceNode.position.x + 40
    const startY = sourceNode.position.y
    const endX = targetNode.position.x - 40
    const endY = targetNode.position.y

    const midX = (startX + endX) / 2
    const midY = (startY + endY) / 2

    return (
      <g key={connection.id}>
        <defs>
          <marker
            id={`arrowhead-${connection.id}`}
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="rgb(0, 212, 255)"
            />
          </marker>
        </defs>
        <path
          d={`M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${midY} Q ${midX} ${endY} ${endX} ${endY}`}
          stroke="rgb(0, 212, 255)"
          strokeWidth="2"
          fill="none"
          markerEnd={`url(#arrowhead-${connection.id})`}
          className="opacity-70 hover:opacity-100 transition-opacity"
        />
      </g>
    )
  }

  return (
    <div className="flex h-full">
      {/* Canvas */}
      <div className="flex-1 relative">
        <div
          ref={canvasRef}
          className="w-full h-full bg-gradient-to-br from-black/20 to-black/40 rounded-lg border border-white/10 relative overflow-hidden"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '20px 20px' }}
        >
          {/* SVG for connections */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {connections.map(renderConnection)}
          </svg>

          {/* Nodes */}
          {nodes.map(renderNode)}

          {/* Add Node Buttons */}
          <div className="absolute top-4 left-4 flex gap-2">
            {Object.entries(nodeTypes).map(([type, config]) => {
              const Icon = config.icon
              return (
                <Button
                  key={type}
                  size="sm"
                  variant="outline"
                  className="glass border-white/20"
                  onClick={() => addNode(type as keyof typeof nodeTypes, { x: 200, y: 150 })}
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {config.label}
                </Button>
              )
            })}
          </div>

          {/* Canvas Actions */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button size="sm" variant="outline" className="glass border-white/20">
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="glass border-white/20"
              onClick={() => onSave?.(nodes, connections)}
            >
              <Play className="w-3 h-3 mr-1" />
              Test
            </Button>
          </div>
        </div>
      </div>

      {/* Node Properties Panel */}
      {selectedNode && (
        <div className="w-80 border-l border-white/10 p-4 space-y-4">
          <Card className="glass border-white/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-primary">Node Properties</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteNode(selectedNode.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Node Type</Label>
                <Input 
                  value={nodeTypes[selectedNode.type].label} 
                  className="mt-1 h-8 text-sm glass border-white/20" 
                  readOnly
                />
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">Label</Label>
                <Input 
                  value={selectedNode.data.label} 
                  onChange={(e) => {
                    setNodes(prev => prev.map(node => 
                      node.id === selectedNode.id 
                        ? { ...node, data: { ...node.data, label: e.target.value } }
                        : node
                    ))
                    setSelectedNode(prev => prev ? { ...prev, data: { ...prev.data, label: e.target.value } } : null)
                  }}
                  className="mt-1 h-8 text-sm glass border-white/20" 
                />
              </div>

              {selectedNode.type === 'agent' && (
                <>
                  <div>
                    <Label className="text-xs text-muted-foreground">Model</Label>
                    <Select 
                      value={selectedNode.data.config?.model || 'claude-3.5-sonnet'}
                      onValueChange={(value) => updateNodeConfig(selectedNode.id, { model: value })}
                    >
                      <SelectTrigger className="mt-1 h-8 text-sm glass border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        <SelectItem value="deepseek-coder">DeepSeek Coder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Temperature</Label>
                    <Input 
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={selectedNode.data.config?.temperature || 0.7}
                      onChange={(e) => updateNodeConfig(selectedNode.id, { temperature: parseFloat(e.target.value) })}
                      className="mt-1 h-8 text-sm glass border-white/20" 
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Max Tokens</Label>
                    <Input 
                      type="number"
                      value={selectedNode.data.config?.maxTokens || 1000}
                      onChange={(e) => updateNodeConfig(selectedNode.id, { maxTokens: parseInt(e.target.value) })}
                      className="mt-1 h-8 text-sm glass border-white/20" 
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">System Prompt</Label>
                    <Textarea 
                      value={selectedNode.data.config?.systemPrompt || ''}
                      onChange={(e) => updateNodeConfig(selectedNode.id, { systemPrompt: e.target.value })}
                      placeholder="Enter system prompt..."
                      className="mt-1 text-sm glass border-white/20 resize-none" 
                      rows={3}
                    />
                  </div>
                </>
              )}

              {selectedNode.type === 'process' && (
                <>
                  <div>
                    <Label className="text-xs text-muted-foreground">Process Type</Label>
                    <Select 
                      value={selectedNode.data.config?.processType || 'transform'}
                      onValueChange={(value) => updateNodeConfig(selectedNode.id, { processType: value })}
                    >
                      <SelectTrigger className="mt-1 h-8 text-sm glass border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="transform">Transform Data</SelectItem>
                        <SelectItem value="filter">Filter Data</SelectItem>
                        <SelectItem value="validate">Validate Data</SelectItem>
                        <SelectItem value="aggregate">Aggregate Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Configuration</Label>
                    <Textarea 
                      value={selectedNode.data.config?.configuration || ''}
                      onChange={(e) => updateNodeConfig(selectedNode.id, { configuration: e.target.value })}
                      placeholder="Enter process configuration..."
                      className="mt-1 text-sm glass border-white/20 resize-none" 
                      rows={3}
                    />
                  </div>
                </>
              )}

              {selectedNode.type === 'database' && (
                <>
                  <div>
                    <Label className="text-xs text-muted-foreground">Operation</Label>
                    <Select 
                      value={selectedNode.data.config?.operation || 'query'}
                      onValueChange={(value) => updateNodeConfig(selectedNode.id, { operation: value })}
                    >
                      <SelectTrigger className="mt-1 h-8 text-sm glass border-white/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="query">Query</SelectItem>
                        <SelectItem value="insert">Insert</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="delete">Delete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">Query</Label>
                    <Textarea 
                      value={selectedNode.data.config?.query || ''}
                      onChange={(e) => updateNodeConfig(selectedNode.id, { query: e.target.value })}
                      placeholder="SELECT * FROM table WHERE..."
                      className="mt-1 text-sm glass border-white/20 resize-none font-mono" 
                      rows={3}
                    />
                  </div>
                </>
              )}

              <Button size="sm" className="w-full">
                <Settings className="w-3 h-3 mr-1" />
                Advanced Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}