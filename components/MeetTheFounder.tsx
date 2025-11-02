import Reveal from './Reveal'
import Image from 'next/image'
import CTAButton from './CTAButton'

export default function MeetTheTeam() {
  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-alira-primary mb-6">
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
                  <p className="text-xl text-alira-primary leading-relaxed">
                    I started ALIRA because I know what it feels like to have ambition but no clear path.
                  </p>
                  
                  <p className="text-lg text-alira-primary/70 leading-relaxed font-sans">
                    For years I worked in project management and operations, leading teams, fixing systems, and delivering projects that saved organisations time and money.
                  </p>
                  
                  <p className="text-lg text-alira-primary/70 leading-relaxed font-sans">
                    What I kept seeing was the same problem — people overcomplicate. Ideas stall, businesses get stuck, and potential gets wasted.
                  </p>
                  
                  <p className="text-lg text-alira-primary/70 leading-relaxed font-sans">
                    That's why I built ALIRA. To strip away the noise and give people what they actually need: a simple plan, clear steps, and the confidence to move forward.
                  </p>
                </div>

                {/* Credentials/Experience */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-alira-gold rounded-full"></div>
                    <span className="text-alira-primary font-sans font-light">10+ years in project management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-alira-gold rounded-full"></div>
                    <span className="text-alira-primary font-sans font-light">Experience leading teams across multiple industries</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-alira-gold rounded-full"></div>
                    <span className="text-alira-primary font-sans font-light">Delivered projects that saved organisations time and money</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-4">
                  <CTAButton 
                    href="/contact" 
                    variant="alira"
                    className="px-8 py-4 text-lg font-sans font-light"
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
                {/* Founder photo with oval styling */}
                <div className="relative flex justify-center">
                  <div className="w-80 h-80 overflow-hidden border-4 border-alira-gold/30 shadow-2xl relative" style={{borderRadius: '50%'}}>
                    <Image 
                      src="/images/assets/founder.jpg" 
                      alt="ALIRA Founder - Professional headshot"
                      width={320}
                      height={320}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  {/* Decorative elements */}
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-alira-gold/20 rounded-full"></div>
                  <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-alira-gold/30 rounded-full"></div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Team Members Section */}
          <div className="mt-20">
            <Reveal delay={600}>
              <div className="text-center mb-12">
                <h3 className="text-3xl font-serif font-normal text-alira-primary mb-4">Meet Our Specialists</h3>
                <p className="text-lg text-alira-primary/70 max-w-2xl mx-auto font-serif italic font-light">
                  Two experts working together to deliver reach and systems that work.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* The Marketing Lead */}
              <Reveal delay={800}>
                <div className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl border-r-4 border-r-alira-gold/40 border border-alira-primary/10 hover:border-alira-gold/30 hover:shadow-2xl hover:bg-alira-gold/5 transition-all duration-500 text-center group relative">
                  {/* Accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-alira-gold to-alira-gold/60"></div>
                  
                  {/* Oval placeholder with meaningful icon */}
                  <div className="w-32 h-32 mx-auto mb-6 overflow-hidden border-3 border-alira-gold/30 shadow-lg relative" style={{borderRadius: '50%'}}>
                    <div className="w-full h-full bg-gradient-to-br from-alira-gold/10 to-alira-gold/5 flex items-center justify-center">
                      {/* Megaphone icon for Marketing */}
                      <svg className="w-16 h-16 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                      </svg>
                    </div>
                  </div>
                  
                  <h4 className="text-2xl font-serif font-normal text-alira-primary mb-3">Etomi – Marketing Lead</h4>
                  <p className="text-base md:text-lg text-alira-primary/80 leading-relaxed mb-8 font-sans">
                    Knows how to make your brand impossible to ignore.
                  </p>
                  
                  <div className="space-y-4 text-center">
                    <div>
                      <h5 className="text-base font-serif font-normal text-alira-gold mb-1">Social Media Content</h5>
                      <p className="text-sm md:text-base text-alira-primary/70 leading-relaxed font-sans">Campaigns designed to grab attention and drive engagement.</p>
                    </div>
                    <div>
                      <h5 className="text-base font-serif font-normal text-alira-gold mb-1">Content Calendars</h5>
                      <p className="text-sm md:text-base text-alira-primary/70 leading-relaxed font-sans">Consistent visibility and reach that builds momentum.</p>
                    </div>
                    <div>
                      <h5 className="text-base font-serif font-normal text-alira-gold mb-1">Targeted Messaging</h5>
                      <p className="text-sm md:text-base text-alira-primary/70 leading-relaxed font-sans">Clear, compelling copy that reaches the right customers.</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* The Systems Engineer */}
              <Reveal delay={700}>
                <div className="bg-white/80 backdrop-blur-sm p-10 rounded-2xl border-l-4 border-l-alira-gold/40 border border-alira-primary/10 hover:border-alira-gold/30 hover:shadow-2xl hover:bg-alira-gold/5 transition-all duration-500 text-center group relative">
                  {/* Accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-alira-gold to-alira-gold/60"></div>
                  
                  {/* Oval placeholder with meaningful icon */}
                  <div className="w-32 h-32 mx-auto mb-6 overflow-hidden border-3 border-alira-gold/30 shadow-lg relative" style={{borderRadius: '50%'}}>
                    <div className="w-full h-full bg-gradient-to-br from-alira-gold/10 to-alira-gold/5 flex items-center justify-center">
                      {/* Cog/Settings icon for Systems */}
                      <svg className="w-16 h-16 text-alira-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <h4 className="text-2xl font-serif font-normal text-alira-primary mb-3">Naufal – Systems Engineer</h4>
                  <p className="text-base md:text-lg text-alira-primary/80 leading-relaxed mb-8 font-sans">
                    Builds the tools and processes that unlock growth.
                  </p>
                  
                  <div className="space-y-4 text-center">
                    <div>
                      <h5 className="text-base font-serif font-normal text-alira-gold mb-1">Websites & Platforms</h5>
                      <p className="text-sm md:text-base text-alira-primary/70 leading-relaxed font-sans">Online presences designed and launched to convert visitors.</p>
                    </div>
                    <div>
                      <h5 className="text-base font-serif font-normal text-alira-gold mb-1">AI Integration</h5>
                      <p className="text-sm md:text-base text-alira-primary/70 leading-relaxed font-sans">Smart workflows that boost efficiency and unlock insights.</p>
                    </div>
                    <div>
                      <h5 className="text-base font-serif font-normal text-alira-gold mb-1">Task Automation</h5>
                      <p className="text-sm md:text-base text-alira-primary/70 leading-relaxed font-sans">Repetitive work eliminated to free up time and reduce chaos.</p>
                    </div>
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
