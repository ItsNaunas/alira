'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Target, CheckCircle, ArrowRight } from 'lucide-react';
import { serviceInterestOptions } from '@/lib/schema';

interface FormData {
  business_idea?: string;
  current_challenges?: string;
  immediate_goals?: string;
  service_interest?: string[];
  current_tools?: string;
}

interface SummaryConfirmationProps {
  data: FormData;
  onConfirm: () => void;
  onCancel?: () => void;
  isProcessing?: boolean;
}

export default function SummaryConfirmation({ 
  data, 
  onConfirm, 
  onCancel, 
  isProcessing = false 
}: SummaryConfirmationProps) {
  const getServiceLabels = (services: string[]) => {
    return services.map(s => 
      serviceInterestOptions.find(o => o.value === s)?.label || s
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-gradient-to-r from-accent to-accent-dark rounded-full flex items-center justify-center mx-auto"
        >
          <CheckCircle className="w-8 h-8 text-black" />
        </motion.div>
        <h3 className="text-xl font-serif text-text-primary">
          Here's what I've understood
        </h3>
        <p className="text-sm text-text-secondary">
          Review your information before I create your personalized business plan
        </p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-4">
        {/* Business Idea */}
        {data.business_idea && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-surface border border-borderToken-subtle rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-alira-gold/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Target className="w-4 h-4 text-alira-gold" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-accent mb-1">Your Business</h4>
                <p className="text-sm text-text-primary leading-relaxed">
                  {data.business_idea}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Challenges */}
        {data.current_challenges && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-surface border border-borderToken-subtle rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-400 text-xs">⚠</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-accent mb-1">Key Challenges</h4>
                <p className="text-sm text-text-primary leading-relaxed">
                  {data.current_challenges}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Goals */}
        {data.immediate_goals && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-surface border border-borderToken-subtle rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-400 text-xs">🎯</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-accent mb-1">3-6 Month Goals</h4>
                <p className="text-sm text-text-primary leading-relaxed">
                  {data.immediate_goals}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Services */}
        {data.service_interest && data.service_interest.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-surface border border-borderToken-subtle rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-xs">🛠</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-accent mb-2">Services of Interest</h4>
                <div className="flex flex-wrap gap-2">
                  {getServiceLabels(data.service_interest).map((service, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full bg-alira-gold/10 text-alira-gold text-xs font-light"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex gap-3 pt-4"
      >
        <Button
          onClick={onConfirm}
          disabled={isProcessing}
          className="flex-1 bg-gradient-to-r from-accent to-accent-dark hover:from-accent-dark hover:to-accent text-text-primary font-medium disabled:opacity-50"
        >
          {isProcessing ? (
            <>
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2" />
              Creating Your Plan...
            </>
          ) : (
            <>
              <Target className="w-4 h-4 mr-2" />
              Create My Business Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
        
        {onCancel && (
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-borderToken-subtle text-text-primary hover:bg-bg-muted"
            disabled={isProcessing}
          >
            Edit Details
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
}
