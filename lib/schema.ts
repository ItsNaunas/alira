import { z } from 'zod'

// Mini form schema for homepage
export const miniFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  email: z.string().email("Valid email is required"),
  idea: z.string().optional()
})

// New wizard form schema (aligned with ALIRA service areas)
export const wizardFormSchema = z.object({
  business_idea: z.string().min(10, "Please provide more detail about your business idea"),
  business_stage: z.enum(['idea', 'early', 'growing', 'established']).optional(),
  current_challenges: z.string().min(10, "Please provide more detail about your current challenges"),
  immediate_goals: z.string().min(10, "Please provide more detail about your immediate goals"),
  service_interest: z.array(z.string()).min(1, "Please select at least one service area"),
  current_tools: z.string().optional(),
  name: z.string().optional(), // Optional since it comes from hero form
  email: z.string().email().optional(), // Optional since it comes from hero form
  consent: z.boolean().refine(val => val === true, "You must agree to the terms")
})

// Legacy IntakeForm validation schema (keeping for backward compatibility)
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
    effort: z.enum(['low', 'med', 'medium', 'high']),
    impact: z.enum(['low', 'med', 'medium', 'high'])
  })),
  expected_outcomes: z.array(z.string()),
  next_steps: z.array(z.string())
})

// Types
export type MiniFormData = z.infer<typeof miniFormSchema>
export type WizardFormData = z.infer<typeof wizardFormSchema>
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

// Service interest options for the wizard form
export const serviceInterestOptions = [
  { 
    value: 'brand_product', 
    label: 'Brand & Product Management',
    description: 'Positioning, offer clarity, launch strategy'
  },
  { 
    value: 'content_management', 
    label: 'Content Management',
    description: 'Social media strategy and content creation for business growth'
  },
  { 
    value: 'digital_solutions', 
    label: 'Digital Solutions & AI Integration',
    description: 'Websites, AI tools, bespoke systems'
  }
] as const

// Current tools/tech options
export const currentToolsOptions = [
  { value: 'none', label: 'No current tools' },
  { value: 'basic', label: 'Basic tools (email, spreadsheets)' },
  { value: 'crm', label: 'CRM system (HubSpot, Salesforce, etc.)' },
  { value: 'website', label: 'Website with basic functionality' },
  { value: 'automation', label: 'Some automation tools' },
  { value: 'ai_tools', label: 'AI tools and integrations' }
] as const

// ============================================
// Plan Versioning and Management Types
// ============================================

// Plan version schema
export const planVersionSchema = z.object({
  id: z.string().uuid(),
  dashboard_id: z.string().uuid(),
  generation_id: z.string().uuid().nullable(),
  version: z.number().int().positive(),
  content: z.record(z.string(), z.any()),
  changes_summary: z.string().nullable(),
  parent_version_id: z.string().uuid().nullable(),
  created_at: z.string(),
  created_by: z.string().uuid().nullable(),
  user_id: z.string().uuid(),
})

export type PlanVersion = z.infer<typeof planVersionSchema>

// Refinement chat message schema
export const refinementChatMessageSchema = z.object({
  id: z.string().uuid(),
  dashboard_id: z.string().uuid(),
  message_type: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  suggested_changes: z.record(z.string(), z.any()).nullable(),
  applied: z.boolean().default(false),
  created_at: z.string(),
  user_id: z.string().uuid(),
})

export type RefinementChatMessage = z.infer<typeof refinementChatMessageSchema>

// Plan detail with all related data
export interface PlanDetail {
  id: string
  business_name: string
  current_challenges?: string
  immediate_goals?: string
  service_interest?: string[]
  form_data?: Record<string, any>
  pdf_url?: string | null
  status: string
  created_at: string
  updated_at: string
  user_id: string
  generation?: {
    id: string
    type: string
    content: BusinessCaseOutline
    version: number
    created_at: string
  }
  current_version?: PlanVersion
  version_count?: number
}

// Plan section types for structured editing
export type PlanSection = 
  | 'problem_statement'
  | 'objectives'
  | 'current_state'
  | 'proposed_solution'
  | 'expected_outcomes'
  | 'next_steps'
  | 'risk_assessment'
  | 'competitive_advantage'

export const planSectionLabels: Record<PlanSection, string> = {
  problem_statement: 'Problem Statement',
  objectives: 'Objectives',
  current_state: 'Current State',
  proposed_solution: 'Proposed Solution',
  expected_outcomes: 'Expected Outcomes',
  next_steps: 'Next Steps',
  risk_assessment: 'Risk Assessment',
  competitive_advantage: 'Competitive Advantage',
}

// Status options for plans
export const planStatusOptions = [
  { value: 'draft', label: 'Draft', color: 'gray' },
  { value: 'in_progress', label: 'In Progress', color: 'blue' },
  { value: 'complete', label: 'Complete', color: 'green' },
  { value: 'archived', label: 'Archived', color: 'slate' },
] as const