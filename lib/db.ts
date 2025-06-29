import { PrismaClient } from '@prisma/client'
import { env } from './env'

// Ensure Node.js globals are available
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
    }
  }
}

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create a singleton Prisma client
export const db = globalForPrisma.prisma ?? new PrismaClient({
  log: env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  errorFormat: 'pretty',
})

// In development, store the client on the global object to prevent
// creating multiple instances due to hot reloading
if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Graceful shutdown handling
process.on('beforeExit', async () => {
  await db.$disconnect()
})

// Health check function
export async function healthCheck(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

// Database connection test
export async function testConnection(): Promise<void> {
  try {
    await db.$connect()
    console.log('✅ Database connected successfully')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    throw error
  }
}