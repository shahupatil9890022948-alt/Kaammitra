import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n';
import { useData } from '../state/DataContext';
import { Card, Chip, EmptyState, IconCircle, ThemedText } from '../components/ui';
import { REMINDER_CATEGORIES, REMINDER_CATEGORY_META } from '../utils/categories';
import { ReminderCategory } from '../models/types';
import { relativeDay } from '../utils/format';
import { shareText } from '../utils/share';
import { Fab, TabHeader } from '../components/layout';

export default function RemindersScreen({ navigation }: any) {
  const theme = useTheme();
  const { t, language } = useI18n();
  const { reminders, toggleReminder, deleteReminder } = useData();
  const [tab, setTab] = useState<'pending' | 'completed'>('pending');
  const [cat, setCat] = useState<ReminderCategory | 'all'>('all');

  const filtered = reminders
    .filter((r) => (tab === 'pending' ? !r.completed : r.completed))
    .filter((r) => (cat === 'all' ? true : r.category === cat))
    .sort((a, b) => (a.dueAt ?? Infinity) - (b.dueAt ?? Infinity));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <TabHeader title={t('reminders.title')} />

      <View style={{ flexDirection: 'row', gap: theme.spacing(1), paddingHorizontal: theme.spacing(2) }}>
        {(['pending', 'completed'] as const).map((tk) => (
          <Pressable key={tk} onPress={() => setTab(tk)} style={{ flex: 1 }}>
            <View
              style={{
                paddingVertical: theme.spacing(1.25),
                borderRadius: theme.radius.pill,
                backgroundColor: tab === tk ? theme.colors.primary : theme.colors.surfaceAlt,
                alignItems: 'center',
              }}
            >
              <ThemedText variant="body" color={tab === tk ? '#FFFFFF' : theme.colors.text}>
                {tk === 'pending' ? t('common.pending') : t('common.completed')}
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: theme.spacing(1), padding: theme.spacing(2) }}
      >
        <Chip label={t('common.all')} active={cat === 'all'} onPress={() => setCat('all')} />
        {REMINDER_CATEGORIES.map((c) => (
          <Chip
            key={c}
            label={t(REMINDER_CATEGORY_META[c].labelKey)}
            icon={REMINDER_CATEGORY_META[c].icon as any}
            color={REMINDER_CATEGORY_META[c].color(theme.colors)}
            active={cat === c}
            onPress={() => setCat(c)}
          />
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingHorizontal: theme.spacing(2), paddingBottom: theme.spacing(16), gap: theme.spacing(1) }}>
        {filtered.length === 0 ? (
          <EmptyState icon="alarm-outline" text={t('reminders.empty')} />
        ) : (
          filtered.map((r) => {
            const meta = REMINDER_CATEGORY_META[r.category];
            return (
              <Card key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
                <Pressable onPress={() => toggleReminder(r.id)} hitSlop={8}>
                  <Ionicons
                    name={r.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={28}
                    color={r.completed ? theme.colors.success : theme.colors.textMuted}
                  />
                </Pressable>
                <IconCircle icon={meta.icon as any} color={meta.color(theme.colors)} size={40} />
                <View style={{ flex: 1 }}>
                  <ThemedText variant="body" numberOfLines={2} style={r.completed ? { textDecorationLine: 'line-through', color: theme.colors.textMuted } : undefined}>
                    {r.title}
                  </ThemedText>
                  <ThemedText variant="caption" color={theme.colors.textMuted}>
                    {t(meta.labelKey)}{r.dueAt ? ` · ${relativeDay(r.dueAt, language)}` : ` · ${t('reminders.noDate')}`}
                  </ThemedText>
                </View>
                <Pressable onPress={() => shareText(`${t('share.reminderText')}: ${r.title}`, 'reminder')} hitSlop={8} style={{ padding: 4 }}>
                  <Ionicons name="logo-whatsapp" size={22} color={theme.colors.success} />
                </Pressable>
                <Pressable onPress={() => deleteReminder(r.id)} hitSlop={8} style={{ padding: 4 }}>
                  <Ionicons name="trash-outline" size={20} color={theme.colors.textMuted} />
                </Pressable>
              </Card>
            );
          })
        )}
      </ScrollView>

      <Fab icon="add" onPress={() => navigation.navigate('AddEntry', { mode: 'reminder' })} />
    </SafeAreaView>
  );
}
