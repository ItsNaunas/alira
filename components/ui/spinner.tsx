import { cn } from "@/lib/utils"

interface SpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  color?: "primary" | "white" | "gold"
}

export function Spinner({ size = "md", className, color = "primary" }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-12 h-12",
  }

  const colorClasses = {
    primary: "border-alira-primary",
    white: "border-white",
    gold: "border-alira-gold",
  }

  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-b-2",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

