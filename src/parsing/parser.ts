import {
  ExpenseCategory,
  ParsedResult,
  ReminderCategory,
  UdhaarDirection,
} from '../models/types';

/**
 * KaamMitra parsing engine — the "invisible AI".
 *
 * This is a deterministic, offline, rule-based intent classifier + slot filler.
 * It deliberately avoids a chatbot/LLM round-trip so it stays instant, free and
 * private on budget devices and slow networks. It understands English, Hindi,
 * Marathi and mixed Hinglish/Marathi-English input.
 *
 * Output contract (see ParsedResult): a single intent `kind`, extracted slots
 * (title, amount, personName, dueAt, category, note), a confidence score, and
 * at most one short `clarification` question when something important is missing.
 */

const WEEKDAYS: Record<string, number> = {
  sunday: 0, ravivar: 0, raviwar: 0, itvar: 0,
  monday: 1, somvar: 1, somwar: 1,
  tuesday: 2, mangalvar: 2, mangalwar: 2,
  wednesday: 3, budhvar: 3, budhwar: 3,
  thursday: 4, guruvar: 4, guruwar: 4, brihaspativar: 4,
  friday: 5, shukravar: 5, shukrawar: 5,
  saturday: 6, shanivar: 6, shaniwar: 6,
};

const TIME_OF_DAY: Record<string, number> = {
  subah: 9, morning: 9, सुबह: 9, सकाळ: 9, सकाळी: 9,
  dopahar: 13, afternoon: 13, दोपहर: 13, दुपारी: 13,
  shaam: 18, sham: 18, evening: 18, शाम: 18, संध्याकाळ: 18, संध्याकाळी: 18,
  raat: 20, night: 20, रात: 20, रात्र: 20, रात्री: 20,
};

interface Keyword {
  words: string[];
  value: string;
}

const REMINDER_HINTS = [
  'yaad', 'याद', 'याद दिलाना', 'yaad dila', 'remind', 'reminder', 'रिमाइंडर',
  'आठवण', 'aathvan', 'athvan', 'aठवण', 'alarm', 'note me', 'mat bhulna', 'bhulna',
];

const UDHAAR_HINTS = ['udhaar', 'udhar', 'उधार', 'उधारी', 'baki', 'बाकी', 'borrow', 'lend', 'loan'];

const DOCUMENT_HINTS = [
  'document', 'documents', 'kagaz', 'kagzaat', 'kaagzaat', 'कागज', 'कागजात',
  'कागदपत्र', 'कागदपत्रे', 'form', 'फॉर्म', 'paperwork', 'certificate', 'dastavej',
];

const EXPENSE_HINTS = [
  'kharch', 'खर्च', 'spent', 'spend', 'me gaya', 'mein gaya', 'lag gaye', 'lage',
  'gaya', 'gaye', 'kharcha', 'paid for', 'bought', 'liya', 'kharidi', 'खर्ची',
  'झाले', 'लागले', 'खरेदी',
];

const REMINDER_CATEGORY: Keyword[] = [
  { value: 'bills', words: ['bill', 'bijli', 'light bill', 'बिजली', 'वीज', 'gas', 'गैस', 'गॅस', 'water bill', 'पानी', 'recharge bill', 'bill bhar'] },
  { value: 'payments', words: ['payment', 'pay', 'paisa', 'paise', 'भुगतान', 'पेमेंट', 'installment', 'emi', 'kist', 'किस्त', 'hapta', 'हप्ता'] },
  { value: 'health', words: ['doctor', 'dawai', 'davai', 'medicine', 'दवा', 'tablet', 'checkup', 'hospital', 'डॉक्टर', 'गोळी', 'tabiyat'] },
  { value: 'study', words: ['exam', 'padhai', 'study', 'homework', 'पढ़ाई', 'अभ्यास', 'class', 'paper', 'paper', 'परीक्षा', 'syllabus', 'assignment'] },
  { value: 'business', words: ['supplier', 'shop', 'dukan', 'दुकान', 'order', 'stock', 'maal', 'माल', 'customer', 'grahak', 'delivery'] },
  { value: 'personal', words: ['personal', 'ghar', 'घर', 'family', 'birthday', 'meeting', 'milna', 'milne'] },
];

