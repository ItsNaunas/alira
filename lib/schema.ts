import { z } from 'zod'

export const intakeFormSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  industry: z.string().min(2, 'Industry must be at least 2 characters'),
  stage: z.enum(['idea', 'early', 'growing', 'established'], {
    required_error: 'Please select your business stage',
  }),
  challenges: z.string().min(10, 'Please provide at least 10 characters describing your challenges'),
  goalsShort: z.string().min(10, 'Please provide at least 10 characters describing your short-term goals'),
  goalsLong: z.string().min(10, 'Please provide at least 10 characters describing your long-term goals'),
  resources: z.string().min(5, 'Please describe your available resources'),
  budget: z.enum(['<£2k', '£2k–£5k', '£5k–£15k', '£15k+'], {
    required_error: 'Please select your budget range',
  }),
  timeline: z.enum(['asap', '2–4 weeks', '1–3 months', '3+ months'], {
    required_error: 'Please select your timeline',
  }),
  service: z.enum(['Business Reset', 'Growth Blueprint', 'AI Advantage', 'Strategic Partner'], {
    required_error: 'Please select a service',
  }),
  contactName: z.string().min(2, 'Contact name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  notes: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
})

export type IntakeFormData = z.infer<typeof intakeFormSchema>

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
    description: 'A 3–6 week programme that turns ideas into credible businesses.',
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
