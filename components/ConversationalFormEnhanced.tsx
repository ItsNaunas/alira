'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { getUserFriendlyError } from '@/lib/error-messages';
import { ArrowUpIcon, Sparkles, CheckCircle, Bot, User } from 'lucide-react';
import { serviceInterestOptions } from '@/lib/schema';

interface Message {
  id: string;
  type: 'bot' | 'user' | 'system';
  content: string;
  timestamp: Date;
  isFollowUp?: boolean;
}

interface FormData {
  business_idea?: string;
  current_challenges?: string;
  immediate_goals?: string;
  service_interest?: string[];
  current_tools?: string;
}

interface QuestionConfig {
  id: keyof FormData;
  question: string;
  placeholder?: string;
  helper: string;
  type?: 'text' | 'multiselect';
  options?: readonly { value: string; label: string; description?: string }[];
}

const questions: QuestionConfig[] = [
  {
    id: 'business_idea',
    question: "Let's start with the basics. What's your business idea or current venture?",
    placeholder: "Tell me about your business...",
    helper: "Take your time - the more detail you share, the better I can help."
  },
  {
    id: 'current_challenges',
    question: "What are your biggest operational challenges right now?",
    placeholder: "What's slowing you down or preventing growth?",
    helper: "Think about daily obstacles, resource constraints, or strategic blockers."
  },
  {
    id: 'immediate_goals',
    question: "What do you want to achieve in the next 3-6 months?",
    placeholder: "What specific outcomes do you want to see?",
    helper: "Be specific about metrics, milestones, or transformations you're aiming for."
  },
  {
    id: 'service_interest',
    question: "Which of our service areas would be most valuable to you?",
    type: 'multiselect',
    options: serviceInterestOptions,
    helper: "Select all that apply - we'll customize our recommendations based on your needs."
  }
];

interface ConversationalFormEnhancedProps {
  userId: string;
  initialData?: Partial<FormData>;
  onComplete: (data: FormData) => void;
}

