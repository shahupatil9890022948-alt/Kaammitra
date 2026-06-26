import { Platform } from 'react-native';

/**
 * Notification scheduling wrapper.
 *
 * `expo-notifications` is not available on the web target and behaves
 * differently across platforms, so we import it lazily and degrade gracefully.
 * Reminders still work without notifications — scheduling is best-effort.
 */

type NotificationsModule = typeof import('expo-notifications');

let cached: NotificationsModule | null = null;
let configured = false;

function getModule(): NotificationsModule | null {
  if (Platform.OS === 'web') return null;
  if (cached) return cached;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    cached = require('expo-notifications') as NotificationsModule;
    if (cached && !configured) {
      cached.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
      configured = true;
    }
    return cached;
  } catch {
    return null;
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  const mod = getModule();
  if (!mod) return false;
  try {
    const settings = await mod.getPermissionsAsync();
    if (settings.granted) return true;
    const req = await mod.requestPermissionsAsync();
    return req.granted;
  } catch {
    return false;
  }
}

/** Schedule a one-off local notification. Returns the id, or null if not scheduled. */
export async function scheduleReminder(
  title: string,
  body: string,
  dueAt: number,
): Promise<string | null> {
  const mod = getModule();
  if (!mod) return null;
  if (dueAt <= Date.now()) return null;
  try {
    const id = await mod.scheduleNotificationAsync({
      content: { title, body },
      trigger: {
        type: mod.SchedulableTriggerInputTypes.DATE,
        date: new Date(dueAt),
      },
    });
    return id;
  } catch {
    return null;
  }
}

export async function cancelReminder(notificationId?: string | null): Promise<void> {
  if (!notificationId) return;
  const mod = getModule();
  if (!mod) return;
  try {
    await mod.cancelScheduledNotificationAsync(notificationId);
  } catch {
    // ignore
  }
}
