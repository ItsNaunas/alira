'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { 
  Send, 
  Loader2, 
  Bot, 
  User, 
  Sparkles,
  Check,
  X
} from 'lucide-react'
import { RefinementChatMessage } from '@/lib/schema'
import { getQuickActions } from '@/lib/refinement-utils'

interface RefinementChatProps {
  planId: string
  focusSection?: string
  onSuggestionAccepted?: (suggestion: any) => void
  className?: string
}

interface Message {
  id: string
  type: 'user' | 'assistant' | 'system'
  content: string
  suggestedChanges?: any
  applied?: boolean
  timestamp: Date
}

export default function RefinementChat({ 
  planId, 
  focusSection, 
  onSuggestionAccepted,
  className = '' 
}: RefinementChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load chat history
  const loadChatHistory = useCallback(async () => {
    try {
      setIsLoadingHistory(true)
      const response = await fetch(`/api/plan/refine?planId=${planId}`)
      
      if (response.ok) {
        const data = await response.json()
        const historyMessages: Message[] = (data.messages || []).map((msg: RefinementChatMessage) => ({
          id: msg.id,
          type: msg.message_type,
          content: msg.content,
          suggestedChanges: msg.suggested_changes,
          applied: msg.applied,
          timestamp: new Date(msg.created_at)
        }))
        setMessages(historyMessages)
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    } finally {
      setIsLoadingHistory(false)
    }
  }, [planId])

  // Load chat history on mount and when planId changes
  useEffect(() => {
    loadChatHistory()
  }, [loadChatHistory])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/plan/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          message: inputValue,
          focusSection,
          includeHistory: true
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get refinement')
      }

      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.changes_summary || 'I\'ve refined the content based on your feedback.',
        suggestedChanges: data.refined_content,
        applied: false,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Refinement error:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'system',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleQuickAction = (action: string) => {
    setInputValue(action)
    textareaRef.current?.focus()
  }

  const handleAcceptSuggestion = (message: Message) => {
    if (message.suggestedChanges && onSuggestionAccepted) {
      onSuggestionAccepted(message.suggestedChanges)
      setMessages(prev => prev.map(msg => 
        msg.id === message.id ? { ...msg, applied: true } : msg
      ))
    }
  }

  const handleRejectSuggestion = (message: Message) => {
    setMessages(prev => prev.map(msg => 
      msg.id === message.id ? { ...msg, applied: false } : msg
    ))
  }

  const quickActions = focusSection ? getQuickActions(focusSection) : []

  if (isLoadingHistory) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <Loader2 className="w-8 h-8 text-alira-gold animate-spin" />
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-alira-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-alira-gold" />
            </div>
            <h3 className="text-lg font-serif text-text-primary mb-2">
              Refine Your Plan with AI
            </h3>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              Ask me to improve specific sections, add more detail, make it more concise, or any other changes you'd like.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type !== 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-alira-gold/10 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-alira-gold" />
                </div>
              )}
              
              <div className={`flex-1 max-w-[80%] ${message.type === 'user' ? 'text-right' : ''}`}>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-alira-gold text-alira-black'
                      : message.type === 'system'
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                      : 'bg-bg-muted text-text-primary border border-borderToken-subtle'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>

                {/* Suggestion Actions */}
                {message.type === 'assistant' && message.suggestedChanges && !message.applied && (
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAcceptSuggestion(message)}
                      className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20"
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRejectSuggestion(message)}
                      className="text-text-tertiary hover:text-text-primary hover:bg-bg-muted"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}

                {message.applied && (
                  <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    Applied
                  </div>
                )}

                <div className="mt-1 text-xs text-text-tertiary">
                  {message.timestamp.toLocaleTimeString('en-GB', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-alira-gold rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-alira-black" />
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-alira-gold/10 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-alira-gold" />
            </div>
            <div className="bg-bg-muted rounded-2xl px-4 py-3 border border-borderToken-subtle">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-accent" />
                <span className="text-sm text-text-secondary">Analyzing and refining...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {quickActions.length > 0 && messages.length === 0 && (
        <div className="px-4 py-3 border-t border-borderToken-subtle">
          <div className="text-xs text-text-tertiary mb-2">Quick actions:</div>
          <div className="flex flex-wrap gap-2">
            {quickActions.slice(0, 3).map((action, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickAction(action)}
                className="px-3 py-1.5 rounded-lg text-xs bg-bg-muted hover:bg-surface text-text-secondary hover:text-text-primary border border-borderToken-subtle hover:border-accent transition-all"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="px-4 py-4 border-t border-borderToken-subtle">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={focusSection 
              ? `Ask me to improve ${focusSection}...` 
              : "Ask me to refine your plan..."}
            className="flex-1 min-h-[80px] bg-bg-muted border-borderToken-subtle text-text-primary placeholder:text-text-tertiary resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="bg-alira-gold hover:bg-alira-gold/90 text-alira-black self-end"
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>
        <div className="mt-2 text-xs text-text-tertiary">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  )
}

