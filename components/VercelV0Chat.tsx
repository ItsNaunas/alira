'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAutoResizeTextarea } from '@/hooks/use-auto-resize-textarea';
import { ArrowUpIcon, X } from 'lucide-react';
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
        const { data, error } = await auth.signUp(email, password, name);
        
        if (error) {
          setAuthError(error.message);
          setIsSubmitting(false);
          return;
        }
        
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-alira-primary rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-alira-primary/50 dark:text-alira-white/50 hover:text-alira-primary dark:hover:text-alira-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl sm:text-2xl font-serif font-normal text-alira-primary dark:text-alira-white mb-2">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-xs sm:text-sm text-alira-primary/70 dark:text-alira-white/70 mb-4 sm:mb-6">
              {isSignUp 
                ? 'Sign up to save your progress and access your business plans anytime.'
                : 'Log in to continue building your business plan.'}
            </p>
            
            {authError && (
              <div className="mb-4 p-2.5 sm:p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs sm:text-sm text-red-500">{authError}</p>
              </div>
            )}
            
            <form onSubmit={handleModalSubmit} className="space-y-3 sm:space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-sm font-sans font-light text-alira-primary dark:text-alira-white mb-2">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., John Smith"
                    required
                    className="w-full"
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-sans font-light text-alira-primary dark:text-alira-white mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g., john@example.com"
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-sans font-light text-alira-primary dark:text-alira-white mb-2">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  required
                  minLength={6}
                  className="w-full"
                />
                {isSignUp && (
                  <p className="text-xs text-alira-primary/50 dark:text-alira-white/50 mt-1">
                    Minimum 6 characters
                  </p>
                )}
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  'w-full flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200',
                  'bg-gradient-to-r from-alira-gold to-[#8B5A00] text-alira-black',
                  'hover:shadow-[0_0_15px_rgba(160,107,0,0.4)] hover:scale-105',
                  'active:scale-95',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none'
                )}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 sm:h-4 sm:w-4 border-b-2 border-black"></div>
                    <span className="text-xs sm:text-sm">{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs sm:text-sm">{isSignUp ? 'Create Account & Continue' : 'Sign In & Continue'}</span>
                    <ArrowUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </>
                )}
              </button>
              
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setAuthError('');
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
          </div>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-4xl flex-col items-center space-y-4 sm:space-y-6 lg:space-y-8 p-4 sm:p-6">
        <h1 className="text-alira-white text-center text-lg sm:text-xl lg:text-2xl font-serif font-normal px-4">
          Ask me about your business idea
        </h1>
        <div className="w-full">
        <div className={cn(
          'relative rounded-xl sm:rounded-2xl min-h-[100px] sm:min-h-[120px] transition-all duration-300',
          'bg-white/5 backdrop-blur-md ring-1 ring-white/10',
          'shadow-[0_0_20px_rgba(160,107,0,0.15)]',
          'hover:shadow-[0_0_30px_rgba(160,107,0,0.2)]',
          isFocused && 'ring-alira-gold/50 shadow-[0_0_25px_rgba(160,107,0,0.25)] min-h-[140px] sm:min-h-[160px]'
        )}>
          {/* Gradient highlight from top */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent rounded-t-2xl"></div>
          
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
                'w-full px-4 py-4 sm:px-6 sm:py-6',
                'resize-none',
                'bg-transparent',
                'border-none',
                'text-sm sm:text-base text-alira-white',
                'focus:outline-none',
                'focus-visible:ring-0 focus-visible:ring-offset-0',
                'placeholder:text-alira-white/60',
                'min-h-[60px] sm:min-h-[80px] transition-all duration-300',
                isFocused && 'min-h-[100px] sm:min-h-[120px]'
              )}
              style={{
                overflow: 'hidden',
              }}
            />
          </div>
          
          <div className="flex items-center justify-end p-3 sm:p-4 border-t border-white/5">
            {/* Primary Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!value.trim()}
              className={cn(
                'flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200',
                'bg-gradient-to-r from-alira-gold to-[#8B5A00] text-alira-black',
                'hover:shadow-[0_0_15px_rgba(160,107,0,0.4)] hover:scale-105',
                'active:scale-95',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none'
              )}
            >
              <span className="whitespace-nowrap">Send</span>
              <ArrowUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default VercelV0Chat;
