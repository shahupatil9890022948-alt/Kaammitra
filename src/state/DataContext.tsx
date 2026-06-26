import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  AppSettings,
  BusinessNote,
  DocumentProgress,
  Expense,
  ParsedResult,
  Reminder,
  UdhaarEntry,
} from '../models/types';
import {
  clearAll,
  readCollection,
  readDoc,
  uid,
  writeCollection,
  writeDoc,
} from '../db/storage';
import { buildSeedData } from '../db/seed';
import { track } from '../analytics/analytics';
import { cancelReminder, scheduleReminder } from '../notifications/notifications';

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en',
  theme: 'system',
  notificationsEnabled: false,
  onboardingCompleted: false,
  userName: '',
};

interface DataContextValue {
  ready: boolean;
  settings: AppSettings;
  reminders: Reminder[];
  expenses: Expense[];
  udhaar: UdhaarEntry[];
  notes: BusinessNote[];
  docProgress: DocumentProgress[];

  updateSettings: (patch: Partial<AppSettings>) => Promise<void>;
  completeOnboarding: (name: string) => Promise<void>;

  addReminder: (
    data: Pick<Reminder, 'title' | 'category' | 'dueAt'> &
      Partial<Pick<Reminder, 'note' | 'source'>>,
  ) => Promise<Reminder>;
  toggleReminder: (id: string) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;

  addExpense: (
    data: Pick<Expense, 'amount' | 'category'> &
      Partial<Pick<Expense, 'note' | 'source' | 'spentAt'>>,
  ) => Promise<Expense>;
  deleteExpense: (id: string) => Promise<void>;

  addUdhaar: (
    data: Pick<UdhaarEntry, 'personName' | 'amount' | 'direction'> &
      Partial<Pick<UdhaarEntry, 'note' | 'source' | 'dueAt' | 'status'>>,
  ) => Promise<UdhaarEntry>;
  setUdhaarStatus: (id: string, status: UdhaarEntry['status']) => Promise<void>;
  deleteUdhaar: (id: string) => Promise<void>;

  addNote: (
    data: Pick<BusinessNote, 'title'> & Partial<Pick<BusinessNote, 'body' | 'source'>>,
  ) => Promise<BusinessNote>;
  deleteNote: (id: string) => Promise<void>;

  getDocProgress: (templateId: string) => DocumentProgress | undefined;
  setDocItem: (templateId: string, itemKey: string, checked: boolean) => Promise<void>;
  setDocNote: (templateId: string, note: string) => Promise<void>;

  commitParsed: (parsed: ParsedResult) => Promise<void>;
  resetData: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [udhaar, setUdhaar] = useState<UdhaarEntry[]>([]);
  const [notes, setNotes] = useState<BusinessNote[]>([]);
  const [docProgress, setDocProgress] = useState<DocumentProgress[]>([]);

  // Initial load: hydrate from storage; seed sample data on very first run.
  useEffect(() => {
    (async () => {
      const storedSettings = await readDoc<AppSettings>('settings');
      const [r, e, u, n, d] = await Promise.all([
        readCollection<Reminder>('reminders'),
        readCollection<Expense>('expenses'),
        readCollection<UdhaarEntry>('udhaar'),
        readCollection<BusinessNote>('notes'),
        readCollection<DocumentProgress>('docProgress'),
      ]);

      if (!storedSettings) {
        const seed = buildSeedData();
        await Promise.all([
          writeCollection('reminders', seed.reminders),
          writeCollection('expenses', seed.expenses),
          writeCollection('udhaar', seed.udhaar),
          writeCollection('notes', seed.notes),
          writeDoc('settings', DEFAULT_SETTINGS),
        ]);
        setReminders(seed.reminders);
        setExpenses(seed.expenses);
        setUdhaar(seed.udhaar);
        setNotes(seed.notes);
        setSettings(DEFAULT_SETTINGS);
      } else {
        setSettings(storedSettings);
        setReminders(r);
        setExpenses(e);
        setUdhaar(u);
        setNotes(n);
        setDocProgress(d);
      }
      setReady(true);
    })();
  }, []);

  const persistReminders = useCallback(async (next: Reminder[]) => {
    setReminders(next);
    await writeCollection('reminders', next);
  }, []);
  const persistExpenses = useCallback(async (next: Expense[]) => {
    setExpenses(next);
    await writeCollection('expenses', next);
  }, []);
  const persistUdhaar = useCallback(async (next: UdhaarEntry[]) => {
    setUdhaar(next);
    await writeCollection('udhaar', next);
  }, []);
  const persistNotes = useCallback(async (next: BusinessNote[]) => {
    setNotes(next);
    await writeCollection('notes', next);
  }, []);
  const persistDocs = useCallback(async (next: DocumentProgress[]) => {
    setDocProgress(next);
    await writeCollection('docProgress', next);
  }, []);

