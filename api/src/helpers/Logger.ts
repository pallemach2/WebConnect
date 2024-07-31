// Custom imports
import FileLogger from '@helpers/FileLogger';

export type logLevel = 'error' | 'warn' | 'info' | 'log' | 'debug';

export const logLevels: logLevel[] = ['error', 'warn', 'info', 'log', 'debug'];

export type LoggerOptions = {
  logLevel: logLevel;
  logFile: string;
};

declare global {
  interface Date {
    format(format: string): string;
  }
}

Date.prototype.format = function (format) {
  let date = this;
  return format.replace(/(yyyy|mm|dd|hh|MM|ss)/gi, function (key) {
    switch (key) {
      case 'yyyy':
        return date.getFullYear();
      case 'mm':
        let x = (date.getMonth() + 1).toString();
        x = x.length === 1 ? '0' + x : x;
        return x;
      case 'dd':
        let y = date.getDate().toString();
        y = y.length === 1 ? '0' + y : y;
        return y;
      case 'hh':
        let z = date.getHours().toString();
        z = z.length === 1 ? '0' + z : z;
        return z;
      case 'MM':
        let a = date.getMinutes().toString();
        a = a.length === 1 ? '0' + a : a;
        return a;
      case 'ss':
        let b = date.getSeconds().toString();
        b = b.length === 1 ? '0' + b : b;
        return b;
      default:
        return key;
    }
  });
};

export class LoggerClass {
  env: string;
  logLevel: logLevel;
  logFile: string;
  transports: Array<Console | FileLogger>;

  constructor(transports: Array<Console | FileLogger> = [console]) {
    this.transports = transports;
  }

  init(env: string, options: LoggerOptions) {
    try {
      this.env = env;
      this.logLevel = options.logLevel;
      this.logFile = options.logFile;

      // if (this.env !== 'production') {
      this.initTransport(env, options);
      // }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }

  initTransport(env: string, options: LoggerOptions) {
    this.transports.push(new FileLogger(env, options));
  }

  shouldLog(method: logLevel) {
    const appLogLevel = logLevels.findIndex((f) => f === this.logLevel);
    const methodLogLevel = logLevels.findIndex((f) => f === method);

    return methodLogLevel <= appLogLevel;
  }

  log(ctx: unknown, ...args: unknown[]) {
    return this.send(ctx, 'log', ...args);
  }

  error(ctx: unknown, ...args: unknown[]) {
    return this.send(ctx, 'error', ...args);
  }

  warn(ctx: unknown, ...args: unknown[]) {
    return this.send(ctx, 'warn', ...args);
  }

  info(ctx: unknown, ...args: unknown[]) {
    return this.send(ctx, 'info', ...args);
  }

  debug(ctx: unknown, ...args: unknown[]) {
    return this.send(ctx, 'debug', ...args);
  }

  send(ctx: unknown, method: logLevel, ...args: unknown[]) {
    try {
      if (this.shouldLog(method)) {
        this.transports.forEach((t) => {
          args.forEach((a) => {
            if (typeof a !== 'string') {
              a = JSON.stringify(a, null, 2).replace(/\n\r?/g, '\n\t');
            }

            const timestamp = new Date().format('hh:MM:ss');

            const content = `${timestamp} ${method.toUpperCase()} : ${a}`;

            t[method](content);
          });
        });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
}

// Singleton
const Logger = new LoggerClass();

export default Logger;
