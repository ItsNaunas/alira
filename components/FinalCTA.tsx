import Reveal from './Reveal'
import { Button } from './ui/button'
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="w-full py-24 px-4 bg-white">
      <div className="max-w-2xl mx-auto text-center">
        <Reveal>
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx font-serif leading-tight">
              Every enquiry is the start of clarity.
            </h2>
            <Button 
              asChild 
              size="lg"
              className="bg-alira-onyx text-alira-porcelain px-12 py-4 text-lg font-medium hover:bg-alira-onyx/90 transition-colors duration-200 border-2 border-alira-onyx hover:border-alira-onyx/90"
            >
              <Link href="/contact">
                Start Your Business Case
              </Link>
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
