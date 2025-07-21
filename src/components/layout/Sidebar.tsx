import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LayoutDashboard, 
  Bot, 
  Workflow, 
  FileText, 
  Code, 
  Rocket, 
  BarChart3,
  Zap,
  Settings
} from 'lucide-react'
import type { Page } from '@/App'

interface SidebarProps {
  currentPage: Page
  onPageChange: (page: Page) => void
}

const navigation = [
  { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard, badge: null },
  { id: 'agents' as Page, label: 'Agent Management', icon: Bot, badge: '12' },
  { id: 'workflows' as Page, label: 'Workflow Builder', icon: Workflow, badge: null },
  { id: 'prompts' as Page, label: 'Prompt Studio', icon: FileText, badge: 'New' },
  { id: 'projects' as Page, label: 'Project Development', icon: Code, badge: null },
  { id: 'deployment' as Page, label: 'Deployment Center', icon: Rocket, badge: null },
  { id: 'analytics' as Page, label: 'Analytics', icon: BarChart3, badge: null },
]

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <div className="w-64 glass border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">AI Command</h1>
            <p className="text-xs text-muted-foreground">Agent Center</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          
          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 h-12 text-left",
                isActive && "bg-primary/20 text-primary border border-primary/30 glow-primary"
              )}
              onClick={() => onPageChange(item.id)}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge 
                  variant={item.badge === 'New' ? 'default' : 'secondary'}
                  className={cn(
                    "text-xs",
                    item.badge === 'New' && "bg-accent text-white"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <Button variant="ghost" className="w-full justify-start gap-3 h-12">
          <Settings className="w-5 h-5" />
          Settings
        </Button>
        
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-medium">System Status</span>
          </div>
          <p className="text-xs text-muted-foreground">All agents operational</p>
        </div>
      </div>
    </div>
  )
}