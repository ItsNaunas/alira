import * as React from "react"
import { motion } from "framer-motion"
import { CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface FormSuccessProps {
  title?: string
  message?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
  children?: React.ReactNode
}

export function FormSuccess({
  title = "Success!",
  message = "Your submission was successful.",
  actionLabel,
  onAction,
  className,
  children,
}: FormSuccessProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-6 sm:p-8",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
          className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center"
        >
          <CheckCircle2 className="w-8 h-8 text-emerald-400" aria-hidden="true" />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-serif font-normal text-alira-white">
          {title}
        </h3>

        {/* Message */}
        {message && (
          <p className="text-base text-alira-white/80 max-w-md">
            {message}
          </p>
        )}

        {/* Custom Content */}
        {children}

        {/* Action Button */}
        {actionLabel && onAction && (
          <Button
            onClick={onAction}
            variant="primary"
            size="lg"
            className="mt-2"
          >
            {actionLabel}
            <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </Button>
        )}
      </div>
    </motion.div>
  )
}

interface FormSuccessBannerProps {
  message: string
  onDismiss?: () => void
  className?: string
}

export function FormSuccessBanner({
  message,
  onDismiss,
  className,
}: FormSuccessBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm text-emerald-100 font-medium">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </motion.div>
  )
}

