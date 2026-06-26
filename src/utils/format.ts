import { LanguageCode } from '../models/types';

/**
 * Indian-style grouping (e.g. 12,34,567) without relying on Intl/`toLocaleString`,
 * because Hermes on many budget Android phones ships a limited ICU and may not
 * group `en-IN` correctly. Pure string math = same output on every device.
 */
export function formatCurrency(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  const negative = safe < 0;
  const digits = String(Math.round(Math.abs(safe)));
  let grouped: string;
  if (digits.length <= 3) {
    grouped = digits;
  } else {
    const last3 = digits.slice(-3);
    const rest = digits.slice(0, -3);
    grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
  }
  return `${negative ? '-' : ''}₹${grouped}`;
}

const LOCALES: Record<LanguageCode, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

export function formatDate(ts: number | null, lang: LanguageCode): string {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleDateString(LOCALES[lang] ?? 'en-IN', {
      day: 'numeric',
      month: 'short',
    });
  } catch {
    return new Date(ts).toDateString();
  }
}

export function formatDateTime(ts: number | null, lang: LanguageCode): string {
  if (!ts) return '';
  try {
    return new Date(ts).toLocaleString(LOCALES[lang] ?? 'en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return new Date(ts).toString();
  }
}

export function isToday(ts: number | null): boolean {
  if (!ts) return false;
  const d = new Date(ts);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function startOfToday(): number {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function startOfWeek(): number {
  const d = new Date();
  const day = d.getDay();
  const diff = (day + 6) % 7; // Monday as first day
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function relativeDay(ts: number | null, lang: LanguageCode): string {
  if (!ts) return '';
  const today = startOfToday();
  const dayMs = 24 * 60 * 60 * 1000;
  const diff = Math.round((new Date(ts).setHours(0, 0, 0, 0) - today) / dayMs);
  const labels: Record<LanguageCode, Record<string, string>> = {
    en: { '-1': 'Yesterday', '0': 'Today', '1': 'Tomorrow' },
    hi: { '-1': 'कल', '0': 'आज', '1': 'कल' },
    mr: { '-1': 'काल', '0': 'आज', '1': 'उद्या' },
  };
  const table = labels[lang] ?? labels.en;
  if (table[String(diff)]) return table[String(diff)];
  return formatDate(ts, lang);
}
