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
    <section className="section bg-alira-porcelain">
      <div className="container">
        <Reveal>
          <div className="text-center mb-16">
            <div className="heading-eyebrow">Our Services</div>
            <h2 className="h2 mb-6">Signature Engagements</h2>
            <div className="w-16 h-px bg-alira-gold mx-auto"></div>
          </div>
        </Reveal>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {engagements.map((engagement, index) => (
            <Reveal key={index} delay={index * 100}>
              <div className="card">
                <h3 className="h3 mb-4">
                  {engagement.title}
                </h3>
                <p className="copy">
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
