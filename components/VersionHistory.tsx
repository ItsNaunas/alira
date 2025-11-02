'use client'

import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PlanVersion } from '@/lib/schema'
import { 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface VersionHistoryProps {
  planId: string
  currentVersion?: number
  onRestoreVersion?: (versionId: string) => void
  className?: string
}

export default function VersionHistory({ 
  planId, 
  currentVersion,
  onRestoreVersion,
  className = '' 
}: VersionHistoryProps) {
  const [versions, setVersions] = useState<PlanVersion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [restoringId, setRestoringId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const loadVersions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/plan/versions?planId=${planId}`)
      
      if (!response.ok) {
        throw new Error('Failed to load versions')
      }

      const data = await response.json()
      setVersions(data.versions || [])
    } catch (err) {
      console.error('Failed to load versions:', err)
      setError('Failed to load version history')
    } finally {
      setLoading(false)
    }
  }, [planId])

  // Load versions on mount and when planId changes
  useEffect(() => {
    loadVersions()
  }, [loadVersions])

  const handleRestore = async (versionId: string) => {
    if (!onRestoreVersion) return

    const confirmed = window.confirm(
      'Are you sure you want to restore this version? This will create a new version with the restored content.'
    )

    if (!confirmed) return

    try {
      setRestoringId(versionId)

      const response = await fetch('/api/plan/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          versionId
        })
      })

      if (!response.ok) {
        throw new Error('Failed to restore version')
      }

      onRestoreVersion(versionId)
      await loadVersions()
    } catch (err) {
      console.error('Failed to restore version:', err)
      alert('Failed to restore version. Please try again.')
    } finally {
      setRestoringId(null)
    }
  }

  const toggleExpand = (versionId: string) => {
    setExpandedId(expandedId === versionId ? null : versionId)
  }

  if (loading) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-bg-muted rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-bg-muted rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className={`bg-surface border-borderToken-subtle ${className}`}>
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-text-secondary text-sm">{error}</p>
          <Button
            onClick={loadVersions}
            size="sm"
            variant="outline"
            className="mt-4 border-borderToken-subtle text-text-primary hover:bg-bg-muted"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (versions.length === 0) {
    return (
      <Card className={`bg-surface border-borderToken-subtle ${className}`}>
        <CardContent className="p-6 text-center">
          <Clock className="w-8 h-8 text-text-tertiary mx-auto mb-2" />
          <p className="text-text-secondary text-sm">No version history yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-serif text-text-primary">Version History</h3>
        <span className="text-sm text-text-secondary">{versions.length} versions</span>
      </div>

      <div className="space-y-2">
        {versions.map((version, index) => {
          const isExpanded = expandedId === version.id
          const isCurrent = version.version === currentVersion
          const isLatest = index === 0

          return (
            <Card 
              key={version.id}
              className={`bg-surface border-borderToken-subtle hover:border-accent transition-all ${
                isCurrent ? 'border-accent bg-accent/5' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Version Header */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-text-primary">
                          Version {version.version}
                        </span>
                        {isLatest && (
                          <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Latest
                          </span>
                        )}
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded text-xs bg-alira-gold/10 text-alira-gold border border-alira-gold/20">
                            <CheckCircle2 className="w-3 h-3 inline mr-1" />
                            Current
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Version Info */}
                    <div className="text-xs text-text-secondary mb-2">
                      <Clock className="w-3 h-3 inline mr-1" />
                      {new Date(version.created_at).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>

                    {/* Changes Summary */}
                    {version.changes_summary && (
                      <p className="text-sm text-text-primary leading-relaxed line-clamp-2">
                        {version.changes_summary}
                      </p>
                    )}

                    {/* Expanded Content */}
                    {isExpanded && version.content && (
                      <div className="mt-3 p-3 bg-bg-muted rounded border border-borderToken-subtle">
                        <pre className="text-xs text-text-secondary overflow-x-auto whitespace-pre-wrap">
                          {JSON.stringify(version.content, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {!isCurrent && onRestoreVersion && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestore(version.id)}
                        disabled={restoringId === version.id}
                        className="border-borderToken-subtle text-text-primary hover:bg-bg-muted"
                      >
                        {restoringId === version.id ? (
                          <>
                            <div className="w-3 h-3 border-2 border-text-tertiary border-t-text-primary rounded-full animate-spin mr-1"></div>
                            Restoring...
                          </>
                        ) : (
                          <>
                            <RotateCcw className="w-3 h-3 mr-1" />
                            Restore
                          </>
                        )}
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleExpand(version.id)}
                      className="text-text-tertiary hover:text-text-primary hover:bg-bg-muted"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

