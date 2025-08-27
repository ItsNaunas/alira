import Reveal from './Reveal'

const engagements = [
  {
    eyebrow: "RESET",
    title: "Business Reset",
    description: "Transform operational chaos into systematic clarity within 30 days."
  },
  {
    eyebrow: "STRATEGY",
    title: "Growth Blueprint", 
    description: "Design scalable frameworks that turn ambition into executable strategy."
  },
  {
    eyebrow: "AI",
    title: "AI Advantage",
    description: "Integrate intelligence systems that amplify human decision-making."
  },
  {
    eyebrow: "PARTNERSHIP",
    title: "Strategic Partner",
    description: "Ongoing clarity counsel for leaders navigating complex transitions."
  }
]

export default function HomeServices() {
  return (
    <section className="py-24 bg-alira-porcelain/40">
      <div className="container mx-auto px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-alira-gold text-sm tracking-wide uppercase mb-4 font-medium">
              Our Services
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx mb-6">
              Signature Engagements
            </h2>
            <div className="w-16 h-px bg-alira-gold mx-auto"></div>
          </div>
        </Reveal>
        
        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {engagements.map((engagement, index) => (
            <Reveal key={index} delay={index * 150}>
              <div className="p-8 border border-alira-onyx/10 rounded-lg hover:border-alira-gold hover:-translate-y-1 transition-all duration-300 ease-out">
                <span className="block text-alira-gold text-xs tracking-wide uppercase mb-2 font-medium">
                  {engagement.eyebrow}
                </span>
                <h3 className="text-xl font-semibold text-alira-onyx mb-3">
                  {engagement.title}
                </h3>
                <p className="text-alira-onyx/70 leading-relaxed">
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
