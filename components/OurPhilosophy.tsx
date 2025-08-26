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
    <section className="w-full py-24 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-alira-onyx font-serif leading-tight mb-6">
              Our Philosophy
            </h2>
            <div className="w-16 h-px bg-alira-gold mx-auto"></div>
          </div>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {principles.map((principle, index) => (
            <Reveal key={index} delay={index * 100}>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-alira-onyx font-serif leading-tight">
                  {principle.title}
                </h3>
                <p className="text-base text-alira-onyx/70 leading-relaxed">
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
