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

// Choose layout variation: 'grid' or 'manifesto'
const LAYOUT_VARIATION: 'grid' | 'manifesto' = 'manifesto'

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

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <Reveal>
          <div className="text-center mb-20">
            <div className="heading-eyebrow tracking-wider">OUR APPROACH</div>
            <h2 id="philosophy-heading" className="h2 mb-6">Our Philosophy</h2>
            <div className="w-16 h-px bg-alira-gold mx-auto"></div>
          </div>
        </Reveal>

        {LAYOUT_VARIATION === 'grid' ? (
          <VariationAGrid />
        ) : (
          <VariationBManifesto />
        )}
      </div>
    </section>
  )
}

// Variation A: 2x2 Grid with Dividers
function VariationAGrid() {
  return (
    <div className="relative">
      {/* Grid container with dividers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {/* Vertical divider */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-alira-onyx/10 transform -translate-x-1/2" />
        
        {/* Horizontal divider */}
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-px bg-alira-onyx/10 transform -translate-y-1/2" />
        
        {principles.map((principle, index) => (
          <Reveal key={index} delay={index * 150}>
            <div className={`p-12 ${index % 2 === 0 ? 'md:pr-6' : 'md:pl-6'} ${index < 2 ? 'pb-6' : 'pt-6'}`}>
              <div className="group">
                <h3 className="h3 mb-4 relative">
                  {principle.title}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-alira-gold transition-all duration-300 group-hover:w-full"></div>
                </h3>
                <p className="copy">
                  {principle.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}

// Variation B: Manifesto / Editorial Style
function VariationBManifesto() {
  return (
    <div className="space-y-16">
      {/* Pull quote */}
      <Reveal>
        <div className="text-center max-w-4xl mx-auto">
          <blockquote className="text-3xl md:text-4xl font-light text-alira-onyx/90 leading-tight italic">
            "Simple systems outlast complicated ones."
          </blockquote>
        </div>
      </Reveal>

      {/* Principles with staggered alignment */}
      <div className="space-y-12">
        {principles.map((principle, index) => (
          <Reveal key={index} delay={index * 200}>
            <div className={`max-w-2xl ${index % 2 === 0 ? 'ml-0' : 'ml-auto'}`}>
              <div className="group">
                <h3 className="h3 mb-4 relative">
                  {principle.title}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-alira-gold transition-all duration-300 group-hover:w-full"></div>
                </h3>
                <p className="copy">
                  {principle.description}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
