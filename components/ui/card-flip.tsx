'use client';
/**
 * @author: @nuelst
 * @description: Card Flip - MVP Development Theme
 * @version: 1.1.0
 * @date: 2025-01-14
 * @license: MIT
 * @website: https://nueslt.vercel.app
 * @github: https://github.com/nuelst
 */
import { cn } from '@/lib/utils';
import { ArrowRight, Code2, Copy, Rocket, Zap } from 'lucide-react';
import { useState } from 'react';

export interface CardFlipProps {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  imageSrc?: string;
  imageAlt?: string;
  imagePosition?: 'center' | 'top' | 'bottom';
}

export default function CardFlip({
  title = 'Build MVPs Fast',
  subtitle = 'Launch your idea in record time',
  description = 'Copy, paste, customize—and launch your MVP faster than ever with our developer-first component library.',
  features = [
    'Copy & Paste Ready',
    'Developer-First',
    'MVP Optimized',
    'Zero Setup Required',
  ],
  imageSrc,
  imageAlt = 'Team member',
  imagePosition = 'center',
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div
      className="group relative h-[360px] w-full max-w-[300px] [perspective:2000px]"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <div
        className={cn(
          'relative h-full w-full',
          '[transform-style:preserve-3d]',
          'transition-all duration-700',
          isFlipped
            ? '[transform:rotateY(180deg)]'
            : '[transform:rotateY(0deg)]',
        )}
      >
        {/* Front of card */}
        <div
      className={cn(
        'absolute inset-0 h-full w-full',
        '[transform:rotateY(0deg)] [backface-visibility:hidden]',
        'overflow-hidden rounded-2xl',
        'bg-alira-primary/20 backdrop-blur-sm',
        'shadow-xl shadow-black/20',
        'transition-all duration-700',
        'group-hover:shadow-2xl group-hover:shadow-alira-gold/10',
        'group-hover:bg-alira-primary/30',
        'group-hover:backdrop-blur-md',
        isFlipped ? 'opacity-0' : 'opacity-100',
      )}
        >
          {/* Premium glass effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-alira-gold/10" />
          
          {/* Team member image - full card */}
          {imageSrc && (
            <div className="absolute inset-0 overflow-hidden">
              {/* Premium background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-alira-primary/40 via-alira-primary/20 to-alira-gold/10"></div>
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 30% 70%, rgba(160, 107, 0, 0.1) 0%, transparent 50%),
                                radial-gradient(circle at 70% 30%, rgba(11, 29, 81, 0.2) 0%, transparent 50%)`,
              }}></div>
              
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={imageAlt}
                className={`w-full h-full object-cover relative z-10 ${
                  imagePosition === 'bottom' 
                    ? 'object-top' 
                    : imagePosition === 'top' 
                    ? 'object-bottom' 
                    : 'object-center'
                }`}
                style={{
                  transform: title === 'Etomi' ? 'translateX(-10px) translateY(20px)' : 'none'
                }}
              />
              {/* Premium overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-20" />
            </div>
          )}
          
          {/* Bottom content */}
          <div className="absolute right-0 bottom-0 left-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5 relative z-10">
                <h3 className="text-lg leading-snug font-serif font-normal tracking-tight text-alira-white transition-all duration-500 ease-out group-hover:translate-y-[-4px]">
                  {title}
                </h3>
                <p className="line-clamp-2 text-sm tracking-tight text-alira-white/90 transition-all delay-[50ms] duration-500 ease-out group-hover:translate-y-[-4px]">
                  {subtitle}
                </p>
              </div>
              <div className="group/icon relative">
                <div
                  className={cn(
                    'absolute inset-[-8px] rounded-lg transition-opacity duration-300',
                    'from-alira-gold/20 via-alira-gold/10 bg-gradient-to-br to-transparent',
                    'opacity-0 group-hover/icon:opacity-100',
                  )}
                />
                <Zap className="text-alira-gold relative z-10 h-5 w-5 transition-all duration-300 group-hover/icon:scale-110 group-hover/icon:rotate-12" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Back of card */}
        <div
      className={cn(
        'absolute inset-0 h-full w-full',
        '[transform:rotateY(180deg)] [backface-visibility:hidden]',
        'rounded-2xl p-5',
        'bg-alira-primary/20 backdrop-blur-sm',
        'shadow-xl shadow-black/20',
        'flex flex-col',
        'transition-all duration-700',
        'group-hover:shadow-2xl group-hover:shadow-alira-gold/10',
        'group-hover:bg-alira-primary/30',
        'group-hover:backdrop-blur-md',
        !isFlipped ? 'opacity-0' : 'opacity-100',
      )}
        >
          {/* Premium glass effect overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 via-transparent to-alira-gold/10" />
          
          <div className="relative z-10 flex-1 space-y-5">
            <div className="space-y-2">
              <div className="mb-2 flex items-center gap-2">
                <div className="from-alira-gold via-alira-gold/90 to-alira-gold/80 flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br shadow-lg shadow-alira-gold/20">
                  <Code2 className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg leading-snug font-serif font-normal tracking-tight text-white transition-all duration-500 ease-out group-hover:translate-y-[-2px]">
                  {title}
                </h3>
              </div>
              <p className="line-clamp-3 text-sm tracking-tight text-white/70 transition-all duration-500 ease-out group-hover:translate-y-[-2px]">
                {description}
              </p>
            </div>
            
            <div className="space-y-2.5">
              {features.map((feature, index) => {
                const icons = [Copy, Code2, Rocket, Zap];
                const IconComponent = icons[index % icons.length];
                return (
                  <div
                    key={feature}
                    className="flex items-center gap-3 text-sm text-white/80 transition-all duration-500"
                    style={{
                      transform: isFlipped
                        ? 'translateX(0)'
                        : 'translateX(-10px)',
                      opacity: isFlipped ? 1 : 0,
                      transitionDelay: `${index * 100 + 200}ms`,
                    }}
                  >
                    <div className="bg-alira-gold/20 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md shadow-sm shadow-alira-gold/10">
                      <IconComponent className="text-alira-gold h-3 w-3" />
                    </div>
                    <span className="font-sans font-light">{feature}</span>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="relative z-10 mt-auto border-t border-white/20 pt-4">
            <div
              className={cn(
                'group/start relative',
                'flex items-center justify-between',
                'rounded-xl p-3',
                'transition-all duration-300',
                'bg-alira-gold text-white',
                'hover:bg-alira-primary hover:border-alira-gold',
                'hover:scale-[1.02] hover:cursor-pointer',
                'border-2 border-transparent',
                'shadow-lg shadow-alira-gold/20 hover:shadow-alira-gold/30',
              )}
            >
              <span className="text-sm font-sans font-light transition-colors duration-300">
                Learn More
              </span>
              <div className="group/icon relative">
                <div
                  className={cn(
                    'absolute inset-[-6px] rounded-lg transition-all duration-300',
                    'from-alira-gold/20 via-alira-gold/10 bg-gradient-to-br to-transparent',
                    'scale-90 opacity-0 group-hover/start:scale-100 group-hover/start:opacity-100',
                  )}
                />
                <ArrowRight className="relative z-10 h-4 w-4 transition-all duration-300 group-hover/start:translate-x-1 group-hover/start:scale-110" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
