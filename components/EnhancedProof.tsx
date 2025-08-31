import Reveal from './Reveal'

export default function EnhancedProof() {
  const outcomes = [
    { metric: '£21k', label: 'saved annually' },
    { metric: '25%', label: 'sign-ups ↑' },
    { metric: '1,000+', label: 'staff trained' },
    { metric: '200+', label: 'attendees per event' }
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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-6xl mx-auto">
            {/* Outcomes Grid */}
            <div className="text-center mb-16">
              <h2 className="text-2xl font-bold text-alira-onyx mb-8">
                Proven Outcomes
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {outcomes.map((outcome, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-alira-gold mb-2">
                      {outcome.metric}
                    </div>
                    <div className="text-sm text-alira-onyx/70">
                      {outcome.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-alira-onyx/5 rounded-lg p-6">
                  <p className="text-alira-onyx/80 italic mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-sm text-alira-onyx/60">
                    — {testimonial.author}
                  </p>
                </div>
              ))}
            </div>


          </div>
        </Reveal>
      </div>
    </section>
  )
}
