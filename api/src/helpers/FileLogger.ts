/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
// eslint-disable-next-line import/no-cycle
import { LoggerOptions, logLevel } from './Logger';

class FileLogger {
  env: string;
  logLevel: logLevel;
  logFile: string;
  transports: any[];

  constructor(env: string, options: LoggerOptions) {
    this.env = env;
    this.logLevel = options.logLevel;
    this.logFile = options.logFile;
  }

  getFileName() {
    return this.logFile.replace('$date', new Date().format('yyyy-mm-dd'));
  }

  log(...args: any) {
    return this.send('log', ...args);
  }

  error(...args: any) {
    return this.send('error', ...args);
  }

  warn(...args: any) {
    return this.send('warn', ...args);
  }

  info(...args: any) {
    return this.send('info', ...args);
  }

  debug(...args: any) {
    return this.send('debug', ...args);
  }

  send(method: logLevel, ...args: any) {
    try {
      args.forEach((a: any) => {
        fs.appendFile(this.getFileName(), `${a} \n`, (e) => {
          if (e !== null) throw e;
        });
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
}

export default FileLogger;
