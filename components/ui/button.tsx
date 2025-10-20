import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-light ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // ALIRA-specific variants
        alira: "inline-flex items-center justify-center text-lg font-light text-white dark:text-alira-primary bg-alira-primary dark:bg-alira-white hover:bg-alira-primary/90 dark:hover:bg-white/90 focus:outline-none focus:ring-4 focus:ring-alira-gold/20 focus:ring-offset-2 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl border-2 border-alira-primary dark:border-alira-white hover:border-alira-gold",
        aliraOutline: "inline-flex items-center justify-center text-lg font-light text-alira-gold border-2 border-alira-gold hover:bg-alira-gold hover:text-alira-primary dark:text-alira-white focus:outline-none focus:ring-4 focus:ring-alira-gold/20 focus:ring-offset-2 transition-all duration-300 active:scale-95 shadow-lg hover:shadow-xl",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Determine spinner color based on button variant
    const getSpinnerColor = () => {
      if (variant === "alira" || variant === "default") return "white"
      if (variant === "aliraOutline") return "gold"
      return "primary"
    }
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner size="sm" color={getSpinnerColor()} className="mr-2" />}
        {children}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
