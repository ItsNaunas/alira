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

// Choose layout variation: 'grid' or 'zigzag'
const LAYOUT_VARIATION: 'grid' | 'zigzag' = 'zigzag'

export default function OurPhilosophy() {
  return (
    <section 
      className="py-24 bg-alira-porcelain relative overflow-hidden"
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
          <div className="text-center mb-20">
            <div className="heading-eyebrow tracking-wider">OUR APPROACH</div>
            <h2 id="philosophy-heading" className="h2 mb-8">Our Philosophy</h2>
            <div className="w-16 h-px bg-alira-gold mx-auto mb-12"></div>
            
            {/* Quote */}
            <blockquote className="text-xl text-alira-ink/80 italic font-light max-w-3xl mx-auto leading-relaxed">
              "Simple systems outlast complicated ones."
            </blockquote>
          </div>
        </Reveal>

        {LAYOUT_VARIATION === 'grid' ? (
          <VariationAGrid />
        ) : (
          <VariationBZigZag />
        )}
      </div>
    </section>
  )
}

// Variation A: 2x2 Grid
function VariationAGrid() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {principles.map((principle, index) => (
          <Reveal key={index} delay={index * 150}>
            <div className="group">
              <h3 className="h3 mb-3 relative">
                {principle.title}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-alira-gold transition-all duration-300 group-hover:w-full"></div>
              </h3>
              <p className="text-alira-ink/70 leading-relaxed">
                {principle.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

// Variation B: Zig-Zag Stagger
function VariationBZigZag() {
  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Subtle central anchor line */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-alira-onyx/5 transform -translate-x-1/2" />
      
      <div className="space-y-12">
        {principles.map((principle, index) => (
          <Reveal 
            key={index} 
            delay={index * 200}
            className={`${index % 2 === 0 ? 'md:mr-12' : 'md:ml-12'}`}
          >
            <div className={`group ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
              <h3 className="h3 mb-3 relative">
                {principle.title}
                <div className={`absolute bottom-0 h-0.5 bg-alira-gold transition-all duration-300 group-hover:w-full ${
                  index % 2 === 0 ? 'left-0 w-0' : 'right-0 w-0'
                }`}></div>
              </h3>
              <p className="text-alira-ink/70 leading-relaxed">
                {principle.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
