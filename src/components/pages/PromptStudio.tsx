import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Save, 
  Play, 
  Copy, 
  Share, 
  FileText,
  Zap,
  Brain,
  Code,
  Palette,
  MessageSquare,
  Settings,
  Plus,
  Star
} from 'lucide-react'

export function PromptStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [promptText, setPromptText] = useState('')

  const promptTemplates = [
    {
      id: 'code-review',
      name: 'Code Review',
      description: 'Comprehensive code analysis and feedback',
      category: 'Development',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      template: `You are an expert code reviewer. Please analyze the following code and provide detailed feedback on:

1. Code quality and best practices
2. Potential bugs or security issues
3. Performance optimizations
4. Readability and maintainability
5. Suggestions for improvement

Code to review:
{code}

Please structure your response with clear sections and actionable recommendations.`,
      variables: ['code'],
      rating: 4.8,
      uses: 1247
    },
    {
      id: 'content-creation',
      name: 'Content Creation',
      description: 'Generate engaging content for various platforms',
      category: 'Content',
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
      template: `Create compelling {content_type} content about {topic} for {platform}.

Requirements:
- Target audience: {audience}
- Tone: {tone}
- Length: {length}
- Include relevant hashtags and call-to-action

Key points to cover:
{key_points}

Make it engaging, informative, and optimized for {platform}.`,
      variables: ['content_type', 'topic', 'platform', 'audience', 'tone', 'length', 'key_points'],
      rating: 4.9,
      uses: 2156
    },
    {
      id: 'data-analysis',
      name: 'Data Analysis',
      description: 'Analyze data and generate insights',
      category: 'Analytics',
      icon: Brain,
      color: 'from-green-500 to-emerald-500',
      template: `Analyze the following dataset and provide comprehensive insights:

Dataset: {dataset_description}
Data: {data}

Please provide:
1. Summary statistics and key findings
2. Trends and patterns identified
3. Anomalies or outliers
4. Actionable recommendations
5. Visualizations suggestions

Focus on {analysis_focus} and present findings in a clear, business-friendly format.`,
      variables: ['dataset_description', 'data', 'analysis_focus'],
      rating: 4.7,
      uses: 892
    },
    {
      id: 'creative-writing',
      name: 'Creative Writing',
      description: 'Generate creative stories and narratives',
      category: 'Creative',
      icon: FileText,
      color: 'from-orange-500 to-red-500',
      template: `Write a {genre} story with the following elements:

Setting: {setting}
Main character: {character}
Conflict: {conflict}
Theme: {theme}

Style requirements:
- Tone: {tone}
- Length: {length}
- Point of view: {pov}

Create an engaging narrative that captures the reader's attention from the first sentence and maintains momentum throughout.`,
      variables: ['genre', 'setting', 'character', 'conflict', 'theme', 'tone', 'length', 'pov'],
      rating: 4.6,
      uses: 634
    }
  ]

  const recentPrompts = [
    { name: 'API Documentation Generator', category: 'Development', lastUsed: '2 hours ago' },
    { name: 'Social Media Campaign', category: 'Marketing', lastUsed: '1 day ago' },
    { name: 'Bug Report Analysis', category: 'Development', lastUsed: '2 days ago' },
    { name: 'Product Description', category: 'Content', lastUsed: '3 days ago' }
  ]

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template.id)
    setPromptText(template.template)
  }

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Prompt Studio</h1>
          <p className="text-muted-foreground">
            Design, test, and optimize prompts for maximum AI performance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="glass border-white/20">
            <Copy className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80">
            <Plus className="w-4 h-4 mr-2" />
            New Prompt
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Library */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-primary">Template Library</CardTitle>
              <CardDescription>Pre-built prompts for common tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {promptTemplates.map((template) => {
                const Icon = template.icon
                return (
                  <div
                    key={template.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                      selectedTemplate === template.id
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-white/10 bg-white/5 hover:border-primary/30'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{template.name}</h3>
                        <Badge variant="outline" className="text-xs border-primary/30 text-primary mt-1">
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                    
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-yellow-400">{template.rating}</span>
                      </div>
                      <span className="text-muted-foreground">{template.uses} uses</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Recent Prompts */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-primary">Recent Prompts</CardTitle>
              <CardDescription>Your recently used prompts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentPrompts.map((prompt, index) => (
                <div key={index} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-primary/30 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-white">{prompt.name}</p>
                      <p className="text-xs text-muted-foreground">{prompt.category}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{prompt.lastUsed}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Prompt Editor */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="glass border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-primary">Prompt Editor</CardTitle>
                  <CardDescription>Design and test your prompts</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Save className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button size="sm" variant="outline">
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-primary to-accent">
                    <Play className="w-3 h-3 mr-1" />
                    Test
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="editor" className="w-full">
                <TabsList className="grid w-full grid-cols-3 glass">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="variables">Variables</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                
                <TabsContent value="editor" className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-primary mb-2 block">Prompt Text</label>
                    <Textarea
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="Enter your prompt here..."
                      className="min-h-[300px] font-mono text-sm glass border-white/20 resize-none"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Characters: {promptText.length}</span>
                    <span>Estimated tokens: ~{Math.ceil(promptText.length / 4)}</span>
                  </div>
                </TabsContent>
                
                <TabsContent value="variables" className="space-y-4 mt-4">
                  {selectedTemplate && promptTemplates.find(t => t.id === selectedTemplate)?.variables.map((variable, index) => (
                    <div key={index}>
                      <label className="text-sm font-medium text-primary mb-2 block capitalize">
                        {variable.replace('_', ' ')}
                      </label>
                      <Input
                        placeholder={`Enter ${variable.replace('_', ' ')}`}
                        className="glass border-white/20"
                      />
                    </div>
                  ))}
                  {(!selectedTemplate || !promptTemplates.find(t => t.id === selectedTemplate)?.variables.length) && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No variables detected in this prompt</p>
                      <p className="text-sm">Use {'{variable_name}'} syntax to add variables</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="settings" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-primary mb-2 block">Model</label>
                      <Input value="Claude 3.5 Sonnet" className="glass border-white/20" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary mb-2 block">Temperature</label>
                      <Input value="0.7" className="glass border-white/20" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary mb-2 block">Max Tokens</label>
                      <Input value="1000" className="glass border-white/20" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-primary mb-2 block">Top P</label>
                      <Input value="0.9" className="glass border-white/20" />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-primary">Test Results</CardTitle>
              <CardDescription>AI response and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-black/20 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary">Response</span>
                    <Badge variant="outline" className="border-green-500/30 text-green-400">
                      Success
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click "Test" to see AI response here...
                  </p>
                </div>
                
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-primary">--</p>
                    <p className="text-xs text-muted-foreground">Response Time</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-primary">--</p>
                    <p className="text-xs text-muted-foreground">Tokens Used</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-primary">--</p>
                    <p className="text-xs text-muted-foreground">Cost</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-primary">--</p>
                    <p className="text-xs text-muted-foreground">Quality Score</p>
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