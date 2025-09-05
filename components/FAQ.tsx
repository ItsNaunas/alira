'use client'

import { useState } from 'react'
import Reveal from './Reveal'
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      q: "What exactly do I receive?",
      a: "A complete, board-ready PDF with problem statement, objectives, solution, and next steps — generated in minutes."
    },
    {
      q: "How fast is it?",
      a: "Once you submit the form, you'll receive your full, board-ready business case in just minutes."
    },
    {
      q: "What if I don't like it?",
      a: "No risk, no credit card. Because it's delivered in minutes, there's no wasted time — you can walk away."
    },
    {
      q: "Is my info secure?",
      a: "Yes. It's processed instantly and privately, GDPR-compliant."
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-24 bg-alira-porcelain/40">
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx mb-6">
                Frequently Asked Questions
              </h2>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              <p className="text-xl text-alira-onyx/70 max-w-2xl mx-auto">
                Everything you need to know about getting your simple plan.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <Reveal key={index} delay={index * 100}>
                  <div className="bg-white rounded-2xl border border-alira-onyx/10 hover:border-alira-gold/20 transition-all duration-300 overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-alira-porcelain/20 transition-colors duration-200"
                    >
                      <h3 className="text-lg font-bold text-alira-onyx pr-4">
                        {faq.q}
                      </h3>
                      <div className="flex-shrink-0">
                        {openIndex === index ? (
                          <ChevronUp className="w-5 h-5 text-alira-gold" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-alira-onyx/60" />
                        )}
                      </div>
                    </button>
                    
                    <div 
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-6 pb-6">
                        <p className="text-alira-onyx/80 leading-relaxed">
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
