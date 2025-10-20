'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { auth, createClient } from '@/lib/supabase-client'
import { User } from '@supabase/supabase-js'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Menu } from 'lucide-react'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

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

        {/* Center - Navigation Links (Desktop - show at lg breakpoint 1024px) */}
        <nav className="hidden lg:flex items-center gap-6 2xl:gap-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-serif text-sm 2xl:text-base font-normal transition-colors duration-200 whitespace-nowrap relative group ${
                pathname === link.href
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
              {/* Active indicator - gold underline */}
              {pathname === link.href && (
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-alira-gold" />
              )}
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

        {/* Mobile Menu Button (shown below lg breakpoint) */}
        <div className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            className="text-white hover:bg-white/10"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Full-Screen Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-full flex flex-col items-center justify-center p-8"
            >
              {/* Navigation Links */}
              <nav className="flex flex-col items-center gap-8 mb-12">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-serif text-2xl font-normal transition-colors duration-200 ${
                      pathname === link.href
                        ? 'text-alira-gold'
                        : 'text-white hover:text-alira-gold'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Auth Buttons */}
              <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                {user ? (
                  <>
                    <Button
                      asChild
                      className="w-full bg-alira-gold text-alira-black hover:bg-alira-gold/90 font-sans font-medium py-6 text-lg"
                    >
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 font-sans font-light py-6 text-lg"
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => {
                        setIsSignUp(true)
                        setShowAuthModal(true)
                        setIsMobileMenuOpen(false)
                      }}
                      className="w-full bg-alira-gold text-alira-black hover:bg-alira-gold/90 font-sans font-medium py-6 text-lg"
                    >
                      Sign Up
                    </Button>
                    <Button
                      onClick={() => {
                        setIsSignUp(false)
                        setShowAuthModal(true)
                        setIsMobileMenuOpen(false)
                      }}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 font-sans font-light py-6 text-lg"
                    >
                      Log In
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
