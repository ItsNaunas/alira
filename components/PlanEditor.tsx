'use client'

import { useState } from 'react'
import { BusinessCaseOutline, PlanSection, planSectionLabels } from '@/lib/schema'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { 
  Sparkles, 
  Save, 
  ChevronDown,
  ChevronUp,
  Plus,
  Minus
} from 'lucide-react'

interface PlanEditorProps {
  content: BusinessCaseOutline
  onChange: (content: BusinessCaseOutline) => void
  onSave: () => void
  isSaving?: boolean
  className?: string
}

interface SectionEditorProps {
  title: string
  value: any
  onChange: (value: any) => void
  type?: 'text' | 'array' | 'solutions'
  isExpanded?: boolean
  onToggle?: () => void
}

function SectionEditor({ 
  title, 
  value, 
  onChange, 
  type = 'text',
  isExpanded = true,
  onToggle
}: SectionEditorProps) {
  // Handle text content
  if (type === 'text') {
    return (
      <Card className="bg-surface border-borderToken-subtle">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-serif text-text-primary">{title}</h4>
            {onToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="text-text-tertiary hover:text-text-primary"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            )}
          </div>
          
          {isExpanded && (
            <Textarea
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Enter ${title.toLowerCase()}...`}
              className="min-h-[120px] bg-bg-muted border-borderToken-subtle text-text-primary placeholder:text-text-tertiary"
            />
          )}
        </CardContent>
      </Card>
    )
  }

  // Handle array content
  if (type === 'array') {
    const items = Array.isArray(value) ? value : []
    
    return (
      <Card className="bg-surface border-borderToken-subtle">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-serif text-text-primary">{title}</h4>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange([...items, ''])}
                className="text-accent hover:text-accent-dark"
              >
                <Plus className="w-4 h-4" />
              </Button>
              {onToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="text-text-tertiary hover:text-text-primary"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
          
          {isExpanded && (
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Textarea
                    value={item}
                    onChange={(e) => {
                      const newItems = [...items]
                      newItems[index] = e.target.value
                      onChange(newItems)
                    }}
                    placeholder={`Item ${index + 1}...`}
                    className="flex-1 min-h-[60px] bg-bg-muted border-borderToken-subtle text-text-primary placeholder:text-text-tertiary"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onChange(items.filter((_, i) => i !== index))}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              
              {items.length === 0 && (
                <p className="text-sm text-text-tertiary text-center py-4">
                  No items yet. Click + to add one.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  // Handle solutions (complex object array)
  if (type === 'solutions') {
    const solutions = Array.isArray(value) ? value : []
    
    return (
      <Card className="bg-surface border-borderToken-subtle">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-serif text-text-primary">{title}</h4>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange([...solutions, {
                  pillar: '',
                  actions: [],
                  effort: 'medium',
                  impact: 'medium'
                }])}
                className="text-accent hover:text-accent-dark"
              >
                <Plus className="w-4 h-4" />
              </Button>
              {onToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggle}
                  className="text-text-tertiary hover:text-text-primary"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              )}
            </div>
          </div>
          
          {isExpanded && (
            <div className="space-y-4">
              {solutions.map((solution, index) => (
                <div key={index} className="bg-bg-muted rounded-lg p-3 border border-borderToken-subtle space-y-3">
                  <div className="flex justify-between items-start">
                    <input
                      type="text"
                      value={solution.pillar || ''}
                      onChange={(e) => {
                        const newSolutions = [...solutions]
                        newSolutions[index] = { ...solution, pillar: e.target.value }
                        onChange(newSolutions)
                      }}
                      placeholder="Pillar name..."
                      className="flex-1 bg-transparent border-none text-text-primary placeholder:text-text-tertiary focus:outline-none font-serif"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onChange(solutions.filter((_, i) => i !== index))}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={solution.effort || 'medium'}
                      onChange={(e) => {
                        const newSolutions = [...solutions]
                        newSolutions[index] = { ...solution, effort: e.target.value as any }
                        onChange(newSolutions)
                      }}
                      className="text-xs bg-bg-muted border border-borderToken-subtle text-text-primary rounded px-2 py-1"
                    >
                      <option value="low">Effort: Low</option>
                      <option value="medium">Effort: Medium</option>
                      <option value="high">Effort: High</option>
                    </select>
                    
                    <select
                      value={solution.impact || 'medium'}
                      onChange={(e) => {
                        const newSolutions = [...solutions]
                        newSolutions[index] = { ...solution, impact: e.target.value as any }
                        onChange(newSolutions)
                      }}
                      className="text-xs bg-bg-muted border border-borderToken-subtle text-text-primary rounded px-2 py-1"
                    >
                      <option value="low">Impact: Low</option>
                      <option value="medium">Impact: Medium</option>
                      <option value="high">Impact: High</option>
                    </select>
                  </div>
                  
                  <div>
                    <div className="text-xs text-text-secondary mb-1">Actions:</div>
                    {(solution.actions || []).map((action: string, actionIndex: number) => (
                      <div key={actionIndex} className="flex gap-2 mb-1">
                        <input
                          type="text"
                          value={action}
                          onChange={(e) => {
                            const newSolutions = [...solutions]
                            const newActions = [...(solution.actions || [])]
                            newActions[actionIndex] = e.target.value
                            newSolutions[index] = { ...solution, actions: newActions }
                            onChange(newSolutions)
                          }}
                          placeholder="Action..."
                          className="flex-1 text-xs bg-bg-muted border border-borderToken-subtle rounded px-2 py-1 text-text-primary placeholder:text-text-tertiary"
                        />
                        <button
                          onClick={() => {
                            const newSolutions = [...solutions]
                            const newActions = (solution.actions || []).filter((_: any, i: number) => i !== actionIndex)
                            newSolutions[index] = { ...solution, actions: newActions }
                            onChange(newSolutions)
                          }}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newSolutions = [...solutions]
                        newSolutions[index] = { 
                          ...solution, 
                          actions: [...(solution.actions || []), ''] 
                        }
                        onChange(newSolutions)
                      }}
                      className="text-xs text-accent hover:text-accent-dark mt-1"
                    >
                      + Add action
                    </button>
                  </div>
                </div>
              ))}
              
              {solutions.length === 0 && (
                <p className="text-sm text-text-tertiary text-center py-4">
                  No solutions yet. Click + to add one.
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return null
}

export default function PlanEditor({
  content,
  onChange,
  onSave,
  isSaving = false,
  className = ''
}: PlanEditorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['problem_statement', 'objectives', 'proposed_solution'])
  )

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateSection = (section: keyof BusinessCaseOutline, value: any) => {
    onChange({
      ...content,
      [section]: value
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Save Button */}
      <div className="sticky top-0 z-10 bg-bg-page/95 backdrop-blur-sm p-4 -mx-4 -mt-4 mb-4 border-b border-borderToken-subtle">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-serif text-text-primary">Edit Plan</h3>
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-alira-black/30 border-t-alira-black rounded-full animate-spin mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Editors */}
      <SectionEditor
        title={planSectionLabels.problem_statement}
        value={content.problem_statement}
        onChange={(v) => updateSection('problem_statement', v)}
        type="text"
        isExpanded={expandedSections.has('problem_statement')}
        onToggle={() => toggleSection('problem_statement')}
      />

      <SectionEditor
        title={planSectionLabels.objectives}
        value={content.objectives}
        onChange={(v) => updateSection('objectives', v)}
        type="array"
        isExpanded={expandedSections.has('objectives')}
        onToggle={() => toggleSection('objectives')}
      />

      <SectionEditor
        title={planSectionLabels.current_state}
        value={content.current_state}
        onChange={(v) => updateSection('current_state', v)}
        type="text"
        isExpanded={expandedSections.has('current_state')}
        onToggle={() => toggleSection('current_state')}
      />

      <SectionEditor
        title={planSectionLabels.proposed_solution}
        value={content.proposed_solution}
        onChange={(v) => updateSection('proposed_solution', v)}
        type="solutions"
        isExpanded={expandedSections.has('proposed_solution')}
        onToggle={() => toggleSection('proposed_solution')}
      />

      <SectionEditor
        title={planSectionLabels.expected_outcomes}
        value={content.expected_outcomes}
        onChange={(v) => updateSection('expected_outcomes', v)}
        type="array"
        isExpanded={expandedSections.has('expected_outcomes')}
        onToggle={() => toggleSection('expected_outcomes')}
      />

      <SectionEditor
        title={planSectionLabels.next_steps}
        value={content.next_steps}
        onChange={(v) => updateSection('next_steps', v)}
        type="array"
        isExpanded={expandedSections.has('next_steps')}
        onToggle={() => toggleSection('next_steps')}
      />

      {(content as any).risk_assessment !== undefined && (
        <SectionEditor
          title={planSectionLabels.risk_assessment}
          value={(content as any).risk_assessment}
          onChange={(v) => updateSection('risk_assessment' as any, v)}
          type="text"
          isExpanded={expandedSections.has('risk_assessment')}
          onToggle={() => toggleSection('risk_assessment')}
        />
      )}

      {(content as any).competitive_advantage !== undefined && (
        <SectionEditor
          title={planSectionLabels.competitive_advantage}
          value={(content as any).competitive_advantage}
          onChange={(v) => updateSection('competitive_advantage' as any, v)}
          type="text"
          isExpanded={expandedSections.has('competitive_advantage')}
          onToggle={() => toggleSection('competitive_advantage')}
        />
      )}
    </div>
  )
}

