'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';
import { ArrowUpIcon, Sparkles, CheckCircle, Brain, Target, Zap } from 'lucide-react';
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

interface Question {
  id: string;
  question: string;
  placeholder?: string;
  helper: string;
  type?: 'text' | 'multiselect';
  options?: ReadonlyArray<{ readonly value: string; readonly label: string; readonly description?: string }>;
  followUpQuestions?: string[];
  depthThreshold?: number; // Minimum character count for sufficient detail
}

interface ProgressState {
  currentStep: number;
  totalSteps: number;
  percentage: number;
  contextMessage: string;
  isComplete: boolean;
}

// Enhanced question flow with adaptive follow-ups
const questionFlow: Question[] = [
  {
    id: 'business_idea',
    question: "Let's start with the basics. What's your business idea or current venture?",
    placeholder: "Tell me about your business...",
    helper: "Take your time - the more detail you share, the better I can help.",
    followUpQuestions: [
      "What specific problem does your business solve?",
      "Who is your target audience?",
      "What makes your approach unique?"
    ],
    depthThreshold: 50
  },
  {
    id: 'current_challenges',
    question: "Thanks for sharing that! Now, what are your biggest operational challenges right now?",
    placeholder: "What's slowing you down or preventing growth?",
    helper: "Think about daily obstacles, resource constraints, or strategic blockers.",
    followUpQuestions: [
      "How long have you been facing these challenges?",
      "What have you tried to solve them so far?",
      "What's the impact on your business performance?"
    ],
    depthThreshold: 40
  },
  {
    id: 'immediate_goals',
    question: "Got it. What do you want to achieve in the next 3-6 months?",
    placeholder: "What specific outcomes do you want to see?",
    helper: "Be specific about metrics, milestones, or transformations you're aiming for.",
    followUpQuestions: [
      "What would success look like in concrete terms?",
      "How will you measure progress?",
      "What resources do you need to achieve this?"
    ],
    depthThreshold: 40
  },
  {
    id: 'service_interest',
    question: "Almost there! Which of our service areas would be most valuable to you?",
    type: 'multiselect',
    options: serviceInterestOptions,
    helper: "Select all that apply - we'll customize our recommendations based on your needs."
  }
];

interface AdaptiveQuestioningProps {
  userId: string;
  initialData?: Partial<FormData>;
  onComplete: (data: FormData) => void;
}