const EXPENSE_CATEGORY: Keyword[] = [
  { value: 'travel', words: ['petrol', 'diesel', 'fuel', 'bus', 'train', 'auto', 'rickshaw', 'taxi', 'uber', 'ola', 'travel', 'पेट्रोल', 'डीजल', 'किराया भाडे', 'cab', 'metro', 'ticket'] },
  { value: 'food', words: ['khana', 'food', 'chai', 'tea', 'nashta', 'lunch', 'dinner', 'खाना', 'जेवण', 'sabzi', 'vegetable', 'groceries', 'kirana', 'किराना', 'dudh', 'milk', 'दूध', 'hotel', 'restaurant', 'snacks', 'pani puri'] },
  { value: 'medicine', words: ['dawai', 'davai', 'medicine', 'tablet', 'दवा', 'दवाई', 'औषध', 'doctor fees', 'syrup', 'injection'] },
  { value: 'recharge', words: ['recharge', 'रिचार्ज', 'mobile recharge', 'data', 'jio', 'airtel', 'vi', 'dth'] },
  { value: 'rent', words: ['rent', 'kiraya', 'किराया', 'भाडे', 'bhada', 'room rent'] },
  { value: 'home', words: ['ghar', 'घर', 'electricity', 'gas', 'cylinder', 'household', 'maintenance', 'सिलेंडर', 'gharkharch'] },
  { value: 'shopping', words: ['kapde', 'clothes', 'shopping', 'खरीदारी', 'shoes', 'kapda', 'कपड़े', 'कपडे', 'mall', 'gift'] },
  { value: 'business', words: ['stock', 'supplier', 'maal', 'माल', 'raw material', 'inventory', 'wholesale'] },
];

function normalize(input: string): string {
  return ` ${input.toLowerCase().replace(/[।.,!?]/g, ' ').replace(/\s+/g, ' ').trim()} `;
}

function containsAny(haystack: string, needles: string[]): boolean {
  return needles.some((n) => haystack.includes(` ${n} `) || haystack.includes(n));
}

function firstMatch(haystack: string, table: Keyword[]): string | undefined {
  for (const entry of table) {
    if (containsAny(haystack, entry.words)) return entry.value;
  }
  return undefined;
}

/** Extract the first money amount. Handles ₹, rs, rupaye, and comma grouping. */
function extractAmount(raw: string): number | undefined {
  const cleaned = raw.replace(/,/g, '');
  const match = cleaned.match(/(?:₹|rs\.?|inr|rupees?|rupaye?|रुपये?|रु)?\s*(\d+(?:\.\d{1,2})?)/i);
  if (match) {
    const value = parseFloat(match[1]);
    if (!Number.isNaN(value) && value > 0) return value;
  }
  return undefined;
}

function atHour(base: Date, hour: number): Date {
  const d = new Date(base);
  d.setHours(hour, 0, 0, 0);
  return d;
}

/** Resolve a due date/time from natural-language date + time-of-day cues. */
function extractDueAt(norm: string): number | null {
  const now = new Date();
  let day: Date | null = null;

  // NOTE: avoid \b word boundaries here — they are ASCII-only and never match
  // Devanagari (कल/आज/उद्या), so Hindi/Marathi dates would silently fail.
  if (containsAny(norm, ['aaj', 'आज', 'today'])) day = new Date(now);
  else if (containsAny(norm, ['kal', 'कल', 'उद्या', 'tomorrow'])) day = addDays(now, 1);
  else if (containsAny(norm, ['parso', 'परसों', 'परवा', 'day after'])) day = addDays(now, 2);
  else {
    for (const [name, dow] of Object.entries(WEEKDAYS)) {
      if (norm.includes(` ${name} `)) {
        day = nextWeekday(now, dow);
        break;
      }
    }
  }

  // Explicit clock time like "5 baje", "5 pm", "5:30".
  let hour: number | null = null;
  const clock = norm.match(/\b(\d{1,2})(?::(\d{2}))?\s*(am|pm|baje|बजे|वाजता)?\b/);
  if (clock && /(am|pm|baje|बजे|वाजता)/.test(clock[0])) {
    hour = parseInt(clock[1], 10);
    if (/pm/.test(clock[0]) && hour < 12) hour += 12;
    if (/am/.test(clock[0]) && hour === 12) hour = 0;
  }
  if (hour === null) {
    for (const [name, h] of Object.entries(TIME_OF_DAY)) {
      if (norm.includes(name)) {
        hour = h;
        break;
      }
    }
  }

  if (day) return atHour(day, hour ?? 9).getTime();
  if (hour !== null) {
    // Time but no day → today if still in the future, else tomorrow.
    const todayAt = atHour(now, hour);
    return (todayAt.getTime() > now.getTime() ? todayAt : atHour(addDays(now, 1), hour)).getTime();
  }
  return null;
}

