'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X, Lightbulb, Info, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'

interface HelpTip {
  id: string
  title: string
  content: string
  type?: 'info' | 'tip' | 'example'
  icon?: React.ReactNode
}

interface ContextualHelpProps {
  fieldId: string
  tips?: HelpTip[]
  className?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  onClick?: () => void
}

const defaultTips: Record<string, HelpTip[]> = {
  business_idea: [
    {
      id: 'what-to-include',
      title: 'What to include',
      type: 'info',
      content: 'Describe your business concept, target market, and unique value proposition. Be specific about what makes your business different.',
    },
    {
      id: 'examples',
      title: 'Example',
      type: 'example',
      content: 'Good: "A marketing agency specializing in helping creators launch and scale their first digital product, focusing on email marketing and social media strategy."',
    },
    {
      id: 'tip',
      title: 'Pro Tip',
      type: 'tip',
      content: 'The more detail you provide, the better we can tailor your business plan. Think about your ideal customer and what problem you\'re solving for them.',
    },
  ],
  business_stage: [
    {
      id: 'idea-stage',
      title: 'Idea Stage',
      type: 'info',
      content: 'You have a concept but haven\'t started yet. You\'re still validating the idea and planning the first steps.',
    },
    {
      id: 'early-stage',
      title: 'Early Stage',
      type: 'info',
      content: 'You\'ve launched or are about to launch. You have initial customers or are actively acquiring your first clients.',
    },
    {
      id: 'growing',
      title: 'Growing',
      type: 'info',
      content: 'Your business is established and growing. You have consistent revenue and are scaling operations.',
    },
    {
      id: 'established',
      title: 'Established',
      type: 'info',
      content: 'You\'re a mature business with stable operations. You\'re looking to optimize, expand, or enter new markets.',
    },
  ],
  current_challenges: [
    {
      id: 'be-honest',
      title: 'Be Honest',
      type: 'info',
      content: 'Identifying your challenges helps us create solutions. Common challenges include: lack of clarity, inconsistent revenue, marketing struggles, or operational inefficiencies.',
    },
    {
      id: 'specific',
      title: 'Be Specific',
      type: 'tip',
      content: 'Instead of "marketing is hard," try "struggling to reach our target audience on social media despite creating quality content."',
    },
  ],
  immediate_goals: [
    {
      id: 'timeframe',
      title: 'Think Timeframe',
      type: 'info',
      content: 'Focus on goals you want to achieve in the next 3-6 months. These are actionable, short-term objectives that move you toward your vision.',
    },
    {
      id: 'smart-goals',
      title: 'SMART Goals',
      type: 'tip',
      content: 'Good goals are Specific, Measurable, Achievable, Relevant, and Time-bound. Example: "Increase monthly revenue by 30% in the next 6 months."',
    },
  ],
  service_interest: [
    {
      id: 'multiple',
      title: 'Select Multiple',
      type: 'info',
      content: 'You can select multiple service areas. We\'ll tailor your plan to address all areas you\'re interested in.',
    },
    {
      id: 'can-change',
      title: 'You Can Change This',
      type: 'tip',
      content: 'Don\'t worry if you\'re not sure. You can always refine your plan later based on our recommendations.',
    },
  ],
}

const getIcon = (type: HelpTip['type']) => {
  switch (type) {
    case 'tip':
      return <Lightbulb className="w-4 h-4" />
    case 'example':
      return <BookOpen className="w-4 h-4" />
    default:
      return <Info className="w-4 h-4" />
  }
}

export function ContextualHelp({
  fieldId,
  tips,
  className,
  placement = 'top',
  onClick
}: ContextualHelpProps) {
  const [isOpen, setIsOpen] = useState(false)
  const helpTips = tips || defaultTips[fieldId] || []

  if (helpTips.length === 0) return null

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onClick={onClick}
          className={cn(
            "inline-flex items-center justify-center p-1.5 rounded-full transition-colors",
            "hover:bg-alira-gold/20 dark:hover:bg-alira-gold/30",
            "text-alira-primary/60 dark:text-alira-white/60 hover:text-alira-gold",
            "focus:outline-none focus:ring-2 focus:ring-alira-gold/40",
            className
          )}
          aria-label="Get help"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        side={placement}
        className="w-80 sm:w-96 p-0 bg-white dark:bg-alira-primary border-alira-primary/20 dark:border-alira-white/20 shadow-xl"
        align="end"
      >
        <div className="p-4 border-b border-alira-primary/10 dark:border-alira-white/10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-alira-primary dark:text-alira-white">
              Help & Tips
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded hover:bg-alira-primary/10 dark:hover:bg-alira-primary/20 transition-colors"
              aria-label="Close help"
            >
              <X className="w-4 h-4 text-text-tertiary" />
            </button>
          </div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          <AnimatePresence>
            {helpTips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "p-4 border-b border-alira-primary/10 dark:border-alira-white/10 last:border-b-0",
                  tip.type === 'tip' && "bg-alira-gold/5 dark:bg-alira-gold/10",
                  tip.type === 'example' && "bg-blue-50 dark:bg-blue-900/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-1.5 rounded-md flex-shrink-0",
                    tip.type === 'tip' && "bg-alira-gold/20 text-alira-gold",
                    tip.type === 'example' && "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
                    !tip.type && "bg-alira-primary/10 dark:bg-alira-primary/20 text-alira-primary dark:text-alira-white"
                  )}>
                    {tip.icon || getIcon(tip.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-alira-primary dark:text-alira-white mb-1">
                      {tip.title}
                    </h4>
                    <p className="text-xs text-text-tertiary leading-relaxed">
                      {tip.content}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// Inline help component for displaying tips directly in the form
export function InlineHelp({ 
  fieldId, 
  className 
}: { 
  fieldId: string
  className?: string 
}) {
  const tips = defaultTips[fieldId] || []
  const mainTip = tips.find(t => t.type === 'tip') || tips[0]

  if (!mainTip) return null

  return (
    <div className={cn(
      "flex items-start gap-2 p-3 rounded-lg bg-alira-gold/10 dark:bg-alira-gold/20 border border-alira-gold/20",
      className
    )}>
      <Lightbulb className="w-4 h-4 text-alira-gold flex-shrink-0 mt-0.5" />
      <p className="text-xs text-text-tertiary leading-relaxed">
        <span className="font-semibold text-alira-primary dark:text-alira-white">{mainTip.title}:</span> {mainTip.content}
      </p>
    </div>
  )
}

