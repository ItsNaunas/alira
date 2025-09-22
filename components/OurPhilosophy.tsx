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
    <section 
      className="py-24 bg-alira-porcelain dark:bg-alira-onyx relative overflow-hidden"
      aria-labelledby="philosophy-heading"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #0B0B0B 1px, transparent 1px),
                           linear-gradient(to bottom, #0B0B0B 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-sm tracking-wide uppercase text-alira-onyx/60 dark:text-alira-porcelain/60 mb-4 font-medium">
              OUR APPROACH
            </div>
            <div className="group inline-block">
              <h2 id="philosophy-heading" className="text-4xl md:text-5xl font-bold text-alira-onyx dark:text-alira-porcelain mb-8 relative">
                Our Philosophy
                <div className="absolute bottom-0 left-0 w-0 h-1 bg-alira-gold transition-all duration-500 ease-out group-hover:w-full"></div>
              </h2>
            </div>
            <div className="w-16 h-px bg-alira-gold mx-auto mb-12"></div>
          </div>
        </Reveal>

        {/* Premium Pull Quote */}
        <Reveal delay={150}>
          <div className="text-center mb-20">
            <blockquote className="text-3xl md:text-4xl text-alira-onyx dark:text-alira-porcelain font-serif italic font-light max-w-4xl mx-auto leading-tight">
              "Simple systems outlast complicated ones."
            </blockquote>
          </div>
        </Reveal>

        {/* 2x2 Grid of Principles */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {principles.map((principle, index) => (
              <Reveal key={index} delay={index * 100}>
                <div className="relative group">
                  {/* Gold divider line */}
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-alira-gold/30 transition-colors duration-300 group-hover:bg-alira-gold/60"></div>
                  
                  <div className="pl-6 py-4">
                    <h3 className="text-xl font-bold text-alira-onyx dark:text-alira-porcelain mb-3 relative">
                      {principle.title}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-alira-gold transition-all duration-300 ease-out group-hover:w-full"></div>
                    </h3>
                    <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 leading-relaxed text-base group-hover:text-alira-onyx/90 dark:group-hover:text-alira-porcelain/90 transition-colors duration-300">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        
        {/* Speed Connection */}
        <Reveal delay={500}>
          <div className="text-center mt-16">
            <p className="text-lg text-alira-onyx/80 dark:text-alira-porcelain/80 font-medium">
              That's why every business case we deliver arrives in minutes, not days — clarity without delay.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
