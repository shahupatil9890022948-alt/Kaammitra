import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n';
import { useData } from '../state/DataContext';
import { Card, Chip, EmptyState, IconCircle, ThemedText } from '../components/ui';
import { EXPENSE_CATEGORIES, EXPENSE_CATEGORY_META } from '../utils/categories';
import { ExpenseCategory } from '../models/types';
import { formatCurrency, relativeDay, startOfToday, startOfWeek } from '../utils/format';
import { Fab, TabHeader } from '../components/layout';

export default function ExpensesScreen({ navigation }: any) {
  const theme = useTheme();
  const { t, language } = useI18n();
  const { expenses, deleteExpense } = useData();
  const [cat, setCat] = useState<ExpenseCategory | 'all'>('all');
  const [query, setQuery] = useState('');

  const spentToday = expenses.filter((e) => e.spentAt >= startOfToday()).reduce((s, e) => s + e.amount, 0);
  const spentWeek = expenses.filter((e) => e.spentAt >= startOfWeek()).reduce((s, e) => s + e.amount, 0);

  const filtered = useMemo(
    () =>
      expenses
        .filter((e) => (cat === 'all' ? true : e.category === cat))
        .filter((e) =>
          query.trim()
            ? (e.note ?? '').toLowerCase().includes(query.toLowerCase()) ||
              t(EXPENSE_CATEGORY_META[e.category].labelKey).toLowerCase().includes(query.toLowerCase())
            : true,
        )
        .sort((a, b) => b.spentAt - a.spentAt),
    [expenses, cat, query, t],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <TabHeader title={t('expenses.title')} />

      <View style={{ flexDirection: 'row', gap: theme.spacing(1.5), paddingHorizontal: theme.spacing(2) }}>
        <Card style={{ flex: 1, gap: 2 }}>
          <ThemedText variant="caption" color={theme.colors.textMuted}>{t('home.spentToday')}</ThemedText>
          <ThemedText variant="title" color={theme.colors.primary}>{formatCurrency(spentToday)}</ThemedText>
        </Card>
        <Card style={{ flex: 1, gap: 2 }}>
          <ThemedText variant="caption" color={theme.colors.textMuted}>{t('expenses.thisWeek')}</ThemedText>
          <ThemedText variant="title">{formatCurrency(spentWeek)}</ThemedText>
        </Card>
      </View>

      <View style={{ paddingHorizontal: theme.spacing(2), marginTop: theme.spacing(1.5) }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing(1),
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            paddingHorizontal: theme.spacing(1.5),
          }}
        >
          <Ionicons name="search" size={18} color={theme.colors.textMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('common.search')}
            placeholderTextColor={theme.colors.textMuted}
            style={{ flex: 1, paddingVertical: theme.spacing(1.5), color: theme.colors.text, fontSize: theme.font.md }}
          />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ gap: theme.spacing(1), padding: theme.spacing(2) }}>
        <Chip label={t('common.all')} active={cat === 'all'} onPress={() => setCat('all')} />
        {EXPENSE_CATEGORIES.map((c) => (
          <Chip key={c} label={t(EXPENSE_CATEGORY_META[c].labelKey)} icon={EXPENSE_CATEGORY_META[c].icon as any} color={EXPENSE_CATEGORY_META[c].color(theme.colors)} active={cat === c} onPress={() => setCat(c)} />
        ))}
      </ScrollView>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: theme.spacing(2), paddingBottom: theme.spacing(16), gap: theme.spacing(1) }}>
        {filtered.length === 0 ? (
          <EmptyState icon="wallet-outline" text={t('expenses.empty')} />
        ) : (
          filtered.map((e) => {
            const meta = EXPENSE_CATEGORY_META[e.category];
            return (
              <Card key={e.id} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
                <IconCircle icon={meta.icon as any} color={meta.color(theme.colors)} />
                <View style={{ flex: 1 }}>
                  <ThemedText variant="body">{e.note || t(meta.labelKey)}</ThemedText>
                  <ThemedText variant="caption" color={theme.colors.textMuted}>
                    {t(meta.labelKey)} · {relativeDay(e.spentAt, language)}
                  </ThemedText>
                </View>
                <ThemedText variant="heading">{formatCurrency(e.amount)}</ThemedText>
                <Pressable onPress={() => deleteExpense(e.id)} hitSlop={8} style={{ padding: 4 }}>
                  <Ionicons name="trash-outline" size={20} color={theme.colors.textMuted} />
                </Pressable>
              </Card>
            );
          })
        )}
      </ScrollView>

      <Fab icon="add" onPress={() => navigation.navigate('AddEntry', { mode: 'expense' })} />
    </SafeAreaView>
  );
}
