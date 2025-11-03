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
  methodologies?: string[]
}

export function MessageBubble({ role, content, timestamp, isTyping = false, methodologies }: MessageBubbleProps) {
  const isMobile = useMobile()

  const isUser = role === 'user'
  const isAssistant = role === 'assistant'

  return (
    <motion.article
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={cn(
        'flex items-start gap-3 w-full',
        isUser ? 'justify-end' : 'justify-start'
        // Spacing handled by parent container via space-y
      )}
      role={isTyping ? 'status' : undefined}
      aria-live={isTyping ? 'polite' : undefined}
    >
      {isAssistant && (
        <motion.div 
          className="flex-shrink-0 mt-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-alira-primary/20 to-alira-primary/10 dark:from-alira-primary/80 dark:to-alira-primary/60 flex items-center justify-center shadow-md border border-alira-primary/10 dark:border-alira-white/10">
            <Bot className="w-5 h-5 text-alira-primary dark:text-alira-white" />
          </div>
        </motion.div>
      )}

      <motion.div
        className={cn(
          'rounded-2xl px-4 py-3 shadow-lg',
          'text-sm sm:text-base',
          isUser
            ? 'bg-gradient-to-br from-alira-gold to-alira-gold-dark text-alira-primary rounded-br-sm shadow-xl shadow-alira-gold/20'
            : 'bg-alira-primary/10 dark:bg-alira-primary/90 text-alira-primary dark:text-alira-white rounded-bl-sm border border-alira-primary/20 dark:border-alira-white/20 backdrop-blur-sm',
          // Width: mobile gets 85%, tablet 75%, desktop gets wider (60-70%)
          isMobile 
            ? 'max-w-[85%]' 
            : 'max-w-[65%] md:max-w-[70%]',
          // Enhanced hover effect for desktop
          !isMobile && isUser && 'hover:shadow-2xl hover:shadow-alira-gold/30 transition-shadow duration-300'
        )}
        whileHover={!isMobile ? { scale: 1.02, transition: { duration: 0.2 } } : {}}
      >
        {isTyping ? (
          <div className="flex items-center gap-2">
            <span className="text-alira-primary/70 dark:text-alira-white/70 text-sm">Analyzing</span>
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-alira-gold"
                  animate={{
                    y: [0, -6, 0],
                    opacity: [0.4, 1, 0.4],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="leading-relaxed whitespace-pre-wrap break-words font-sans">
            {content}
          </p>
        )}
      </motion.div>

      {isUser && (
        <motion.div 
          className="flex-shrink-0 mt-1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-alira-gold to-alira-gold-dark flex items-center justify-center shadow-lg shadow-alira-gold/30 border border-alira-gold/20">
            <User className="w-5 h-5 text-alira-primary" />
          </div>
        </motion.div>
      )}
    </motion.article>
  )
}

