'use client'

import { PlanDetail, planStatusOptions } from '@/lib/schema'
import { Button } from '@/components/ui/button'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { 
  Edit3, 
  MessageSquare, 
  Download, 
  ChevronDown,
  Home,
  ChevronRight,
  FileText,
  Loader2,
  Trash2
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

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
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const statusOption = planStatusOptions.find(opt => opt.value === plan.status)
  const statusColor = statusOption?.color || 'gray'

  const handleEdit = () => {
    router.push(`/dashboard/${plan.id}/edit`)
  }

  const handleRefine = () => {
    router.push(`/dashboard/${plan.id}/refine`)
  }

  const handleDownloadPDF = async () => {
    // If PDF already exists, just open it
    if (plan.pdf_url) {
      window.open(plan.pdf_url, '_blank')
      return
    }

    // Otherwise, generate it on-demand
    setGeneratingPDF(true)
    try {
      const response = await fetch('/api/plan/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id })
      })

      const result = await response.json()
      
      if (!response.ok) {
        console.error('PDF generation failed:', result)
        throw new Error(result.error || 'Failed to generate PDF')
      }

      // The API wraps response in a 'data' field: { success: true, data: {...} }
      const data = result.data || result

      if (data.pdf_url) {
        // PDF was uploaded to storage, open the URL
        window.open(data.pdf_url, '_blank')
        // Refresh the page to show the updated PDF URL
        window.location.reload()
      } else if (data.pdf_base64) {
        // PDF returned as base64, trigger download
        const byteCharacters = atob(data.pdf_base64)
        const byteNumbers = new Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        const blob = new Blob([byteArray], { type: 'application/pdf' })
        
        // Create download link
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${plan.business_name || 'Business-Plan'}-${new Date().toISOString().split('T')[0]}.pdf`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } else {
        throw new Error('No PDF data returned')
      }
    } catch (error: any) {
      console.error('Error generating PDF:', error)
      alert(`Failed to generate PDF: ${error.message || 'Please try again.'}`)
    } finally {
      setGeneratingPDF(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch('/api/plan/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id })
      })

      if (!response.ok) {
        throw new Error('Failed to delete plan')
      }

      // Redirect to dashboard after successful deletion
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error deleting plan:', error)
      alert('Failed to delete plan. Please try again.')
      setIsDeleting(false)
    }
  }

  return (
    <div className="border-b border-borderToken-subtle bg-bg-page/95 backdrop-blur-sm sticky top-0 z-10">
      <div className="px-4 md:px-6 py-4 md:py-5">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link 
              href="/dashboard" 
              className="text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </Link>
            <ChevronRight className="w-4 h-4 text-text-tertiary" />
            <span className="text-text-primary flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {plan.business_name || 'Business Plan'}
            </span>
          </nav>

          {/* Header Content */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title and Status */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-serif font-normal text-text-primary truncate">
                  {plan.business_name || 'Business Plan'}
                </h1>
                <span className={`px-3 py-1 rounded-full text-xs border ${
                  statusColor === 'green'
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : statusColor === 'blue'
                    ? 'bg-alira-primary/10 text-alira-primary border-alira-primary/20'
                    : statusColor === 'gray'
                    ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    : 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                }`}>
                  {statusOption?.label || plan.status}
                </span>
              </div>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                <span>
                  Created {new Date(plan.created_at).toLocaleDateString('en-GB', { 
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                {totalVersions > 1 && (
                  <>
                    <span className="text-text-tertiary">•</span>
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
                  className="border-borderToken-subtle text-text-primary hover:bg-bg-muted"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                
                <Button
                  onClick={handleRefine}
                  variant="outline"
                  size="sm"
                  className="border-borderToken-subtle text-text-primary hover:bg-bg-muted"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Refine with AI
                </Button>
                
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  size="sm"
                  className="border-borderToken-subtle text-text-primary hover:bg-bg-muted"
                  disabled={generatingPDF}
                >
                  {generatingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      {plan.pdf_url ? 'Download PDF' : 'Generate PDF'}
                    </>
                  )}
                </Button>

                <Button
                  onClick={() => setDeleteDialogOpen(true)}
                  variant="outline"
                  size="sm"
                  className="border-borderToken-subtle text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Plan?"
        description={`Are you sure you want to delete "${plan.business_name}"? This action cannot be undone and will permanently delete all plan data, versions, and chat history.`}
        cancelText="Cancel"
        actionText="Delete Plan"
        onAction={handleDelete}
        variant="destructive"
        loading={isDeleting}
      />
    </div>
  )
}

