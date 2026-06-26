import { ExpenseCategory, ReminderCategory } from '../models/types';
import { TranslationKey } from '../i18n';
import { ThemeColors } from '../theme/theme';

export interface CategoryMeta {
  icon: string;
  /** Picks an accent color from the active theme. */
  color: (c: ThemeColors) => string;
  labelKey: TranslationKey;
}

export const REMINDER_CATEGORIES: ReminderCategory[] = [
  'bills', 'payments', 'personal', 'business', 'study', 'health',
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'food', 'home', 'travel', 'business', 'medicine', 'recharge', 'rent', 'shopping', 'other',
];

export const REMINDER_CATEGORY_META: Record<ReminderCategory, CategoryMeta> = {
  bills: { icon: 'flash-outline', color: (c) => c.warning, labelKey: 'cat.bills' },
  payments: { icon: 'cash-outline', color: (c) => c.success, labelKey: 'cat.payments' },
  personal: { icon: 'person-outline', color: (c) => c.info, labelKey: 'cat.personal' },
  business: { icon: 'storefront-outline', color: (c) => c.primary, labelKey: 'cat.business' },
  study: { icon: 'school-outline', color: (c) => c.accent, labelKey: 'cat.study' },
  health: { icon: 'medkit-outline', color: (c) => c.danger, labelKey: 'cat.health' },
};

export const EXPENSE_CATEGORY_META: Record<ExpenseCategory, CategoryMeta> = {
  food: { icon: 'fast-food-outline', color: (c) => c.warning, labelKey: 'cat.food' },
  home: { icon: 'home-outline', color: (c) => c.info, labelKey: 'cat.home' },
  travel: { icon: 'car-outline', color: (c) => c.accent, labelKey: 'cat.travel' },
  business: { icon: 'storefront-outline', color: (c) => c.primary, labelKey: 'cat.business' },
  medicine: { icon: 'medkit-outline', color: (c) => c.danger, labelKey: 'cat.medicine' },
  recharge: { icon: 'phone-portrait-outline', color: (c) => c.success, labelKey: 'cat.recharge' },
  rent: { icon: 'key-outline', color: (c) => c.primaryDark, labelKey: 'cat.rent' },
  shopping: { icon: 'bag-handle-outline', color: (c) => c.info, labelKey: 'cat.shopping' },
  other: { icon: 'ellipsis-horizontal-outline', color: (c) => c.textMuted, labelKey: 'cat.other' },
};
