'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, Sparkles, CheckCircle } from 'lucide-react';
import { serviceInterestOptions } from '@/lib/schema';

interface Message {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

interface FormData {
  business_idea?: string;
  current_challenges?: string;
  immediate_goals?: string;
  service_interest?: string[];
  current_tools?: string;
}

const questions = [
  {
    id: 'business_idea',
    question: "Let's start with the basics. What's your business idea or current venture?",
    placeholder: "Tell me about your business...",
    helper: "Take your time - the more detail you share, the better I can help."
  },
  {
    id: 'current_challenges',
    question: "Thanks for sharing that! Now, what are your biggest operational challenges right now?",
    placeholder: "What's slowing you down or preventing growth?",
    helper: "Think about daily obstacles, resource constraints, or strategic blockers."
  },
  {
    id: 'immediate_goals',
    question: "Got it. What do you want to achieve in the next 3-6 months?",
    placeholder: "What specific outcomes do you want to see?",
    helper: "Be specific about metrics, milestones, or transformations you're aiming for."
  },
  {
    id: 'service_interest',
    question: "Almost there! Which of our service areas would be most valuable to you?",
    type: 'multiselect',
    options: serviceInterestOptions,
    helper: "Select all that apply - we'll customize our recommendations based on your needs."
  }
];

interface ConversationalFormProps {
  userId: string;
  initialData?: Partial<FormData>;
  onComplete: (data: FormData) => void;
}

export default function ConversationalForm({ userId, initialData, onComplete }: ConversationalFormProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialData?.business_idea ? 1 : 0);
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState<FormData>(initialData || {});
  const [isTyping, setIsTyping] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasInitialized = useRef(false);
  // Capture initial business idea to stable ref
  const initialBusinessIdea = useRef(initialData?.business_idea);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Show first question on mount (only once)
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      // If we have initial business idea from homepage, skip first question
      if (initialBusinessIdea.current) {
        setTimeout(() => {
          addUserMessage(initialBusinessIdea.current!);
        }, 300);
        
        // Go straight to second question
        setTimeout(() => {
          addBotMessage(questions[1].question);
        }, 1000);
      } else {
        // No initial data, start with first question
        setTimeout(() => {
          addBotMessage(questions[0].question);
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Intentionally empty: hasInitialized ref ensures this runs only once on mount
  }, []);

  const addBotMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: `bot-${Date.now()}-${Math.random()}`,
        type: 'bot',
        content,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 800);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: `user-${Date.now()}-${Math.random()}`,
      type: 'user',
      content,
      timestamp: new Date()
    }]);
  };

  const handleSend = async () => {
    if (currentQuestion.type === 'multiselect') {
      // Handle multiselect submission
      if (selectedServices.length === 0) return;
      
      const servicesText = selectedServices
        .map(s => serviceInterestOptions.find(o => o.value === s)?.label)
        .join(', ');
      
      addUserMessage(servicesText);
      
      const updatedData = { ...formData, service_interest: selectedServices };
      setFormData(updatedData);
      
      // Complete the form
      setIsTyping(true);
      setIsSubmitting(true);
      setTimeout(() => {
        addBotMessage("Perfect! I'm now creating your personalized business plan. This will just take a moment...");
        setTimeout(async () => {
          try {
            await onComplete(updatedData);
          } catch (error) {
            console.error('Error completing form:', error);
            setIsSubmitting(false);
            addBotMessage("I encountered an error saving your plan. Please check the console or contact support.");
          }
        }, 1500);
      }, 500);
      
    } else {
      // Handle text input submission
      if (!inputValue.trim()) return;
      
      addUserMessage(inputValue);
      
      const updatedData = {
        ...formData,
        [currentQuestion.id]: inputValue
      };
      setFormData(updatedData);
      setInputValue('');
      
      // Move to next question
      if (currentQuestionIndex < questions.length - 1) {
        setTimeout(() => {
          const nextQuestion = questions[currentQuestionIndex + 1];
          addBotMessage(nextQuestion.question);
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 1000);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleService = (serviceValue: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceValue)
        ? prev.filter(s => s !== serviceValue)
        : [...prev, serviceValue]
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-160px)] lg:h-[calc(100vh-200px)] max-w-4xl mx-auto">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'flex',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[85%] sm:max-w-[80%] rounded-xl sm:rounded-2xl px-4 py-3 sm:px-6 sm:py-4',
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-alira-gold to-[#8B5A00] text-white'
                    : 'bg-white/10 dark:bg-alira-primary/50 text-alira-white border border-white/10'
                )}
              >
                {message.type === 'bot' && (
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-alira-gold" />
                    <span className="text-[10px] sm:text-xs text-alira-gold font-light">ALIRA Assistant</span>
                  </div>
                )}
                <p className="text-xs sm:text-sm md:text-base font-sans font-light leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white/10 dark:bg-alira-primary/50 rounded-2xl px-6 py-4 border border-white/10">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-alira-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-alira-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-alira-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Helper Text */}
        {!isTyping && messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p className="text-xs text-alira-white/50 font-light italic">
              {currentQuestion?.helper}
            </p>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm p-4 sm:p-6">
        {currentQuestion?.type === 'multiselect' ? (
          // Multiselect UI
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-2 sm:gap-3">
              {currentQuestion.options?.map((option) => (
                <button
                  key={option.value}
                  onClick={() => toggleService(option.value)}
                  className={cn(
                    'text-left p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200',
                    selectedServices.includes(option.value)
                      ? 'border-alira-gold bg-alira-gold/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  )}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className={cn(
                      'mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0',
                      selectedServices.includes(option.value)
                        ? 'border-alira-gold bg-alira-gold'
                        : 'border-white/30'
                    )}>
                      {selectedServices.includes(option.value) && (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-alira-white font-medium text-sm sm:text-base">{option.label}</h4>
                      <p className="text-xs sm:text-sm text-alira-white/60 mt-1">{option.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <Button
              onClick={handleSend}
              disabled={selectedServices.length === 0}
              loading={isSubmitting}
              className={cn(
                'w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200',
                'bg-gradient-to-r from-alira-gold to-[#8B5A00] text-black',
                'hover:shadow-[0_0_20px_rgba(160,107,0,0.4)] hover:scale-[1.02]',
                'active:scale-95',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none'
              )}
            >
              {isSubmitting ? (
                <span>Processing...</span>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </>
              )}
            </Button>
          </div>
        ) : (
          // Text Input UI
          <div className={cn(
            'rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10',
            'focus-within:ring-alira-gold/50 transition-all duration-300'
          )}>
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentQuestion?.placeholder}
              className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-transparent border-none text-sm sm:text-base text-alira-white placeholder:text-alira-white/40 focus:outline-none focus-visible:ring-0 resize-none min-h-[60px] sm:min-h-[80px]"
            />
            
            <div className="flex items-center justify-end p-3 sm:p-4 border-t border-white/5">
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200',
                  'bg-gradient-to-r from-alira-gold to-[#8B5A00] text-black',
                  'hover:shadow-[0_0_15px_rgba(160,107,0,0.4)] hover:scale-105',
                  'active:scale-95',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none'
                )}
              >
                <span>Send</span>
                <ArrowUpIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

