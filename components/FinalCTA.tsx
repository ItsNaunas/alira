import Reveal from './Reveal'
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
              <Link href="/contact" className="btn-primary">
                Start Your Business Case
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
