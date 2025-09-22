'use client'

import { useEffect, useState } from 'react'
import Reveal from './Reveal'

export default function ProvenOutcomes() {
  const [hasAnimated, setHasAnimated] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [displayValues, setDisplayValues] = useState([0, 0, 0, 0])

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true)
          setHasAnimated(true)
          
          if (prefersReducedMotion) {
            // Show final values immediately for accessibility
            setDisplayValues([21, 25, 1000, 200])
          } else {
            // Animate count-up
            animateCountUp()
          }
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

  const animateCountUp = () => {
    const finalValues = [21, 25, 1000, 200]
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      
      const progress = currentStep / steps
      const newValues = finalValues.map(finalValue => 
        Math.floor(finalValue * progress)
      )
      
      setDisplayValues(newValues)
      
      if (currentStep >= steps) {
        clearInterval(interval)
        setDisplayValues(finalValues)
      }
    }, stepDuration)
  }

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
      className="py-20 bg-white dark:bg-alira-onyx/20 border-t border-alira-gold/20"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-6xl mx-auto">
                         {/* Header */}
             <div className="text-center mb-16">
               <h2 className="text-sm tracking-wide uppercase text-alira-gold mb-4 font-medium">
                 Proven Outcomes
               </h2>
               <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-alira-onyx dark:text-alira-porcelain leading-tight mb-6">
                 Generated in minutes — not days.
               </h3>
             </div>

                         {/* Stats Grid */}
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
               {stats.map((stat, index) => (
                 <div key={index} className="text-center relative">
                   <div className="text-3xl font-bold text-alira-gold mb-2">
                     <span className="inline-block">
                       {stat.prefix || ''}{displayValues[index]}{stat.suffix}
                     </span>
                   </div>
                   <div className="text-sm text-alira-onyx/60 dark:text-alira-porcelain/60">
                     {stat.label}
                   </div>
                   {/* Vertical divider (desktop only) */}
                   {index < stats.length - 1 && (
                     <div className="hidden md:block absolute right-0 top-1/2 transform -translate-y-1/2 w-px h-8 bg-alira-gold/30"></div>
                   )}
                 </div>
               ))}
             </div>

                         {/* Divider Tagline */}
             <div className="text-center mb-16">
               <div className="w-16 h-px bg-alira-gold/30 mx-auto mb-4"></div>
                               <p className="text-sm tracking-wide uppercase text-alira-onyx dark:text-alira-porcelain font-medium">
                  All from just 10 minutes of your input.
                </p>
               <div className="w-16 h-px bg-alira-gold/30 mx-auto mt-4"></div>
             </div>

             {/* Testimonials */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {testimonials.map((testimonial, index) => (
                 <div key={index} className="bg-white dark:bg-alira-onyx/30 rounded-lg p-8 shadow-sm border border-alira-onyx/5 dark:border-alira-porcelain/10 relative group hover:shadow-md transition-shadow duration-300">
                   {/* Gold accent bar */}
                   <div className="absolute top-0 left-0 right-0 h-1 bg-alira-gold/20 rounded-t-lg"></div>
                   
                   {/* Quote */}
                   <p className="text-alira-onyx/80 dark:text-alira-porcelain/80 italic mb-6 leading-relaxed text-lg">
                     "{testimonial.quote}"
                   </p>
                   
                   {/* Author with avatar */}
                   <div className="flex items-center">
                     <div className="w-10 h-10 bg-alira-gold/10 rounded-full flex items-center justify-center mr-3">
                       <span className="text-alira-gold font-semibold text-sm">
                         {testimonial.author.split(' ').map(n => n[0]).join('')}
                       </span>
                     </div>
                     <div>
                       <p className="font-semibold text-alira-onyx dark:text-alira-porcelain">
                         {testimonial.author}
                       </p>
                       <p className="text-sm text-alira-onyx/60 dark:text-alira-porcelain/60">Client</p>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
