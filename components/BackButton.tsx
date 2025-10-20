'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  href?: string
  label?: string
  className?: string
}

export function BackButton({ href, label = "Back", className }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleClick}
      className={className || "text-alira-white/80 hover:text-alira-white -ml-2"}
      aria-label={`Navigate back to ${label.toLowerCase()}`}
    >
      <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
      {label}
    </Button>
  )
}

