let debugEnabled = false

export const enableDebug = (value: boolean) => {
  debugEnabled = value
}

export const logger = {
  debug: (...args: unknown[]) => {
    if (debugEnabled) {
      console.log('[debug]', ...args)
    }
  },
  info: (...args: unknown[]) => {
    console.log(...args)
  },
  error: (...args: unknown[]) => {
    console.error(...args)
  },
}

export default logger
