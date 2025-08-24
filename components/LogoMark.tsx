import { cn } from '@/lib/utils'

interface LogoMarkProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LogoMark({ className, size = 'md' }: LogoMarkProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  return (
    <span className={cn(
      'font-serif font-bold tracking-tight text-alira-onyx',
      sizeClasses[size],
      className
    )}>
      ALIRA<span className="text-alira-gold">.</span>
    </span>
  )
}
