'use client'

import { useState } from 'react'
import Reveal from './Reveal'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: "How fast can I start?",
      a: "Most sessions can begin within a few days."
    },
    {
      q: "How does pricing work?",
      a: "Each service has a starting price. The final cost depends on the scope of work. You will always know the price before we begin."
    },
    {
      q: "Do I need to prepare anything?",
      a: "No heavy prep. Just be ready to share where you are stuck or what you want to achieve."
    },
    {
      q: "Is this only for new ideas?",
      a: "No. It works whether you are starting, building, or already running something."
    },
    {
      q: "What's included in your services?",
      a: "Our Content & Growth service includes strategy, campaigns, copywriting, and distribution systems. Our Systems & Automation service covers process automation, dashboards, tool integration, and operational efficiency improvements."
    },
    {
      q: "Do you work with established businesses?",
      a: "Absolutely. Whether you're a startup or an established business looking to optimise your operations, our services are designed to scale with your needs."
    },
    {
      q: "How do you ensure quality?",
      a: "We focus on measurable outcomes and clear deliverables. Every project includes regular check-ins, progress tracking, and final documentation to ensure you get maximum value."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 md:py-24 bg-bg-section relative overflow-hidden">
      {/* Enhanced pattern overlay */}
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-normal text-text-primary mb-6">
                Frequently Asked Questions
              </h2>
              <div className="w-16 h-px bg-accent mx-auto mb-8"></div>
              <p className="text-xl text-text-secondary max-w-2xl mx-auto font-serif italic font-light">
                Everything you need to know about our services and how we can help you grow.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Reveal key={index} delay={index * 100}>
                  <div className="bg-surface rounded-2xl border border-borderToken-subtle hover:border-borderToken-strong shadow-token-sm transition-all duration-300 overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-bg-muted transition-colors duration-200 min-h-[44px] touch-target"
                      aria-expanded={openIndex === index}
                      aria-controls={`faq-answer-${index}`}
                    >
                      <h3 id={`faq-question-${index}`} className="text-base sm:text-lg font-serif font-normal text-text-primary pr-4 text-left">
                        {faq.q}
                      </h3>
                      <div className="flex-shrink-0 min-w-[44px] min-h-[44px] flex items-center justify-center">
                        {openIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-accent" aria-hidden="true" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-text-secondary" aria-hidden="true" />
                        )}
                      </div>
                    </button>
                    
                    <div 
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base text-left font-sans">
                  {faq.a}
                </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
