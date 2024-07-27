/**
 * @param {String} content
 * @param {String} type='info'
 */
const logger = (content, type = 'info') => {
    const timestamp = `[${new Date().toLocaleString()}]:`
    const logTypes = {
      info: { method: console.log, style: '' },
      warn: { method: console.warn, style: '\x1b[33m' },
      error: { method: console.error, style: '\x1b[31m' },
      debug: { method: console.log, style: '\x1b[34m' },
      success: { method: console.log, style: '\x1b[32m' },
    }
  
    const logType = logTypes[type]
    if (!logType) {
      throw new TypeError(`Logger type must be one of: ${Object.keys(logTypes).join(', ')}`)
    }
  
    logType.method(`${logType.style}${timestamp} ${content}\x1b[0m`)
  }
  
  module.exports = { logger }