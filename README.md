# KaamMitra

> **"Speak it once, KaamMitra organizes it."**

KaamMitra is a **voice-first, local-language daily-organizer** for Indian users. It turns everyday spoken instructions (Hindi / Marathi / English / Hinglish) into structured **reminders, expenses, udhaar (credit) entries, business notes and document checklists** — faster than WhatsApp notes or a paper diary.

The AI is **invisible**: there is no chatbot. A fast, offline, rule-based parser classifies what you said and fills in the details. Everything is **local-first**, so it works on budget Android phones and slow internet.

---

## 1. Tech stack & how to run

- **Expo (React Native) + TypeScript** — Android-first, also runs on web for quick previews.
- **React Navigation** — bottom tabs + modal stack.
- **AsyncStorage** — local-first JSON document store (sync-ready schema).
- **expo-notifications** — local reminder scheduling (native only; degrades gracefully on web).

```bash
npm install            # install dependencies
npm run android        # run on Android device/emulator (primary target)
npm run web            # run in a browser (used for the demo in this repo)
npm run typecheck      # tsc --noEmit
npm run test           # parser unit tests (node --test via tsx)
npm run lint           # expo lint
```

> The app seeds realistic sample data on first launch, so every screen is populated immediately.

---

## 2. Information architecture

```
KaamMitra
├── Onboarding (first run)
│   ├── Language (English / हिंदी / मराठी)
│   ├── Purpose
│   ├── Voice permission explainer
│   ├── Notification permission explainer
│   └── Name + Get started
└── App (bottom tabs, max 5)
    ├── Home          → summary, today, quick actions, recent activity, voice CTA
    ├── Reminders     → pending/completed tabs, category chips, voice/manual add
    ├── Expenses      → amount-first add, day/week totals, category chips, search
    ├── Business      → Udhaar ledger (pending/paid/overdue) + Notes, share summary
    └── Profile       → language, theme, notifications, backup/premium placeholders
    Secondary (modals):
    ├── Voice capture (the "invisible AI" — reachable from Home & quick actions)
    ├── Add entry (reminder / expense / udhaar / note)
    └── Documents → 5 checklist templates → Document detail (check items + notes)
```

Documents is intentionally a **secondary entry from Home** (Quick action) to keep the tab bar at 5.

---

## 3. Screen-by-screen UI

| Screen | Key UI |
| --- | --- |
| **Onboarding** | 5 illustrated steps with progress dots, large language cards, permission explainers, name input |
| **Home** | Greeting, 3 summary cards (due today / spent today / to collect), progress bar, 4 quick actions, big voice CTA, today's reminders, business follow-ups, recent expenses |
| **Reminders** | Pending/Completed segmented tabs, horizontal category chips, check-to-complete, WhatsApp share, delete, FAB add |
| **Expenses** | Today + this-week totals, search bar, category chips, amount-first add sheet (₹ big input), list with category icons |
| **Business** | Net-to-collect banner, Udhaar/Notes tabs, status filter chips, ledger cards with mark-paid + share, notes list, FAB add |
| **Documents** | Template cards with progress bars → detail with checkboxes, saved progress, free-text note |
| **Profile** | Language chips, theme (system/light/dark), notification toggle, backup/premium/business-pack placeholders, reset sample data |

---

## 4. Data schema (`src/models/types.ts`)

Every record is **sync-ready**: stable `id`, `createdAt`/`updatedAt`, and a `synced` flag so a future backend can reconcile offline edits.

- **User** — `id, name, language, createdAt`
- **Reminder** — `id, title, category, dueAt, note, completed, notificationId, source, …`
- **Expense** — `id, amount, category, note, spentAt, source, …`
- **UdhaarEntry** — `id, personName, amount, direction(given|received), status(pending|paid|overdue), dueAt, …`
- **BusinessNote** — `id, title, body, source, …`
- **DocumentTemplate** — `id, title{lang}, icon, items[]` (built-in, localized)
- **DocumentProgress** — `id, templateId, checked{itemKey:bool}, note, …`
- **AppSettings** — `language, theme, notificationsEnabled, onboardingCompleted, userName`

Categories: reminders → `bills, payments, personal, business, study, health`; expenses → `food, home, travel, business, medicine, recharge, rent, shopping, other`.

---

## 5. Local storage plan (`src/db/`)

- Each collection is one JSON array under a namespaced key (`kaammitra:v1:<name>`) in AsyncStorage.
- `storage.ts` exposes `readCollection / writeCollection / readDoc / writeDoc / clearAll / uid`.
- `DataContext` hydrates everything once on launch, keeps it in React state, and writes through on every mutation (instant UI, offline-safe).
- The repository-style API deliberately mirrors what SQLite/a remote DB would expose, so swapping the backend later is a localized change. `synced:false` is set on every write, ready for a future delta-sync.

---

