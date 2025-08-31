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
            {/* Testimonials */}
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-alira-onyx mb-8">
                What Our Clients Say
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-alira-onyx/5 rounded-lg p-8 border border-alira-onyx/10">
                  <p className="text-alira-onyx/80 italic mb-6 leading-relaxed text-lg">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-alira-gold/20 rounded-full flex items-center justify-center mr-3">
                      <span className="text-alira-gold font-semibold text-sm">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-alira-onyx">{testimonial.author}</p>
                      <p className="text-sm text-alira-onyx/60">Client</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
