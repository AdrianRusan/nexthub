import { z } from 'zod'

// Ensure Node.js globals are available
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
    }
  }
}

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),
  
  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default('/sign-in'),
  NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default('/sign-up'),
  NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL: z.string().default('/'),
  NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL: z.string().default('/'),
  
  // Stream.io
  NEXT_PUBLIC_STREAM_API_KEY: z.string().min(1),
  STREAM_SECRET_KEY: z.string().min(1),
  
  // Application
  NEXT_PUBLIC_BASE_URL: z.string().url(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  
  // Rate Limiting (Upstash Redis)
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  
  // Monitoring (Sentry)
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),
})

type Env = z.infer<typeof envSchema>

const parseEnv = (): Env => {
  try {
    return envSchema.parse(process.env)
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.error('❌ Invalid environment variables:')
      error.errors.forEach((err: z.ZodIssue) => {
        console.error(`  ${err.path.join('.')}: ${err.message}`)
      })
      if (typeof process !== 'undefined') {
        process.exit(1)
      }
    }
    throw error
  }
}

export const env = parseEnv()

// Type-safe environment variables for client-side usage
export const clientEnv = {
  CLERK_PUBLISHABLE_KEY: env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  STREAM_API_KEY: env.NEXT_PUBLIC_STREAM_API_KEY,
  BASE_URL: env.NEXT_PUBLIC_BASE_URL,
  SENTRY_DSN: env.NEXT_PUBLIC_SENTRY_DSN,
  NODE_ENV: env.NODE_ENV,
} as const