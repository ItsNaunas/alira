import Reveal from './Reveal'

const experiences = [
  {
    period: "2017–2019",
    title: "Strategy Consultant",
    description: "Helped mid-sized businesses streamline operations and cut costs by 20%."
  },
  {
    period: "2020–2021", 
    title: "AI & Systems Integration",
    description: "Designed and delivered AI frameworks for professional services firms."
  },
  {
    period: "2022",
    title: "Senior Advisory Roles", 
    description: "Supported startups and enterprises with clarity-driven growth frameworks."
  },
  {
    period: "2023–Now",
    title: "Founded ALIRA.",
    description: "Built the Clarity Engine to turn complexity into actionable business cases."
  }
]

export default function Experience() {
  return (
    <section className="py-24 bg-alira-porcelain/30">
      <div className="max-w-5xl mx-auto px-4">
        {/* Section Header */}
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-sm tracking-wide uppercase text-alira-onyx/60 mb-4 font-medium">
              OUR EXPERIENCE
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx mb-6">
              Built from Experience
            </h2>
            <div className="w-16 h-px bg-alira-gold mx-auto"></div>
          </div>
        </Reveal>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-px bg-alira-onyx/10"></div>
          
          <div className="space-y-12">
            {experiences.map((experience, index) => (
              <Reveal key={index} delay={index * 200}>
                <div className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-2 w-3 h-3 bg-alira-gold rounded-full -ml-1.5"></div>
                  
                  {/* Content */}
                  <div className="ml-16">
                    <div className="text-sm font-medium text-alira-gold mb-2">
                      {experience.period}
                    </div>
                    <h3 className="text-lg font-semibold text-alira-onyx mb-3">
                      {experience.title}
                    </h3>
                    <p className="text-body text-alira-onyx/70 leading-relaxed">
                      {experience.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
