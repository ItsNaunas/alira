import Reveal from './Reveal'
import Image from 'next/image'

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-alira-onyx/20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-sm font-medium text-alira-gold uppercase tracking-wider mb-4">
                How it works
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
                Three steps to your <span className="text-alira-gold">business plan</span>
              </h2>
            </div>
          </Reveal>
          
          {/* Process Flow */}
          <Reveal delay={300}>
            <div className="max-w-6xl mx-auto mb-16">
              {/* Horizontal Process Flow */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8 relative">
                
                {/* Step 1: Answer questions */}
                <div className="flex flex-col items-center text-center group flex-1">
                  {/* Large Step Number */}
                  <div className="mb-6">
                    <span className="text-6xl font-bold text-alira-gold/80 group-hover:text-alira-gold transition-colors duration-300">1</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-alira-onyx dark:text-alira-porcelain mb-4 group-hover:text-alira-gold transition-colors duration-300">
                    Answer questions
                  </h3>
                  <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 leading-relaxed mb-8">
                    Tell us about your idea or business through our quick, structured questionnaire.
                  </p>
                  
                  {/* Device Illustration - Larger */}
                  <div className="w-72 h-54 flex items-center justify-center">
                    <Image 
                      src="/images/how-it-works/step1-signup.png" 
                      alt="Step 1: Answer questions"
                      width={288}
                      height={216}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Connecting Arrow 1 - Improved */}
                <div className="hidden lg:flex items-center justify-center w-16 h-12 relative">
                  <svg className="w-16 h-12 text-alira-gold" viewBox="0 0 64 48" fill="none">
                    <path d="M4 24 Q32 6 60 24" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5,3" fill="none"/>
                    <path d="M54 20 L60 24 L54 28" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                  </svg>
                </div>

                {/* Step 2: AI analysis */}
                <div className="flex flex-col items-center text-center group flex-1">
                  {/* Large Step Number */}
                  <div className="mb-6">
                    <span className="text-6xl font-bold text-alira-gold/80 group-hover:text-alira-gold transition-colors duration-300">2</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-alira-onyx dark:text-alira-porcelain mb-4 group-hover:text-alira-gold transition-colors duration-300">
                    AI analysis
                  </h3>
                  <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 leading-relaxed mb-8">
                    Our AI processes your information using strategic frameworks to create actionable insights.
                  </p>
                  
                  {/* Device Illustration - Larger */}
                  <div className="w-72 h-54 flex items-center justify-center">
                    <Image 
                      src="/images/how-it-works/step3-invite-team.png" 
                      alt="Step 2: AI analysis"
                      width={288}
                      height={216}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Connecting Arrow 2 - Improved */}
                <div className="hidden lg:flex items-center justify-center w-16 h-12 relative">
                  <svg className="w-16 h-12 text-alira-gold" viewBox="0 0 64 48" fill="none">
                    <path d="M4 24 Q32 6 60 24" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5,3" fill="none"/>
                    <path d="M54 20 L60 24 L54 28" stroke="currentColor" strokeWidth="2.5" fill="none"/>
                  </svg>
                </div>

                {/* Step 3: Get your plan */}
                <div className="flex flex-col items-center text-center group flex-1">
                  {/* Large Step Number */}
                  <div className="mb-6">
                    <span className="text-6xl font-bold text-alira-gold/80 group-hover:text-alira-gold transition-colors duration-300">3</span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-alira-onyx dark:text-alira-porcelain mb-4 group-hover:text-alira-gold transition-colors duration-300">
                    Get your plan
                  </h3>
                  <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 leading-relaxed mb-8">
                    Receive a comprehensive PDF business plan tailored to your specific situation and goals.
                  </p>
                  
                  {/* Device Illustration - Larger */}
                  <div className="w-72 h-54 flex items-center justify-center">
                    <Image 
                      src="/images/how-it-works/step2-spending-rules.png" 
                      alt="Step 3: Get your plan"
                      width={288}
                      height={216}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