  const updateSettings = useCallback(
    async (patch: Partial<AppSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        writeDoc('settings', next);
        return next;
      });
    },
    [],
  );

  const completeOnboarding = useCallback(
    async (name: string) => {
      await updateSettings({ onboardingCompleted: true, userName: name.trim() });
      await track('onboarding_completed', { language: settings.language });
    },
    [settings.language, updateSettings],
  );

  const addReminder = useCallback<DataContextValue['addReminder']>(
    async (data) => {
      const ts = Date.now();
      let notificationId: string | null = null;
      if (data.dueAt && data.dueAt > ts) {
        notificationId = await scheduleReminder('KaamMitra', data.title, data.dueAt);
      }
      const reminder: Reminder = {
        id: uid('rem'),
        title: data.title,
        category: data.category,
        dueAt: data.dueAt ?? null,
        note: data.note,
        completed: false,
        notificationId,
        source: data.source ?? 'manual',
        createdAt: ts,
        updatedAt: ts,
        synced: false,
      };
      await persistReminders([reminder, ...reminders]);
      await track('reminder_created', { category: reminder.category, source: reminder.source });
      return reminder;
    },
    [persistReminders, reminders],
  );

  const toggleReminder = useCallback(
    async (id: string) => {
      const target = reminders.find((r) => r.id === id);
      const next = reminders.map((r) =>
        r.id === id ? { ...r, completed: !r.completed, updatedAt: Date.now(), synced: false } : r,
      );
      await persistReminders(next);
      if (target && !target.completed) {
        await cancelReminder(target.notificationId);
        await track('reminder_completed', { category: target.category });
      }
    },
    [persistReminders, reminders],
  );

  const deleteReminder = useCallback(
    async (id: string) => {
      const target = reminders.find((r) => r.id === id);
      await cancelReminder(target?.notificationId);
      await persistReminders(reminders.filter((r) => r.id !== id));
    },
    [persistReminders, reminders],
  );

  const addExpense = useCallback<DataContextValue['addExpense']>(
    async (data) => {
      const ts = Date.now();
      const expense: Expense = {
        id: uid('exp'),
        amount: data.amount,
        category: data.category,
        note: data.note,
        spentAt: data.spentAt ?? ts,
        source: data.source ?? 'manual',
        createdAt: ts,
        updatedAt: ts,
        synced: false,
      };
      await persistExpenses([expense, ...expenses]);
      await track('expense_added', { category: expense.category, amount: expense.amount, source: expense.source });
      return expense;
    },
    [expenses, persistExpenses],
  );

  const deleteExpense = useCallback(
    async (id: string) => {
      await persistExpenses(expenses.filter((e) => e.id !== id));
    },
    [expenses, persistExpenses],
  );

  const addUdhaar = useCallback<DataContextValue['addUdhaar']>(
    async (data) => {
      const ts = Date.now();
      const entry: UdhaarEntry = {
        id: uid('udh'),
        personName: data.personName,
        amount: data.amount,
        direction: data.direction,
        status: data.status ?? 'pending',
        dueAt: data.dueAt ?? null,
        note: data.note,
        source: data.source ?? 'manual',
        createdAt: ts,
        updatedAt: ts,
        synced: false,
      };
      await persistUdhaar([entry, ...udhaar]);
      await track('udhaar_added', { direction: entry.direction, amount: entry.amount, source: entry.source });
      return entry;
    },
    [persistUdhaar, udhaar],
  );

  const setUdhaarStatus = useCallback(
    async (id: string, status: UdhaarEntry['status']) => {
      const next = udhaar.map((u) =>
        u.id === id ? { ...u, status, updatedAt: Date.now(), synced: false } : u,
      );
      await persistUdhaar(next);
    },
    [persistUdhaar, udhaar],
  );

  const deleteUdhaar = useCallback(
    async (id: string) => {
      await persistUdhaar(udhaar.filter((u) => u.id !== id));
    },
    [persistUdhaar, udhaar],
  );

  const addNote = useCallback<DataContextValue['addNote']>(
    async (data) => {
      const ts = Date.now();
      const note: BusinessNote = {
        id: uid('note'),
        title: data.title,
        body: data.body,
        source: data.source ?? 'manual',
        createdAt: ts,
        updatedAt: ts,
        synced: false,
      };
      await persistNotes([note, ...notes]);
      return note;
    },
    [notes, persistNotes],
  );

  const deleteNote = useCallback(
    async (id: string) => {
      await persistNotes(notes.filter((n) => n.id !== id));
    },
    [notes, persistNotes],
  );

  const getDocProgress = useCallback(
    (templateId: string) => docProgress.find((d) => d.templateId === templateId),
    [docProgress],
  );

  const ensureDoc = useCallback(
    (templateId: string): DocumentProgress => {
      const existing = docProgress.find((d) => d.templateId === templateId);
      if (existing) return existing;
      const ts = Date.now();
      return {
        id: uid('doc'),
        templateId,
        checked: {},
        note: '',
        createdAt: ts,
        updatedAt: ts,
        synced: false,
      };
    },
    [docProgress],
  );

  const upsertDoc = useCallback(
    async (doc: DocumentProgress, isNew: boolean) => {
      const next = isNew
        ? [...docProgress, doc]
        : docProgress.map((d) => (d.id === doc.id ? doc : d));
      await persistDocs(next);
    },
    [docProgress, persistDocs],
  );

  const setDocItem = useCallback(
    async (templateId: string, itemKey: string, checked: boolean) => {
      const isNew = !docProgress.some((d) => d.templateId === templateId);
      const base = ensureDoc(templateId);
      const wasEmpty = Object.values(base.checked).every((v) => !v);
      const updated: DocumentProgress = {
        ...base,
        checked: { ...base.checked, [itemKey]: checked },
        updatedAt: Date.now(),
        synced: false,
      };
      await upsertDoc(updated, isNew);
      if (isNew || (wasEmpty && checked)) {
        await track('checklist_started', { templateId });
      }
    },
    [docProgress, ensureDoc, upsertDoc],
  );

  const setDocNote = useCallback(
    async (templateId: string, note: string) => {
      const isNew = !docProgress.some((d) => d.templateId === templateId);
      const base = ensureDoc(templateId);
      await upsertDoc({ ...base, note, updatedAt: Date.now(), synced: false }, isNew);
    },
    [docProgress, ensureDoc, upsertDoc],
  );

  const commitParsed = useCallback(
    async (parsed: ParsedResult) => {
      await track('voice_input_used', { kind: parsed.kind });
      switch (parsed.kind) {
        case 'reminder':
          await addReminder({
            title: parsed.title ?? parsed.rawInput,
            category: (parsed.category as Reminder['category']) ?? 'personal',
            dueAt: parsed.dueAt ?? null,
            note: parsed.note,
            source: 'voice',
          });
          break;
        case 'expense':
          await addExpense({
            amount: parsed.amount ?? 0,
            category: (parsed.category as Expense['category']) ?? 'other',
            note: parsed.note,
            source: 'voice',
          });
          break;
        case 'udhaar':
          await addUdhaar({
            personName: parsed.personName ?? 'Unknown',
            amount: parsed.amount ?? 0,
            direction: parsed.direction ?? 'given',
            dueAt: parsed.dueAt ?? null,
            note: parsed.note,
            source: 'voice',
          });
          break;
        case 'document_task':
          await addNote({
            title: parsed.title ?? parsed.rawInput,
            body: `Document task: ${parsed.rawInput}`,
            source: 'voice',
          });
          break;
        case 'business_note':
        default:
          await addNote({
            title: parsed.title ?? parsed.rawInput,
            body: parsed.note,
            source: 'voice',
          });
          break;
      }
    },
    [addExpense, addNote, addReminder, addUdhaar],
  );

  const resetData = useCallback(async () => {
    await clearAll();
    const seed = buildSeedData();
    const freshSettings: AppSettings = { ...DEFAULT_SETTINGS, onboardingCompleted: true, userName: settings.userName, language: settings.language, theme: settings.theme };
    await Promise.all([
      writeCollection('reminders', seed.reminders),
      writeCollection('expenses', seed.expenses),
      writeCollection('udhaar', seed.udhaar),
      writeCollection('notes', seed.notes),
      writeCollection('docProgress', []),
      writeDoc('settings', freshSettings),
    ]);
    setReminders(seed.reminders);
    setExpenses(seed.expenses);
    setUdhaar(seed.udhaar);
    setNotes(seed.notes);
    setDocProgress([]);
    setSettings(freshSettings);
  }, [settings.language, settings.theme, settings.userName]);

  const value = useMemo<DataContextValue>(
    () => ({
      ready,
      settings,
      reminders,
      expenses,
      udhaar,
      notes,
      docProgress,
      updateSettings,
      completeOnboarding,
      addReminder,
      toggleReminder,
      deleteReminder,
      addExpense,
      deleteExpense,
      addUdhaar,
      setUdhaarStatus,
      deleteUdhaar,
      addNote,
      deleteNote,
      getDocProgress,
      setDocItem,
      setDocNote,
      commitParsed,
      resetData,
    }),
    [
      ready, settings, reminders, expenses, udhaar, notes, docProgress,
      updateSettings, completeOnboarding, addReminder, toggleReminder, deleteReminder,
      addExpense, deleteExpense, addUdhaar, setUdhaarStatus, deleteUdhaar, addNote,
      deleteNote, getDocProgress, setDocItem, setDocNote, commitParsed, resetData,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