export default function AdaptiveQuestioning({ userId, initialData, onComplete }: AdaptiveQuestioningProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [formData, setFormData] = useState<FormData>(initialData || {});
  const [isTyping, setIsTyping] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState<ProgressState>({
    currentStep: 0,
    totalSteps: questionFlow.length,
    percentage: 0,
    contextMessage: "We're getting to know your business...",
    isComplete: false
  });
  const [followUpIndex, setFollowUpIndex] = useState(0);
  const [showSummary, setShowSummary] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasInitialized = useRef(false);
  const initialBusinessIdea = useRef(initialData?.business_idea);

  // Progress context messages
  const progressMessages = [
    "We're getting to know your business...",
    "Understanding your challenges...",
    "Learning about your goals...",
    "Tailoring your strategy...",
    "Finalizing your plan..."
  ];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update progress
  const updateProgress = useCallback((step: number, isComplete = false) => {
    const percentage = Math.round((step / questionFlow.length) * 100);
    setProgress({
      currentStep: step,
      totalSteps: questionFlow.length,
      percentage,
      contextMessage: progressMessages[Math.min(step, progressMessages.length - 1)],
      isComplete
    });
  }, [progressMessages]);

  // Initialize conversation
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      
      if (initialBusinessIdea.current) {
        setTimeout(() => {
          addUserMessage(initialBusinessIdea.current!);
          handleAnswer(initialBusinessIdea.current!, 'business_idea');
        }, 300);
      } else {
        setTimeout(() => {
          startQuestion(0);
        }, 500);
      }
    }
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

  const startQuestion = (index: number) => {
    const question = questionFlow[index];
    addBotMessage(question.question);
    updateProgress(index);
  };

  // Evaluate answer depth and determine if follow-up is needed
  const evaluateAnswerDepth = (answer: string, threshold: number): boolean => {
    return answer.trim().length >= threshold;
  };

  // Handle adaptive questioning logic
  const handleAnswer = async (answer: string, questionId: string) => {
    const currentQuestion = questionFlow.find(q => q.id === questionId);
    if (!currentQuestion) return;

    // Check if answer has sufficient depth
    const hasDepth = currentQuestion.depthThreshold 
      ? evaluateAnswerDepth(answer, currentQuestion.depthThreshold)
      : true;

    if (!hasDepth && currentQuestion.followUpQuestions && followUpIndex < currentQuestion.followUpQuestions.length) {
      // Ask follow-up question
      setTimeout(() => {
        addBotMessage(currentQuestion.followUpQuestions![followUpIndex]);
        setFollowUpIndex(prev => prev + 1);
      }, 1000);
      return;
    }

    // Answer is sufficient, move to next question
    setFollowUpIndex(0);
    
    // Update form data
    const updatedData = {
      ...formData,
      [questionId]: questionId === 'service_interest' ? selectedServices : answer
    };
    setFormData(updatedData);

    // Move to next question or show summary
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questionFlow.length) {
      setTimeout(() => {
        startQuestion(nextIndex);
        setCurrentQuestionIndex(nextIndex);
      }, 1000);
    } else {
      // All questions complete, show summary
      setTimeout(() => {
        showSummaryConfirmation(updatedData);
      }, 1000);
    }
  };

  const showSummaryConfirmation = (data: FormData) => {
    const summary = `
Here's what I've understood so far:

🎯 **Your Business:** ${data.business_idea || 'Not specified'}

🚧 **Key Challenges:** ${data.current_challenges || 'Not specified'}

🎯 **3-6 Month Goals:** ${data.immediate_goals || 'Not specified'}

🛠️ **Services of Interest:** ${data.service_interest?.map(s => 
  serviceInterestOptions.find(o => o.value === s)?.label
).join(', ') || 'Not specified'}

Ready to create your personalized business plan?
    `;

    addBotMessage(summary);
    setShowSummary(true);
    updateProgress(questionFlow.length, true);
  };

  const handleSend = async () => {
    if (currentQuestion.type === 'multiselect') {
      if (selectedServices.length === 0) return;
      
      const servicesText = selectedServices
        .map(s => serviceInterestOptions.find(o => o.value === s)?.label)
        .join(', ');
      
      addUserMessage(servicesText);
      await handleAnswer(servicesText, currentQuestion.id);
      
    } else {
      if (!inputValue.trim()) return;
      
      addUserMessage(inputValue);
      await handleAnswer(inputValue, currentQuestion.id);
      setInputValue('');
    }
  };

  const handleConfirmSummary = async () => {
    setIsSubmitting(true);
    addBotMessage("Perfect! I'm now creating your personalized business plan. This will just take a moment...");
    
    setTimeout(async () => {
      try {
        await onComplete(formData);
      } catch (error) {
        console.error('Error completing form:', error);
        setIsSubmitting(false);
        addBotMessage("I encountered an error saving your plan. Please check the console or contact support.");
      }
    }, 1500);
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

  const currentQuestion = questionFlow[currentQuestionIndex];

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-160px)] lg:h-[calc(100vh-200px)] max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="max-w-4xl mx-auto">
          <ProgressBar
            current={progress.currentStep + 1}
            total={progress.totalSteps}
            contextMessage={progress.contextMessage}
          />
        </div>
      </div>

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
                <span className="text-xs text-alira-white/70">ALIRA is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      {!showSummary && !isSubmitting && (
        <div className="border-t border-white/10 bg-black/50 backdrop-blur-sm p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            {currentQuestion.type === 'multiselect' ? (
              <div className="space-y-4">
                <p className="text-sm text-alira-white/70 mb-3">{currentQuestion.helper}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentQuestion.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => toggleService(option.value)}
                      className={cn(
                        'p-3 rounded-lg border text-left transition-all duration-200',
                        selectedServices.includes(option.value)
                          ? 'border-alira-gold bg-alira-gold/10 text-alira-gold'
                          : 'border-white/20 bg-white/5 text-alira-white hover:border-alira-gold/50 hover:bg-alira-gold/5'
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          'w-4 h-4 rounded border-2 flex items-center justify-center',
                          selectedServices.includes(option.value)
                            ? 'border-alira-gold bg-alira-gold'
                            : 'border-white/40'
                        )}>
                          {selectedServices.includes(option.value) && (
                            <CheckCircle className="w-3 h-3 text-black" />
                          )}
                        </div>
                        <span className="text-sm font-light">{option.label}</span>
                      </div>
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handleSend}
                  disabled={selectedServices.length === 0}
                  className="w-full bg-gradient-to-r from-alira-gold to-[#8B5A00] hover:from-[#8B5A00] hover:to-alira-gold text-black font-medium"
                >
                  Continue
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-alira-white/70">{currentQuestion.helper}</p>
                <div className="flex gap-2">
                  <Textarea
                    ref={textareaRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={currentQuestion.placeholder}
                    className="flex-1 min-h-[60px] max-h-[120px] resize-none bg-white/5 border-white/20 text-alira-white placeholder:text-alira-white/50 focus:border-alira-gold focus:ring-alira-gold/20"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                    size="sm"
                    className="bg-gradient-to-r from-alira-gold to-[#8B5A00] hover:from-[#8B5A00] hover:to-alira-gold text-black font-medium px-3"
                  >
                    <ArrowUpIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary Confirmation */}
      {showSummary && !isSubmitting && (
        <div className="border-t border-white/10 bg-black/50 backdrop-blur-sm p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3">
              <Button
                onClick={handleConfirmSummary}
                className="flex-1 bg-gradient-to-r from-alira-gold to-[#8B5A00] hover:from-[#8B5A00] hover:to-alira-gold text-black font-medium"
              >
                <Target className="w-4 h-4 mr-2" />
                Create My Business Plan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Processing State */}
      {isSubmitting && (
        <div className="border-t border-white/10 bg-black/50 backdrop-blur-sm p-4 sm:p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-alira-gold">
              <Zap className="w-5 h-5 animate-pulse" />
              <span className="font-light">Generating your personalized business plan...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
