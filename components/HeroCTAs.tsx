'use client'

import Link from 'next/link'

export default function HeroCTAs() {
  return (
    <div className="flex items-center justify-center pt-4">
      <Link
        href="/form"
        className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-alira-porcelain bg-alira-onyx rounded-lg hover:bg-alira-onyx/90 focus:outline-none focus:ring-2 focus:ring-alira-onyx focus:ring-offset-2 focus:ring-offset-alira-porcelain transition-all duration-200 active:scale-95"
      >
        Start your business case
      </Link>
    </div>
  )
}
