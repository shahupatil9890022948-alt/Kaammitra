/**
 * KaamMitra data models.
 *
 * The schema is intentionally local-first and sync-ready: every record carries a
 * stable `id`, `createdAt`/`updatedAt` timestamps, and (where relevant) a soft
 * `synced` flag so a future backend can reconcile offline changes without a
 * destructive migration.
 */

export type LanguageCode = 'en' | 'hi' | 'mr';

export type ThemeMode = 'system' | 'light' | 'dark';

/** High-level classification produced by the parsing engine. */
export type ParsedKind =
  | 'reminder'
  | 'expense'
  | 'udhaar'
  | 'business_note'
  | 'document_task';

export type ReminderCategory =
  | 'bills'
  | 'payments'
  | 'personal'
  | 'business'
  | 'study'
  | 'health';

export type ExpenseCategory =
  | 'food'
  | 'home'
  | 'travel'
  | 'business'
  | 'medicine'
  | 'recharge'
  | 'rent'
  | 'shopping'
  | 'other';

export type UdhaarDirection = 'given' | 'received';

export type UdhaarStatus = 'pending' | 'paid' | 'overdue';

export interface User {
  id: string;
  name: string;
  language: LanguageCode;
  createdAt: number;
}

export interface Reminder {
  id: string;
  title: string;
  category: ReminderCategory;
  /** Epoch ms for when the reminder is due (and when a notification fires). */
  dueAt: number | null;
  note?: string;
  completed: boolean;
  /** Local notification identifier, if one has been scheduled. */
  notificationId?: string | null;
  source: 'voice' | 'manual';
  createdAt: number;
  updatedAt: number;
  synced: boolean;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note?: string;
  /** Epoch ms of when the spend happened (defaults to creation time). */
  spentAt: number;
  source: 'voice' | 'manual';
  createdAt: number;
  updatedAt: number;
  synced: boolean;
}

export interface UdhaarEntry {
  id: string;
  personName: string;
  amount: number;
  direction: UdhaarDirection;
  status: UdhaarStatus;
  dueAt: number | null;
  note?: string;
  source: 'voice' | 'manual';
  createdAt: number;
  updatedAt: number;
  synced: boolean;
}

export interface BusinessNote {
  id: string;
  title: string;
  body?: string;
  source: 'voice' | 'manual';
  createdAt: number;
  updatedAt: number;
  synced: boolean;
}

export interface DocumentChecklistItem {
  key: string;
  /** Localized labels keyed by language code. */
  label: Record<LanguageCode, string>;
}

export interface DocumentTemplate {
  id: string;
  /** Localized template titles keyed by language code. */
  title: Record<LanguageCode, string>;
  icon: string;
  items: DocumentChecklistItem[];
}

export interface DocumentProgress {
  id: string;
  templateId: string;
  /** Map of checklist item key -> completed flag. */
  checked: Record<string, boolean>;
  note?: string;
  createdAt: number;
  updatedAt: number;
  synced: boolean;
}

export interface AppSettings {
  language: LanguageCode;
  theme: ThemeMode;
  notificationsEnabled: boolean;
  onboardingCompleted: boolean;
  userName: string;
}

/** Shape returned by the parsing engine before it is committed to storage. */
export interface ParsedResult {
  kind: ParsedKind;
  title?: string;
  amount?: number;
  personName?: string;
  dueAt?: number | null;
  reminderTime?: number | null;
  category?: ReminderCategory | ExpenseCategory;
  note?: string;
  direction?: UdhaarDirection;
  /** 0..1 confidence; below `clarifyThreshold` we ask one short question. */
  confidence: number;
  /** Single clarification question when the input is ambiguous. */
  clarification?: string;
  rawInput: string;
}
