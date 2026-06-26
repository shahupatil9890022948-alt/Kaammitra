import { readCollection, writeCollection } from '../db/storage';

/**
 * Analytics event plan. For the MVP these are buffered locally (and logged to
 * the console in dev). A future provider (Firebase/Amplitude/PostHog) only needs
 * to implement `flushTo` — call sites never change.
 */
export type AnalyticsEvent =
  | 'onboarding_completed'
  | 'reminder_created'
  | 'reminder_completed'
  | 'expense_added'
  | 'voice_input_used'
  | 'udhaar_added'
  | 'checklist_started'
  | 'checklist_completed'
  | 'share_action_used';

export interface LoggedEvent {
  event: AnalyticsEvent;
  props?: Record<string, string | number | boolean>;
  ts: number;
}

const COLLECTION = 'analytics_events';

export async function track(
  event: AnalyticsEvent,
  props?: Record<string, string | number | boolean>,
): Promise<void> {
  const entry: LoggedEvent = { event, props, ts: Date.now() };
  if (__DEV__) {
    // Visible in the Metro / browser console during development.
    console.log('[analytics]', event, props ?? {});
  }
  try {
    const existing = await readCollection<LoggedEvent>(COLLECTION);
    existing.push(entry);
    // Keep the local buffer bounded on budget devices.
    const trimmed = existing.slice(-500);
    await writeCollection(COLLECTION, trimmed);
  } catch {
    // Analytics must never break the user flow.
  }
}

export async function getEvents(): Promise<LoggedEvent[]> {
  return readCollection<LoggedEvent>(COLLECTION);
}
