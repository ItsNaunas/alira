'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState, useEffect } from 'react'
import { auth, createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'

// Navigation links array to be used in both desktop and mobile menus
const navigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'What You Get' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/results', label: 'Results' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSignUp, setIsSignUp] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Check authentication state
  useEffect(() => {
    const checkUser = async () => {
      const { user } = await auth.getUser()
      setUser(user)
    }
    checkUser()

    // Listen for auth changes
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await auth.signOut()
    setUser(null)
    router.push('/')
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
      isScrolled 
        ? 'bg-[#0A0E18]/30 backdrop-blur-xl' 
        : 'bg-transparent'
    }`}>
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Left side - Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="text-alira-gold font-serif font-normal tracking-wider text-xl sm:text-2xl whitespace-nowrap">
            ALIRA<span className="text-alira-gold">.</span>
          </Link>
        </div>

        {/* Center - Navigation Links (Desktop only, hidden on tablet and mobile) */}
        <nav className="hidden xl:flex items-center gap-6 2xl:gap-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-serif text-sm 2xl:text-base font-normal transition-colors duration-200 whitespace-nowrap ${
                pathname === link.href
                  ? 'text-white'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side - Auth/CTA Buttons */}
        <div className="hidden sm:flex items-center gap-2 lg:gap-3 flex-shrink-0">
          {user ? (
            <>
              <Button
                asChild
                variant="ghost"
                className="text-white hover:bg-white/10 font-sans font-light px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap"
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 font-sans font-light px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setIsSignUp(false)
                  setShowAuthModal(true)
                }}
                variant="ghost"
                className="text-white hover:bg-white/10 font-sans font-light px-3 lg:px-4 py-1.5 sm:py-2 text-xs sm:text-sm whitespace-nowrap"
              >
                Log In
              </Button>
              <Button 
                onClick={() => {
                  setIsSignUp(true)
                  setShowAuthModal(true)
                }}
                className="bg-alira-gold text-alira-black hover:bg-alira-gold/90 font-sans font-medium px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 rounded-lg transition-all duration-200 text-xs sm:text-sm lg:text-base whitespace-nowrap"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Tablet/Mobile Menu (shown on xl and below) */}
        <div className="xl:hidden flex items-center gap-2">
          {/* Show CTA on mobile inside menu trigger */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                className="group h-9 w-9 sm:h-10 sm:w-10 p-0 text-white hover:bg-white/10" 
                variant="ghost" 
                size="icon"
                aria-label="Open menu"
              >
                <svg
                  className="pointer-events-none text-white"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 12L20 12"
                    className="origin-center -translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[315deg]"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                  />
                  <path
                    d="M4 12H20"
                    className="origin-center translate-y-[7px] transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-[135deg]"
                  />
                </svg>
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              align="end" 
              className="w-56 sm:w-64 p-3 bg-[#0A0E18]/95 backdrop-blur-xl border-white/10"
            >
              <nav className="flex flex-col gap-1">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-4 py-3 text-sm sm:text-base font-serif font-normal rounded-md transition-colors ${
                      pathname === link.href
                        ? 'text-alira-gold bg-alira-gold/10'
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Auth buttons in mobile menu */}
                <div className="mt-2 pt-2 border-t border-white/10 space-y-2">
                  {user ? (
                    <>
                      <Link
                        href="/dashboard"
                        className="block w-full px-4 py-3 text-center bg-white/5 text-white hover:bg-white/10 font-sans font-light rounded-lg transition-all duration-200 text-sm sm:text-base"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full px-4 py-3 text-center border border-white/20 text-white hover:bg-white/10 font-sans font-light rounded-lg transition-all duration-200 text-sm sm:text-base"
                      >
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsSignUp(false)
                          setShowAuthModal(true)
                        }}
                        className="block w-full px-4 py-3 text-center bg-white/5 text-white hover:bg-white/10 font-sans font-light rounded-lg transition-all duration-200 text-sm sm:text-base"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => {
                          setIsSignUp(true)
                          setShowAuthModal(true)
                        }}
                        className="block w-full px-4 py-3 text-center bg-alira-gold text-alira-black hover:bg-alira-gold/90 font-sans font-medium rounded-lg transition-all duration-200 text-sm sm:text-base"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </nav>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  )
}
