'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ArrowRight, Download, Mail, CheckCircle } from 'lucide-react'

interface PreviewData {
  businessName: string
  industry: string
  challenge: string
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Retail',
  'Manufacturing',
  'Professional Services',
  'Education',
  'Other'
]

const challenges = [
  'Scaling operations efficiently',
  'Improving customer acquisition',
  'Optimizing costs and processes',
  'Digital transformation',
  'Team and leadership development',
  'Market expansion'
]

export default function ValuePreview() {
  const [step, setStep] = useState<'input' | 'preview' | 'email'>('input')
  const [formData, setFormData] = useState<PreviewData>({
    businessName: '',
    industry: '',
    challenge: ''
  })
  const [email, setEmail] = useState('')

  const generatePreview = () => {
    if (formData.businessName && formData.industry && formData.challenge) {
      setStep('preview')
    }
  }

  const requestFullCase = () => {
    setStep('email')
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would integrate with your email service
    // and generate the full business case
    console.log('Email submitted:', email)
    // Redirect to thank you page or show success message
  }

  const generatePreviewContent = () => {
    return {
      problemStatement: `${formData.businessName} faces challenges in ${formData.challenge.toLowerCase()} within the ${formData.industry} sector.`,
      objectives: [
        'Streamline operational processes for improved efficiency',
        'Develop scalable growth strategies',
        'Optimize resource allocation and cost management'
      ],
      solutionFramework: [
        'Strategic assessment and gap analysis',
        'Process optimization and system implementation',
        'Performance monitoring and continuous improvement'
      ]
    }
  }

  if (step === 'input') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-2 border-alira-gold/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-alira-onyx">
              Get Your Business Case Preview
            </CardTitle>
            <p className="text-alira-onyx/70">
              Answer 3 quick questions to see your customized business case structure
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name</label>
              <Input
                value={formData.businessName}
                onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                placeholder="Enter your business name"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Industry</label>
              <Select onValueChange={(value) => setFormData({...formData, industry: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Main Challenge</label>
              <Select onValueChange={(value) => setFormData({...formData, challenge: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary challenge" />
                </SelectTrigger>
                <SelectContent>
                  {challenges.map((challenge) => (
                    <SelectItem key={challenge} value={challenge}>
                      {challenge}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              onClick={generatePreview}
              disabled={!formData.businessName || !formData.industry || !formData.challenge}
              className="w-full bg-alira-onyx hover:bg-alira-onyx/90"
            >
              Generate Preview
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            
            <p className="text-xs text-alira-onyx/60 text-center">
              Takes 30 seconds • No email required for preview
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === 'preview') {
    const preview = generatePreviewContent()
    
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-alira-onyx mb-4">
            Your Business Case Preview
          </h2>
          <p className="text-alira-onyx/70">
            This is just a preview of your customized business case structure
          </p>
        </div>
        
        <Card className="border-2 border-alira-gold/20 mb-8">
          <CardHeader className="bg-alira-gold/5">
            <CardTitle className="text-xl font-bold text-alira-onyx">
              {formData.businessName} - Business Case Framework
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-alira-onyx mb-2">Problem Statement</h3>
              <p className="text-alira-onyx/80 leading-relaxed">
                {preview.problemStatement}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-alira-onyx mb-2">Key Objectives</h3>
              <ul className="space-y-2">
                {preview.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-alira-gold mt-0.5 flex-shrink-0" />
                    <span className="text-alira-onyx/80">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-alira-onyx mb-2">Solution Framework</h3>
              <ul className="space-y-2">
                {preview.solutionFramework.map((solution, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-alira-gold mt-0.5 flex-shrink-0" />
                    <span className="text-alira-onyx/80">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center space-y-4">
          <div className="bg-alira-gold/10 rounded-lg p-4 border border-alira-gold/20">
            <h3 className="font-semibold text-alira-onyx mb-2">
              Get Your Complete Business Case
            </h3>
            <p className="text-alira-onyx/70 mb-4">
              Receive your full customized business case with detailed analysis, recommendations, and implementation roadmap.
            </p>
            <Button 
              onClick={requestFullCase}
              className="bg-alira-onyx hover:bg-alira-onyx/90"
            >
              Get Full Business Case
              <Download className="ml-2 w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-sm text-alira-onyx/60">
            ✓ Professional formatting • ✓ Detailed analysis • ✓ Implementation roadmap • ✓ 24-hour delivery
          </p>
        </div>
      </div>
    )
  }

  if (step === 'email') {
    return (
      <div className="max-w-md mx-auto">
        <Card className="border-2 border-alira-gold/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-alira-onyx">
              Get Your Complete Business Case
            </CardTitle>
            <p className="text-alira-onyx/70">
              Enter your email to receive your customized business case
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full"
                />
              </div>
              
              <Button type="submit" className="w-full bg-alira-onyx hover:bg-alira-onyx/90">
                Send My Business Case
                <Mail className="ml-2 w-4 h-4" />
              </Button>
              
              <div className="text-xs text-alira-onyx/60 space-y-1">
                <p>✓ Delivered within 24 hours</p>
                <p>✓ No spam, unsubscribe anytime</p>
                <p>✓ Secure and private</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
