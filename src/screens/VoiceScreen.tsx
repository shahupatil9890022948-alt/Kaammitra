import React, { useState } from 'react';
import { Pressable, TextInput, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n';
import { useData } from '../state/DataContext';
import {
  Button,
  Card,
  Chip,
  IconCircle,
  ScreenModalHeader,
  ThemedText,
  withAlpha,
} from '../components/ui';
import { parseInput } from '../parsing/parser';
import {
  ExpenseCategory,
  ParsedResult,
  ReminderCategory,
  UdhaarDirection,
} from '../models/types';
import {
  EXPENSE_CATEGORIES,
  EXPENSE_CATEGORY_META,
  REMINDER_CATEGORIES,
  REMINDER_CATEGORY_META,
} from '../utils/categories';

const EXAMPLES = [
  'Kal light bill bharna yaad dilana',
  'Aaj 250 petrol me gaya',
  'Ramesh ko 1200 udhaar diya',
  'Sunday ko supplier ko payment yaad dilana',
  'Job ke documents ready karne hain',
];

const KIND_ICON: Record<ParsedResult['kind'], keyof typeof Ionicons.glyphMap> = {
  reminder: 'alarm-outline',
  expense: 'wallet-outline',
  udhaar: 'people-outline',
  business_note: 'document-text-outline',
  document_task: 'folder-open-outline',
};

function quickDate(option: 'today' | 'tomorrow' | 'evening' | 'weekend'): number {
  const d = new Date();
  if (option === 'today') d.setHours(18, 0, 0, 0);
  if (option === 'evening') d.setHours(20, 0, 0, 0);
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

export default function VoiceScreen({ navigation }: any) {
  const theme = useTheme();
  const { t } = useI18n();
  const { commitParsed } = useData();

  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [parsed, setParsed] = useState<ParsedResult | null>(null);

  // Simulated speech-to-text: a real device plugs an ASR engine in here, but the
  // structured-action magic is the parser, which runs identically on the text.
  const onMic = () => {
    setListening(true);
    setParsed(null);
    setTimeout(() => {
      const phrase = EXAMPLES[exampleIndex % EXAMPLES.length];
      setExampleIndex((i) => i + 1);
      setText(phrase);
      setListening(false);
    }, 1100);
  };

  const onParse = () => {
    if (!text.trim()) return;
    setParsed(parseInput(text));
  };

  const onCreate = async () => {
    if (!parsed) return;
    await commitParsed(parsed);
    navigation.goBack();
  };

  const updateParsed = (patch: Partial<ParsedResult>) =>
    setParsed((prev) => (prev ? { ...prev, ...patch } : prev));

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScreenModalHeader title={t('voice.title')} onClose={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing(2), paddingBottom: theme.spacing(6) }}>
        <ThemedText variant="caption" color={theme.colors.textMuted} style={{ textAlign: 'center' }}>
          {t('voice.hint')}
        </ThemedText>

        <View style={{ alignItems: 'center', marginVertical: theme.spacing(3) }}>
          <Pressable
            onPress={onMic}
            style={({ pressed }) => ({
              width: 108,
              height: 108,
              borderRadius: 54,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: listening ? theme.colors.primary : withAlpha(theme.colors.primary, 0.16),
              borderWidth: 2,
              borderColor: theme.colors.primary,
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Ionicons
              name={listening ? 'mic' : 'mic-outline'}
              size={48}
              color={listening ? '#FFFFFF' : theme.colors.primary}
            />
          </Pressable>
          <ThemedText variant="caption" color={theme.colors.textMuted} style={{ marginTop: theme.spacing(1) }}>
            {listening ? t('voice.listening') : t('home.speak')}
          </ThemedText>
        </View>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t('voice.placeholder')}
          placeholderTextColor={theme.colors.textMuted}
          multiline
          style={{
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            padding: theme.spacing(1.75),
            minHeight: 64,
            color: theme.colors.text,
            fontSize: theme.font.md,
            textAlignVertical: 'top',
          }}
        />

        <Button label={t('voice.parse')} icon="sparkles-outline" onPress={onParse} style={{ marginTop: theme.spacing(2) }} />

        {!parsed && (
          <View style={{ marginTop: theme.spacing(3) }}>
            <ThemedText variant="label" color={theme.colors.textMuted}>
              {t('voice.tryExamples').toUpperCase()}
            </ThemedText>
            <View style={{ gap: theme.spacing(1), marginTop: theme.spacing(1) }}>
              {EXAMPLES.map((ex) => (
                <Pressable
                  key={ex}
                  onPress={() => {
                    setText(ex);
                    setParsed(parseInput(ex));
                  }}
                >
                  <Card style={{ paddingVertical: theme.spacing(1.5) }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
                      <Ionicons name="chatbubble-ellipses-outline" size={18} color={theme.colors.primary} />
                      <ThemedText variant="body" style={{ flex: 1 }}>{ex}</ThemedText>
                    </View>
                  </Card>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {parsed && (
          <ParsedPreview
            parsed={parsed}
            onChange={updateParsed}
            onCreate={onCreate}
            onQuickDate={(opt) => updateParsed({ dueAt: quickDate(opt), reminderTime: quickDate(opt) })}
          />
        )}
      </ScrollView>
    </View>
  );
}

function ParsedPreview({
  parsed,
  onChange,
  onCreate,
  onQuickDate,
}: {
  parsed: ParsedResult;
  onChange: (p: Partial<ParsedResult>) => void;
  onCreate: () => void;
  onQuickDate: (opt: 'today' | 'tomorrow' | 'evening' | 'weekend') => void;
}) {
  const theme = useTheme();
  const { t, language } = useI18n();

  const needsClarify = !!parsed.clarification && (
    (parsed.kind === 'reminder' && !parsed.dueAt) ||
    (parsed.kind === 'udhaar' && !parsed.personName)
  );

  return (
    <Card style={{ marginTop: theme.spacing(3), gap: theme.spacing(1.5) }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
        <IconCircle icon={KIND_ICON[parsed.kind]} color={theme.colors.primary} />
        <View style={{ flex: 1 }}>
          <ThemedText variant="label" color={theme.colors.textMuted}>
            {t('voice.detected').toUpperCase()}
          </ThemedText>
          <ThemedText variant="heading">{t(`voice.kind.${parsed.kind}` as any)}</ThemedText>
        </View>
        <View
          style={{
            backgroundColor: withAlpha(theme.colors.success, 0.16),
            borderRadius: theme.radius.pill,
            paddingHorizontal: theme.spacing(1),
            paddingVertical: 2,
          }}
        >
          <ThemedText variant="caption" color={theme.colors.success}>
            {Math.round(parsed.confidence * 100)}%
          </ThemedText>
        </View>
      </View>

      {/* Title / note */}
      {parsed.title !== undefined && (
        <Field label={t('common.title')}>
          <TextInput
            value={parsed.title}
            onChangeText={(v) => onChange({ title: v })}
            style={inputStyle(theme)}
            placeholderTextColor={theme.colors.textMuted}
          />
        </Field>
      )}

      {/* Amount */}
      {(parsed.kind === 'expense' || parsed.kind === 'udhaar') && (
        <Field label={t('common.amount')}>
          <TextInput
            value={parsed.amount ? String(parsed.amount) : ''}
            onChangeText={(v) => onChange({ amount: parseFloat(v) || 0 })}
            keyboardType="numeric"
            style={inputStyle(theme)}
            placeholder="0"
            placeholderTextColor={theme.colors.textMuted}
          />
        </Field>
      )}

      {/* Person + direction for udhaar */}
      {parsed.kind === 'udhaar' && (
        <>
          <Field label={t('business.personName')}>
            <TextInput
              value={parsed.personName ?? ''}
              onChangeText={(v) => onChange({ personName: v })}
              style={inputStyle(theme)}
              placeholder={t('business.personName')}
              placeholderTextColor={theme.colors.textMuted}
            />
          </Field>
          <View style={{ flexDirection: 'row', gap: theme.spacing(1) }}>
            {(['given', 'received'] as UdhaarDirection[]).map((dir) => (
              <Chip
                key={dir}
                label={dir === 'given' ? t('business.given') : t('business.received')}
                active={parsed.direction === dir}
                onPress={() => onChange({ direction: dir })}
              />
            ))}
          </View>
        </>
      )}

      {/* Category for reminder/expense */}
      {parsed.kind === 'reminder' && (
        <Field label={t('common.category')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(1) }}>
            {REMINDER_CATEGORIES.map((c) => (
              <Chip
                key={c}
                label={t(REMINDER_CATEGORY_META[c].labelKey)}
                icon={REMINDER_CATEGORY_META[c].icon as any}
                color={REMINDER_CATEGORY_META[c].color(theme.colors)}
                active={parsed.category === c}
                onPress={() => onChange({ category: c as ReminderCategory })}
              />
            ))}
          </View>
        </Field>
      )}
      {parsed.kind === 'expense' && (
        <Field label={t('common.category')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(1) }}>
            {EXPENSE_CATEGORIES.map((c) => (
              <Chip
                key={c}
                label={t(EXPENSE_CATEGORY_META[c].labelKey)}
                icon={EXPENSE_CATEGORY_META[c].icon as any}
                color={EXPENSE_CATEGORY_META[c].color(theme.colors)}
                active={parsed.category === c}
                onPress={() => onChange({ category: c as ExpenseCategory })}
              />
            ))}
          </View>
        </Field>
      )}

      {/* Reminder date quick-pick + clarification */}
      {parsed.kind === 'reminder' && (
        <Field label={needsClarify ? t('voice.clarifyTime') : t('common.today')}>
          {needsClarify && (
            <ThemedText variant="caption" color={theme.colors.warning} style={{ marginBottom: 6 }}>
              {parsed.clarification}
            </ThemedText>
          )}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing(1) }}>
            <Chip label={t('common.today')} onPress={() => onQuickDate('today')} active={false} />
            <Chip label="Tomorrow 9 AM" onPress={() => onQuickDate('tomorrow')} active={false} />
            <Chip label="Evening" onPress={() => onQuickDate('evening')} active={false} />
            <Chip label="Sunday" onPress={() => onQuickDate('weekend')} active={false} />
          </View>
          {parsed.dueAt ? (
            <ThemedText variant="caption" color={theme.colors.success} style={{ marginTop: 6 }}>
              ✓ {new Date(parsed.dueAt).toLocaleString(language === 'en' ? 'en-IN' : language + '-IN')}
            </ThemedText>
          ) : null}
        </Field>
      )}

      <Button label={t('voice.create')} icon="checkmark-circle-outline" onPress={onCreate} style={{ marginTop: theme.spacing(1) }} />
    </Card>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  const theme = useTheme();
  return (
    <View style={{ gap: 6 }}>
      <ThemedText variant="label" color={theme.colors.textMuted}>
        {label.toUpperCase()}
      </ThemedText>
      {children}
    </View>
  );
}

function inputStyle(theme: ReturnType<typeof useTheme>) {
  return {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(1.25),
    color: theme.colors.text,
    fontSize: theme.font.md,
  } as const;
}
