import Reveal from './Reveal'
import { Button } from './ui/button'
import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <Reveal>
            <div className="space-y-8">
              <h2 className="h2">
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
      </div>
    </section>
  )
}
