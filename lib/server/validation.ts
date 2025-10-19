/**
 * Input Validation Schemas with Zod
 * 
 * This module provides:
 * - Runtime type validation for all API inputs
 * - Type inference for TypeScript
 * - Protection against injection attacks
 * - Automatic error messages
 * 
 * SECURITY: All API route inputs should be validated using these schemas
 */

import { z } from 'zod';

/**
 * Common validation primitives
 */
export const validators = {
  uuid: z.string().uuid('Invalid ID format'),
  email: z.string().email('Invalid email address'),
  url: z.string().url('Invalid URL'),
  nonEmptyString: z.string().min(1, 'This field is required'),
  positiveNumber: z.number().positive('Must be a positive number'),
};

/**
 * Dashboard/Generate Input Schema
 * Used for: /api/generate, /api/ai/generate
 */
export const GenerateInputSchema = z.object({
  dashboardId: validators.uuid,
  type: z.enum(['plan', 'content', 'analysis'], {
    errorMap: () => ({ message: 'Type must be one of: plan, content, analysis' }),
  }),
  prompt: z.string().optional(),
  context: z.record(z.any()).optional(),
});

export type GenerateInput = z.infer<typeof GenerateInputSchema>;

/**
 * Create Checkout Session Schema
 * Used for: /api/checkout
 */
export const CreateCheckoutSessionSchema = z.object({
  dashboardId: validators.uuid,
  priceId: z.string().min(1, 'Price ID is required'),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export type CreateCheckoutSession = z.infer<typeof CreateCheckoutSessionSchema>;

/**
 * Buy Credits Schema
 * Used for: /api/buy-credits
 */
export const BuyCreditsSchema = z.object({
  amount: z.number()
    .int('Amount must be a whole number')
    .min(100, 'Minimum purchase is 100 credits')
    .max(10000, 'Maximum purchase is 10,000 credits'),
  priceId: z.enum(['price_basic', 'price_premium', 'price_enterprise'], {
    errorMap: () => ({ message: 'Invalid price ID' }),
  }),
});

export type BuyCredits = z.infer<typeof BuyCreditsSchema>;

/**
 * Create Dashboard Schema
 * Used for: /api/dashboard/create
 */
export const CreateDashboardSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  settings: z.object({
    theme: z.enum(['light', 'dark', 'auto']).optional(),
    notifications: z.boolean().optional(),
  }).optional(),
});

export type CreateDashboard = z.infer<typeof CreateDashboardSchema>;

/**
 * Contact Form Schema
 * Used for: /api/contact
 */
export const ContactFormSchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters'),
  email: validators.email,
  subject: z.string()
    .min(1, 'Subject is required')
    .max(200, 'Subject must be less than 200 characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters'),
  phone: z.string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional(),
});

export type ContactForm = z.infer<typeof ContactFormSchema>;

/**
 * Draft Creation Schema
 * Used for: /api/draft/create
 */
export const CreateDraftSchema = z.object({
  formData: z.record(z.any()),
  sessionId: z.string().optional(),
  metadata: z.object({
    version: z.string().optional(),
    source: z.string().optional(),
  }).optional(),
});

export type CreateDraft = z.infer<typeof CreateDraftSchema>;

/**
 * Draft Submission Schema
 * Used for: /api/draft/submit, /api/draft/submit-enhanced
 */
export const SubmitDraftSchema = z.object({
  draftId: validators.uuid,
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
  finalData: z.record(z.any()).optional(),
});

export type SubmitDraft = z.infer<typeof SubmitDraftSchema>;

/**
 * Resume Draft Schema
 * Used for: /api/draft/resume/[token]
 */
export const ResumeDraftSchema = z.object({
  token: z.string().min(1, 'Token is required'),
});

export type ResumeDraft = z.infer<typeof ResumeDraftSchema>;

/**
 * Save Draft Schema
 * Used for: /api/draft/save
 */
export const SaveDraftSchema = z.object({
  draftId: validators.uuid.optional(),
  formData: z.record(z.any()),
  email: validators.email,
  currentStep: z.number().int().min(0).optional(),
});

export type SaveDraft = z.infer<typeof SaveDraftSchema>;

/**
 * Generate Plan Schema
 * Used for: /api/generate-plan
 */
export const GeneratePlanSchema = z.object({
  answers: z.record(z.any()),
  userId: validators.uuid.optional(),
  preferences: z.object({
    format: z.enum(['pdf', 'html', 'markdown']).optional(),
    includeImages: z.boolean().optional(),
  }).optional(),
});

export type GeneratePlan = z.infer<typeof GeneratePlanSchema>;

/**
 * Helper function to safely parse and validate input
 * 
 * Usage:
 * ```typescript
 * const input = await safeValidate(GenerateInputSchema, await req.json());
 * // Input is now validated and typed
 * ```
 */
export async function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<T> {
  return schema.parse(data);
}

/**
 * Parse and validate with custom error handling
 */
export function validateOrThrow<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    throw result.error;
  }
  
  return result.data;
}

/**
 * Validate query parameters from URL
 * 
 * Usage:
 * ```typescript
 * const params = validateQueryParams(
 *   new URL(req.url).searchParams,
 *   z.object({ id: validators.uuid })
 * );
 * ```
 */
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodSchema<T>
): T {
  const params = Object.fromEntries(searchParams.entries());
  return validateOrThrow(schema, params);
}

