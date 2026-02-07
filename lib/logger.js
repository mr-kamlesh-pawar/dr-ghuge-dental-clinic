class Logger {
  constructor(module) {
    this.module = module;
    this.enabled = process.env.NODE_ENV !== 'production';
  }

  log(level, message, data = {}) {
    if (!this.enabled) return;

    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      module: this.module,
      level,
      message,
      ...data
    };

    switch(level) {
      case 'ERROR':
        console.error(`[${timestamp}] [${this.module}] ERROR:`, message, data);
        break;
      case 'WARN':
        console.warn(`[${timestamp}] [${this.module}] WARN:`, message, data);
        break;
      case 'INFO':
        console.info(`[${timestamp}] [${this.module}] INFO:`, message, data);
        break;
      case 'DEBUG':
        console.debug(`[${timestamp}] [${this.module}] DEBUG:`, message, data);
        break;
      default:
        console.log(`[${timestamp}] [${this.module}] ${level}:`, message, data);
    }

    // You could also save to a file or send to logging service here
    return logEntry;
  }

  info(message, data) {
    return this.log('INFO', message, data);
  }

  debug(message, data) {
    return this.log('DEBUG', message, data);
  }

  warn(message, data) {
    return this.log('WARN', message, data);
  }

  error(message, data) {
    return this.log('ERROR', message, data);
  }

  start(operation, data = {}) {
    this.info(`START: ${operation}`, data);
    return {
      operation,
      startTime: Date.now(),
      log: this
    };
  }

  end(context, result = {}, error = null) {
    const duration = Date.now() - context.startTime;
    
    if (error) {
      this.error(`END: ${context.operation} - FAILED`, {
        duration: `${duration}ms`,
        error: error.message,
        stack: error.stack,
        ...result
      });
    } else {
      this.info(`END: ${context.operation} - SUCCESS`, {
        duration: `${duration}ms`,
        ...result
      });
    }
    
    return { duration, error, result };
  }
}

// Create module-specific loggers
export const createLogger = (module) => new Logger(module);

// Default logger
export const logger = createLogger('App');