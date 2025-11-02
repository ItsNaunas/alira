import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  label: string
  description?: string
}

interface Milestone {
  percent: number
  message: string
}

interface FormProgressProps {
  steps: Step[]
  currentStep: number
  className?: string
  estimatedTimePerStep?: number // in seconds
  showMilestones?: boolean
  milestones?: Milestone[]
}

const defaultMilestones: Milestone[] = [
  { percent: 25, message: "Great start! 🎉" },
  { percent: 50, message: "You're halfway there! 🚀" },
  { percent: 75, message: "Almost done! 💪" }
]

export function FormProgress({ 
  steps, 
  currentStep, 
  className,
  estimatedTimePerStep = 60, // default 60 seconds per step
  showMilestones = true,
  milestones = defaultMilestones
}: FormProgressProps) {
  const percentage = ((currentStep - 1) / (steps.length - 1)) * 100
  const remainingSteps = steps.length - currentStep
  const estimatedTimeRemaining = remainingSteps * estimatedTimePerStep
  const minutesRemaining = Math.ceil(estimatedTimeRemaining / 60)

  // Find active milestone
  const activeMilestone = milestones
    .filter(m => percentage >= m.percent)
    .sort((a, b) => b.percent - a.percent)[0]

  // Check if we just hit a milestone
  const [lastMilestoneShown, setLastMilestoneShown] = React.useState<number>(0)
  const [showMilestoneMessage, setShowMilestoneMessage] = React.useState(false)

  React.useEffect(() => {
    if (activeMilestone && activeMilestone.percent > lastMilestoneShown) {
      setLastMilestoneShown(activeMilestone.percent)
      setShowMilestoneMessage(true)
      // Hide message after 3 seconds
      const timer = setTimeout(() => setShowMilestoneMessage(false), 3000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [activeMilestone, lastMilestoneShown])

  return (
    <div className={cn("w-full", className)} role="navigation" aria-label="Form progress">
      {/* Milestone Celebration */}
      <AnimatePresence>
        {showMilestones && showMilestoneMessage && activeMilestone && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="mb-4 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-alira-gold/10 border border-alira-gold/20">
              <span className="text-sm font-medium text-alira-gold">
                {activeMilestone.message}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Estimate */}
      {remainingSteps > 0 && (
        <div className="mb-4 text-center">
          <p className="text-xs text-text-tertiary font-light">
            {minutesRemaining === 1 ? 'About 1 minute left' : `About ${minutesRemaining} minutes left`}
          </p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="relative mb-8">
        {/* Background Track */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-borderToken-subtle" aria-hidden="true" />
        
        {/* Active Progress */}
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-alira-gold"
          initial={{ width: "0%" }}
          animate={{ width: `${percentage}%` }}
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
                    isUpcoming && "bg-surface border-borderToken-subtle text-text-tertiary"
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
                      (isCompleted || isCurrent) && "text-text-primary",
                      isUpcoming && "text-text-tertiary"
                    )}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p
                      className={cn(
                        "text-xs mt-1 hidden sm:block transition-colors",
                        (isCompleted || isCurrent) && "text-text-secondary",
                        isUpcoming && "text-text-tertiary"
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
        <p className="text-sm text-text-secondary font-light">
          Step {currentStep} of {totalSteps}
        </p>
        <p className="text-sm text-text-tertiary font-light">
          {Math.round(percentage)}% complete
        </p>
      </div>
      <div className="h-2 bg-borderToken-subtle rounded-full overflow-hidden">
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

