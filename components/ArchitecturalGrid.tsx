'use client'

import { cn } from '@/lib/utils'

interface ArchitecturalGridProps {
  className?: string
  opacity?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'subtle' | 'minimal'
}

export default function ArchitecturalGrid({ 
  className,
  opacity = 0.35,
  size = 'md',
  variant = 'full'
}: ArchitecturalGridProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  const opacityClasses = {
    full: opacity,
    subtle: opacity * 0.5,
    minimal: opacity * 0.2
  }

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <pattern
            id={`alira-grid-${size}-${variant}`}
            width={size === 'sm' ? '24' : size === 'md' ? '32' : '48'}
            height={size === 'sm' ? '24' : size === 'md' ? '32' : '48'}
            patternUnits="userSpaceOnUse"
          >
            <path 
              d={`M ${size === 'sm' ? '24' : size === 'md' ? '32' : '48'} 0 L 0 0 0 ${size === 'sm' ? '24' : size === 'md' ? '32' : '48'}`}
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.5" 
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#alira-grid-${size}-${variant})`}
          className="text-alira-primary dark:text-alira-white/10"
          style={{ opacity: opacityClasses[variant] }}
        />
        {variant === 'full' && (
          <g className="text-alira-primary dark:text-alira-white/15" style={{ opacity: opacityClasses[variant] * 0.7 }}>
            <path d="M0 80 H100%" stroke="currentColor" strokeWidth="0.6" />
            <path d="M0 160 H100%" stroke="currentColor" strokeWidth="0.6" />
            <path d="M120 0 V100%" stroke="currentColor" strokeWidth="0.6" />
            <path d="M240 0 V100%" stroke="currentColor" strokeWidth="0.6" />
          </g>
        )}
      </svg>
    </div>
  )
}
