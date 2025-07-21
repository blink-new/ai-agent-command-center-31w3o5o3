import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Play, 
  Square, 
  RotateCcw, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Clock,
  Zap,
  DollarSign,
  BarChart3,
  Download,
  Share
} from 'lucide-react'
import { AIService } from '@/lib/ai-services'

interface TestResult {
  id: string
  timestamp: Date
  model: string
  prompt: string
  response: string
  metrics: {
    responseTime: number
    tokenCount: number
    cost: number
    qualityScore?: number
  }
  rating?: 'good' | 'bad'
}

interface PromptTesterProps {
  prompt: string
  variables?: Record<string, string>
  onResultsChange?: (results: TestResult[]) => void
}

export function PromptTester({ prompt, variables = {}, onResultsChange }: PromptTesterProps) {
  const [selectedModel, setSelectedModel] = useState('claude-3.5-sonnet')
  const [isRunning, setIsRunning] = useState(false)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [batchSize, setBatchSize] = useState(1)

  const models = [
    { id: 'claude-3.5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'OpenAI' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
    { id: 'deepseek-coder', name: 'DeepSeek Coder', provider: 'DeepSeek' },
    { id: 'kimi-k2', name: 'KIMI K2', provider: 'Moonshot AI' }
  ]

  const processPrompt = (promptText: string, vars: Record<string, string>) => {
    let processed = promptText
    Object.entries(vars).forEach(([key, value]) => {
      processed = processed.replace(new RegExp(`\\{${key}\\}`, 'g'), value)
    })
    return processed
  }

  const runSingleTest = async (model: string, processedPrompt: string): Promise<TestResult> => {
    const startTime = Date.now()
    
    try {
      const response = await AIService.callAgent(model, processedPrompt)
      const endTime = Date.now()
      
      const result: TestResult = {
        id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        model,
        prompt: processedPrompt,
        response: response.content || response.error || 'No response',
        metrics: {
          responseTime: endTime - startTime,
          tokenCount: response.usage?.totalTokens || 0,
          cost: calculateCost(model, response.usage?.totalTokens || 0),
          qualityScore: Math.random() * 100 // Placeholder - would be actual quality assessment
        }
      }
      
      return result
    } catch (error) {
      const endTime = Date.now()
      return {
        id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        model,
        prompt: processedPrompt,
        response: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        metrics: {
          responseTime: endTime - startTime,
          tokenCount: 0,
          cost: 0,
          qualityScore: 0
        }
      }
    }
  }

  const calculateCost = (model: string, tokens: number): number => {
    const rates: Record<string, number> = {
      'claude-3.5-sonnet': 0.003,
      'gpt-4-turbo': 0.01,
      'gemini-pro': 0.0005,
      'deepseek-coder': 0.0014,
      'kimi-k2': 0.0
    }
    return (rates[model] || 0.001) * (tokens / 1000)
  }

  const runTest = async () => {
    if (!prompt.trim()) return
    
    setIsRunning(true)
    setCurrentTest('Preparing test...')
    
    const processedPrompt = processPrompt(prompt, variables)
    const newResults: TestResult[] = []
    
    try {
      for (let i = 0; i < batchSize; i++) {
        setCurrentTest(`Running test ${i + 1} of ${batchSize}...`)
        const result = await runSingleTest(selectedModel, processedPrompt)
        newResults.push(result)
        
        // Add small delay between requests
        if (i < batchSize - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
      
      const updatedResults = [...testResults, ...newResults]
      setTestResults(updatedResults)
      onResultsChange?.(updatedResults)
    } catch (error) {
      console.error('Test failed:', error)
    } finally {
      setIsRunning(false)
      setCurrentTest(null)
    }
  }

  const runBatchTest = async () => {
    if (!prompt.trim()) return
    
    setIsRunning(true)
    setCurrentTest('Running batch test across all models...')
    
    const processedPrompt = processPrompt(prompt, variables)
    const newResults: TestResult[] = []
    
    try {
      for (const model of models) {
        setCurrentTest(`Testing ${model.name}...`)
        const result = await runSingleTest(model.id, processedPrompt)
        newResults.push(result)
        
        // Add delay between model tests
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
      
      const updatedResults = [...testResults, ...newResults]
      setTestResults(updatedResults)
      onResultsChange?.(updatedResults)
    } catch (error) {
      console.error('Batch test failed:', error)
    } finally {
      setIsRunning(false)
      setCurrentTest(null)
    }
  }

  const rateResult = (resultId: string, rating: 'good' | 'bad') => {
    setTestResults(prev => prev.map(result => 
      result.id === resultId ? { ...result, rating } : result
    ))
  }

  const copyResult = (result: TestResult) => {
    navigator.clipboard.writeText(result.response)
  }

  const clearResults = () => {
    setTestResults([])
    onResultsChange?.([])
  }

  const exportResults = () => {
    const dataStr = JSON.stringify(testResults, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `prompt-test-results-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getAverageMetrics = () => {
    if (testResults.length === 0) return null
    
    const totals = testResults.reduce((acc, result) => ({
      responseTime: acc.responseTime + result.metrics.responseTime,
      tokenCount: acc.tokenCount + result.metrics.tokenCount,
      cost: acc.cost + result.metrics.cost,
      qualityScore: acc.qualityScore + (result.metrics.qualityScore || 0)
    }), { responseTime: 0, tokenCount: 0, cost: 0, qualityScore: 0 })
    
    return {
      responseTime: Math.round(totals.responseTime / testResults.length),
      tokenCount: Math.round(totals.tokenCount / testResults.length),
      cost: (totals.cost / testResults.length).toFixed(4),
      qualityScore: Math.round(totals.qualityScore / testResults.length)
    }
  }

  const averageMetrics = getAverageMetrics()

  return (
    <div className="space-y-6">
      {/* Test Configuration */}
      <Card className="glass border-white/10">
        <CardHeader>
          <CardTitle className="text-primary">Test Configuration</CardTitle>
          <CardDescription>Configure your prompt testing parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-primary mb-2 block">Model</label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {models.map(model => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} ({model.provider})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-primary mb-2 block">Batch Size</label>
              <Select value={batchSize.toString()} onValueChange={(value) => setBatchSize(parseInt(value))}>
                <SelectTrigger className="glass border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 test</SelectItem>
                  <SelectItem value="3">3 tests</SelectItem>
                  <SelectItem value="5">5 tests</SelectItem>
                  <SelectItem value="10">10 tests</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={runTest} 
              disabled={isRunning || !prompt.trim()}
              className="flex-1"
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  {currentTest}
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Run Test
                </>
              )}
            </Button>
            <Button 
              onClick={runBatchTest} 
              disabled={isRunning || !prompt.trim()}
              variant="outline"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Batch Test
            </Button>
            <Button 
              onClick={clearResults} 
              disabled={testResults.length === 0}
              variant="outline"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <>
          {/* Summary Metrics */}
          {averageMetrics && (
            <Card className="glass border-white/10">
              <CardHeader>
                <CardTitle className="text-primary">Test Summary</CardTitle>
                <CardDescription>{testResults.length} test results</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-lg font-bold text-primary">{averageMetrics.responseTime}ms</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Avg Response Time</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-lg font-bold text-primary">{averageMetrics.tokenCount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Avg Tokens</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-lg font-bold text-primary">${averageMetrics.cost}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Avg Cost</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <span className="text-lg font-bold text-primary">{averageMetrics.qualityScore}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Avg Quality</p>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button size="sm" variant="outline" onClick={exportResults}>
                    <Download className="w-3 h-3 mr-1" />
                    Export Results
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share className="w-3 h-3 mr-1" />
                    Share Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Individual Results */}
          <Card className="glass border-white/10">
            <CardHeader>
              <CardTitle className="text-primary">Test Results</CardTitle>
              <CardDescription>Individual test responses and metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testResults.map((result, index) => (
                <div key={result.id} className="p-4 rounded-lg bg-black/20 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-primary/30 text-primary">
                        Test #{testResults.length - index}
                      </Badge>
                      <Badge variant="secondary">
                        {models.find(m => m.id === result.model)?.name || result.model}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {result.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={result.rating === 'good' ? 'default' : 'outline'}
                        onClick={() => rateResult(result.id, 'good')}
                      >
                        <ThumbsUp className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant={result.rating === 'bad' ? 'destructive' : 'outline'}
                        onClick={() => rateResult(result.id, 'bad')}
                      >
                        <ThumbsDown className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => copyResult(result)}>
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 mb-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Response Time:</span>
                      <span className="ml-1 text-primary font-medium">{result.metrics.responseTime}ms</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tokens:</span>
                      <span className="ml-1 text-primary font-medium">{result.metrics.tokenCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Cost:</span>
                      <span className="ml-1 text-primary font-medium">${result.metrics.cost.toFixed(4)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quality:</span>
                      <span className="ml-1 text-primary font-medium">{Math.round(result.metrics.qualityScore || 0)}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Response:</label>
                      <div className="mt-1 p-3 rounded bg-black/40 border border-white/10">
                        <pre className="text-sm whitespace-pre-wrap text-white">{result.response}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}