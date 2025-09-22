import Reveal from './Reveal'
import { TrendingUp, Users, Target, DollarSign, Calendar, Award, CheckCircle, Building } from 'lucide-react'

const results = [
  {
    category: "Cost Savings",
    metrics: [
      { value: "£21,000", label: "Total annual savings secured", icon: DollarSign },
      { value: "£11,000", label: "Cost reduction achieved", icon: TrendingUp },
      { value: "£10,000+", label: "Additional vendor savings", icon: Target }
    ]
  },
  {
    category: "Operational Impact",
    metrics: [
      { value: "25%", label: "Training sign-up increase", icon: TrendingUp },
      { value: "1,000+", label: "Staff trained", icon: Users },
      { value: "200+", label: "Attendees per event", icon: Calendar }
    ]
  },
  {
    category: "Scale & Reach",
    metrics: [
      { value: "3,000+", label: "Staff onboarded", icon: Users },
      { value: "20+", label: "Projects managed", icon: Target },
      { value: "10+", label: "Years experience", icon: Building }
    ]
  }
]

const keyAchievements = [
  "Reduced operational costs by £11,000 through stakeholder negotiations and process optimization",
  "Achieved £10,000+ savings by reviewing vendor contracts and agency spending",
  "Redesigned flagship training workflow, increasing sign-ups by 25% and improving user experience",
  "Designed and delivered comprehensive training and compliance systems across large organizations",
  "Planned and executed large-scale transformation events every six months for 200+ attendees",
  "Coordinated multi-workstream projects with PMO rigor, governance, and executive reporting"
]

export default function ClientResults() {
  return (
    <section className="py-24 bg-white dark:bg-alira-onyx/20">
      <div className="max-w-6xl mx-auto px-4">
        <Reveal>
          <div className="text-center mb-16">
            <div className="text-sm tracking-wide uppercase text-alira-gold mb-4 font-medium">
              CLIENT SUCCESS
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-alira-onyx dark:text-alira-porcelain mb-6">
              Enterprise Transformation Results
            </h2>
            <div className="w-16 h-px bg-alira-gold mx-auto mb-6"></div>
            <p className="text-lg text-alira-onyx/70 dark:text-alira-porcelain/70 max-w-3xl mx-auto">
              Delivered comprehensive transformation programmes focused on improving efficiency, value for money, and operational performance across multiple teams and departments.
            </p>
          </div>
        </Reveal>

        {/* Results Grid */}
        <Reveal delay={200}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {results.map((category, index) => (
              <div key={index} className="bg-alira-porcelain/30 dark:bg-alira-onyx/30 rounded-2xl p-8 border border-alira-onyx/5 dark:border-alira-porcelain/10">
                <h3 className="text-xl font-bold text-alira-onyx dark:text-alira-porcelain mb-6 text-center">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.metrics.map((metric, metricIndex) => {
                    const IconComponent = metric.icon
                    return (
                      <div key={metricIndex} className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-alira-gold/10 rounded-full flex items-center justify-center">
                          <IconComponent className="w-5 h-5 text-alira-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xl font-bold text-alira-onyx dark:text-alira-porcelain">
                            {metric.value}
                          </div>
                          <div className="text-sm text-alira-onyx/70 dark:text-alira-porcelain/70">
                            {metric.label}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Key Achievements */}
        <Reveal delay={400}>
          <div className="bg-alira-onyx/5 dark:bg-alira-onyx/20 rounded-2xl p-8 lg:p-12 border border-alira-onyx/10 dark:border-alira-porcelain/10">
            <h3 className="text-2xl font-bold text-alira-onyx dark:text-alira-porcelain mb-8 text-center">
              Key Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyAchievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-alira-gold/10 rounded-full flex items-center justify-center mt-0.5">
                    <CheckCircle className="w-4 h-4 text-alira-gold" />
                  </div>
                  <p className="text-alira-onyx/80 dark:text-alira-porcelain/80 leading-relaxed">
                    {achievement}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Impact Summary */}
        <Reveal delay={600}>
          <div className="mt-16 text-center">
            <div className="inline-block bg-alira-gold/10 dark:bg-alira-gold/20 rounded-full px-8 py-4 border border-alira-gold/20">
              <div className="text-2xl font-bold text-alira-onyx dark:text-alira-porcelain mb-2">
                £21,000 Total Annual Savings
              </div>
              <div className="text-sm text-alira-onyx/70 dark:text-alira-porcelain/70">
                Secured through efficiency measures, contract reviews, and stakeholder negotiations
              </div>
            </div>
          </div>
        </Reveal>

        {/* Testimonial */}
        <Reveal delay={800}>
          <div className="mt-16 bg-white dark:bg-alira-onyx/30 rounded-2xl p-8 border border-alira-onyx/10 dark:border-alira-porcelain/10 shadow-lg">
            <div className="text-center">
              <div className="text-sm tracking-wide uppercase text-alira-gold mb-4 font-medium">
                CLIENT TESTIMONIAL
              </div>
              <blockquote className="text-lg text-alira-onyx/80 dark:text-alira-porcelain/80 italic mb-4 max-w-3xl mx-auto">
                "I was consistently impressed by his creativity to solve problems and deliver results. His ability to quickly learn new skills and build relationships consistently contributed to the success of our team projects that had internal and external stakeholders, and a national and international reach."
              </blockquote>
              <div className="text-sm text-alira-onyx/60 dark:text-alira-porcelain/60">
                — Programme Director, National Institute for Health and Care Excellence
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
