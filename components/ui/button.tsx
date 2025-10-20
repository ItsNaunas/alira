import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Spinner } from "./spinner"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-light ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Standard shadcn variants
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        
        // ALIRA Design System - Consolidated & Simplified
        primary: "bg-alira-gold text-alira-black hover:bg-alira-gold/90 focus:ring-alira-gold/40 font-medium shadow-sm hover:shadow-lg transition-all duration-200 active:scale-[0.98]",
        primaryOutline: "border-2 border-alira-gold text-alira-gold hover:bg-alira-gold hover:text-alira-black focus:ring-alira-gold/40 transition-all duration-200 shadow-sm hover:shadow-lg active:scale-[0.98]",
        tertiary: "text-alira-white hover:bg-white/10 focus:ring-white/40 transition-colors",
        
        // Legacy support (deprecated - will be removed in next major version)
        alira: "bg-alira-gold text-alira-black hover:bg-alira-gold/90 focus:ring-alira-gold/40 font-medium shadow-sm hover:shadow-lg transition-all duration-200 active:scale-[0.98]",
        aliraOutline: "border-2 border-alira-gold text-alira-gold hover:bg-alira-gold hover:text-alira-black focus:ring-alira-gold/40 transition-all duration-200 shadow-sm hover:shadow-lg active:scale-[0.98]",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-8 text-base",
        xl: "h-14 px-10 text-lg",
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
    // When loading, we can't use asChild because we need to render multiple children (spinner + content)
    // Slot component requires exactly one child
    const Comp = (asChild && !loading) ? Slot : "button"
    
    // Determine spinner color based on button variant
    const getSpinnerColor = () => {
      if (variant === "primary" || variant === "alira") return "primary"
      if (variant === "primaryOutline" || variant === "aliraOutline") return "gold"
      if (variant === "default") return "white"
      return "white"
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
