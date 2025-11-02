'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Save } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'

interface ExitIntentModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (email: string) => Promise<void>
  existingEmail?: string
}

export function ExitIntentModal({
  isOpen,
  onClose,
  onSave,
  existingEmail
}: ExitIntentModalProps) {
  const [email, setEmail] = useState(existingEmail || '')
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && existingEmail) {
      setEmail(existingEmail)
    }
  }, [isOpen, existingEmail])

  const handleSave = async () => {
    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address')
      setSaveStatus('error')
      return
    }

    setIsSaving(true)
    setSaveStatus('idle')
    setErrorMessage(null)

    try {
      await onSave(email)
      setSaveStatus('success')
      
      // Close modal after 1.5 seconds on success
      setTimeout(() => {
        onClose()
        setSaveStatus('idle')
      }, 1500)
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to save your progress')
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setSaveStatus('idle')
    setErrorMessage(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative bg-white dark:bg-alira-primary rounded-2xl shadow-2xl max-w-md w-full p-6"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-lg hover:bg-alira-primary/10 dark:hover:bg-alira-primary/20 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-text-tertiary" />
          </button>

          {/* Content */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-alira-gold/10 dark:bg-alira-gold/20">
                <Mail className="w-6 h-6 text-alira-gold" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-alira-primary dark:text-alira-white">
                  Don't lose your progress!
                </h3>
                <p className="text-sm text-text-tertiary mt-1">
                  Save your form and come back later
                </p>
              </div>
            </div>

            {saveStatus === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
              >
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                  ✓ Your progress has been saved! We'll send you a link to continue.
                </p>
              </motion.div>
            ) : (
              <>
                <div>
                  <label htmlFor="exit-email" className="block text-sm font-medium text-alira-primary dark:text-alira-white mb-2">
                    Email Address
                  </label>
                  <Input
                    id="exit-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setSaveStatus('idle')
                      setErrorMessage(null)
                    }}
                    placeholder="your@email.com"
                    className={cn(
                      "w-full",
                      saveStatus === 'error' && "border-red-500 focus:border-red-500"
                    )}
                    disabled={isSaving}
                  />
                  {errorMessage && (
                    <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                      {errorMessage}
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    No thanks
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving || !email}
                    loading={isSaving}
                    className="flex-1 bg-alira-gold text-alira-primary hover:bg-alira-gold/90"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Progress
                  </Button>
                </div>

                <p className="text-xs text-text-tertiary text-center">
                  We'll email you a secure link to continue where you left off
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

