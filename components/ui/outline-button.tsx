import React from 'react'
import { cn } from '@/lib/utils'

interface OutlineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'gold' | 'onyx'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  children: React.ReactNode
}

const OutlineButton = React.forwardRef<HTMLButtonElement, OutlineButtonProps>(
  ({ className, variant = 'default', size = 'md', icon, children, ...props }, ref) => {
    const baseClasses = 'active:scale-95 transition-all duration-200 font-medium rounded-lg bg-transparent flex items-center justify-center gap-2'
    
    const variants = {
      default: 'text-alira-onyx dark:text-alira-porcelain border border-alira-onyx/20 dark:border-alira-porcelain/20 hover:border-alira-gold hover:bg-alira-gold/5',
      gold: 'text-alira-gold border border-alira-gold hover:bg-alira-gold/10',
      onyx: 'text-alira-porcelain border border-alira-porcelain/30 hover:border-alira-gold hover:bg-alira-gold/10'
    }
    
    const sizes = {
      sm: 'px-4 py-2 text-xs',
      md: 'px-6 py-3 text-sm',
      lg: 'px-8 py-4 text-base'
    }

    return (
      <button
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {icon && <span className="mt-0.5">{icon}</span>}
        <p className="mb-0.5">{children}</p>
      </button>
    )
  }
)

OutlineButton.displayName = 'OutlineButton'

export { OutlineButton }
