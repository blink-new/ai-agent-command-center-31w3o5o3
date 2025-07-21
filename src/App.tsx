import { useState, useEffect } from 'react'
import { blink } from './lib/blink'
import { DatabaseService } from './lib/database'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/pages/Dashboard'
import { AgentManagement } from './components/pages/AgentManagement'
import { WorkflowBuilder } from './components/pages/WorkflowBuilder'
import { PromptStudio } from './components/pages/PromptStudio'
import { ProjectDevelopment } from './components/pages/ProjectDevelopment'
import { DeploymentCenter } from './components/pages/DeploymentCenter'
import { Analytics } from './components/pages/Analytics'
import { Toaster } from './components/ui/toaster'

export type Page = 'dashboard' | 'agents' | 'workflows' | 'prompts' | 'projects' | 'deployment' | 'analytics'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let initializationPromise: Promise<void> | null = null
    
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      // Initialize default data for new users (only once)
      if (state.user && !state.isLoading && !initializationPromise) {
        initializationPromise = DatabaseService.initializeDefaultData(state.user.id)
          .catch(error => {
            console.error('Failed to initialize default data:', error)
            // Reset promise so it can be retried later
            initializationPromise = null
          })
      }
    })
    
    return unsubscribe
  }, [])

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />
      case 'agents':
        return <AgentManagement user={user} />
      case 'workflows':
        return <WorkflowBuilder user={user} />
      case 'prompts':
        return <PromptStudio user={user} />
      case 'projects':
        return <ProjectDevelopment user={user} />
      case 'deployment':
        return <DeploymentCenter user={user} />
      case 'analytics':
        return <Analytics user={user} />
      default:
        return <Dashboard user={user} />
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400 text-lg">Initializing AI Command Center...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">AI Agent Command Center</h1>
          <p className="text-gray-300 mb-8">Please sign in to access your AI agents and workflows</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} user={user} />
      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>
      <Toaster />
    </div>
  )
}

export default App