## 6. AI parsing flow (`src/parsing/parser.ts`) — the "invisible AI"

Deterministic, offline, instant. No LLM round-trip.

```
speech/text → normalize → detect amount + date/time
            → classify intent (priority order):
                 1. udhaar      (udhaar word + amount)
                 2. document    (paperwork words, no money)
                 3. reminder    (remind words OR future date + action)
                 4. expense     (amount + spend cue)
                 5. business note (fallback)
            → fill slots: title, amount, personName, dueAt, category, note, direction
            → confidence score + (at most) ONE clarification question
            → editable preview card → commit to local store
```

Handles the 5 core examples and Hindi/Marathi/Hinglish variants (see `src/parsing/__tests__/parser.test.ts`). If a critical slot is missing (reminder time, udhaar person), it asks exactly one short question instead of starting a conversation.

---

## 7. Notification flow (`src/notifications/notifications.ts`)

- Permission requested during onboarding and toggleable in Profile.
- Creating a reminder with a future `dueAt` schedules a one-off local notification and stores its `notificationId`.
- Completing/deleting a reminder cancels the scheduled notification.
- Lazily imported and a no-op on web, so reminders still work everywhere.

---

## 8. Sample onboarding copy

- **Purpose:** "Your daily work, organized — Reminders, expenses, udhaar and documents, all in one simple, fast app made for India."
- **Voice:** "Just speak naturally. Say *Kal light bill bharna yaad dilana* and KaamMitra turns it into a reminder. We only listen when you tap the mic."
- **Notifications:** "Allow notifications so we can remind you about bills, payments and follow-ups on time."

(Full Hindi & Marathi copy in `src/i18n/translations.ts`.)

---

## 9. App icon direction

- A friendly **terracotta/saffron (#E2640D)** rounded-square icon.
- Mark: a simple **speech bubble + check-mark** (or a stylized "क"/"K") — communicates *speak → done*.
- Flat, warm, no gradients; readable at small sizes on budget launchers. Adaptive icon background uses the brand saffron.

---

## 10. Play Store short description

> KaamMitra: bolkar reminders, kharcha, udhaar & documents manage karein. Hindi, Marathi & English. Fast, offline, free.

---

## 11. Play Store long description

**KaamMitra — Speak it once, KaamMitra organizes it.**

Tired of WhatsApp notes and paper diaries? KaamMitra is the simplest way to manage your daily work in your own language. Just speak — KaamMitra turns it into reminders, expenses, udhaar entries, business notes and document checklists.

✅ **Voice-first** — Say "Kal light bill bharna yaad dilana" and it's done.
✅ **Hindi, Marathi, English & Hinglish** — Type or speak the way you talk.
✅ **Reminders** — Bills, payments, health, study — never miss a date.
✅ **Expense tracker** — Log spends in seconds with smart categories.
✅ **Udhaar & business** — Track who owes you, follow up, mark paid.
✅ **Document checklists** — Job, rental, KYC, exam, business — stay ready.
✅ **Works offline** — Light and fast, made for every Android phone.
✅ **Private** — Your data stays on your device.

Built for shopkeepers, students, homemakers, delivery workers and job seekers across India. Free to use, with Premium and Business Pack coming soon.

---

## 12. MVP roadmap (this build)

1. Local-first storage + sync-ready schema ✅
2. Onboarding with language + permission explainers ✅
3. Home dashboard (summary, today, quick actions, activity) ✅
4. Reminders (voice + manual, categories, notifications) ✅
5. Expenses (amount-first, categories, day/week totals, search) ✅
6. Business (udhaar ledger, notes, status filters, share) ✅
7. Documents (5 checklist templates with saved progress) ✅
8. Invisible-AI parser (5 languages, one-question clarify) ✅
9. Light/dark + multi-language theming ✅
10. WhatsApp sharing + analytics event plan ✅

---

## 13. V2 roadmap

- Real on-device speech-to-text (Android `SpeechRecognizer`) wired into the existing parser.
- Cloud backup & multi-device sync (the `synced` flag is already in place).
- Premium: unlimited history, CSV/PDF export, smart monthly summaries.
- Business Pack: supplier management, automated payment follow-ups, ledger reports.
- Recurring reminders, budgets & spend insights, home-screen widgets.
- Smaller APK via asset trimming; per-feature analytics dashboards.

---

## 14. Analytics event plan (`src/analytics/analytics.ts`)

`onboarding_completed, reminder_created, reminder_completed, expense_added, voice_input_used, udhaar_added, checklist_started, checklist_completed, share_action_used` — buffered locally now, with a single swap-in point for Firebase/Amplitude/PostHog later.

## 15. Monetization

- **Free:** reminders, expenses, notes, local tracking.
- **Premium (placeholder):** unlimited history, export, AI smart organization, backup, advanced summaries.
- **Business Pack (placeholder):** advanced udhaar tracking, supplier management, payment follow-up automation.
