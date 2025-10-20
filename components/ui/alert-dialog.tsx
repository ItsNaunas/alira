'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { Button } from './button'

interface AlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  cancelText?: string
  actionText?: string
  onAction: () => void
  variant?: 'default' | 'destructive'
  loading?: boolean
}

export function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  cancelText = 'Cancel',
  actionText = 'Continue',
  onAction,
  variant = 'default',
  loading = false
}: AlertDialogProps) {
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 animate-in fade-in"
        onClick={() => !loading && onOpenChange(false)}
      />
      
      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-[#0A0A0A] border border-white/20 rounded-lg shadow-2xl">
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div>
              <h2 className="text-xl font-serif text-alira-white mb-2">
                {title}
              </h2>
              <p className="text-sm text-alira-white/60 leading-relaxed">
                {description}
              </p>
            </div>
            <button
              onClick={() => !loading && onOpenChange(false)}
              disabled={loading}
              className="text-alira-white/40 hover:text-alira-white transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-white/10">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-white/20 text-alira-white hover:bg-white/5"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onAction}
              disabled={loading}
              className={
                variant === 'destructive'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-alira-gold hover:bg-alira-gold/90 text-alira-black'
              }
            >
              {loading ? 'Please wait...' : actionText}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

