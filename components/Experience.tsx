import Reveal from './Reveal'

const experiences = [
  {
    period: "2017–2019",
    title: "Strategy Consultant",
    context: "Mid-sized businesses",
    description: "Helped streamline operations and cut costs by 20%."
  },
  {
    period: "2020–2021", 
    title: "AI & Systems Integration",
    context: "Professional services",
    description: "Designed and delivered AI frameworks for firms."
  },
  {
    period: "2022",
    title: "Senior Advisory Roles", 
    context: "Startups & enterprises",
    description: "Supported with clarity-driven growth frameworks."
  },
  {
    period: "2023–Now",
    title: "Founded ALIRA.",
    context: "Strategic consultancy",
    description: "Built the Clarity Engine to turn complexity into actionable business cases."
  }
]

export default function Experience() {
  return (
    <section className="py-24 bg-alira-porcelain/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #0B0B0B 1px, transparent 1px),
                           linear-gradient(to bottom, #0B0B0B 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Section Header */}
        <Reveal>
          <div className="text-center mb-20">
            <div className="text-sm tracking-wide uppercase text-alira-gold mb-4 font-medium">
              OUR EXPERIENCE
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx mb-6">
              Built from Experience
            </h2>
            <div className="w-16 h-px bg-alira-gold mx-auto"></div>
          </div>
        </Reveal>

        {/* Premium Timeline */}
        <div className="relative">
          {/* Center line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-alira-gold/30 transform -translate-x-1/2"></div>
          
          <div className="space-y-16 lg:space-y-20">
            {experiences.map((experience, index) => (
              <Reveal key={index} delay={index * 150}>
                <div className={`relative flex items-center ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}>
                  
                  {/* Timeline dot */}
                  <div className={`absolute lg:static lg:flex-shrink-0 left-8 lg:left-1/2 lg:-ml-3 top-4 lg:top-0 w-4 h-4 bg-alira-gold rounded-full border-4 border-white shadow-lg z-10`}></div>
                  
                  {/* Content */}
                  <div className={`lg:w-5/12 ${index % 2 === 0 ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:text-left'} ml-16 lg:ml-0`}>
                    <div className="text-sm font-medium text-alira-gold mb-3 tracking-wide">
                      {experience.period}
                    </div>
                    <h3 className="text-xl font-bold text-alira-onyx mb-2">
                      {experience.title}
                    </h3>
                    <div className="text-base font-medium text-alira-onyx/80 italic mb-3">
                      {experience.context}
                    </div>
                    <p className="text-alira-onyx/70 leading-relaxed">
                      {experience.description}
                    </p>
                  </div>
                  
                  {/* Mobile/Tablet connecting line */}
                  <div className="lg:hidden absolute left-11 top-8 bottom-0 w-px bg-alira-gold/20"></div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
