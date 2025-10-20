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

      {/* Authentication Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAuthModal(false)
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-alira-primary rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-alira-primary/50 dark:text-alira-white/50 hover:text-alira-primary dark:hover:text-alira-white transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
              
              <AuthModalContent
                isSignUp={isSignUp}
                setIsSignUp={setIsSignUp}
                onSuccess={() => {
                  setShowAuthModal(false)
                  router.push('/dashboard')
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// Authentication Modal Content Component
interface AuthModalContentProps {
  isSignUp: boolean
  setIsSignUp: (value: boolean) => void
  onSuccess: () => void
}

function AuthModalContent({ isSignUp, setIsSignUp, onSuccess }: AuthModalContentProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    
    if (isSignUp && (!email.trim() || !name.trim() || !password.trim())) {
      setAuthError('Please fill in all fields')
      return
    }
    
    if (!isSignUp && (!email.trim() || !password.trim())) {
      setAuthError('Please fill in all fields')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      if (isSignUp) {
        // Sign up new user
        const { data, error } = await auth.signUp(email, password, name)
        
        if (error) {
          setAuthError(error.message)
          setIsSubmitting(false)
          return
        }
        
        // Wait a moment for auth state to update
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // After signup, redirect to dashboard
        onSuccess()
      } else {
        // Sign in existing user
        const { data, error } = await auth.signIn(email, password)
        
        if (error) {
          setAuthError(error.message)
          setIsSubmitting(false)
          return
        }
        
        // Wait a moment for auth state to update
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // After login, redirect to dashboard
        onSuccess()
      }
    } catch (error) {
      console.error('Auth error:', error)
      setAuthError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h2 
        id="auth-modal-title"
        className="text-xl sm:text-2xl font-serif font-normal text-alira-primary dark:text-alira-white mb-2"
      >
        {isSignUp ? 'Create your account' : 'Welcome back'}
      </h2>
      <p className="text-xs sm:text-sm text-alira-primary/70 dark:text-alira-white/70 mb-4 sm:mb-6">
        {isSignUp 
          ? 'Sign up to save your progress and access your business plans anytime.'
          : 'Log in to continue and access your dashboard.'}
      </p>
      
      {authError && (
        <div className="mb-4 p-2.5 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-xs sm:text-sm text-red-500">{authError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {isSignUp && (
          <div>
            <label htmlFor="auth-name" className="block text-sm sm:text-base font-sans font-light text-alira-primary dark:text-alira-white mb-2">
              Your Name
            </label>
            <input
              id="auth-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., John Smith"
              required
              className="w-full text-base px-3 py-2 rounded-lg border border-alira-primary/20 dark:border-white/20 bg-white dark:bg-alira-primary text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40 focus:outline-none focus:ring-2 focus:ring-alira-gold"
              aria-required="true"
            />
          </div>
        )}
        
        <div>
          <label htmlFor="auth-email" className="block text-sm sm:text-base font-sans font-light text-alira-primary dark:text-alira-white mb-2">
            Email Address
          </label>
          <input
            id="auth-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., john@example.com"
            required
            className="w-full text-base px-3 py-2 rounded-lg border border-alira-primary/20 dark:border-white/20 bg-white dark:bg-alira-primary text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40 focus:outline-none focus:ring-2 focus:ring-alira-gold"
            aria-required="true"
          />
        </div>
        
        <div>
          <label htmlFor="auth-password" className="block text-sm sm:text-base font-sans font-light text-alira-primary dark:text-alira-white mb-2">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isSignUp ? "Create a secure password" : "Enter your password"}
            required
            minLength={6}
            className="w-full text-base px-3 py-2 rounded-lg border border-alira-primary/20 dark:border-white/20 bg-white dark:bg-alira-primary text-alira-primary dark:text-alira-white placeholder:text-alira-primary/40 dark:placeholder:text-alira-white/40 focus:outline-none focus:ring-2 focus:ring-alira-gold"
            aria-required="true"
            aria-describedby={isSignUp ? "password-hint" : undefined}
          />
          {isSignUp && (
            <p id="password-hint" className="text-xs sm:text-sm text-alira-primary/50 dark:text-alira-white/50 mt-1">
              Minimum 6 characters
            </p>
          )}
        </div>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-alira-gold text-alira-black hover:bg-alira-gold/90 font-sans font-medium py-6 text-base"
        >
          {isSubmitting ? (
            <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
          ) : (
            <span>{isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'}</span>
          )}
        </Button>
        
        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setAuthError('')
            }}
            className="text-xs sm:text-sm text-alira-primary/70 dark:text-alira-white/70 hover:text-alira-gold transition-colors"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"}
          </button>
        </div>
        
        <p className="text-[10px] sm:text-xs text-alira-primary/50 dark:text-alira-white/50 text-center">
          🔒 Your information is secure and private
        </p>
      </form>
    </>
  )
}
