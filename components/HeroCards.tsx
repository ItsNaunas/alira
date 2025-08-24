import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import Link from 'next/link'
import Image from 'next/image'

const cards = [
  {
    title: 'Problem Statement',
    description: 'The situation, reframed with precision.',
    model: 'ANALYSIS',
    href: '#problem',
    image: '/images/cards/problem-statement.jpg',
    badges: ['Structure', 'Context'],
  },
  {
    title: 'Objectives',
    description: 'What success looks like, near and next.',
    model: 'FRAMEWORK',
    href: '#objectives',
    image: '/images/cards/objectives.jpg',
    badges: ['Goals', 'Metrics'],
  },
  {
    title: 'Proposed Solution',
    description: 'Mapped to ALIRA. services and scope.',
    model: 'STRATEGY',
    href: '#solution',
    image: '/images/cards/proposed-solution.jpg',
    badges: ['Strategy', 'Scope'],
  },
  {
    title: 'Next Steps',
    description: 'Decisions, timelines, and the first move.',
    model: 'ROADMAP',
    href: '#next-steps',
    image: '/images/cards/next-steps.jpg',
    badges: ['Timeline', 'Actions'],
  },
]

export default function HeroCards() {
  return (
    <div className="text-center">
      {/* Subheading Section */}
      <div className="mb-8 lg:mb-12">
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
        <div className="flex lg:grid lg:grid-cols-4 gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory scrollbar-hide pb-4 lg:pb-0">
          {cards.map((card, index) => (
            <Link 
              key={card.title}
              href={card.href} 
              className="flex-shrink-0 w-80 lg:w-auto snap-start group focus:outline-none focus-visible:ring-2 focus-visible:ring-alira-midnight focus-visible:ring-offset-2 focus-visible:ring-offset-alira-porcelain rounded-2xl"
              aria-label={`Learn more about ${card.title}`}
            >
              <div className="h-full bg-alira-porcelain rounded-2xl border border-alira-onyx/8 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-alira-card-elevated focus-within:shadow-alira-card-elevated shadow-alira-card group">
                {/* Top hover accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-alira-gold/0 to-transparent group-hover:via-alira-gold/40 transition-all duration-300"></div>
                
                {/* Image block - 16:9 aspect ratio */}
                <div className="relative w-full aspect-video overflow-hidden bg-alira-onyx/5">
                  <Image 
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{
                      filter: 'saturate(0.85) contrast(0.98)'
                    }}
                  />
                  {/* Brand tint overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-alira-gold/6 to-alira-midnight/4"></div>
                  {/* Vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent"></div>
                </div>
                
                {/* Card body */}
                <div className="p-6">
                  {/* Model label */}
                  <div className="mb-1">
                    <span className="text-xs text-alira-onyx/60 font-medium tracking-widest uppercase">
                      {card.model}
                    </span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-lg md:text-xl font-bold text-alira-onyx mb-1.5 line-clamp-2 leading-tight">
                    {card.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-alira-onyx/70 leading-relaxed mb-3 line-clamp-2">
                    {card.description}
                  </p>
                  
                  {/* Badges row */}
                  <div className="flex gap-2">
                    {card.badges.map((badge) => (
                      <span 
                        key={badge}
                        className="px-2 py-1 text-xs font-medium bg-alira-gold/10 text-alira-gold/90 rounded-md border border-alira-gold/30"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Pagination dots for mobile */}
        <div className="flex justify-center mt-6 space-x-2 lg:hidden">
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
  )
}
