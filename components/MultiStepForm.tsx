'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ui/progress-bar';
import { cn } from '@/lib/utils';
import { ArrowRight, Sparkles, CheckCircle, Target, Zap } from 'lucide-react';
import { serviceInterestOptions } from '@/lib/schema';

interface FormData {
  business_idea?: string;
  current_challenges?: string;
  immediate_goals?: string;
  service_interest?: string[];
  current_tools?: string;
}

interface FormStep {
  id: keyof FormData;
  title: string;
  stepNumber: number;
  question: string;
  placeholder: string;
  helperText: string;
  type: 'text' | 'multiselect';
  minChars: number;
  followUpQuestions?: string[];
  options?: ReadonlyArray<{ readonly value: string; readonly label: string; readonly description?: string }>;
}

const formSteps: FormStep[] = [
  {
    id: 'business_idea',
    title: 'Your Business',
    stepNumber: 1,
    question: "Let's start with your business idea or current venture",
    placeholder: "Describe your business, what you offer, and who you serve...",
    helperText: "Take your time to paint a complete picture. The more detail you provide, the better we can help.",
    type: 'text',
    minChars: 100,
    followUpQuestions: [
      "What specific problem does your business solve?",
      "Who is your target audience or ideal customer?",
      "What makes your approach unique in the market?"
    ]
  },
  {
    id: 'current_challenges',
    title: 'Current Challenges',
    stepNumber: 2,
    question: "What are your biggest operational challenges right now?",
    placeholder: "Describe the obstacles preventing your growth or slowing you down...",
    helperText: "Think about daily operations, resource constraints, strategic blockers, or market challenges.",
    type: 'text',
    minChars: 80,
    followUpQuestions: [
      "How long have you been facing these challenges?",
      "What solutions have you tried so far?",
      "What's the impact on your business performance?"
    ]
  },
  {
    id: 'immediate_goals',
    title: 'Your Goals',
    stepNumber: 3,
    question: "What do you want to achieve in the next 3-6 months?",
    placeholder: "Share your specific goals, targets, or milestones...",
    helperText: "Be specific about outcomes, metrics, or transformations you're aiming for.",
    type: 'text',
    minChars: 80,
    followUpQuestions: [
      "What would success look like in concrete terms?",
      "How will you measure progress toward these goals?"
    ]
  },
  {
    id: 'service_interest',
    title: 'Service Areas',
    stepNumber: 4,
    question: "Which service areas would be most valuable to you?",
    placeholder: "",
    helperText: "Select all that apply - we'll customize our recommendations based on your needs.",
    type: 'multiselect',
    minChars: 0,
    options: serviceInterestOptions
  }
];

interface MultiStepFormProps {
  userId: string;
  initialData?: Partial<FormData>;
  onComplete: (data: FormData) => void;
}

