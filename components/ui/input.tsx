import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex h-10 w-full rounded-md border px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-light placeholder:text-muted-foreground transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-borderToken-subtle bg-surface focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2",
        error: "border-red-500 bg-red-50/5 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
        success: "border-emerald-500 bg-emerald-50/5 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2",
        warning: "border-amber-500 bg-amber-50/5 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  error?: boolean
  success?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, error, success, ...props }, ref) => {
    // Determine variant based on props
    const inputVariant = error ? "error" : success ? "success" : variant

    return (
      <input
        type={type}
        className={cn(inputVariants({ variant: inputVariant }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
