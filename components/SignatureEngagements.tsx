import Reveal from './Reveal'

const engagements = [
  {
    title: "Business Reset",
    description: "Transform operational chaos into systematic clarity within 30 days."
  },
  {
    title: "Growth Blueprint",
    description: "Design scalable frameworks that turn ambition into executable strategy."
  },
  {
    title: "AI Advantage", 
    description: "Integrate intelligence systems that amplify human decision-making."
  },
  {
    title: "Strategic Partner",
    description: "Ongoing clarity counsel for leaders navigating complex transitions."
  }
]

export default function SignatureEngagements() {
  return (
    <section className="w-full py-24 px-4 bg-alira-porcelain">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-alira-onyx font-serif leading-tight mb-6">
              Signature Engagements
            </h2>
            <div className="w-16 h-px bg-alira-gold mx-auto"></div>
          </div>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {engagements.map((engagement, index) => (
            <Reveal key={index} delay={index * 100}>
              <div className="bg-white p-8 space-y-4 border border-alira-onyx/10 hover:border-alira-gold/30 transition-colors duration-200">
                <h3 className="text-lg font-semibold text-alira-onyx font-serif leading-tight">
                  {engagement.title}
                </h3>
                <p className="text-sm text-alira-onyx/70 leading-relaxed">
                  {engagement.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