function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

function nextWeekday(base: Date, dow: number): Date {
  const d = new Date(base);
  const diff = (dow - d.getDay() + 7) % 7 || 7;
  d.setDate(d.getDate() + diff);
  return d;
}

/** Person name near "ko"/"से"/"ne" markers, used for udhaar entries. */
function extractPerson(raw: string): string | undefined {
  const tokens = raw.trim().split(/\s+/);
  const markers = ['ko', 'को', 'ne', 'ने', 'se', 'से', 'la', 'ला', 'kade', 'कडे', 'kadun', 'कडून'];
  for (let i = 1; i < tokens.length; i++) {
    if (markers.includes(tokens[i].toLowerCase())) {
      const candidate = tokens[i - 1];
      if (candidate && !/^\d+$/.test(candidate)) return capitalize(candidate);
    }
  }
  // Fallback: a capitalized word that is not the first token.
  const cap = tokens.slice(1).find((tok) => /^[A-Z][a-zA-Z]+$/.test(tok));
  if (cap) return cap;
  return undefined;
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function makeTitle(raw: string): string {
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  const title = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return title.length > 80 ? `${title.slice(0, 77)}…` : title;
}

const CLARIFY_THRESHOLD = 0.55;

export function parseInput(rawInput: string): ParsedResult {
  const raw = (rawInput ?? '').trim();
  const norm = normalize(raw);
  const amount = extractAmount(raw);
  const dueAt = extractDueAt(norm);

  const hasReminder =
    containsAny(norm, REMINDER_HINTS) ||
    containsAny(norm, ['kal', 'aaj', 'parso', 'tomorrow', 'today', 'उद्या', 'कल', 'आज', 'परसों', 'परवा']);
  const hasUdhaar = containsAny(norm, UDHAAR_HINTS);
  const hasDocument = containsAny(norm, DOCUMENT_HINTS);
  const hasExpense = containsAny(norm, EXPENSE_HINTS);

  // 1) Udhaar: explicit udhaar word + an amount is the strongest signal.
  if (hasUdhaar && amount !== undefined) {
    const direction = detectUdhaarDirection(norm);
    const person = extractPerson(raw);
    return {
      kind: 'udhaar',
      amount,
      personName: person,
      direction,
      dueAt,
      note: raw,
      confidence: person ? 0.92 : 0.7,
      clarification: person ? undefined : 'Whose udhaar is this?',
      rawInput: raw,
    };
  }

  // 2) Document tasks: paperwork words with no money involved.
  if (hasDocument && amount === undefined) {
    return {
      kind: 'document_task',
      title: makeTitle(raw),
      note: raw,
      confidence: 0.82,
      rawInput: raw,
    };
  }

  // 3) Reminder: explicit remind words, or a future date with an action.
  if (hasReminder && !(hasExpense && amount !== undefined && !containsAny(norm, REMINDER_HINTS))) {
    const category = (firstMatch(norm, REMINDER_CATEGORY) as ReminderCategory) ?? 'personal';
    return {
      kind: 'reminder',
      title: makeTitle(raw),
      category,
      dueAt,
      reminderTime: dueAt,
      note: raw,
      confidence: dueAt ? 0.9 : 0.7,
      clarification: dueAt ? undefined : 'When should I remind you?',
      rawInput: raw,
    };
  }

  // 4) Expense: an amount with spend cues (and no remind intent).
  if (amount !== undefined && (hasExpense || !hasReminder)) {
    const category = (firstMatch(norm, EXPENSE_CATEGORY) as ExpenseCategory) ?? 'other';
    return {
      kind: 'expense',
      amount,
      category,
      note: raw,
      confidence: hasExpense || category !== 'other' ? 0.88 : 0.62,
      rawInput: raw,
    };
  }

  // 5) Fallback: keep it as a business/general note rather than guessing.
  return {
    kind: 'business_note',
    title: makeTitle(raw),
    note: raw,
    confidence: raw.length > 0 ? 0.5 : 0.2,
    clarification: raw.length > 0 ? undefined : 'Could you say that again?',
    rawInput: raw,
  };
}

function detectUdhaarDirection(norm: string): UdhaarDirection {
  const received = ['liya', 'लिया', 'घेतले', 'मिळाले', 'se liya', 'से लिया', 'received', 'मिळाली', 'lyi'];
  if (containsAny(norm, received)) return 'received';
  return 'given';
}

export const PARSER_CLARIFY_THRESHOLD = CLARIFY_THRESHOLD;
