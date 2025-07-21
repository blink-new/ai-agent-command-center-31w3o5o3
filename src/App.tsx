import { useState } from 'react'
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
    <div className="flex h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] text-white">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-hidden">
        {renderPage()}
      </main>
      <Toaster />
    </div>
  )
}

export default App