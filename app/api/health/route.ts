import { NextRequest, NextResponse } from 'next/server'
import { healthCheck } from '@/lib/db'
import { log } from '@/lib/logger'

// Ensure Node.js globals are available
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined
    }
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    // Check database connectivity
    const dbHealthy = await healthCheck()
    
    // Check Stream.io API key presence
    const streamConfigured = !!(
      process.env.NEXT_PUBLIC_STREAM_API_KEY && 
      process.env.STREAM_SECRET_KEY
    )
    
    // Check Clerk configuration
    const clerkConfigured = !!(
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
      process.env.CLERK_SECRET_KEY
    )
    
    const responseTime = Date.now() - startTime
    const isHealthy = dbHealthy && streamConfigured && clerkConfigured
    
    const healthData = {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
      services: {
        database: dbHealthy ? 'healthy' : 'unhealthy',
        stream: streamConfigured ? 'configured' : 'missing_config',
        clerk: clerkConfigured ? 'configured' : 'missing_config',
      }
    }
    
    log.info('Health check completed', {
      status: healthData.status,
      responseTime,
      services: healthData.services
    })
    
    return NextResponse.json(healthData, {
      status: isHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
    
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    log.error('Health check failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      responseTime
    })
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      error: 'Health check failed'
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  }
}

// Simplified readiness probe
export async function HEAD(request: NextRequest) {
  try {
    const dbHealthy = await healthCheck()
    return new NextResponse(null, {
      status: dbHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    })
  } catch {
    return new NextResponse(null, { status: 503 })
  }
}