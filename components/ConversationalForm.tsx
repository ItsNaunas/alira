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
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasInitialized = useRef(false);
  // Capture initial business idea to stable ref
  const initialBusinessIdea = useRef(initialData?.business_idea);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load draft and initialize on mount
  useEffect(() => {
    const initializeForm = async () => {
      // Load draft first
      const draftLoaded = await loadDraft();
      
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        
        // Only show initial question if no draft was loaded
        if (!draftLoaded) {
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
      }
    };
    
    initializeForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const loadDraft = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/form/draft');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.draft) {
          const draft = result.draft;
          setDraftId(draft.id);
          
          // Restore form data
          if (draft.form_data) {
            setFormData(draft.form_data);
          }
          
          // Restore question index
          if (typeof draft.current_question_index === 'number') {
            setCurrentQuestionIndex(draft.current_question_index);
            
            // Restore messages based on question index
            const restoredMessages: Message[] = [];
            for (let i = 0; i <= draft.current_question_index; i++) {
              const question = questions[i];
              if (question) {
                restoredMessages.push({
                  id: `bot-${i}-restored`,
                  type: 'bot',
                  content: question.question,
                  timestamp: new Date()
                });
                
                const answer = draft.form_data[question.id];
                if (answer && i < draft.current_question_index) {
                  if (question.type === 'multiselect') {
                    restoredMessages.push({
                      id: `user-${i}-restored`,
                      type: 'user',
                      content: Array.isArray(answer) 
                        ? answer.map(s => serviceInterestOptions.find(o => o.value === s)?.label).join(', ')
                        : '',
                      timestamp: new Date()
                    });
                  } else {
                    restoredMessages.push({
                      id: `user-${i}-restored`,
                      type: 'user',
                      content: answer || '',
                      timestamp: new Date()
                    });
                  }
                }
              }
            }
            
            if (restoredMessages.length > 0) {
              setMessages(restoredMessages);
              if (draft.form_data.service_interest) {
                setSelectedServices(draft.form_data.service_interest);
              }
            }
            
          }
          return true; // Draft was loaded
        }
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
    return false; // No draft loaded
  };

  const saveDraft = async () => {
    if (isSubmitting) return; // Don't save if submitting
    
    setIsSavingDraft(true);
    try {
      const response = await fetch('/api/form/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form_data: formData,
          current_question_index: currentQuestionIndex,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.draft) {
          setDraftId(result.draft.id);
        }
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const deleteDraft = async () => {
    try {
      await fetch('/api/form/draft', {
        method: 'DELETE',
      });
      setDraftId(null);
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  };

  // Auto-save when form data or question index changes (debounced)
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Only auto-save if we have some data
    if (Object.keys(formData).length > 0 || currentQuestionIndex > 0) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveDraft();
      }, 2000); // Debounce for 2 seconds
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, currentQuestionIndex]); // eslint-disable-line react-hooks/exhaustive-deps

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
      
      // Delete draft on completion
      await deleteDraft();
      
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

  // Calculate progress
  const progressPercentage = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-160px)] lg:h-[calc(100vh-200px)] max-w-4xl mx-auto">
      {/* Progress Indicator */}
      {messages.length > 0 && (
        <div className="mb-4 px-4 sm:px-6">
          <div className="flex justify-between text-xs text-text-tertiary mb-2">
            <span>Step {currentQuestionIndex + 1} of {questions.length}</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="h-1 bg-bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-alira-gold rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}
      
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
                    ? 'bg-gradient-to-r from-accent to-accent-dark text-text-inverse'
                    : 'bg-bg-muted text-text-primary border border-borderToken-subtle'
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
            <div className="bg-bg-muted rounded-2xl px-6 py-4 border border-borderToken-subtle">
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
            <p className="text-xs text-text-tertiary font-light">
              {currentQuestion?.helper}
            </p>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-borderToken-subtle bg-bg-page/95 backdrop-blur-sm p-4 sm:p-6">
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
                      ? 'border-accent bg-accent/10'
                      : 'border-borderToken-subtle bg-bg-muted hover:border-accent'
                  )}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className={cn(
                      'mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0',
                      selectedServices.includes(option.value)
                        ? 'border-accent bg-accent'
                        : 'border-borderToken-subtle'
                    )}>
                      {selectedServices.includes(option.value) && (
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-text-primary font-medium text-sm sm:text-base">{option.label}</h4>
                      <p className="text-xs sm:text-sm text-text-secondary mt-1">{option.description}</p>
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
                'bg-gradient-to-r from-accent to-accent-dark text-text-primary',
                'hover:shadow-[0_0_20px_rgba(203,163,73,0.4)] hover:scale-[1.02]',
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
            'rounded-xl sm:rounded-2xl bg-bg-muted backdrop-blur-md ring-1 ring-borderToken-subtle',
            'focus-within:ring-accent transition-all duration-300'
          )}>
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={currentQuestion?.placeholder}
              className="w-full px-4 py-3 sm:px-6 sm:py-4 bg-transparent border-none text-sm sm:text-base text-text-primary placeholder:text-text-tertiary focus:outline-none focus-visible:ring-0 resize-none min-h-[60px] sm:min-h-[80px]"
            />
            
            <div className="flex items-center justify-end p-3 sm:p-4 border-t border-borderToken-subtle">
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className={cn(
                  'flex items-center gap-1.5 sm:gap-2 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200',
                  'bg-gradient-to-r from-accent to-accent-dark text-text-primary',
                  'hover:shadow-[0_0_15px_rgba(203,163,73,0.4)] hover:scale-105',
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

