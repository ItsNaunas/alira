'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  contextMessage: string;
  className?: string;
}

export default function ProgressBar({ current, total, contextMessage, className }: ProgressBarProps) {
  const percentage = Math.min(Math.round((current / total) * 100), 100);

  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-alira-gold rounded-full animate-pulse" />
          <span className="text-sm text-alira-white font-light">
            Step {current} of {total}
          </span>
        </div>
        <span className="text-sm text-alira-gold font-light">
          {percentage}%
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-accent to-accent-dark h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 0.6, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
            damping: 20
          }}
        />
      </div>
      
      {/* Context Message */}
      <motion.p
        key={contextMessage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xs text-alira-white/70 font-light"
      >
        {contextMessage}
      </motion.p>
    </div>
  );
}
