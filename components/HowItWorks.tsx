import Reveal from './Reveal'
import ArchitecturalGrid from './ArchitecturalGrid'
import Image from 'next/image'

export default function HowItWorks() {
  // Force deployment update
  return (
    <section className="py-16 md:py-24 bg-alira-warm-white dark:bg-alira-onyx relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <div className="text-sm font-sans font-medium text-alira-gold uppercase tracking-wider mb-4">
                How it works
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
                Steps to your <span className="text-alira-gold">next move</span>
              </h2>
            </div>
          </Reveal>
          
          {/* Process Flow */}
          <Reveal delay={300}>
            <div className="max-w-6xl mx-auto mb-16">
              {/* Horizontal Process Flow */}
              <div className="flex flex-col lg:flex-row items-center justify-center lg:items-start gap-6 lg:gap-8 relative">
                
                {/* Step 1: Answer questions */}
                <div className="flex flex-col items-center text-center group flex-1 max-w-sm">
                  {/* Large Step Number */}
                  <div className="mb-6">
                    <svg className="w-24 h-24 text-alira-gold/80 group-hover:text-alira-gold transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
                      <text x="50" y="65" textAnchor="middle" fontSize="72" fontWeight="bold" stroke="currentColor" strokeWidth="2.5" fill="none">1</text>
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-serif font-semibold text-alira-onyx dark:text-alira-porcelain mb-4 group-hover:text-alira-gold transition-colors duration-300">
                    Answer questions
                  </h3>
                  <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 leading-relaxed mb-8 font-sans">
                    Tell us about your idea or business through our quick, structured questionnaire.
                  </p>
                  
                  {/* Device Illustration - Larger Size */}
                  <div className="w-80 h-60 flex items-center justify-center mx-auto">
                    <Image 
                      src="/images/how-it-works/step-1.png" 
                      alt="Step 1: Answer questions"
                      width={320}
                      height={240}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Connecting Arrow 1 - Custom Image */}
                <div className="hidden lg:flex items-center justify-center w-20 h-16 relative">
                  <Image 
                    src="/images/how-it-works/arrow.png" 
                    alt="Arrow connecting steps"
                    width={200}
                    height={150}
                    className="object-contain max-w-none"
                    style={{ width: '200px', height: '150px' }}
                  />
                </div>

                {/* Step 2: AI analysis */}
                <div className="flex flex-col items-center text-center group flex-1 max-w-sm">
                  {/* Large Step Number */}
                  <div className="mb-6">
                    <svg className="w-24 h-24 text-alira-gold/80 group-hover:text-alira-gold transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
                      <text x="50" y="65" textAnchor="middle" fontSize="72" fontWeight="bold" stroke="currentColor" strokeWidth="2.5" fill="none">2</text>
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-serif font-semibold text-alira-onyx dark:text-alira-porcelain mb-4 group-hover:text-alira-gold transition-colors duration-300">
                    AI analysis
                  </h3>
                  <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 leading-relaxed mb-8 font-sans">
                    Our AI processes your information using strategic frameworks to create actionable insights.
                  </p>
                  
                  {/* Device Illustration - Larger Size */}
                  <div className="w-80 h-60 flex items-center justify-center mx-auto">
                    <Image 
                      src="/images/how-it-works/step-2.png" 
                      alt="Step 2: AI analysis"
                      width={320}
                      height={240}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Connecting Arrow 2 - Custom Image */}
                <div className="hidden lg:flex items-center justify-center w-20 h-16 relative">
                  <Image 
                    src="/images/how-it-works/arrow.png" 
                    alt="Arrow connecting steps"
                    width={200}
                    height={150}
                    className="object-contain max-w-none"
                    style={{ width: '200px', height: '150px' }}
                  />
                </div>

                {/* Step 3: Get your plan */}
                <div className="flex flex-col items-center text-center group flex-1 max-w-sm">
                  {/* Large Step Number */}
                  <div className="mb-6">
                    <svg className="w-24 h-24 text-alira-gold/80 group-hover:text-alira-gold transition-all duration-300 group-hover:-translate-y-2 group-hover:scale-110" viewBox="0 0 100 100" fill="none">
                      <text x="50" y="65" textAnchor="middle" fontSize="72" fontWeight="bold" stroke="currentColor" strokeWidth="2.5" fill="none">3</text>
                    </svg>
                  </div>
                  
                  <h3 className="text-xl font-serif font-semibold text-alira-onyx dark:text-alira-porcelain mb-4 group-hover:text-alira-gold transition-colors duration-300">
                    Get your plan
                  </h3>
                  <p className="text-alira-onyx/70 dark:text-alira-porcelain/70 leading-relaxed mb-8 font-sans">
                    Receive a comprehensive PDF business plan tailored to your specific situation and goals.
                  </p>
                  
                  {/* Device Illustration - Larger Size */}
                  <div className="w-80 h-60 flex items-center justify-center mx-auto">
                    <Image 
                      src="/images/how-it-works/step-3.png" 
                      alt="Step 3: Get your plan"
                      width={320}
                      height={240}
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
