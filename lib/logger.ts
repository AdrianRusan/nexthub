import winston from 'winston'
import { env } from './env'

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
}

// Define log colors for console output
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

// Add colors to winston
winston.addColors(colors)

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info: winston.Logform.TransformableInfo) => `${info.timestamp} ${info.level}: ${info.message}`
  )
)

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

// Define transports
const transports = []

// Console transport for development
if (env.NODE_ENV === 'development') {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
    })
  )
}

// File transports for production
if (env.NODE_ENV === 'production') {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: 'logs/all.log',
      format: fileFormat,
    })
  )
}

// Create the logger
const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'warn',
  levels,
  format: fileFormat,
  transports,
  exitOnError: false,
})

// Enhanced logging methods with context
export const log = {
  error: (message: string, meta?: Record<string, any>) => {
    logger.error(message, { ...meta, timestamp: new Date().toISOString() })
  },
  
  warn: (message: string, meta?: Record<string, any>) => {
    logger.warn(message, { ...meta, timestamp: new Date().toISOString() })
  },
  
  info: (message: string, meta?: Record<string, any>) => {
    logger.info(message, { ...meta, timestamp: new Date().toISOString() })
  },
  
  http: (message: string, meta?: Record<string, any>) => {
    logger.http(message, { ...meta, timestamp: new Date().toISOString() })
  },
  
  debug: (message: string, meta?: Record<string, any>) => {
    logger.debug(message, { ...meta, timestamp: new Date().toISOString() })
  },

  // Specialized methods for common use cases
  auth: (message: string, userId?: string, meta?: Record<string, any>) => {
    logger.info(`[AUTH] ${message}`, { 
      userId, 
      ...meta, 
      category: 'authentication',
      timestamp: new Date().toISOString() 
    })
  },

  meeting: (message: string, meetingId?: string, userId?: string, meta?: Record<string, any>) => {
    logger.info(`[MEETING] ${message}`, { 
      meetingId, 
      userId, 
      ...meta, 
      category: 'meeting',
      timestamp: new Date().toISOString() 
    })
  },

  api: (message: string, method?: string, path?: string, statusCode?: number, meta?: Record<string, any>) => {
    logger.http(`[API] ${message}`, { 
      method, 
      path, 
      statusCode, 
      ...meta, 
      category: 'api',
      timestamp: new Date().toISOString() 
    })
  },

  database: (message: string, operation?: string, table?: string, meta?: Record<string, any>) => {
    logger.debug(`[DB] ${message}`, { 
      operation, 
      table, 
      ...meta, 
      category: 'database',
      timestamp: new Date().toISOString() 
    })
  },

  security: (message: string, level: 'low' | 'medium' | 'high' | 'critical' = 'medium', meta?: Record<string, any>) => {
    const logLevel = level === 'critical' || level === 'high' ? 'error' : 'warn'
    logger.log(logLevel, `[SECURITY] ${message}`, { 
      securityLevel: level, 
      ...meta, 
      category: 'security',
      timestamp: new Date().toISOString() 
    })
  },
}

// Error tracking utility
export const trackError = (error: Error, context?: Record<string, any>) => {
  log.error(`Unhandled error: ${error.message}`, {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context,
    category: 'error_tracking',
  })
}

// Performance tracking utility
export const trackPerformance = (operation: string, duration: number, meta?: Record<string, any>) => {
  log.info(`Performance: ${operation} completed in ${duration}ms`, {
    operation,
    duration,
    ...meta,
    category: 'performance',
  })
}

export default logger