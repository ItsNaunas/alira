'use client'

import { useEffect, useState } from 'react'
import Reveal from './Reveal'

export default function ProvenOutcomes() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true)
          setHasAnimated(true)
        }
      },
      { threshold: 0.3 }
    )

    const element = document.getElementById('proven-outcomes')
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [hasAnimated])

  const stats = [
    { value: 21, label: 'saved annually', prefix: '£', suffix: 'k' },
    { value: 25, label: 'sign-ups ↑', suffix: '%' },
    { value: 1000, label: 'staff trained', suffix: '+' },
    { value: 200, label: 'attendees per event', suffix: '+' }
  ]

  const testimonials = [
    {
      quote: "Creativity to solve problems and deliver results.",
      author: "Auzewell Chitewe"
    },
    {
      quote: "Transformed our approach to business planning.",
      author: "Naufal Nassor"
    }
  ]

  return (
    <section 
      id="proven-outcomes"
      className="py-20 bg-white border-t border-alira-gold/20"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-sm tracking-wide uppercase text-alira-onyx/60 mb-4 font-medium">
                Proven Outcomes
              </h2>
              <p className="text-lg text-alira-onyx/80 font-medium">
                Generated in minutes — not days.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center relative">
                  <div className="text-3xl font-bold text-alira-onyx mb-2">
                    {isVisible ? (
                      <span className="inline-block">
                        {stat.prefix || ''}{stat.value}{stat.suffix}
                      </span>
                    ) : (
                      <span className="inline-block">0{stat.suffix}</span>
                    )}
                  </div>
                  <div className="text-sm text-alira-onyx/60">
                    {stat.label}
                  </div>
                  {/* Vertical divider (desktop only) */}
                  {index < stats.length - 1 && (
                    <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-alira-onyx/10"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Helper line */}
            <div className="text-center mb-12">
              <p className="text-sm text-alira-onyx/50">
                Built from just 10 minutes of your input.
              </p>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="border border-alira-onyx/10 rounded-lg p-6">
                  <p className="text-alira-onyx/80 italic mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-sm text-alira-onyx/60">
                    — {testimonial.author}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
