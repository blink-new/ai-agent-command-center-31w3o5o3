import { useState, useEffect } from 'react'
import { blink } from './lib/blink'
import { db } from './lib/database'
import { Sidebar } from './components/layout/Sidebar'
import { Dashboard } from './components/pages/Dashboard'
import { AgentManagement } from './components/pages/AgentManagement'
import { WorkflowBuilder } from './components/pages/WorkflowBuilder'
import { PromptStudio } from './components/pages/PromptStudio'
import { ProjectDevelopment } from './components/pages/ProjectDevelopment'
import { DeploymentCenter } from './components/pages/DeploymentCenter'
import { Analytics } from './components/pages/Analytics'
import { Toaster } from './components/ui/toaster'
import './App.css'

type Page = 'dashboard' | 'agents' | 'workflows' | 'prompts' | 'projects' | 'deployment' | 'analytics'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged(async (state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      if (state.user && !state.isLoading) {
        // Initialize default data for new users
        await db.initializeDefaultData()
      }
    })
    
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading AI Command Center...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">AI Agent Command Center</h1>
          <p className="text-slate-400 mb-8">Please sign in to access your AI agents and workflows</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'agents':
        return <AgentManagement />
      case 'workflows':
        return <WorkflowBuilder />
      case 'prompts':
        return <PromptStudio />
      case 'projects':
        return <ProjectDevelopment />
      case 'deployment':
        return <DeploymentCenter />
      case 'analytics':
        return <Analytics />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-auto">
        {renderPage()}
      </main>
      <Toaster />
    </div>
  )
}

export default App