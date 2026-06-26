import { Platform, Share } from 'react-native';
import { track } from '../analytics/analytics';

/**
 * Share text via the OS share sheet (WhatsApp, etc.). On web we fall back to the
 * Web Share API or clipboard so the demo still works in a browser.
 */
export async function shareText(message: string, context: string): Promise<void> {
  await track('share_action_used', { context });
  try {
    if (Platform.OS === 'web') {
      const nav = (globalThis as any).navigator;
      if (nav?.share) {
        await nav.share({ text: message });
      } else if (nav?.clipboard?.writeText) {
        await nav.clipboard.writeText(message);
      }
      return;
    }
    await Share.share({ message });
  } catch {
    // User dismissed the share sheet — not an error.
  }
}
