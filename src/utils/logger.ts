import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.resolve('logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function getTime(): string {
  const now = new Date();
  return now.toLocaleTimeString('en-IN', { hour12: false });
}

function getLogFilePath(): string {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return path.join(logsDir, `${today}.log`);
}

function writeToFile(type: string, message: string): void {
  const logLine = `[${getTime()}] ${type.padEnd(7)} : ${message}\n`;
  fs.appendFileSync(getLogFilePath(), logLine);
}

type LogMethod = (msg: string) => void;

export const log: {
  info: LogMethod;
  warn: LogMethod;
  error: LogMethod;
  debug: LogMethod;
} = {
  info: (msg) => {
    const formatted = chalk.cyan.bold(`[${getTime()}] INFO    : ❯ `) + msg;
    console.log(formatted);
    writeToFile('INFO', msg);
  },
  warn: (msg) => {
    const formatted = chalk.yellow.bold(`[${getTime()}] WARNING : ⚠ `) + msg;
    console.log(formatted);
    writeToFile('WARNING', msg);
  },
  error: (msg) => {
    const formatted = chalk.red.bold(`[${getTime()}] ERROR   : ✖ `) + msg;
    console.log(formatted);
    writeToFile('ERROR', msg);
  },
  debug: (msg) => {
    const formatted = chalk.gray.bold(`[${getTime()}] DEBUG   : › `) + msg;
    console.log(formatted);
    writeToFile('DEBUG', msg);
  },
};
