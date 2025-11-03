'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import { ArrowUpIcon, X, Mail } from 'lucide-react';
import { auth, createClient } from '@/lib/supabase-client';

// Business idea examples with eg. prefix (defined outside component to prevent recreation)
const BUSINESS_IDEA_EXAMPLES = [
  'eg. AI-powered fitness app that creates personalized workout plans',
  'eg. Sustainable fashion marketplace for eco-conscious consumers',
  'eg. Subscription box service for pet owners with premium treats',
  'eg. B2B SaaS tool for managing remote team productivity',
  'eg. Local food delivery service focusing on farm-to-table restaurants',
  'eg. Online learning platform for professional development courses'
];

export function VercelV0Chat() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderText, setPlaceholderText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight: 60,
    maxHeight: 200,
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { user } = await auth.getUser();
      setCurrentUser(user);
    };
    checkAuth();

    // Listen for auth state changes
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let charIndex = 0;
    let isDeleting = false;

    const typeText = () => {
      const fullText = BUSINESS_IDEA_EXAMPLES[currentIndex];
      
      if (!isDeleting && charIndex < fullText.length) {
        // Typing forward
        setPlaceholderText(fullText.slice(0, charIndex + 1));
        charIndex++;
        timeoutId = setTimeout(typeText, 60); // Faster typing speed
      } else if (!isDeleting && charIndex >= fullText.length) {
        // Finished typing, pause then start deleting
        timeoutId = setTimeout(() => {
          isDeleting = true;
          typeText();
        }, 1500); // Shorter pause before deleting
      } else if (isDeleting && charIndex > 0) {
        // Deleting backward
        charIndex--;
        setPlaceholderText(fullText.slice(0, charIndex));
        timeoutId = setTimeout(typeText, 30); // Faster deleting speed
      } else if (isDeleting && charIndex === 0) {
        // Finished deleting, move to next example
        isDeleting = false;
        setCurrentIndex((prev) => (prev + 1) % BUSINESS_IDEA_EXAMPLES.length);
        timeoutId = setTimeout(typeText, 300); // Shorter pause between examples
      }
    };

    if (!value) { // Only animate when input is empty
      typeText();
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentIndex, value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim()) {
        handleSend();
      }
    }
  };

  const handleSend = () => {
    if (!value.trim()) return;

    // If already logged in, go straight to form-chat
    if (currentUser) {
      router.push(`/form-chat?idea=${encodeURIComponent(value)}`);
    } else {
      // Show the email gating modal
      setShowModal(true);
    }
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setAuthSuccess('');
    
    if (isSignUp && (!email.trim() || !name.trim() || !password.trim())) {
      setAuthError('Please fill in all fields');
      return;
    }
    
    if (!isSignUp && (!email.trim() || !password.trim())) {
      setAuthError('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isSignUp) {
        // Sign up new user
        const { data, error, needsEmailConfirmation } = await auth.signUp(email, password, name);
        
        if (error) {
          setAuthError(error.message);
          setIsSubmitting(false);
          return;
        }
        
        if (needsEmailConfirmation) {
          // Email confirmation is required (this is the normal flow)
          setAuthSuccess('We\'ve sent a confirmation email! Check your inbox and click the link to verify your account. You\'ll be automatically logged in once confirmed.');
          setIsSubmitting(false);
          return;
        }
        
        // User is logged in immediately (only if email confirmation is disabled in Supabase)
        // Wait a moment for auth state to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // After signup, redirect to conversational form with the idea pre-filled
        setShowModal(false);
        router.push(`/form-chat?idea=${encodeURIComponent(value)}`);
      } else {
        // Sign in existing user
        const { data, error } = await auth.signIn(email, password);
        
        if (error) {
          setAuthError(error.message);
          setIsSubmitting(false);
          return;
        }
        
        // Wait a moment for auth state to update
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // After login, redirect to conversational form with the idea pre-filled
        setShowModal(false);
        router.push(`/form-chat?idea=${encodeURIComponent(value)}`);
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError('An unexpected error occurred. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Email Gating Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg-page p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowModal(false);
            }
          }}
        >
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-text-tertiary hover:text-text-primary transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 
              id="auth-modal-title"
              className="text-xl sm:text-2xl font-serif font-normal text-text-primary mb-2"
            >
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mb-4 sm:mb-6">
              {isSignUp 
                ? 'Sign up to save your progress and access your business plans anytime.'
                : 'Log in to continue building your business plan.'}
            </p>
            
            {authSuccess && (
              <div className="mb-4 p-4 rounded-xl bg-alira-gold/20 dark:bg-alira-gold/10 border border-alira-gold/40 dark:border-alira-gold/30 shadow-lg">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-8 h-8 rounded-full bg-alira-gold/30 dark:bg-alira-gold/20 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-alira-gold dark:text-alira-gold" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-sans font-medium text-alira-primary dark:text-alira-white mb-1">
                      Almost there!
                    </h3>
                    <p className="text-xs sm:text-sm text-alira-primary/90 dark:text-alira-white/90 leading-relaxed">
                      {authSuccess}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {authError && (
              <div className="mb-4 p-2.5 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs sm:text-sm text-red-500">{authError}</p>
              </div>
            )}
            
            <form onSubmit={handleModalSubmit} className="space-y-3 sm:space-y-4">
              {isSignUp && (
                <div>
                  <label htmlFor="auth-name" className="block text-sm sm:text-base font-sans font-light text-text-primary mb-2">
                    Your Name
                  </label>
                  <Input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., John Smith"
                    required
                    className="w-full text-base"
                    aria-required="true"
                    autoComplete="name"
                    autoCapitalize="words"
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="auth-email" className="block text-sm sm:text-base font-sans font-light text-text-primary mb-2">
                  Email Address
                </label>
                <Input
                  id="auth-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., john@example.com"
                  required
                  className="w-full text-base"
                  aria-required="true"
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="off"
                  autoCorrect="off"
                />
              </div>
              
              <div>
                <label htmlFor="auth-password" className="block text-sm sm:text-base font-sans font-light text-text-primary mb-2">
                  Password
                </label>
                <Input
                  id="auth-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  required
                  minLength={6}
                  className="w-full text-base"
                  aria-required="true"
                  aria-describedby={isSignUp ? "password-hint" : undefined}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  autoCapitalize="off"
                  autoCorrect="off"
                />
                {isSignUp && (
                  <p id="password-hint" className="text-xs sm:text-sm text-text-tertiary mt-1">
                    Minimum 6 characters
                  </p>
                )}
              </div>
              
              <Button
                type="submit"
                loading={isSubmitting}
                className={cn(
                  'w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200',
                  'bg-gradient-to-r from-accent to-accent-dark text-text-primary',
                  'hover:shadow-[0_0_15px_rgba(203,163,73,0.4)] hover:scale-105',
                  'active:scale-95',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none'
                )}
              >
                {isSubmitting ? (
                  <span className="text-xs sm:text-sm">{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                ) : (
                  <>
                    <span className="text-xs sm:text-sm">{isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'}</span>
                    <ArrowUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </>
                )}
              </Button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setAuthError('');
                  }}
                  className="text-xs sm:text-sm text-text-secondary hover:text-accent transition-colors"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign in' 
                    : "Don't have an account? Sign up"}
                </button>
              </div>
              
              <p className="text-xs sm:text-sm text-text-tertiary text-center">
                Your information is secure and private
              </p>
            </form>
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-3 sm:space-y-4 lg:space-y-6 p-3 sm:p-4 lg:p-6">
        <h1 className="text-alira-primary text-center text-lg sm:text-xl lg:text-2xl font-serif font-medium px-2 sm:px-4">
          Tell us what you're building
        </h1>
        <div className="w-full">
        <div className={cn(
          'relative rounded-lg sm:rounded-xl lg:rounded-2xl min-h-[80px] sm:min-h-[100px] lg:min-h-[120px] transition-all duration-300',
          'bg-white/80 backdrop-blur-md ring-2 ring-text-primary/10',
          'shadow-[0_0_20px_rgba(203,163,73,0.15)] border-2 border-text-primary/15',
          'hover:shadow-[0_0_30px_rgba(203,163,73,0.2)]',
          isFocused && 'ring-accent/50 shadow-[0_0_25px_rgba(203,163,73,0.25)] min-h-[100px] sm:min-h-[120px] lg:min-h-[140px]'
        )}>
          {/* Gradient highlight from top */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent rounded-t-2xl"></div>
          
          <div className="overflow-y-auto">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                adjustHeight();
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholderText}
              className={cn(
                'w-full px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6',
                'resize-none',
                'bg-transparent',
                'border-none',
                'text-base sm:text-lg lg:text-xl text-text-primary font-medium',
                'focus:outline-none',
                'focus-visible:ring-0 focus-visible:ring-offset-0',
                'placeholder:text-text-secondary placeholder:opacity-70',
                'min-h-[50px] sm:min-h-[60px] lg:min-h-[80px] transition-all duration-300',
                isFocused && 'min-h-[80px] sm:min-h-[100px] lg:min-h-[120px]'
              )}
              style={{
                overflow: 'hidden',
              }}
              aria-label="Enter your business idea"
            />
          </div>
          
          <div className="flex items-center justify-end p-2 sm:p-3 lg:p-4 border-t-2 border-text-primary/15">
            {/* Primary Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!value.trim()}
              aria-label="Get started"
              className={cn(
                'flex items-center gap-2 sm:gap-2.5 rounded-lg px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-200 min-h-[44px] min-w-[44px]',
                'bg-gradient-to-r from-accent to-accent-dark text-white',
                'shadow-[0_4px_16px_rgba(203,163,73,0.5)]',
                'ring-2 ring-accent/40 border-2 border-accent-dark/30',
                'hover:shadow-[0_0_30px_rgba(203,163,73,0.7)] hover:scale-105 hover:ring-accent/60 hover:border-accent-dark/50',
                'active:scale-95',
                'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-[0_4px_16px_rgba(203,163,73,0.5)]'
              )}
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}
            >
              <span className="whitespace-nowrap font-medium">Get Started</span>
              <ArrowUpIcon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default VercelV0Chat;
