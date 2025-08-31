import Reveal from './Reveal'

export default function MiniCaseStudy() {
  return (
    <section className="py-16 bg-alira-onyx/5">
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-alira-onyx/10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-alira-onyx mb-4">
                  Case Study: NHS Training Transformation
                </h2>
                <p className="text-alira-onyx/70">
                  How we helped solve a critical business challenge
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="font-semibold text-alira-onyx mb-2">Challenge</h3>
                  <p className="text-sm text-alira-onyx/70">
                    NHS training sign-ups stagnating
                  </p>
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-alira-onyx mb-2">Solution</h3>
                  <p className="text-sm text-alira-onyx/70">
                    Workflow redesign
                  </p>
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold text-alira-onyx mb-2">Outcome</h3>
                  <p className="text-sm text-alira-onyx/70">
                    +25% sign-ups, £10k savings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
