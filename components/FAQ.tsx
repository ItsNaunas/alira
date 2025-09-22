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
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 bg-alira-porcelain/40 dark:bg-alira-onyx/40">
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
                Frequently Asked Questions
              </h2>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              <p className="text-xl text-alira-onyx/70 dark:text-alira-porcelain/70 max-w-2xl mx-auto">
                Everything you need to know about getting your simple plan.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Reveal key={index} delay={index * 100}>
                  <div className="bg-white dark:bg-alira-onyx/20 rounded-2xl border border-alira-onyx/10 dark:border-alira-porcelain/10 hover:border-alira-gold/20 transition-all duration-300 overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-alira-porcelain/20 dark:hover:bg-alira-onyx/20 transition-colors duration-200"
                    >
                      <h3 className="text-lg font-bold text-alira-onyx dark:text-alira-porcelain pr-4">
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
                        openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-6">
                        <p className="text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed">
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
