/**
 * Minimal tagged logger for debugging on real devices.
 *
 * Keeps a small in-memory ring buffer so QA can inspect recent events even when
 * a device isn't attached to Metro. Never throws.
 */
type Level = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: Level;
  tag: string;
  message: string;
  ts: number;
}

const RING_SIZE = 100;
const ring: LogEntry[] = [];

function push(level: Level, tag: string, message: string, extra?: unknown) {
  const entry: LogEntry = { level, tag, message, ts: Date.now() };
  ring.push(entry);
  if (ring.length > RING_SIZE) ring.shift();
  const line = `[KaamMitra:${tag}] ${message}`;
  const fn = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
  if (extra !== undefined) fn(line, extra);
  else fn(line);
}

export const log = {
  debug: (tag: string, msg: string, extra?: unknown) => {
    if (__DEV__) push('debug', tag, msg, extra);
  },
  info: (tag: string, msg: string, extra?: unknown) => push('info', tag, msg, extra),
  warn: (tag: string, msg: string, extra?: unknown) => push('warn', tag, msg, extra),
  error: (tag: string, msg: string, extra?: unknown) => push('error', tag, msg, extra),
};

/** Recent log entries (newest last) — handy for an in-app debug view later. */
export function getRecentLogs(): LogEntry[] {
  return [...ring];
}
