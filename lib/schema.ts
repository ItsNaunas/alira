import { z } from 'zod'

// IntakeForm validation schema
export const intakeFormSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  stage: z.string().min(1, "Business stage is required"),
  challenges: z.string().min(10, "Please provide more detail about your challenges"),
  goalsShort: z.string().min(10, "Please provide more detail about your short-term goals"),
  goalsLong: z.string().min(10, "Please provide more detail about your long-term goals"),
  resources: z.string().min(1, "Please describe your available resources"),
  budget: z.string().min(1, "Budget range is required"),
  timeline: z.string().min(1, "Timeline is required"),
  service: z.string().min(1, "Service focus is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Valid email is required"),
  notes: z.string().optional(),
  consent: z.boolean().refine(val => val === true, "You must agree to the terms"),
  aiOutline: z.any().optional() // Store AI-generated outline
})

// AI generation request schema
export const aiGenerateSchema = z.object({
  businessName: z.string().min(1),
  industry: z.string().min(1),
  stage: z.string().min(1),
  challenges: z.string().min(1),
  goalsShort: z.string().optional().default(''),
  goalsLong: z.string().optional().default(''),
  resources: z.string().optional().default(''),
  budget: z.string().optional().default(''),
  timeline: z.string().optional().default(''),
  service: z.string().optional().default(''),
  notes: z.string().optional().default('')
})

// Save request schema
export const saveRequestSchema = z.object({
  lead: intakeFormSchema,
  businessCase: z.object({
    outline: z.any(),
    pdfBuffer: z.string() // base64 encoded PDF
  })
})

// Business case outline schema
export const businessCaseOutlineSchema = z.object({
  problem_statement: z.string(),
  objectives: z.array(z.string()),
  current_state: z.string(),
  proposed_solution: z.array(z.object({
    pillar: z.string(),
    actions: z.array(z.string()),
    effort: z.enum(['low', 'med', 'high']),
    impact: z.enum(['low', 'med', 'high'])
  })),
  expected_outcomes: z.array(z.string()),
  next_steps: z.array(z.string())
})

// Types
export type IntakeFormData = z.infer<typeof intakeFormSchema>
export type AIGenerateRequest = z.infer<typeof aiGenerateSchema>
export type SaveRequest = z.infer<typeof saveRequestSchema>
export type BusinessCaseOutline = z.infer<typeof businessCaseOutlineSchema>

export const businessStages = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'early', label: 'Early Stage' },
  { value: 'growing', label: 'Growing' },
  { value: 'established', label: 'Established' },
] as const

export const budgetRanges = [
  { value: '<£2k', label: 'Under £2,000' },
  { value: '£2k–£5k', label: '£2,000 – £5,000' },
  { value: '£5k–£15k', label: '£5,000 – £15,000' },
  { value: '£15k+', label: '£15,000+' },
] as const

export const timelineOptions = [
  { value: 'asap', label: 'ASAP' },
  { value: '2–4 weeks', label: '2–4 weeks' },
  { value: '1–3 months', label: '1–3 months' },
  { value: '3+ months', label: '3+ months' },
] as const

export const services = [
  {
    value: 'Business Reset',
    label: 'Business Reset',
    description: 'A private 10-day engagement to strip away overload and rebuild clarity.',
    price: '£2,500',
    duration: '10 days',
  },
  {
    value: 'Growth Blueprint',
    label: 'Growth Blueprint',
    description: 'A 3-6 week programme that turns ideas into credible businesses.',
    price: '£5,000',
    duration: '3–6 weeks',
  },
  {
    value: 'AI Advantage',
    label: 'AI Advantage',
    description: 'Practical AI integration to make systems faster, smarter, leaner.',
    price: '£8,000',
    duration: '4–8 weeks',
  },
  {
    value: 'Strategic Partner',
    label: 'Strategic Partner',
    description: 'Ongoing oversight and structured support for serious ambitions.',
    price: '£15,000+',
    duration: 'Ongoing',
  },
] as const
