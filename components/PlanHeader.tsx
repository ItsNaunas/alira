'use client'

import { PlanDetail, planStatusOptions } from '@/lib/schema'
import { Button } from '@/components/ui/button'
import { 
  Edit3, 
  MessageSquare, 
  Download, 
  Share2, 
  ChevronDown,
  Home,
  ChevronRight,
  FileText
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PlanHeaderProps {
  plan: PlanDetail
  currentVersion?: number
  totalVersions?: number
  onVersionChange?: (version: number) => void
  showActions?: boolean
}

export default function PlanHeader({ 
  plan, 
  currentVersion = 1, 
  totalVersions = 1,
  onVersionChange,
  showActions = true 
}: PlanHeaderProps) {
  const router = useRouter()
  
  const statusOption = planStatusOptions.find(opt => opt.value === plan.status)
  const statusColor = statusOption?.color || 'gray'

  const handleEdit = () => {
    router.push(`/dashboard/${plan.id}/edit`)
  }

  const handleRefine = () => {
    router.push(`/dashboard/${plan.id}/refine`)
  }

  const handleExport = () => {
    if (plan.pdf_url) {
      window.open(plan.pdf_url, '_blank')
    }
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    alert('Share functionality coming soon!')
  }

  return (
    <div className="border-b border-white/10 bg-black/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="px-4 md:px-6 py-4 md:py-5">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link 
              href="/dashboard" 
              className="text-alira-white/60 hover:text-alira-white transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-alira-white/30" />
            <span className="text-alira-white flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {plan.business_name || 'Business Plan'}
            </span>
          </nav>

          {/* Header Content */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title and Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-serif font-normal text-alira-white truncate">
                  {plan.business_name || 'Business Plan'}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs border ${
                  statusColor === 'green'
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : statusColor === 'blue'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : statusColor === 'gray'
                    ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {statusOption?.label || plan.status}
                </span>
              </div>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-alira-white/50">
                <span>
                  Created {new Date(plan.created_at).toLocaleDateString('en-GB', { 
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                {totalVersions > 1 && (
                  <>
                    <span className="text-alira-white/20">•</span>
                    <div className="flex items-center gap-2">
                      <span>Version {currentVersion} of {totalVersions}</span>
                      {onVersionChange && (
                        <button 
                          className="flex items-center gap-1 hover:text-alira-gold transition-colors"
                          onClick={() => {
                            // TODO: Show version selector dropdown
                            alert('Version selector coming soon!')
                          }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {showActions && (
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-alira-white hover:bg-white/5"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                
                <Button
                  onClick={handleRefine}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-alira-white hover:bg-white/5"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Refine with AI
                </Button>
                
                {plan.pdf_url && (
                  <Button
                    onClick={handleExport}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-alira-white hover:bg-white/5"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                )}
                
                <Button
                  onClick={handleShare}
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-alira-white hover:bg-white/5"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

