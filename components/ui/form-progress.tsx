import * as React from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  label: string
  description?: string
}

interface FormProgressProps {
  steps: Step[]
  currentStep: number
  className?: string
}

export function FormProgress({ steps, currentStep, className }: FormProgressProps) {
  return (
    <div className={cn("w-full", className)} role="navigation" aria-label="Form progress">
      {/* Progress Bar */}
      <div className="relative mb-8">
        {/* Background Track */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10" aria-hidden="true" />
        
        {/* Active Progress */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-alira-gold"
          initial={{ width: "0%" }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          aria-hidden="true"
        />

        {/* Step Indicators */}
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1
            const isCompleted = stepNumber < currentStep
            const isCurrent = stepNumber === currentStep
            const isUpcoming = stepNumber > currentStep

            return (
              <div
                key={index}
                className="flex flex-col items-center flex-1"
                aria-current={isCurrent ? "step" : undefined}
              >
                {/* Step Circle */}
                <motion.div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm border-2 transition-colors relative z-10",
                    isCompleted && "bg-alira-gold border-alira-gold text-alira-black",
                    isCurrent && "bg-alira-primary border-alira-gold text-alira-gold",
                    isUpcoming && "bg-alira-primary border-white/20 text-white/40"
                  )}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <span>{stepNumber}</span>
                  )}
                </motion.div>

                {/* Step Label */}
                <div className="mt-3 text-center">
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-medium transition-colors",
                      (isCompleted || isCurrent) && "text-alira-white",
                      isUpcoming && "text-white/40"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p
                      className={cn(
                        "text-xs mt-1 hidden sm:block transition-colors",
                        (isCompleted || isCurrent) && "text-white/60",
                        isUpcoming && "text-white/30"
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Step Counter (Screen Reader) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.label}
      </div>
    </div>
  )
}

interface SimpleFormProgressProps {
  currentStep: number
  totalSteps: number
  className?: string
}

export function SimpleFormProgress({
  currentStep,
  totalSteps,
  className,
}: SimpleFormProgressProps) {
  const percentage = (currentStep / totalSteps) * 100

  return (
    <div className={cn("w-full", className)} role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={totalSteps} aria-label="Form progress">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-alira-white/80 font-light">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-sm text-alira-white/60 font-light">
          {Math.round(percentage)}% complete
        </p>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-alira-gold rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}

