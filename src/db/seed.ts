import {
  BusinessNote,
  Expense,
  Reminder,
  UdhaarEntry,
} from '../models/types';
import { uid } from './storage';

function daysFromNow(n: number, hour = 9): number {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(hour, 0, 0, 0);
  return d.getTime();
}

function hoursAgo(n: number): number {
  return Date.now() - n * 60 * 60 * 1000;
}

/** Realistic demo content so the app feels alive on first launch. */
export function buildSeedData() {
  const now = Date.now();

  const reminders: Reminder[] = [
    {
      id: uid('rem'), title: 'Light bill bharna', category: 'bills',
      dueAt: daysFromNow(0, 18), completed: false, source: 'voice',
      createdAt: hoursAgo(20), updatedAt: hoursAgo(20), synced: false,
    },
    {
      id: uid('rem'), title: 'Supplier ko payment yaad', category: 'payments',
      dueAt: daysFromNow(2, 11), completed: false, source: 'manual',
      createdAt: hoursAgo(30), updatedAt: hoursAgo(30), synced: false,
    },
    {
      id: uid('rem'), title: 'Doctor checkup', category: 'health',
      dueAt: daysFromNow(0, 17), completed: false, source: 'manual',
      createdAt: hoursAgo(48), updatedAt: hoursAgo(48), synced: false,
    },
    {
      id: uid('rem'), title: 'Mobile recharge', category: 'personal',
      dueAt: daysFromNow(-1, 10), completed: true, source: 'manual',
      createdAt: hoursAgo(72), updatedAt: hoursAgo(20), synced: false,
    },
  ];

  const expenses: Expense[] = [
    { id: uid('exp'), amount: 250, category: 'travel', note: 'Petrol', spentAt: hoursAgo(3), source: 'voice', createdAt: hoursAgo(3), updatedAt: hoursAgo(3), synced: false },
    { id: uid('exp'), amount: 120, category: 'food', note: 'Sabzi', spentAt: hoursAgo(6), source: 'manual', createdAt: hoursAgo(6), updatedAt: hoursAgo(6), synced: false },
    { id: uid('exp'), amount: 60, category: 'food', note: 'Chai nashta', spentAt: hoursAgo(28), source: 'manual', createdAt: hoursAgo(28), updatedAt: hoursAgo(28), synced: false },
    { id: uid('exp'), amount: 199, category: 'recharge', note: 'Mobile recharge', spentAt: hoursAgo(50), source: 'manual', createdAt: hoursAgo(50), updatedAt: hoursAgo(50), synced: false },
    { id: uid('exp'), amount: 800, category: 'shopping', note: 'Kapde', spentAt: hoursAgo(74), source: 'manual', createdAt: hoursAgo(74), updatedAt: hoursAgo(74), synced: false },
  ];

  const udhaar: UdhaarEntry[] = [
    { id: uid('udh'), personName: 'Ramesh', amount: 1200, direction: 'given', status: 'pending', dueAt: daysFromNow(5), note: 'Ramesh ko 1200 udhaar diya', source: 'voice', createdAt: hoursAgo(40), updatedAt: hoursAgo(40), synced: false },
    { id: uid('udh'), personName: 'Suresh', amount: 500, direction: 'given', status: 'overdue', dueAt: daysFromNow(-3), note: 'Chai shop', source: 'manual', createdAt: hoursAgo(120), updatedAt: hoursAgo(120), synced: false },
    { id: uid('udh'), personName: 'Anita', amount: 2000, direction: 'received', status: 'pending', dueAt: daysFromNow(10), note: 'Stock ke liye', source: 'manual', createdAt: hoursAgo(60), updatedAt: hoursAgo(60), synced: false },
  ];

  const notes: BusinessNote[] = [
    { id: uid('note'), title: 'Naya stock order karna hai', body: 'Wholesale market se Monday ko', source: 'manual', createdAt: hoursAgo(26), updatedAt: hoursAgo(26), synced: false },
    { id: uid('note'), title: 'Customer ko discount dena', body: 'Regular grahak — 5% off', source: 'voice', createdAt: hoursAgo(90), updatedAt: hoursAgo(90), synced: false },
  ];

  return { reminders, expenses, udhaar, notes, now };
}
