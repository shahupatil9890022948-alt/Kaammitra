# KaamMitra — Agent guide

KaamMitra is an **Expo (React Native) + TypeScript**, Android-first, voice-first daily organizer (reminders / expenses / udhaar / business notes / document checklists) for Indian users. Storage is **local-first** (AsyncStorage); the "AI" is a deterministic offline parser in `src/parsing/parser.ts` (no LLM/network).

Architecture map:
- `src/models/types.ts` — data schema (sync-ready records).
- `src/db/` — local storage, document templates, seed data.
- `src/state/DataContext.tsx` — single source of truth; hydrate-once + write-through CRUD.
- `src/parsing/parser.ts` — intent classifier + slot filler (the invisible AI).
- `src/i18n/` — English/Hindi/Marathi strings; `src/theme/` — light/dark India-first design tokens.
- `src/screens/` + `src/navigation/RootNavigator.tsx` — onboarding gate, bottom tabs, modal capture/add/documents.

Standard commands live in `package.json` (`start`, `android`, `web`, `typecheck`, `test`, `lint`); usage is documented in `README.md`.

## Cursor Cloud specific instructions

- **Run/preview here via the web target**, not Android: `npx expo start --web --port 8081` (serves on `http://localhost:8081`). There is no Android emulator in this environment, so the web target is the way to verify UI and flows. Android remains the primary production target.
- **Verify quickly without a browser**: `curl -s -o /dev/null -w "%{http_code}" http://localhost:8081` should return `200` and the page `<title>` is `KaamMitra`. The Metro log line `Web Bundled … index.ts` confirms a clean bundle.
- **Tests run through `tsx`, not Jest**: `npm test` executes `node --import tsx --test src/parsing/__tests__/*.test.ts`. The app `tsconfig.json` intentionally **excludes `**/__tests__/**`** so `npm run typecheck` stays clean (Node test globals aren't in the RN type set); the test files carry their own `/// <reference types="node" />`.
- **First launch seeds sample data** (`src/db/seed.ts`) keyed off the absence of stored settings. To get back to a clean/seeded state, use Profile → "Reset sample data" (or clear browser storage); on web, the reset skips the native confirm dialog and resets immediately.
- **Notifications are native-only**: `src/notifications/notifications.ts` lazily requires `expo-notifications` and is a no-op on web — reminders still get created, they just won't fire a local notification in the browser. Don't treat missing web notifications as a bug.
- **Voice input is simulated on the parser side for the MVP**: the mic button feeds example phrases into the *real* parser. Production speech-to-text (Android `SpeechRecognizer`) is a V2 item; the parser is the actual deliverable and is unit-tested.
- Theme and language are driven by `DataContext` settings, so changing them in Profile/Onboarding re-themes/re-localizes the whole app instantly.
