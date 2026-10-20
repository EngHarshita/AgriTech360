/* eslint-disable no-console */

const getTimestamp = (): string => new Date().toISOString();

export const logger = {
  info: (message: string, ...args: unknown[]): void => {
    console.log(`\x1b[32m[INFO]\x1b[0m [${getTimestamp()}] ${message}`, ...args);
  },
  warn: (message: string, ...args: unknown[]): void => {
    console.warn(`\x1b[33m[WARN]\x1b[0m [${getTimestamp()}] ${message}`, ...args);
  },
  error: (message: string, ...args: unknown[]): void => {
    console.error(`\x1b[31m[ERROR]\x1b[0m [${getTimestamp()}] ${message}`, ...args);
  },
  debug: (message: string, ...args: unknown[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`\x1b[36m[DEBUG]\x1b[0m [${getTimestamp()}] ${message}`, ...args);
    }
  },
  // Stream interface for Morgan HTTP logger integration
  stream: {
    write: (message: string): void => {
      // Morgan adds its own trailing newline, trim it
      const trimmed = message.trim();
      if (trimmed.length > 0) {
        console.log(`\x1b[35m[HTTP]\x1b[0m [${getTimestamp()}] ${trimmed}`);
      }
    }
  }
};
