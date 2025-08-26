import Reveal from './Reveal'

const principles = [
  {
    title: "Clarity over clutter",
    description: "Every decision removes complexity, not adds it."
  },
  {
    title: "Discipline over distraction", 
    description: "Focus creates momentum where scattered effort fails."
  },
  {
    title: "Elegance over noise",
    description: "Simple systems outlast complicated solutions."
  },
  {
    title: "Systems that last",
    description: "Built once, refined continuously, trusted completely."
  }
]

export default function OurPhilosophy() {
  return (
    <section className="section bg-white">
      <div className="container">
        <Reveal>
          <div className="text-center mb-16">
            <div className="heading-eyebrow">Our Approach</div>
            <h2 className="h2 mb-6">Our Philosophy</h2>
            <div className="rule"></div>
          </div>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {principles.map((principle, index) => (
            <Reveal key={index} delay={index * 100}>
              <div className="space-y-4">
                <h3 className="h3">
                  {principle.title}
                </h3>
                <p className="copy">
                  {principle.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
