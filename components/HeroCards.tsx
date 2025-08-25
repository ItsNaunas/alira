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
          {/* Card grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card, index) => {
              const IconComponent = card.icon
              return (
                <Link 
                  key={card.title}
                  href={card.href} 
                  className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-alira-midnight focus-visible:ring-offset-2 focus-visible:ring-offset-alira-porcelain rounded-3xl"
                  aria-label={`Learn more about ${card.title}`}
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <article className="h-full rounded-3xl bg-white/90 ring-1 ring-black/5 backdrop-blur shadow-[0_1px_1px_rgba(0,0,0,0.06),0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-300 ease-in-out hover:-translate-y-1.5 group-hover:ring-alira-gold/35">
                    {/* Icon safe area */}
                    <div className="h-48 p-3 flex items-center justify-center rounded-t-3xl bg-[#F8F7F5] relative overflow-hidden">
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
                    <div className="p-5">
                      {/* Eyebrow - Midnight Blue */}
                      <div className="mb-2">
                        <span className="text-[11px] tracking-[0.14em] font-semibold text-alira-midnight uppercase">
                          {card.model}
                        </span>
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-alira-onyx mb-2 line-clamp-2 leading-tight">
                        {card.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-alira-onyx/70 leading-6 mb-4 line-clamp-2">
                        {card.description}
                      </p>
                      
                      {/* Enhanced badges row - Option B: Keep minimal pills */}
                      <div className="flex gap-2">
                        {card.badges.slice(0, 1).map((badge) => (
                          <span 
                            key={badge}
                            className="inline-flex items-center rounded-full border border-alira-gold/30 bg-white px-2.5 py-1 text-[12px] text-alira-onyx/80"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
          
          {/* CTA Button */}
          <div className="mt-12 text-center">
            <Link
              href="#how-it-works"
              className="inline-flex items-center rounded-full bg-alira-onyx text-white px-5 py-2.5 text-sm font-medium border border-transparent hover:border-alira-gold hover:shadow-lg hover:shadow-black/10 transition-all duration-200"
            >
              See How It Works
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
