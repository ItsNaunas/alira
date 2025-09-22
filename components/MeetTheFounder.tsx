import Reveal from './Reveal'
import Image from 'next/image'
import CTAButton from './CTAButton'

export default function MeetTheTeam() {
  return (
    <section className="py-24 bg-gradient-to-br from-alira-porcelain/20 via-white to-alira-porcelain/10 dark:from-alira-onyx/20 dark:via-alira-onyx dark:to-alira-onyx/10 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, #0B0B0B 1px, transparent 1px),
                           linear-gradient(to bottom, #0B0B0B 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
                Meet the Team
              </h2>
              <div className="w-16 h-px bg-alira-gold mx-auto mb-8"></div>
            </div>
          </Reveal>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left column - Story */}
            <Reveal delay={200}>
              <div className="space-y-8">
                {/* Opening statement */}
                <div className="space-y-6">
                  <p className="text-xl text-alira-onyx dark:text-alira-porcelain/80 leading-relaxed">
                    I started ALIRA because I know what it feels like to have ambition but no clear path.
                  </p>
                  
                  <p className="text-lg text-alira-onyx dark:text-alira-porcelain/70 leading-relaxed">
                    For years I worked in project management and operations, leading teams, fixing systems, and delivering projects that saved organisations time and money.
                  </p>
                  
                  <p className="text-lg text-alira-onyx dark:text-alira-porcelain/70 leading-relaxed">
                    What I kept seeing was the same problem — people overcomplicate. Ideas stall, businesses get stuck, and potential gets wasted.
                  </p>
                  
                  <p className="text-lg text-alira-onyx dark:text-alira-porcelain/70 leading-relaxed">
                    That's why I built ALIRA. To strip away the noise and give people what they actually need: a simple plan, clear steps, and the confidence to move forward.
                  </p>
                </div>

                {/* Credentials/Experience */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-alira-gold rounded-full"></div>
                    <span className="text-alira-onyx dark:text-alira-porcelain/80 font-medium">10+ years in project management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-alira-gold rounded-full"></div>
                    <span className="text-alira-onyx dark:text-alira-porcelain/80 font-medium">Experience leading teams across multiple industries</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-alira-gold rounded-full"></div>
                    <span className="text-alira-onyx dark:text-alira-porcelain/80 font-medium">Delivered projects that saved organisations time and money</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-4">
                  <CTAButton 
                    href="/contact" 
                    variant="alira"
                    className="px-8 py-4 text-lg font-medium"
                    location="founder-section"
                  >
                    Contact Us
                  </CTAButton>
                </div>
              </div>
            </Reveal>

            {/* Right column - Photo */}
            <Reveal delay={400}>
              <div className="space-y-8">
                {/* Founder photo with elegant styling */}
                <div className="relative">
                  <div className="w-full h-80 rounded-2xl overflow-hidden border border-alira-onyx/10 shadow-lg">
                    <Image 
                      src="/images/assets/founder.jpg" 
                      alt="ALIRA Founder - Professional headshot"
                      width={400}
                      height={320}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-alira-gold/20 rounded-full"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-alira-gold/30 rounded-full"></div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Team Members Section */}
          <div className="mt-20">
            <Reveal delay={600}>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-alira-onyx dark:text-alira-porcelain mb-4">Meet Our Specialists</h3>
                <p className="text-lg text-alira-onyx/70 dark:text-alira-porcelain/70 max-w-2xl mx-auto">
                  Two experts working together to deliver reach and systems that work.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* The Marketing Lead */}
              <Reveal delay={800}>
                <div className="bg-white/80 dark:bg-alira-onyx/80 backdrop-blur-sm p-10 rounded-2xl border border-alira-onyx/10 hover:border-alira-gold/30 hover:shadow-2xl hover:bg-alira-gold/5 transition-all duration-500 text-center group relative overflow-hidden">
                  {/* Accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-alira-gold to-alira-gold/60"></div>
                  
                  <div className="w-24 h-24 bg-gradient-to-br from-alira-gold/10 to-alira-gold/5 rounded-full mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2M9 8h6m-6 4h6m-6 4h6" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-alira-onyx dark:text-alira-porcelain mb-4">Mariam – Marketing Lead</h4>
                  <p className="text-alira-onyx dark:text-alira-porcelain/80 leading-relaxed mb-6">
                    Knows how to make your brand impossible to ignore.
                  </p>
                  <div className="text-sm text-alira-onyx dark:text-alira-porcelain/70 space-y-3 text-left">
                    <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Improves your social media content</span> and campaigns for better engagement</p>
                    <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Builds content calendars</span> to grow visibility and reach</p>
                    <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Helps you reach the right customers</span> with clear, compelling messaging</p>
                  </div>
                </div>
              </Reveal>

              {/* The Systems Engineer */}
              <Reveal delay={700}>
                <div className="bg-white/80 dark:bg-alira-onyx/80 backdrop-blur-sm p-10 rounded-2xl border border-alira-onyx/10 hover:border-alira-gold/30 hover:shadow-2xl hover:bg-alira-gold/5 transition-all duration-500 text-center group relative overflow-hidden">
                  {/* Accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-alira-gold to-alira-gold/60"></div>
                  
                  <div className="w-24 h-24 bg-gradient-to-br from-alira-gold/10 to-alira-gold/5 rounded-full mx-auto mb-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-12 h-12 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="text-2xl font-bold text-alira-onyx dark:text-alira-porcelain mb-4">Alex – Systems Engineer</h4>
                  <p className="text-alira-onyx dark:text-alira-porcelain/80 leading-relaxed mb-6">
                    Builds the tools and processes that unlock growth.
                  </p>
                  <div className="text-sm text-alira-onyx dark:text-alira-porcelain/70 space-y-3 text-left">
                    <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Designs and launches websites</span> and online platforms that convert</p>
                    <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Integrates AI into daily workflows</span> to boost efficiency and insights</p>
                    <p><span className="font-semibold text-alira-onyx dark:text-alira-porcelain">Automates repetitive tasks</span> to free up time and reduce chaos</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
