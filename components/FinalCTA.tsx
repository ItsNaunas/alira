import Reveal from './Reveal'
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="py-24 bg-alira-onyx">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="space-y-12">
              <div className="relative">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Every enquiry is the start of clarity.
                </h2>
                <div className="w-20 h-px bg-alira-gold mx-auto"></div>
              </div>
              
              <Link 
                href="/contact" 
                className="inline-flex items-center justify-center px-12 py-4 text-lg font-semibold text-alira-gold border-2 border-alira-gold rounded-full hover:bg-alira-gold hover:text-alira-onyx focus:outline-none focus:ring-2 focus:ring-alira-gold focus:ring-offset-2 focus:ring-offset-alira-onyx transition-all duration-300 active:scale-95"
              >
                Start Your Business Case
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
