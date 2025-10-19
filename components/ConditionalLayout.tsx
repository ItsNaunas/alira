'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Pages that use their own navigation (sidebar) - hide global header/footer
  const pagesWithOwnNav = ['/dashboard', '/form', '/form-chat']
  const shouldShowHeaderFooter = !pagesWithOwnNav.some(path => pathname?.startsWith(path))

  if (!shouldShowHeaderFooter) {
    // Pages with sidebar navigation - render children directly without wrapper
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