export default function MultiStepForm({ userId, initialData, onComplete }: MultiStepFormProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData || {});
  const [currentInput, setCurrentInput] = useState('');
  const [followUpInputs, setFollowUpInputs] = useState<string[]>([]);
  const [activeFollowUps, setActiveFollowUps] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>(initialData?.service_interest || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidationHint, setShowValidationHint] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const hasInitialized = useRef(false);

  const currentStep = formSteps[currentStepIndex];
  const completedSteps = currentStepIndex;
  const progressPercentage = (completedSteps / formSteps.length) * 100;

  const progressMessages = [
    "We're getting to know your business...",
    "Understanding your challenges...",
    "Learning about your goals...",
    "Tailoring your strategy..."
  ];

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [currentInput]);

  // Initialize with pre-filled data if exists
  useEffect(() => {
    if (!hasInitialized.current && initialData?.business_idea) {
      hasInitialized.current = true;
      setCurrentInput(initialData.business_idea);
    }
  }, [initialData]);

  const evaluateDepth = useCallback((text: string, minChars: number): boolean => {
    const trimmed = text.trim();
    return trimmed.length >= minChars;
  }, []);

  const handleContinue = useCallback(() => {
    setShowValidationHint(false);

    // For multiselect, check selection count
    if (currentStep.type === 'multiselect') {
      if (selectedServices.length === 0) {
        setShowValidationHint(true);
        return;
      }

      // Save and complete
      const updatedData = {
        ...formData,
        [currentStep.id]: selectedServices
      };
      setFormData(updatedData);
      setIsSubmitting(true);
      
      setTimeout(() => {
        onComplete(updatedData);
      }, 1000);
      return;
    }

    // For text fields
    const allInputs = [currentInput, ...followUpInputs].join(' ').trim();
    const hasDepth = evaluateDepth(allInputs, currentStep.minChars);

    if (!hasDepth && activeFollowUps.length < (currentStep.followUpQuestions?.length || 0)) {
      // Ask next follow-up question
      const nextFollowUp = currentStep.followUpQuestions![activeFollowUps.length];
      setActiveFollowUps(prev => [...prev, nextFollowUp]);
      setShowValidationHint(false);
      return;
    }

    if (!hasDepth) {
      // All follow-ups exhausted but still not enough depth
      setShowValidationHint(true);
      return;
    }

    // Save data and move to next step
    const updatedData = {
      ...formData,
      [currentStep.id]: allInputs
    };
    setFormData(updatedData);

    if (currentStepIndex < formSteps.length - 1) {
      // Move to next step
      setCurrentStepIndex(prev => prev + 1);
      setCurrentInput('');
      setFollowUpInputs([]);
      setActiveFollowUps([]);
      setShowValidationHint(false);
      
      // Focus next input after transition
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 400);
    }
  }, [currentStep, currentInput, followUpInputs, activeFollowUps, selectedServices, formData, currentStepIndex, evaluateDepth, onComplete]);

  const handleFollowUpChange = (index: number, value: string) => {
    const newFollowUpInputs = [...followUpInputs];
    newFollowUpInputs[index] = value;
    setFollowUpInputs(newFollowUpInputs);
  };

  const toggleService = (serviceValue: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceValue)
        ? prev.filter(s => s !== serviceValue)
        : [...prev, serviceValue]
    );
    setShowValidationHint(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleContinue();
    }
  };

  // Step transition animations
  const stepVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const followUpVariants = {
    hidden: { opacity: 0, height: 0, marginTop: 0 },
    visible: { opacity: 1, height: 'auto', marginTop: 16 }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/10 p-4 sm:p-6">
        <ProgressBar
          current={completedSteps}
          total={formSteps.length}
          contextMessage={progressMessages[Math.min(currentStepIndex, progressMessages.length - 1)]}
        />
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-8 sm:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepIndex}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-3xl mx-auto"
          >
            {/* Step Header */}
            <div className="mb-8 sm:mb-10 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-alira-gold/10 border border-alira-gold/20 mb-4">
                <Sparkles className="w-4 h-4 text-alira-gold" />
                <span className="text-sm text-alira-gold font-light">
                  Step {currentStep.stepNumber} of {formSteps.length}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-normal text-alira-white mb-3">
                {currentStep.title}
              </h2>
              <p className="text-lg sm:text-xl text-alira-white/70 font-light">
                {currentStep.question}
              </p>
            </div>

            {/* Form Field */}
            {currentStep.type === 'text' ? (
              <div className="space-y-4">
                {/* Primary Input */}
                <div className={cn(
                  'rounded-2xl bg-white/5 backdrop-blur-md ring-1 ring-white/10 transition-all duration-300',
                  'focus-within:ring-2 focus-within:ring-alira-gold/50 focus-within:bg-white/[0.07]',
                  'shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]'
                )}>
                  <Textarea
                    ref={textareaRef}
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={currentStep.placeholder}
                    className={cn(
                      'w-full px-6 py-5 bg-transparent border-none',
                      'text-base sm:text-lg text-alira-white placeholder:text-alira-white/40',
                      'focus:outline-none focus-visible:ring-0 resize-none',
                      'min-h-[180px] sm:min-h-[220px]'
                    )}
                    disabled={isSubmitting}
                  />
                  <div className="px-6 pb-4 flex items-center justify-between text-xs text-alira-white/50">
                    <span>{currentStep.helperText}</span>
                    <span>{currentInput.length} characters</span>
                  </div>
                </div>

                {/* Follow-up Questions */}
                <AnimatePresence>
                  {activeFollowUps.map((followUp, index) => (
                    <motion.div
                      key={index}
                      variants={followUpVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{ duration: 0.3 }}
                      className="ml-4 sm:ml-8"
                    >
                      <div className="rounded-xl bg-gradient-to-br from-alira-gold/10 to-transparent border border-alira-gold/30 p-4 sm:p-5 space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-alira-gold/20 flex items-center justify-center mt-1">
                            <Sparkles className="w-3.5 h-3.5 text-alira-gold" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-alira-gold font-light mb-2">ALIRA asks:</p>
                            <p className="text-base text-alira-white/90 font-light">{followUp}</p>
                          </div>
                        </div>
                        <Textarea
                          value={followUpInputs[index] || ''}
                          onChange={(e) => handleFollowUpChange(index, e.target.value)}
                          placeholder="Your answer..."
                          className={cn(
                            'w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg',
                            'text-base text-alira-white placeholder:text-alira-white/30',
                            'focus:outline-none focus:ring-2 focus:ring-alira-gold/30 focus:border-alira-gold/50',
                            'resize-none min-h-[80px]'
                          )}
                          disabled={isSubmitting}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Validation Hint */}
                {showValidationHint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-alira-gold/10 border border-alira-gold/30 p-4 text-center"
                  >
                    <p className="text-sm text-alira-gold font-light">
                      Please provide a bit more detail to help us understand better (at least {currentStep.minChars} characters total).
                    </p>
                  </motion.div>
                )}
              </div>
            ) : (
              // Multiselect for Service Interest
              <div className="space-y-6">
                <p className="text-center text-sm text-alira-white/60 font-light">
                  {currentStep.helperText}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {currentStep.options?.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => toggleService(option.value)}
                      className={cn(
                        'group relative p-4 sm:p-5 rounded-xl border-2 text-left transition-all duration-200',
                        'hover:scale-[1.02] active:scale-[0.98]',
                        selectedServices.includes(option.value)
                          ? 'border-alira-gold bg-gradient-to-br from-alira-gold/20 to-alira-gold/5 shadow-[0_0_20px_rgba(160,107,0,0.3)]'
                          : 'border-white/10 bg-white/5 hover:border-alira-gold/50 hover:bg-white/[0.07]'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 transition-all',
                          selectedServices.includes(option.value)
                            ? 'border-alira-gold bg-alira-gold scale-110'
                            : 'border-white/30 group-hover:border-alira-gold/50'
                        )}>
                          {selectedServices.includes(option.value) && (
                            <CheckCircle className="w-3.5 h-3.5 text-black" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={cn(
                            'text-base font-medium mb-1 transition-colors',
                            selectedServices.includes(option.value)
                              ? 'text-alira-gold'
                              : 'text-alira-white group-hover:text-alira-gold/90'
                          )}>
                            {option.label}
                          </h4>
                          {option.description && (
                            <p className="text-xs sm:text-sm text-alira-white/60 font-light">
                              {option.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {showValidationHint && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg bg-alira-gold/10 border border-alira-gold/30 p-4 text-center"
                  >
                    <p className="text-sm text-alira-gold font-light">
                      Please select at least one service area to continue.
                    </p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Continue Button */}
            <div className="mt-8 sm:mt-10">
              <Button
                onClick={handleContinue}
                disabled={isSubmitting}
                className={cn(
                  'w-full flex items-center justify-center gap-3 rounded-xl px-8 py-5 text-base sm:text-lg font-medium',
                  'bg-gradient-to-r from-alira-gold to-[#8B5A00] text-black',
                  'hover:shadow-[0_0_30px_rgba(160,107,0,0.5)] hover:scale-[1.02]',
                  'active:scale-[0.98] transition-all duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none'
                )}
              >
                {isSubmitting ? (
                  <>
                    <Zap className="w-5 h-5 animate-pulse" />
                    <span>Creating Your Business Plan...</span>
                  </>
                ) : currentStepIndex === formSteps.length - 1 ? (
                  <>
                    <Target className="w-5 h-5" />
                    <span>Create My Business Plan</span>
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
              {currentStep.type === 'text' && !isSubmitting && (
                <p className="text-center text-xs text-alira-white/40 mt-3 font-light">
                  Press Ctrl + Enter to continue
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

