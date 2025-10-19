import Reveal from './Reveal'

export default function SelectedOutcomes() {
  const outcomes = [
    { metric: '£21k', label: 'annual savings secured' },
    { metric: '£11k', label: 'cost reduction achieved' },
    { metric: '25%', label: 'sign-up increase' },
    { metric: '1,000+', label: 'staff trained' },
    { metric: '200+', label: 'attendees per event' },
    { metric: '20+', label: 'projects managed' }
  ]

  return (
    <section className="py-16 bg-alira-primary/5">
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-serif font-normal text-alira-primary dark:text-alira-white mb-4">
                Selected Outcomes
              </h2>
              <p className="text-alira-primary/70">
                Real results from real business transformations
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {outcomes.map((outcome, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-serif font-normal text-alira-gold mb-2">
                    {outcome.metric}
                  </div>
                  <div className="text-sm text-alira-primary/70">
                    {outcome.label}
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
