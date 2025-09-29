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
    <section className="py-16 md:py-24 bg-gradient-to-br from-alira-light-gold/15 via-alira-gold/8 to-alira-light-gold/15 dark:from-alira-onyx/90 dark:via-alira-onyx dark:to-alira-onyx/90 relative overflow-hidden">
      {/* Enhanced pattern overlay */}
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
                Frequently Asked Questions
              </h2>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              <p className="text-xl text-alira-onyx/80 dark:text-alira-porcelain/80 max-w-2xl mx-auto font-serif italic font-light">
                Everything you need to know about our services and how we can help you grow.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Reveal key={index} delay={index * 100}>
                  <div className="bg-white dark:bg-alira-onyx/80 rounded-2xl border border-alira-onyx/10 dark:border-alira-porcelain/10 hover:border-alira-gold/20 transition-all duration-300 overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-alira-porcelain/20 dark:hover:bg-alira-onyx/60 transition-colors duration-200"
                    >
                      <h3 className="text-lg font-serif font-semibold text-alira-onyx dark:text-alira-porcelain pr-4 text-left">
                        {faq.q}
                      </h3>
                      <div className="flex-shrink-0">
                        {openIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-alira-gold" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-alira-onyx/60 dark:text-alira-porcelain/60" />
                        )}
                      </div>
                    </button>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-6">
                <p className="text-alira-onyx/90 dark:text-alira-porcelain/90 leading-relaxed text-base text-left font-sans">
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
