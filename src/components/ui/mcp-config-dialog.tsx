import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Plus, 
  Trash2, 
  Settings, 
  Server, 
  Key, 
  Globe, 
  Shield,
  CheckCircle,
  AlertCircle,
  Copy,
  Save
} from 'lucide-react'

interface MCPConfigDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  agentName: string
  agentProvider: string
}

export function MCPConfigDialog({ open, onOpenChange, agentName, agentProvider }: MCPConfigDialogProps) {
  const [activeTab, setActiveTab] = useState('servers')
  const [mcpServers, setMcpServers] = useState([
    {
      id: 'filesystem',
      name: 'Filesystem MCP',
      url: 'mcp://filesystem',
      status: 'connected',
      description: 'File system operations and management',
      capabilities: ['read', 'write', 'list', 'delete'],
      config: {
        rootPath: '/workspace',
        allowedExtensions: ['.txt', '.md', '.json', '.py'],
        maxFileSize: '10MB'
      }
    },
    {
      id: 'database',
      name: 'Database MCP',
      url: 'mcp://postgresql',
      status: 'disconnected',
      description: 'Database query and management operations',
      capabilities: ['query', 'schema', 'backup'],
      config: {
        host: 'localhost',
        port: '5432',
        database: 'ai_agent_db',
        ssl: true
      }
    }
  ])

  const [newServer, setNewServer] = useState({
    name: '',
    url: '',
    description: '',
    capabilities: [] as string[],
    config: {}
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400'
      case 'disconnected': return 'text-red-400'
      case 'connecting': return 'text-yellow-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return CheckCircle
      case 'disconnected': return AlertCircle
      case 'connecting': return Settings
      default: return AlertCircle
    }
  }

  const addCapability = (capability: string) => {
    if (capability && !newServer.capabilities.includes(capability)) {
      setNewServer(prev => ({
        ...prev,
        capabilities: [...prev.capabilities, capability]
      }))
    }
  }

  const removeCapability = (capability: string) => {
    setNewServer(prev => ({
      ...prev,
      capabilities: prev.capabilities.filter(c => c !== capability)
    }))
  }

  const addServer = () => {
    if (newServer.name && newServer.url) {
      setMcpServers(prev => [...prev, {
        id: Date.now().toString(),
        ...newServer,
        status: 'disconnected'
      }])
      setNewServer({
        name: '',
        url: '',
        description: '',
        capabilities: [],
        config: {}
      })
    }
  }

  const removeServer = (id: string) => {
    setMcpServers(prev => prev.filter(server => server.id !== id))
  }

  const toggleServerStatus = (id: string) => {
    setMcpServers(prev => prev.map(server => 
      server.id === id 
        ? { ...server, status: server.status === 'connected' ? 'disconnected' : 'connected' }
        : server
    ))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto glass border-white/20">
        <DialogHeader>
          <DialogTitle className="text-primary text-xl">
            MCP Server Configuration - {agentName}
          </DialogTitle>
          <DialogDescription>
            Configure Model Context Protocol (MCP) servers for {agentProvider} agent integration
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 glass">
            <TabsTrigger value="servers">MCP Servers</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          <TabsContent value="servers" className="space-y-6 mt-6">
            {/* Connected Servers */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Connected MCP Servers</h3>
                <Badge variant="outline" className="border-primary/30 text-primary">
                  {mcpServers.filter(s => s.status === 'connected').length} Active
                </Badge>
              </div>

              <div className="grid gap-4">
                {mcpServers.map((server) => {
                  const StatusIcon = getStatusIcon(server.status)
                  return (
                    <Card key={server.id} className="glass border-white/10">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                              <Server className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-white text-base">{server.name}</CardTitle>
                              <CardDescription className="text-sm">{server.url}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusIcon className={`w-4 h-4 ${getStatusColor(server.status)}`} />
                            <span className={`text-sm capitalize ${getStatusColor(server.status)}`}>
                              {server.status}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{server.description}</p>
                        
                        {/* Capabilities */}
                        <div>
                          <Label className="text-xs text-muted-foreground">Capabilities</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {server.capabilities.map((capability, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {capability}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Configuration */}
                        <div>
                          <Label className="text-xs text-muted-foreground">Configuration</Label>
                          <div className="mt-1 p-2 rounded bg-black/20 border border-white/10">
                            <pre className="text-xs text-muted-foreground">
                              {JSON.stringify(server.config, null, 2)}
                            </pre>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant={server.status === 'connected' ? 'destructive' : 'default'}
                            onClick={() => toggleServerStatus(server.id)}
                          >
                            {server.status === 'connected' ? 'Disconnect' : 'Connect'}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="w-3 h-3 mr-1" />
                            Configure
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => removeServer(server.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Add New Server */}
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add New MCP Server
                </CardTitle>
                <CardDescription>
                  Connect a new Model Context Protocol server to extend agent capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="server-name">Server Name</Label>
                    <Input
                      id="server-name"
                      value={newServer.name}
                      onChange={(e) => setNewServer(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Custom API Server"
                      className="glass border-white/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="server-url">Server URL</Label>
                    <Input
                      id="server-url"
                      value={newServer.url}
                      onChange={(e) => setNewServer(prev => ({ ...prev, url: e.target.value }))}
                      placeholder="mcp://your-server-url"
                      className="glass border-white/20"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="server-description">Description</Label>
                  <Textarea
                    id="server-description"
                    value={newServer.description}
                    onChange={(e) => setNewServer(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this server provides..."
                    className="glass border-white/20 resize-none"
                    rows={2}
                  />
                </div>

                <div>
                  <Label>Capabilities</Label>
                  <div className="flex flex-wrap gap-1 mt-1 mb-2">
                    {newServer.capabilities.map((capability, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {capability}
                        <button
                          onClick={() => removeCapability(capability)}
                          className="ml-1 hover:text-red-400"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add capability..."
                      className="glass border-white/20"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addCapability(e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addCapability(input.value)
                        input.value = ''
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <Button onClick={addServer} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add MCP Server
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Configure security and authentication for MCP connections
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Authentication</Label>
                    <p className="text-sm text-muted-foreground">All MCP servers must authenticate</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable TLS/SSL</Label>
                    <p className="text-sm text-muted-foreground">Encrypt all MCP communications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sandbox Mode</Label>
                    <p className="text-sm text-muted-foreground">Restrict server capabilities</p>
                  </div>
                  <Switch />
                </div>

                <div>
                  <Label>API Key Management</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Enter API key..."
                        type="password"
                        className="glass border-white/20"
                      />
                      <Button variant="outline">
                        <Key className="w-4 h-4 mr-2" />
                        Add Key
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Allowed Origins</Label>
                  <Textarea
                    placeholder="https://example.com&#10;https://api.example.com"
                    className="glass border-white/20 resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-primary">Connection Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Connections</span>
                      <span className="text-primary font-medium">2/3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Response Time</span>
                      <span className="text-primary font-medium">45ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Success Rate</span>
                      <span className="text-green-400 font-medium">98.5%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Last Health Check</span>
                      <span className="text-muted-foreground text-sm">2 min ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass border-white/10">
                <CardHeader>
                  <CardTitle className="text-primary">Usage Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Requests Today</span>
                      <span className="text-primary font-medium">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Data Transferred</span>
                      <span className="text-primary font-medium">2.3 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Errors</span>
                      <span className="text-red-400 font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Peak Usage</span>
                      <span className="text-muted-foreground text-sm">14:30 UTC</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-primary">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { time: '14:32', action: 'Filesystem MCP connected', status: 'success' },
                    { time: '14:28', action: 'Database query executed', status: 'success' },
                    { time: '14:25', action: 'Authentication failed for API server', status: 'error' },
                    { time: '14:20', action: 'New capability registered: file_search', status: 'info' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded bg-black/20">
                      <span className="text-xs text-muted-foreground w-12">{activity.time}</span>
                      <span className="text-sm flex-1">{activity.action}</span>
                      <Badge 
                        variant={activity.status === 'success' ? 'default' : activity.status === 'error' ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent">
            <Save className="w-4 h-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}