import Reveal from './Reveal'

const proofPoints = [
  {
    transformation: "Overloaded priorities → Strategic reset → Clear roadmap in 10 days",
    context: "Manufacturing leader, 150 employees"
  },
  {
    transformation: "Scattered growth efforts → Unified blueprint → 40% revenue increase in 6 months", 
    context: "Tech startup, Series A"
  },
  {
    transformation: "Manual processes → AI integration → 60% efficiency gain, zero job losses",
    context: "Professional services firm"
  }
]

export default function ProofOfClarity() {
  return (
    <section className="w-full py-24 px-4 bg-alira-porcelain">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-alira-onyx font-serif leading-tight mb-6">
              Proof of Clarity
            </h2>
            <div className="w-16 h-px bg-alira-gold mx-auto"></div>
          </div>
        </Reveal>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {proofPoints.map((proof, index) => (
            <Reveal key={index} delay={index * 150}>
              <div className="bg-white p-8 border border-alira-onyx/10 space-y-4 hover:border-alira-gold/30 transition-colors duration-200">
                <p className="text-base text-alira-onyx leading-relaxed font-medium">
                  {proof.transformation}
                </p>
                <p className="text-sm text-alira-onyx/60">
                  {proof.context}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
