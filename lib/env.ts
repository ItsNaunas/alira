import { z } from 'zod'

// Environment variable validation schema
const envSchema = z.object({
  // Required server-side environment variables
  OPENAI_API_KEY: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  
  // Optional environment variables
  NEXT_PUBLIC_GA4_ID: z.string().optional(),
  SUPABASE_SERVICE_ROLE: z.string().optional(),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Validate environment variables at runtime
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .filter(err => err.code === 'too_small' || err.code === 'invalid_string')
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join('\n')
      
      throw new Error(`Environment validation failed:\n${missingVars}`)
    }
    throw error
  }
}

// Lazy-loaded environment variables (only validate when accessed)
let _env: z.infer<typeof envSchema> | null = null

export const env = new Proxy({} as z.infer<typeof envSchema>, {
  get(target, prop) {
    if (_env === null) {
      _env = validateEnv()
    }
    return _env[prop as keyof typeof _env]
  }
})

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>

// Helper functions for specific environment checks
export const isProduction = env.NODE_ENV === 'production'
export const isDevelopment = env.NODE_ENV === 'development'
export const isTest = env.NODE_ENV === 'test'

// Validation helper for API routes
export function validateRequiredEnv(requiredVars: (keyof Env)[]) {
  const missing: string[] = []
  
  for (const varName of requiredVars) {
    if (!env[varName]) {
      missing.push(varName as string)
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Runtime validation for specific environment variables
export function validateEnvVar(varName: keyof Env, value: string | undefined): void {
  if (!value) {
    throw new Error(`Missing required environment variable: ${varName}`)
  }
  
  // Additional validation for specific variables
  switch (varName) {
    case 'SUPABASE_URL':
      if (!value.startsWith('http')) {
        throw new Error('SUPABASE_URL must be a valid URL')
      }
      break
    case 'RESEND_FROM_EMAIL':
      if (!value.includes('@')) {
        throw new Error('RESEND_FROM_EMAIL must be a valid email address')
      }
      break
  }
}
