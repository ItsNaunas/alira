'use client'

import HeroRotator from '@/components/HeroRotator'
import HeroCards from '@/components/HeroCards'
import HeroCTAs from '@/components/HeroCTAs'
import HomeServices from '@/components/HomeServices'
import ProcessDiagram from '@/components/ProcessDiagram'
import Experience from '@/components/Experience'
import ClientResults from '@/components/ClientResults'
import FinalCTA from '@/components/FinalCTA'
import ValuePreview from '@/components/ValuePreview'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-alira-onyx via-alira-onyx to-alira-onyx/95 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero/hero-bg-base.png')] bg-cover bg-center opacity-10"></div>
        <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Transform Your Business Vision Into 
              <span className="text-alira-gold"> Actionable Strategy</span>
            </h1>
            <p className="text-xl lg:text-2xl text-alira-gold/90 mb-12 leading-relaxed">
              Get your customized business case delivered with same day clarity
            </p>
            
            {/* Value Preview Component */}
            <div className="mb-16">
              <ValuePreview />
            </div>
          </div>
        </div>
      </section>

      {/* Hero Cards Section */}
      <HeroCards />

      {/* Services Section */}
      <HomeServices />

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-alira-onyx mb-4">
              How It Works
            </h2>
            <p className="text-xl text-alira-onyx/70 max-w-3xl mx-auto">
              Our streamlined process delivers your business case with instant clarity
            </p>
          </div>
          <ProcessDiagram />
        </div>
      </section>

      {/* Experience Section */}
      <Experience />

      {/* Client Results Section */}
      <ClientResults />

      {/* Final CTA Section */}
      <FinalCTA />
    </main>
  )
}
