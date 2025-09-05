import Reveal from '@/components/Reveal'
import CTAButton from '@/components/CTAButton'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-alira-porcelain/30 via-white to-alira-porcelain/20">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <div className="text-alira-gold text-sm tracking-wide uppercase mb-4 font-medium">
                About Us
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-alira-onyx mb-8">
                Our Story
              </h1>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              <p className="text-xl text-alira-onyx/80 leading-relaxed mb-8">
                ALIRA was created to give people clarity when starting or growing something. 
                It began with one person's vision and has grown into a team that brings strategy, 
                marketing, and systems together.
              </p>
              <p className="text-lg text-alira-onyx/70 leading-relaxed">
                We started just like you — full of ambition, but not always sure where to turn. 
                That frustration shaped ALIRA. Now we help others cut through the noise and move 
                forward with confidence.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx mb-6">
                Meet the Team
              </h2>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              <p className="text-xl text-alira-onyx/70 max-w-2xl mx-auto">
                Three specialists working together to deliver clarity, reach, and systems that work.
              </p>
            </div>
          </Reveal>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* The Strategist */}
              <Reveal delay={200}>
                <div className="bg-white p-8 rounded-xl border border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg transition-all duration-300 text-center">
                  <div className="w-20 h-20 bg-alira-gold/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <div className="w-12 h-12 bg-alira-gold/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-alira-onyx mb-4">The Strategist</h3>
                  <p className="text-alira-onyx/80 leading-relaxed">
                    Sees the bigger picture, shapes the path, and turns ideas into steps you can act on.
                  </p>
                </div>
              </Reveal>

              {/* The Marketing Lead */}
              <Reveal delay={300}>
                <div className="bg-white p-8 rounded-xl border border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg transition-all duration-300 text-center">
                  <div className="w-20 h-20 bg-alira-gold/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <div className="w-12 h-12 bg-alira-gold/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📢</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-alira-onyx mb-4">The Marketing Lead</h3>
                  <p className="text-alira-onyx/80 leading-relaxed">
                    Knows how to make brands impossible to ignore and how to reach the right people.
                  </p>
                </div>
              </Reveal>

              {/* The Systems Engineer */}
              <Reveal delay={400}>
                <div className="bg-white p-8 rounded-xl border border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg transition-all duration-300 text-center">
                  <div className="w-20 h-20 bg-alira-gold/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <div className="w-12 h-12 bg-alira-gold/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">⚙️</span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-alira-onyx mb-4">The Systems Engineer</h3>
                  <p className="text-alira-onyx/80 leading-relaxed">
                    Builds the tools and processes that free time, reduce chaos, and unlock growth.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Our Principles Section */}
      <section className="py-24 bg-alira-porcelain/40">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx mb-6">
                Our Principles
              </h2>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
              <p className="text-xl text-alira-onyx/70 max-w-2xl mx-auto">
                The core beliefs that guide everything we do and every solution we create.
              </p>
            </div>
          </Reveal>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Clarity over complexity */}
              <Reveal delay={200}>
                <div className="bg-white p-8 rounded-xl border border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-alira-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">✨</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-alira-onyx mb-3">Clarity over complexity</h3>
                      <p className="text-alira-onyx/80 leading-relaxed">
                        Simple wins over complicated every time.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Small tests beat big theories */}
              <Reveal delay={300}>
                <div className="bg-white p-8 rounded-xl border border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-alira-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🧪</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-alira-onyx mb-3">Small tests beat big theories</h3>
                      <p className="text-alira-onyx/80 leading-relaxed">
                        Progress is proven in action, not speculation.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Focus creates movement */}
              <Reveal delay={400}>
                <div className="bg-white p-8 rounded-xl border border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-alira-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-alira-onyx mb-3">Focus creates movement</h3>
                      <p className="text-alira-onyx/80 leading-relaxed">
                        Clear priorities are what drive results.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Systems should serve you */}
              <Reveal delay={500}>
                <div className="bg-white p-8 rounded-xl border border-alira-onyx/10 hover:border-alira-gold/20 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-alira-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">⚙️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-alira-onyx mb-3">Systems should serve you</h3>
                      <p className="text-alira-onyx/80 leading-relaxed">
                        Work smarter, not heavier.
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-alira-onyx to-alira-onyx/90">
        <div className="container mx-auto px-6 lg:px-8">
          <Reveal>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to work with us?
              </h2>
              <p className="text-xl text-white/80 mb-8 leading-relaxed">
                Let's turn your ambition into clear action. Start with a simple plan and build from there.
              </p>
              <CTAButton 
                href="/contact" 
                variant="alira"
                className="px-8 py-4 text-lg font-medium"
              >
                Get Started Today
              </CTAButton>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
