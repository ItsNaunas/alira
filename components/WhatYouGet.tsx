import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { CheckCircle, FileText, Target, Zap, Users } from 'lucide-react'

export default function WhatYouGet() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-alira-onyx mb-4">
            What You Get
          </h2>
          <p className="text-xl text-alira-onyx/70 max-w-3xl mx-auto">
            Every business case draft contains these four building blocks, delivered with instant clarity
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-2 border-alira-gold/20 hover:border-alira-gold/40 transition-colors">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-alira-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-alira-gold" />
              </div>
              <CardTitle className="text-lg font-semibold text-alira-onyx">
                Problem Statement
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-alira-onyx/70 text-sm">
                Clear articulation of your business challenge and objectives
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-alira-gold/20 hover:border-alira-gold/40 transition-colors">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-alira-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-alira-gold" />
              </div>
              <CardTitle className="text-lg font-semibold text-alira-onyx">
                Proposed Solution
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-alira-onyx/70 text-sm">
                Strategic recommendations tailored to your specific situation
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-alira-gold/20 hover:border-alira-gold/40 transition-colors">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-alira-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-alira-gold" />
              </div>
              <CardTitle className="text-lg font-semibold text-alira-onyx">
                Implementation Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-alira-onyx/70 text-sm">
                Step-by-step roadmap for executing your business case
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-2 border-alira-gold/20 hover:border-alira-gold/40 transition-colors">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-alira-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-alira-gold" />
              </div>
              <CardTitle className="text-lg font-semibold text-alira-onyx">
                Professional Format
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-alira-onyx/70 text-sm">
                Ready-to-use document with executive summary and key metrics
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
