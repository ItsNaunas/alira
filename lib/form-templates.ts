/**
 * Form Answer Templates Library
 * Provides example answers for each form question to help users get started
 */

export interface FormTemplate {
  id: string
  label: string
  content: string
  industry?: string
  stage?: string
}

export const businessIdeaTemplates: FormTemplate[] = [
  {
    id: 'saas-freelancer',
    label: 'SaaS for Freelancers',
    content: 'A SaaS platform that helps freelancers manage projects, track time, and invoice clients. Our platform integrates with popular tools like Slack and Google Calendar, and automates repetitive tasks like follow-up emails and payment reminders. We target solo freelancers and small agencies who are frustrated with juggling multiple tools and manual processes.',
    industry: 'saas',
    stage: 'early'
  },
  {
    id: 'ecommerce-marketplace',
    label: 'E-commerce Marketplace',
    content: 'An online marketplace connecting local artisans with customers who value handmade, sustainable products. We handle fulfillment, payment processing, and marketing, while artisans focus on creating quality products. Our target audience is eco-conscious consumers aged 25-45 who want to support local makers.',
    industry: 'ecommerce',
    stage: 'idea'
  },
  {
    id: 'service-agency',
    label: 'Marketing Agency',
    content: 'A marketing agency specializing in helping B2B SaaS companies launch and grow their customer base. We offer content strategy, paid advertising, and conversion optimization services. Our clients are early-stage SaaS startups with $10K-$50K monthly revenue looking to scale their customer acquisition.',
    industry: 'service',
    stage: 'growing'
  },
  {
    id: 'consultancy',
    label: 'Business Consultancy',
    content: 'A consultancy helping traditional businesses modernize their operations through AI integration and digital transformation. We work with manufacturing and retail companies to automate processes, improve customer experience, and increase efficiency. Our clients typically have 50-200 employees and want to stay competitive in a digital world.',
    industry: 'service',
    stage: 'established'
  }
]

export const challengesTemplates: FormTemplate[] = [
  {
    id: 'messaging-unclear',
    label: 'Unclear Messaging',
    content: 'Our biggest challenge is that potential customers don\'t immediately understand what we do or why they need us. We have great products, but our messaging is too technical and doesn\'t clearly communicate the value we provide. This leads to low conversion rates and requires lengthy sales cycles.',
    industry: 'saas',
    stage: 'early'
  },
  {
    id: 'scattered-data',
    label: 'Scattered Customer Data',
    content: 'We have customer information spread across multiple systems - some in our CRM, some in spreadsheets, some just in email. This makes it impossible to get a clear view of our customers, personalize communications, or identify upsell opportunities. Our team wastes hours searching for information.',
    industry: 'service',
    stage: 'growing'
  },
  {
    id: 'manual-processes',
    label: 'Manual Processes',
    content: 'We\'re spending too much time on repetitive tasks like data entry, follow-up emails, and report generation. These manual processes are slowing us down and preventing us from scaling. We need to automate these workflows so our team can focus on high-value activities.',
    industry: 'ecommerce',
    stage: 'established'
  },
  {
    id: 'low-conversion',
    label: 'Low Website Conversion',
    content: 'Our website gets traffic but very few visitors actually convert into leads or customers. We\'re not sure if it\'s our messaging, design, or user experience that\'s causing the problem. We need help identifying the blockers and optimizing our conversion funnel.',
    industry: 'saas',
    stage: 'early'
  },
  {
    id: 'lack-automation',
    label: 'Lack of Automation',
    content: 'Everything we do is manual - from lead qualification to customer onboarding to reporting. This limits our ability to scale and means we\'re constantly firefighting instead of being proactive. We need smart automation that handles routine tasks while maintaining quality.',
    industry: 'service',
    stage: 'growing'
  }
]

export const goalsTemplates: FormTemplate[] = [
  {
    id: 'increase-conversion',
    label: 'Increase Conversion Rates',
    content: 'In the next 3-6 months, we want to increase our website conversion rate from 2% to 5% and reduce our customer acquisition cost by 30%. We\'ll measure success through our analytics dashboard and monthly revenue reports. This will require optimizing our landing pages, improving our messaging, and refining our lead qualification process.',
    industry: 'saas',
    stage: 'early'
  },
  {
    id: 'automate-lead-followup',
    label: 'Automate Lead Follow-up',
    content: 'Our goal is to implement automated lead nurturing that sends personalized follow-up emails based on where prospects are in their journey. We want to reduce our sales cycle from 6 weeks to 4 weeks and increase our lead-to-customer conversion from 15% to 25%. We\'ll track this through our CRM pipeline metrics.',
    industry: 'service',
    stage: 'growing'
  },
  {
    id: 'clarify-positioning',
    label: 'Clarify Brand Positioning',
    content: 'We need to clarify our brand positioning so that when people hear about us, they immediately understand what we do and why we\'re different. Our goal is to create a clear value proposition that resonates with our target market and can be consistently communicated across all touchpoints. Success will be measured by improved brand awareness and clearer customer feedback.',
    industry: 'saas',
    stage: 'early'
  },
  {
    id: 'streamline-onboarding',
    label: 'Streamline Customer Onboarding',
    content: 'We want to reduce our customer onboarding time from 2 weeks to 3 days while improving satisfaction scores. Our goal is to create a self-service onboarding flow with clear milestones and automated check-ins. We\'ll measure success through onboarding completion rates, time-to-value metrics, and customer satisfaction surveys.',
    industry: 'saas',
    stage: 'growing'
  },
  {
    id: 'scale-revenue',
    label: 'Scale Revenue',
    content: 'Our primary goal is to grow from £50K to £150K monthly recurring revenue in the next 6 months. This requires improving our sales process, expanding our marketing channels, and enhancing our product offering. We\'ll track progress through monthly revenue reports and key metrics like customer lifetime value and churn rate.',
    industry: 'saas',
    stage: 'growing'
  }
]

/**
 * Get templates for a specific question
 */
export function getTemplatesForQuestion(
  questionId: 'business_idea' | 'current_challenges' | 'immediate_goals',
  industry?: string,
  stage?: string
): FormTemplate[] {
  let templates: FormTemplate[] = []

  switch (questionId) {
    case 'business_idea':
      templates = businessIdeaTemplates
      break
    case 'current_challenges':
      templates = challengesTemplates
      break
    case 'immediate_goals':
      templates = goalsTemplates
      break
  }

  // Filter by industry/stage if provided
  if (industry || stage) {
    templates = templates.filter(t => 
      (!industry || t.industry === industry) && 
      (!stage || t.stage === stage)
    )
  }

  // If no matches, return all templates
  if (templates.length === 0) {
    switch (questionId) {
      case 'business_idea':
        return businessIdeaTemplates
      case 'current_challenges':
        return challengesTemplates
      case 'immediate_goals':
        return goalsTemplates
    }
  }

  return templates
}

/**
 * Get a random template (for "See Example" preview)
 */
export function getRandomTemplate(
  questionId: 'business_idea' | 'current_challenges' | 'immediate_goals'
): FormTemplate {
  const templates = getTemplatesForQuestion(questionId)
  return templates[Math.floor(Math.random() * templates.length)]
}
