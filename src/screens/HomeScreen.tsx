import React, { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n';
import { useData } from '../state/DataContext';
import { Card, IconCircle, SectionHeader, ThemedText, withAlpha } from '../components/ui';
import { formatCurrency, isToday, startOfToday } from '../utils/format';
import { REMINDER_CATEGORY_META, EXPENSE_CATEGORY_META } from '../utils/categories';

export default function HomeScreen({ navigation }: any) {
  const theme = useTheme();
  const { t } = useI18n();
  const { settings, reminders, expenses, udhaar } = useData();

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return t('home.greetingMorning');
    if (h < 17) return t('home.greetingAfternoon');
    return t('home.greetingEvening');
  }, [t]);

  const todayReminders = reminders.filter((r) => !r.completed && isToday(r.dueAt));
  const pendingUdhaar = udhaar.filter((u) => u.status !== 'paid');
  const toCollect = pendingUdhaar
    .filter((u) => u.direction === 'given')
    .reduce((s, u) => s + u.amount, 0);
  const spentToday = expenses
    .filter((e) => e.spentAt >= startOfToday())
    .reduce((s, e) => s + e.amount, 0);
  const recentExpenses = expenses.slice(0, 3);

  const totalTodayReminders = reminders.filter((r) => isToday(r.dueAt));
  const doneToday = totalTodayReminders.filter((r) => r.completed).length;
  const progress = totalTodayReminders.length
    ? doneToday / totalTodayReminders.length
    : 0;

  const quickActions = [
    { key: 'voice', icon: 'mic', label: t('home.speak'), color: theme.colors.primary, onPress: () => navigation.navigate('Voice') },
    { key: 'rem', icon: 'alarm-outline', label: t('home.addReminder'), color: theme.colors.info, onPress: () => navigation.navigate('AddEntry', { mode: 'reminder' }) },
    { key: 'exp', icon: 'wallet-outline', label: t('home.addExpense'), color: theme.colors.success, onPress: () => navigation.navigate('AddEntry', { mode: 'expense' }) },
    { key: 'doc', icon: 'folder-open-outline', label: t('home.documents'), color: theme.colors.accent, onPress: () => navigation.navigate('Documents') },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing(2), paddingBottom: theme.spacing(14) }}>
        {/* Greeting */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <ThemedText variant="caption" color={theme.colors.textMuted}>{greeting},</ThemedText>
            <ThemedText variant="title">{settings.userName || 'Mitra'} 👋</ThemedText>
          </View>
          <IconCircle icon="leaf-outline" color={theme.colors.primary} size={48} />
        </View>

        {/* Summary cards */}
        <View style={{ flexDirection: 'row', gap: theme.spacing(1.5), marginTop: theme.spacing(2) }}>
          <SummaryCard
            icon="alarm-outline"
            color={theme.colors.info}
            value={String(todayReminders.length)}
            label={t('home.dueToday')}
          />
          <SummaryCard
            icon="wallet-outline"
            color={theme.colors.danger}
            value={formatCurrency(spentToday)}
            label={t('home.spentToday')}
          />
          <SummaryCard
            icon="people-outline"
            color={theme.colors.success}
            value={formatCurrency(toCollect)}
            label={t('home.toCollect')}
          />
        </View>

        {/* Progress */}
        <Card style={{ marginTop: theme.spacing(2), gap: theme.spacing(1) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <ThemedText variant="heading">{t('home.progress')}</ThemedText>
            <ThemedText variant="body" color={theme.colors.textMuted}>
              {doneToday}/{totalTodayReminders.length} {t('home.reminderProgress')}
            </ThemedText>
          </View>
          <View style={{ height: 10, borderRadius: 5, backgroundColor: theme.colors.surfaceAlt, overflow: 'hidden' }}>
            <View style={{ width: `${Math.round(progress * 100)}%`, height: 10, backgroundColor: theme.colors.primary }} />
          </View>
        </Card>

        {/* Quick actions */}
        <SectionHeader title={t('home.quickActions')} />
        <View style={{ flexDirection: 'row', gap: theme.spacing(1.5) }}>
          {quickActions.map((a) => (
            <Pressable key={a.key} onPress={a.onPress} style={{ flex: 1 }}>
              <Card style={{ alignItems: 'center', gap: theme.spacing(1), paddingVertical: theme.spacing(2) }}>
                <IconCircle icon={a.icon as any} color={a.color} size={46} />
                <ThemedText variant="caption" numberOfLines={1}>{a.label}</ThemedText>
              </Card>
            </Pressable>
          ))}
        </View>

        {/* Big voice CTA */}
        <Pressable onPress={() => navigation.navigate('Voice')} style={{ marginTop: theme.spacing(2) }}>
          <Card style={{ backgroundColor: theme.colors.primary, borderColor: theme.colors.primary, flexDirection: 'row', alignItems: 'center', gap: theme.spacing(2) }}>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: withAlpha('#FFFFFF', 0.2), alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="mic" size={28} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <ThemedText variant="heading" color="#FFFFFF">{t('voice.title')}</ThemedText>
              <ThemedText variant="caption" color={withAlpha('#FFFFFF', 0.85)}>{t('app.tagline')}</ThemedText>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
          </Card>
        </Pressable>

        {/* Today's reminders */}
        <SectionHeader title={t('home.todayReminders')} actionLabel={t('home.viewAll')} onAction={() => navigation.navigate('Reminders')} />
        {todayReminders.length === 0 ? (
          <Card><ThemedText variant="caption" color={theme.colors.textMuted}>{t('common.none')}</ThemedText></Card>
        ) : (
          <View style={{ gap: theme.spacing(1) }}>
            {todayReminders.slice(0, 3).map((r) => {
              const meta = REMINDER_CATEGORY_META[r.category];
              return (
                <Card key={r.id} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
                  <IconCircle icon={meta.icon as any} color={meta.color(theme.colors)} />
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="body" numberOfLines={1}>{r.title}</ThemedText>
                    <ThemedText variant="caption" color={theme.colors.textMuted}>{t(meta.labelKey)}</ThemedText>
                  </View>
                  {r.dueAt && (
                    <ThemedText variant="caption" color={theme.colors.primary}>
                      {new Date(r.dueAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}
                    </ThemedText>
                  )}
                </Card>
              );
            })}
          </View>
        )}

        {/* Pending payments / follow-ups */}
        <SectionHeader title={t('home.businessFollowup')} actionLabel={t('home.viewAll')} onAction={() => navigation.navigate('Business')} />
        {pendingUdhaar.length === 0 ? (
          <Card><ThemedText variant="caption" color={theme.colors.textMuted}>{t('common.none')}</ThemedText></Card>
        ) : (
          <View style={{ gap: theme.spacing(1) }}>
            {pendingUdhaar.slice(0, 3).map((u) => (
              <Card key={u.id} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
                <IconCircle icon="person-outline" color={u.status === 'overdue' ? theme.colors.danger : theme.colors.success} />
                <View style={{ flex: 1 }}>
                  <ThemedText variant="body">{u.personName}</ThemedText>
                  <ThemedText variant="caption" color={u.status === 'overdue' ? theme.colors.danger : theme.colors.textMuted}>
                    {u.direction === 'given' ? t('business.given') : t('business.received')} · {t(`common.${u.status}` as any)}
                  </ThemedText>
                </View>
                <ThemedText variant="heading" color={u.direction === 'given' ? theme.colors.success : theme.colors.danger}>
                  {formatCurrency(u.amount)}
                </ThemedText>
              </Card>
            ))}
          </View>
        )}

        {/* Recent expenses */}
        <SectionHeader title={t('home.recentExpenses')} actionLabel={t('home.viewAll')} onAction={() => navigation.navigate('Expenses')} />
        {recentExpenses.length === 0 ? (
          <Card><ThemedText variant="caption" color={theme.colors.textMuted}>{t('common.none')}</ThemedText></Card>
        ) : (
          <View style={{ gap: theme.spacing(1) }}>
            {recentExpenses.map((e) => {
              const meta = EXPENSE_CATEGORY_META[e.category];
              return (
                <Card key={e.id} style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
                  <IconCircle icon={meta.icon as any} color={meta.color(theme.colors)} />
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="body">{e.note || t(meta.labelKey)}</ThemedText>
                    <ThemedText variant="caption" color={theme.colors.textMuted}>{t(meta.labelKey)}</ThemedText>
                  </View>
                  <ThemedText variant="heading">{formatCurrency(e.amount)}</ThemedText>
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function SummaryCard({ icon, color, value, label }: { icon: any; color: string; value: string; label: string }) {
  const theme = useTheme();
  return (
    <Card style={{ flex: 1, gap: theme.spacing(0.5), paddingVertical: theme.spacing(2) }}>
      <IconCircle icon={icon} color={color} size={38} />
      <ThemedText variant="heading" numberOfLines={1} style={{ marginTop: 4 }}>{value}</ThemedText>
      <ThemedText variant="caption" color={theme.colors.textMuted} numberOfLines={1}>{label}</ThemedText>
    </Card>
  );
}
