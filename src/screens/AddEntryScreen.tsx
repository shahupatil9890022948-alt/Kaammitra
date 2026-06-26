import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n';
import { useData } from '../state/DataContext';
import { Button, Card, Chip, ScreenModalHeader, ThemedText } from '../components/ui';
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_META,
  REMINDER_CATEGORIES,
  REMINDER_CATEGORY_META,
} from '../utils/categories';
import {
  ExpenseCategory,
  ReminderCategory,
  UdhaarDirection,
} from '../models/types';
import { isValidAmount, parseAmount } from '../utils/validate';
import { formatDateTime } from '../utils/format';
import { log } from '../utils/logger';

type Mode = 'reminder' | 'expense' | 'udhaar' | 'note';

function quickDate(option: 'today' | 'tomorrow' | 'weekend'): number {
  const d = new Date();
  if (option === 'today') d.setHours(18, 0, 0, 0);
  if (option === 'tomorrow') {
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
  }
  if (option === 'weekend') {
    const diff = (0 - d.getDay() + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    d.setHours(10, 0, 0, 0);
  }
  return d.getTime();
}

function inputStyle(theme: ReturnType<typeof useTheme>) {
  return {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(1.5),
    color: theme.colors.text,
    fontSize: theme.font.md,
  } as const;
}

export default function AddEntryScreen({ navigation, route }: any) {
  const mode: Mode = route?.params?.mode ?? 'reminder';
  const theme = useTheme();
  const { t, language } = useI18n();
  const { addReminder, addExpense, addUdhaar, addNote } = useData();

  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [person, setPerson] = useState('');
  const [reminderCat, setReminderCat] = useState<ReminderCategory>('personal');
  const [expenseCat, setExpenseCat] = useState<ExpenseCategory>('other');
  const [direction, setDirection] = useState<UdhaarDirection>('given');
  const [dueAt, setDueAt] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const titles: Record<Mode, string> = {
    reminder: t('reminders.addTitle'),
    expense: t('expenses.addTitle'),
    udhaar: t('business.addUdhaar'),
    note: t('business.addNote'),
  };

  const validate = (): string | null => {
    if (mode === 'reminder' || mode === 'note') {
      if (!title.trim()) return t('error.title');
    }
    if (mode === 'expense') {
      if (!isValidAmount(parseAmount(amount))) return t('error.amount');
    }
    if (mode === 'udhaar') {
      if (!person.trim()) return t('error.person');
      if (!isValidAmount(parseAmount(amount))) return t('error.amount');
    }
    return null;
  };

  const onSave = async () => {
    if (saving) return; // duplicate-tap guard
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      if (mode === 'reminder') {
        await addReminder({ title: title.trim(), category: reminderCat, dueAt, note: note.trim() || undefined });
      } else if (mode === 'expense') {
        await addExpense({ amount: parseAmount(amount), category: expenseCat, note: note.trim() || undefined });
      } else if (mode === 'udhaar') {
        await addUdhaar({ personName: person.trim(), amount: parseAmount(amount), direction, dueAt, note: note.trim() || undefined });
      } else {
        await addNote({ title: title.trim(), body: note.trim() || undefined });
      }
      navigation.goBack();
    } catch (e) {
      log.error('add-entry', `save failed (${mode})`, e);
      setError(t('error.saveFailed'));
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenModalHeader title={titles[mode]} onClose={() => navigation.goBack()} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: theme.spacing(2), gap: theme.spacing(2), paddingBottom: theme.spacing(6) }}
      >
        <Card style={{ gap: theme.spacing(2) }}>
          {mode === 'expense' && (
            <View style={{ alignItems: 'center', gap: 4 }}>
              <ThemedText variant="label" color={theme.colors.textMuted}>
                {t('expenses.amountFirst').toUpperCase()}
              </ThemedText>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThemedText variant="display" color={theme.colors.primary}>₹</ThemedText>
                <TextInput
                  value={amount}
                  onChangeText={(v) => { setAmount(v); if (error) setError(null); }}
                  keyboardType="numeric"
                  maxLength={9}
                  placeholder="0"
                  placeholderTextColor={theme.colors.textMuted}
                  autoFocus
                  style={{
                    fontSize: theme.font.display,
                    fontWeight: '800',
                    color: theme.colors.text,
                    minWidth: 120,
                    textAlign: 'center',
                  }}
                />
              </View>
            </View>
          )}

          {(mode === 'reminder' || mode === 'note') && (
            <Field label={t('common.title')}>
              <TextInput value={title} onChangeText={(v) => { setTitle(v); if (error) setError(null); }} style={inputStyle(theme)} placeholder={t('common.title')} placeholderTextColor={theme.colors.textMuted} autoFocus />
            </Field>
          )}

          {mode === 'udhaar' && (
            <>
              <Field label={t('business.personName')}>
                <TextInput value={person} onChangeText={(v) => { setPerson(v); if (error) setError(null); }} style={inputStyle(theme)} placeholder={t('business.personName')} placeholderTextColor={theme.colors.textMuted} autoFocus />
              </Field>
              <Field label={t('common.amount')}>
                <TextInput value={amount} onChangeText={(v) => { setAmount(v); if (error) setError(null); }} keyboardType="numeric" maxLength={9} style={inputStyle(theme)} placeholder="0" placeholderTextColor={theme.colors.textMuted} />
              </Field>
              <View style={{ flexDirection: 'row', gap: theme.spacing(1) }}>
                {(['given', 'received'] as UdhaarDirection[]).map((dir) => (
                  <Chip key={dir} label={dir === 'given' ? t('business.given') : t('business.received')} active={direction === dir} onPress={() => setDirection(dir)} />
                ))}
              </View>
            </>
          )}

          {mode === 'reminder' && (
            <Field label={t('common.category')}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(1) }}>
                {REMINDER_CATEGORIES.map((c) => (
                  <Chip key={c} label={t(REMINDER_CATEGORY_META[c].labelKey)} icon={REMINDER_CATEGORY_META[c].icon as any} color={REMINDER_CATEGORY_META[c].color(theme.colors)} active={reminderCat === c} onPress={() => setReminderCat(c)} />
                ))}
              </View>
            </Field>
          )}

          {mode === 'expense' && (
            <Field label={t('common.category')}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(1) }}>
                {EXPENSE_CATEGORIES.map((c) => (
                  <Chip key={c} label={t(EXPENSE_CATEGORY_META[c].labelKey)} icon={EXPENSE_CATEGORY_META[c].icon as any} color={EXPENSE_CATEGORY_META[c].color(theme.colors)} active={expenseCat === c} onPress={() => setExpenseCat(c)} />
                ))}
              </View>
            </Field>
          )}

          {(mode === 'reminder' || mode === 'udhaar') && (
            <Field label={t('common.today')}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(1) }}>
                <Chip label={t('reminders.noDate')} active={dueAt === null} onPress={() => setDueAt(null)} />
                <Chip label={t('common.today')} active={false} onPress={() => setDueAt(quickDate('today'))} />
                <Chip label="Tomorrow" active={false} onPress={() => setDueAt(quickDate('tomorrow'))} />
                <Chip label="Sunday" active={false} onPress={() => setDueAt(quickDate('weekend'))} />
              </View>
              {dueAt && (
                <ThemedText variant="caption" color={theme.colors.success} style={{ marginTop: 6 }}>
                  ✓ {formatDateTime(dueAt, language)}
                </ThemedText>
              )}
            </Field>
          )}

          <Field label={t('common.note')}>
            <TextInput value={note} onChangeText={setNote} style={[inputStyle(theme), { minHeight: 56, textAlignVertical: 'top' }]} multiline placeholder={t('common.note')} placeholderTextColor={theme.colors.textMuted} />
          </Field>
        </Card>

        {error && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: theme.spacing(0.5) }}>
            <ThemedText variant="caption" color={theme.colors.danger}>⚠ {error}</ThemedText>
          </View>
        )}

        <Button
          label={saving ? t('common.saving') : t('common.save')}
          icon="checkmark-circle-outline"
          onPress={onSave}
          loading={saving}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <ThemedText variant="label" color={theme.colors.textMuted}>{label.toUpperCase()}</ThemedText>
      {children}
    </View>
  );
}
