import * as React from "react"
import { motion } from "framer-motion"
import { AlertCircle, RefreshCw, ArrowLeft, Mail } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  onGoBack?: () => void
  onContactSupport?: () => void
  retryLabel?: string
  isRetrying?: boolean
  className?: string
  variant?: "default" | "subtle"
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  onGoBack,
  onContactSupport,
  retryLabel = "Try Again",
  isRetrying = false,
  className,
  variant = "default",
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-xl p-6 sm:p-8",
        variant === "default" && "border border-red-500/20 bg-red-500/10",
        variant === "subtle" && "border border-white/10 bg-white/5",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Error Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
          className={cn(
            "w-16 h-16 rounded-full flex items-center justify-center",
            variant === "default" && "bg-red-500/20",
            variant === "subtle" && "bg-white/10"
          )}
        >
          <AlertCircle 
            className={cn(
              "w-8 h-8",
              variant === "default" && "text-red-400",
              variant === "subtle" && "text-white/60"
            )} 
            aria-hidden="true" 
          />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-serif font-normal text-alira-white">
          {title}
        </h3>

        {/* Message */}
        <p className="text-base text-alira-white/80 max-w-md">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto pt-2">
          {onRetry && (
            <Button
              onClick={onRetry}
              variant="primary"
              size="lg"
              loading={isRetrying}
              disabled={isRetrying}
            >
              {!isRetrying && <RefreshCw className="w-4 h-4 mr-2" aria-hidden="true" />}
              {retryLabel}
            </Button>
          )}

          {onGoBack && (
            <Button
              onClick={onGoBack}
              variant="tertiary"
              size="lg"
            >
              <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
              Go Back
            </Button>
          )}

          {onContactSupport && (
            <Button
              onClick={onContactSupport}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white"
            >
              <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
              Contact Support
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

interface InlineErrorProps {
  message: string
  onRetry?: () => void
  isRetrying?: boolean
  className?: string
}

export function InlineError({
  message,
  onRetry,
  isRetrying = false,
  className,
}: InlineErrorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3",
        className
      )}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex-1">
        <p className="text-sm text-red-100 font-medium">{message}</p>
      </div>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="ghost"
          size="sm"
          loading={isRetrying}
          disabled={isRetrying}
          className="text-red-300 hover:text-red-200 hover:bg-red-500/20 -my-1"
        >
          {!isRetrying && <RefreshCw className="w-3 h-3 mr-1" aria-hidden="true" />}
          {isRetrying ? "Retrying..." : "Retry"}
        </Button>
      )}
    </motion.div>
  )
}

