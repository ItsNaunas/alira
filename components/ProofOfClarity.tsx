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
    <section className="section bg-alira-porcelain">
      <div className="container">
        <Reveal>
          <div className="text-center mb-16">
            <div className="heading-eyebrow">Case Studies</div>
            <h2 className="h2 mb-6">Proof of Clarity</h2>
            <div className="w-16 h-px bg-alira-gold mx-auto"></div>
          </div>
        </Reveal>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {proofPoints.map((proof, index) => (
            <Reveal key={index} delay={index * 150}>
              <div className="card">
                <p className="copy font-medium mb-4">
                  {proof.transformation}
                </p>
                <p className="text-sm text-alira-ink/60">
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
