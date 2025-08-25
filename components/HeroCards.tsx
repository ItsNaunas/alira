import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Target, ArrowRight, Calendar } from 'lucide-react'

const cards = [
  {
    title: 'Problem Statement',
    description: 'Reframe complexity into clear, actionable insights.',
    model: 'ANALYSIS',
    href: '#problem',
    image: '/images/cards/problem-statement.png',
    badges: ['Structure', 'Context'],
    icon: CheckCircle,
  },
  {
    title: 'Objectives',
    description: 'Define success metrics and measurable outcomes.',
    model: 'FRAMEWORK',
    href: '#objectives',
    image: '/images/cards/objectives.png',
    badges: ['Goals', 'Metrics'],
    icon: Target,
  },
  {
    title: 'Proposed Solution',
    description: 'Map services to your specific challenges and scope.',
    model: 'STRATEGY',
    href: '#solution',
    image: '/images/cards/proposed-solution.png',
    badges: ['Strategy', 'Scope'],
    icon: ArrowRight,
  },
  {
    title: 'Next Steps',
    description: 'Clear decisions, timelines, and immediate actions.',
    model: 'ROADMAP',
    href: '#next-steps',
    image: '/images/cards/next-steps.png',
    badges: ['Timeline', 'Actions'],
    icon: Calendar,
  },
]

export default function HeroCards() {
  return (
    <div className="relative">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-alira-porcelain via-alira-porcelain to-alira-midnight/5 pointer-events-none"></div>
      
      <div className="relative text-center">
        {/* Subheading Section */}
        <div className="mb-12 lg:mb-16">
          <h2 className="text-3xl font-semibold text-alira-onyx mb-3">
            What you get
          </h2>
          
          {/* Gold divider */}
          <div className="w-16 h-px bg-alira-gold/30 mx-auto mb-4"></div>
          
          <p className="text-lg md:text-xl font-medium text-alira-onyx/70 max-w-[60ch] mx-auto">
            Every business case draft contains these four building blocks.
          </p>
        </div>

        {/* Cards Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Mobile gradient edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-alira-porcelain to-transparent pointer-events-none z-10 lg:hidden"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-alira-porcelain to-transparent pointer-events-none z-10 lg:hidden"></div>
          
          {/* Card grid */}
          <div className="flex lg:grid lg:grid-cols-4 gap-8 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide pb-4 lg:pb-0">
            {cards.map((card, index) => {
              const IconComponent = card.icon
              return (
                <Link 
                  key={card.title}
                  href={card.href} 
                  className="flex-shrink-0 w-80 lg:w-auto snap-start group focus:outline-none focus-visible:ring-2 focus-visible:ring-alira-midnight focus-visible:ring-offset-2 focus-visible:ring-offset-alira-porcelain rounded-2xl"
                  aria-label={`Learn more about ${card.title}`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="h-full bg-alira-porcelain rounded-2xl border border-alira-onyx/8 overflow-hidden transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-2 hover:shadow-alira-card-elevated focus-within:shadow-alira-card-elevated shadow-alira-card group animate-fade-up">
                    {/* Enhanced hover glow outline */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-alira-gold/0 via-alira-gold/0 to-alira-gold/0 group-hover:from-alira-gold/10 group-hover:via-alira-gold/5 group-hover:to-alira-gold/10 transition-all duration-300 pointer-events-none"></div>
                    
                    {/* Image block - 16:9 aspect ratio with porcelain plinth */}
                    <div className="relative w-full aspect-video overflow-hidden bg-alira-onyx/5">
                      <Image 
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{
                          filter: 'saturate(0.75) contrast(1.05) brightness(0.95)'
                        }}
                      />
                      {/* Enhanced brand tint overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-alira-gold/8 via-alira-gold/4 to-alira-midnight/6"></div>
                      {/* Refined vignette overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/8 via-transparent to-black/8"></div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent"></div>
                      {/* Subtle inner glow for depth */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
                      
                      {/* Icon on porcelain plinth */}
                      <div className="absolute bottom-4 right-4 w-12 h-12 bg-alira-porcelain/95 rounded-xl border border-alira-onyx/10 flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform duration-300">
                        <IconComponent className="w-6 h-6 text-alira-midnight" />
                      </div>
                    </div>
                    
                    {/* Card body */}
                    <div className="p-6">
                      {/* Model label - Midnight Blue */}
                      <div className="mb-2">
                        <span className="text-xs text-alira-midnight font-semibold tracking-widest uppercase">
                          {card.model}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg md:text-xl font-bold text-alira-onyx mb-2 line-clamp-2 leading-tight">
                        {card.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-alira-onyx/70 leading-relaxed mb-4 line-clamp-2">
                        {card.description}
                      </p>
                      
                      {/* Enhanced badges row */}
                      <div className="flex gap-2">
                        {card.badges.map((badge, badgeIndex) => (
                          <span 
                            key={badge}
                            className="px-3 py-1.5 text-xs font-medium bg-alira-porcelain text-alira-onyx/80 rounded-full border border-alira-gold/30 hover:bg-alira-onyx/5 transition-colors duration-200 flex items-center gap-1"
                          >
                            {badgeIndex === 0 && badge === 'Structure' && '✅'}
                            {badgeIndex === 0 && badge === 'Goals' && '📊'}
                            {badgeIndex === 0 && badge === 'Strategy' && '➡️'}
                            {badgeIndex === 0 && badge === 'Timeline' && '📅'}
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
          
          {/* CTA Button */}
          <div className="mt-12 text-center">
            <Link
              href="#how-it-works"
              className="inline-flex items-center px-6 py-3 bg-alira-onyx text-alira-porcelain font-medium rounded-lg hover:bg-alira-onyx/90 focus:outline-none focus:ring-2 focus:ring-alira-gold focus:ring-offset-2 focus:ring-offset-alira-porcelain transition-all duration-200 border border-alira-onyx hover:border-alira-gold/30"
            >
              See How It Works
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
          
          {/* Pagination dots for mobile */}
          <div className="flex justify-center mt-8 space-x-2 lg:hidden">
            {cards.map((_, index) => (
              <div 
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === 0 ? 'bg-alira-gold w-6' : 'bg-alira-gold/30'
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
