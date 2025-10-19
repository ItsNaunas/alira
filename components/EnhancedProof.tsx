import Reveal from './Reveal'

export default function EnhancedProof() {
  const outcomes = [
    { metric: '£21k', label: 'saved annually — from changes identified instantly' },
    { metric: '25%', label: 'sign-ups ↑ — clarity delivered in minutes' },
    { metric: '1,000+', label: 'staff trained' },
    { metric: '200+', label: 'attendees per event' }
  ]

  const testimonials = [
    {
      quote: "Creativity to solve problems and deliver results — fast.",
      author: "Auzewell Chitewe"
    },
    {
      quote: "Transformed our approach to business planning.",
      author: "Naufal Nassor"
    }
  ]



    return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-6xl mx-auto">
            {/* Logo Strip */}
            <div className="text-center">
              <p className="text-sm text-alira-primary/50 mb-4">Trusted by</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <span className="text-sm font-sans font-light text-alira-primary/70">NHS</span>
                <span className="text-sm font-sans font-light text-alira-primary/70">ELFT</span>
                <span className="text-sm font-sans font-light text-alira-primary/70">HMPPS</span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
