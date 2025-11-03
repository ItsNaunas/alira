'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Bot, User } from 'lucide-react'
import { useMobile } from '@/hooks/use-mobile'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  timestamp?: Date
  isTyping?: boolean
}

export function MessageBubble({ role, content, timestamp, isTyping = false }: MessageBubbleProps) {
  const isMobile = useMobile()

  const isUser = role === 'user'
  const isAssistant = role === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'flex items-start gap-3',
        isUser ? 'justify-end' : 'justify-start',
        isMobile ? 'mb-4' : 'mb-6' // More spacing on desktop
      )}
    >
      {isAssistant && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-alira-primary/20 dark:bg-alira-primary/80 flex items-center justify-center">
            <Bot className="w-4 h-4 text-alira-primary dark:text-alira-white" />
          </div>
        </div>
      )}

      <div
        className={cn(
          'rounded-2xl px-4 py-3 shadow-sm',
          'text-sm sm:text-base',
          isUser
            ? 'bg-alira-gold text-alira-primary rounded-br-sm shadow-md'
            : 'bg-alira-primary/10 dark:bg-alira-primary/80 text-alira-primary dark:text-alira-white rounded-bl-sm border border-alira-primary/20 dark:border-alira-white/20',
          // Width: mobile gets 85%, tablet 75%, desktop gets wider (60-70%)
          isMobile 
            ? 'max-w-[85%]' 
            : 'max-w-[65%] md:max-w-[70%]'
        )}
      >
        {isTyping ? (
          <div className="flex items-center gap-1">
            <span className="text-alira-primary/60 dark:text-alira-white/60">Thinking</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-alira-primary/60 dark:bg-alira-white/60"
                  animate={{
                    y: [0, -4, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>
        )}

        {timestamp && (
          <p className={cn(
            'text-xs mt-2',
            isUser
              ? 'text-alira-primary/60'
              : 'text-alira-primary/40 dark:text-alira-white/40'
          )}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-alira-gold flex items-center justify-center">
            <User className="w-4 h-4 text-alira-primary" />
          </div>
        </div>
      )}
    </motion.div>
  )
}