export default function ConversationalFormEnhanced({ 
  userId, 
  initialData, 
  onComplete 
}: ConversationalFormEnhancedProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [input, setValue] = useState('');
  const [formData, setFormData] = useState<FormData>(initialData || {});
  const [selectedServices, setSelectedServices] = useState<string[]>(initialData?.service_interest || []);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInFollowUp, setIsInFollowUp] = useState(false);
  const [followUpCount, setFollowUpCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const isMultiSelect = currentQuestion?.type === 'multiselect';
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Initialize with first question
  useEffect(() => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'bot',
      content: "Hi! I'm ALIRA's AI assistant. I'll help you create a personalized business plan by understanding your goals and challenges. Ready to get started?",
      timestamp: new Date()
    };
    
    const firstQuestion: Message = {
      id: 'q-0',
      type: 'bot',
      content: questions[0].question,
      timestamp: new Date()
    };

    setMessages([welcomeMessage, firstQuestion]);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when messages change
  useEffect(() => {
    inputRef.current?.focus();
  }, [messages, isEvaluating]);

  const addMessage = (type: Message['type'], content: string, isFollowUp = false) => {
    const message: Message = {
      id: `${type}-${Date.now()}`,
      type,
      content,
      timestamp: new Date(),
      isFollowUp
    };
    setMessages(prev => [...prev, message]);
  };

  const evaluateResponse = async (response: string): Promise<{
    hasEnoughDetail: boolean;
    followUpQuestion?: string;
    detailScore: number;
  }> => {
    try {
      const res = await fetch('/api/ai/evaluate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQuestion.question,
          userResponse: response,
          context: {
            businessIdea: formData.business_idea,
            previousAnswers: formData
          }
        })
      });

      if (!res.ok) throw new Error('Evaluation failed');

      const data = await res.json();
      return data.evaluation;
    } catch (error) {
      console.error('Error evaluating response:', error);
      // Fallback: accept if response is reasonably long
      return {
        hasEnoughDetail: response.length > 30,
        detailScore: response.length > 30 ? 7 : 4,
        followUpQuestion: response.length <= 30 ? 'Could you provide a bit more detail about that?' : undefined
      };
    }
  };

  const generateTransition = async (userResponse: string): Promise<string> => {
    try {
      const nextQuestion = questions[currentQuestionIndex + 1];
      if (!nextQuestion) return "Perfect! Let's wrap this up.";

      const res = await fetch('/api/ai/generate-transition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentQuestion: currentQuestion.question,
          nextQuestion: nextQuestion.question,
          userResponse
        })
      });

      if (!res.ok) throw new Error('Transition generation failed');

      const data = await res.json();
      return data.transition;
    } catch (error) {
      console.error('Error generating transition:', error);
      return "Thanks for that! Now, ";
    }
  };

  const handleSend = async () => {
    if ((!input.trim() && !isMultiSelect) || (isMultiSelect && selectedServices.length === 0)) {
      return;
    }

    // For multiselect, create a human-readable response with labels
    let userResponse = input.trim();
    if (isMultiSelect && currentQuestion.options) {
      const selectedLabels = selectedServices.map(value => {
        const option = currentQuestion.options?.find(opt => 
          typeof opt === 'string' ? opt === value : opt.value === value
        );
        if (typeof option === 'string') return option;
        return option?.label || value;
      });
      userResponse = selectedLabels.join(', ');
    }
    
    // Add user message
    addMessage('user', userResponse);
    setValue('');

    // Save to form data
    const fieldId = currentQuestion.id;
    const newFormData = {
      ...formData,
      [fieldId]: isMultiSelect ? selectedServices : userResponse
    };
    setFormData(newFormData);

    setIsEvaluating(true);

    try {
      // For multiselect, skip AI evaluation (it's just a selection)
      if (isMultiSelect) {
        // Move to next question or complete
        if (isLastQuestion) {
          await handleComplete(newFormData);
        } else {
          setTimeout(() => {
            const transition = "Perfect! You're all set.";
            addMessage('system', transition);
            
            setTimeout(() => {
              setCurrentQuestionIndex(prev => prev + 1);
              addMessage('bot', questions[currentQuestionIndex + 1].question);
              setIsInFollowUp(false);
              setFollowUpCount(0);
            }, 800);
          }, 500);
        }
        setIsEvaluating(false);
        return;
      }

      // Evaluate text response with AI
      const evaluation = await evaluateResponse(userResponse);

      console.log('AI Evaluation:', {
        score: evaluation.detailScore,
        hasEnough: evaluation.hasEnoughDetail,
        followUp: evaluation.followUpQuestion
      });

      // If not enough detail and we haven't asked too many follow-ups
      if (!evaluation.hasEnoughDetail && evaluation.followUpQuestion && followUpCount < 2) {
        // Ask follow-up question
        setTimeout(() => {
          addMessage('bot', evaluation.followUpQuestion!, true);
          setIsInFollowUp(true);
          setFollowUpCount(prev => prev + 1);
        }, 800);
      } else {
        // Enough detail or max follow-ups reached - move to next question
        if (isLastQuestion) {
          await handleComplete(newFormData);
        } else {
          // Generate transition and move to next
          const transition = await generateTransition(userResponse);
          
          setTimeout(() => {
            addMessage('system', transition);
            
            setTimeout(() => {
              setCurrentQuestionIndex(prev => prev + 1);
              addMessage('bot', questions[currentQuestionIndex + 1].question);
              setIsInFollowUp(false);
              setFollowUpCount(0);
            }, 1000);
          }, 800);
        }
      }
    } catch (error) {
      console.error('Error processing response:', error);
      addMessage('bot', getUserFriendlyError(error));
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleComplete = async (finalData: FormData) => {
    setIsSubmitting(true);
    addMessage('system', "Great! I have everything I need. Let me create your personalized business plan...");
    
    setTimeout(() => {
      onComplete(finalData);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isMultiSelect) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleService = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  return (
    <div className="flex flex-col h-[600px] max-w-3xl mx-auto bg-black/40 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                'flex gap-3',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {message.type !== 'user' && (
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                  message.type === 'bot' ? 'bg-alira-gold/20' : 'bg-white/10'
                )}>
                  {message.type === 'bot' ? (
                    <Bot className="w-5 h-5 text-alira-gold" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-white/60" />
                  )}
                </div>
              )}
              
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  message.type === 'user'
                    ? 'bg-alira-gold text-alira-black ml-auto'
                    : message.type === 'bot'
                    ? 'bg-white/5 text-white border border-white/10'
                    : 'bg-white/[0.03] text-white/70 italic border border-white/5'
                )}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                {message.isFollowUp && (
                  <p className="text-xs mt-2 opacity-60">
                    💡 Just need a bit more detail
                  </p>
                )}
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {isEvaluating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3 justify-start"
          >
            <div className="w-8 h-8 rounded-full bg-alira-gold/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-alira-gold" />
            </div>
            <div className="bg-white/5 text-white border border-white/10 rounded-2xl px-4 py-3 flex items-center gap-2">
              <Spinner size="sm" color="gold" />
              <span className="text-sm">Analyzing your response...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!isSubmitting && (
        <div className="border-t border-white/10 p-4 sm:p-6 bg-black/40">
          {isMultiSelect ? (
            // Service Selection
            <div className="space-y-4">
              <p className="text-sm text-white/70">
                {currentQuestion.helper}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQuestion.options?.map((option) => {
                  const optionValue = typeof option === 'string' ? option : option.value;
                  const optionLabel = typeof option === 'string' ? option : option.label;
                  const optionDescription = typeof option === 'object' ? option.description : undefined;
                  
                  return (
                    <button
                      key={optionValue}
                      onClick={() => toggleService(optionValue)}
                      className={cn(
                        'p-4 rounded-lg border-2 text-left transition-all',
                        selectedServices.includes(optionValue)
                          ? 'border-alira-gold bg-alira-gold/10 text-white'
                          : 'border-white/20 bg-white/5 text-white/80 hover:border-white/40'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5',
                          selectedServices.includes(optionValue)
                            ? 'border-alira-gold bg-alira-gold'
                            : 'border-white/40'
                        )}>
                          {selectedServices.includes(optionValue) && (
                            <CheckCircle className="w-4 h-4 text-black" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{optionLabel}</div>
                          {optionDescription && (
                            <div className="text-xs text-white/60 mt-1">{optionDescription}</div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <Button
                onClick={handleSend}
                disabled={selectedServices.length === 0}
                loading={isEvaluating}
                className="w-full bg-alira-gold text-black hover:bg-alira-gold/90"
              >
                Continue
                <ArrowUpIcon className="ml-2 w-4 h-4" />
              </Button>
            </div>
          ) : (
            // Text Input
            <div className="flex gap-3">
              <Textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={currentQuestion.placeholder}
                disabled={isEvaluating}
                className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-white/5 border-white/20 text-white placeholder:text-white/40 focus:border-alira-gold"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isEvaluating}
                loading={isEvaluating}
                className="bg-alira-gold text-black hover:bg-alira-gold/90 px-6"
              >
                <ArrowUpIcon className="w-5 h-5" />
              </Button>
            </div>
          )}
          
          {!isMultiSelect && (
            <p className="text-xs text-white/50 mt-2">
              💡 {currentQuestion.helper}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

