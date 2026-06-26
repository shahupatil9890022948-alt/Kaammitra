import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n';
import { useData } from '../state/DataContext';
import { Button, Card, Chip, EmptyState, IconCircle, Pill, ThemedText, withAlpha } from '../components/ui';
import { formatCurrency, relativeDay } from '../utils/format';
import { UdhaarStatus } from '../models/types';
import { shareText } from '../utils/share';
import { Fab, TabHeader } from '../components/layout';

export default function BusinessScreen({ navigation }: any) {
  const theme = useTheme();
  const { t, language } = useI18n();
  const { udhaar, notes, setUdhaarStatus, deleteUdhaar, deleteNote } = useData();
  const [tab, setTab] = useState<'udhaar' | 'notes'>('udhaar');
  const [status, setStatus] = useState<UdhaarStatus | 'all'>('all');

  const netToCollect = udhaar
    .filter((u) => u.status !== 'paid')
    .reduce((s, u) => s + (u.direction === 'given' ? u.amount : -u.amount), 0);

  const filteredUdhaar = udhaar
    .filter((u) => (status === 'all' ? true : u.status === status))
    .sort((a, b) => b.createdAt - a.createdAt);

  const statusColor = (s: UdhaarStatus) =>
    s === 'paid' ? theme.colors.success : s === 'overdue' ? theme.colors.danger : theme.colors.warning;

  const shareSummary = () => {
    const lines = udhaar
      .filter((u) => u.status !== 'paid')
      .map((u) => `${u.personName}: ${formatCurrency(u.amount)} (${t(`common.${u.status}` as any)})`);
    shareText(`${t('share.summaryText')}\n${lines.join('\n')}\n${t('business.netPosition')}: ${formatCurrency(netToCollect)}`, 'business_summary');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <TabHeader
        title={t('business.title')}
        right={
          <Pressable onPress={shareSummary} hitSlop={8}>
            <Ionicons name="share-social-outline" size={24} color={theme.colors.primary} />
          </Pressable>
        }
      />

      <View style={{ paddingHorizontal: theme.spacing(2) }}>
        <Card style={{ backgroundColor: withAlpha(theme.colors.success, theme.dark ? 0.18 : 0.12), borderColor: 'transparent', flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
          <IconCircle icon="trending-up-outline" color={theme.colors.success} />
          <View style={{ flex: 1 }}>
            <ThemedText variant="caption" color={theme.colors.textMuted}>{t('business.netPosition')}</ThemedText>
            <ThemedText variant="title" color={theme.colors.success}>{formatCurrency(netToCollect)}</ThemedText>
          </View>
        </Card>
      </View>

      <View style={{ flexDirection: 'row', gap: theme.spacing(1), padding: theme.spacing(2) }}>
        {(['udhaar', 'notes'] as const).map((tk) => (
          <Pressable key={tk} onPress={() => setTab(tk)} style={{ flex: 1 }}>
            <View style={{ paddingVertical: theme.spacing(1.25), borderRadius: theme.radius.pill, backgroundColor: tab === tk ? theme.colors.primary : theme.colors.surfaceAlt, alignItems: 'center' }}>
              <ThemedText variant="body" color={tab === tk ? '#FFFFFF' : theme.colors.text}>
                {tk === 'udhaar' ? t('business.udhaar') : t('business.notes')}
              </ThemedText>
            </View>
          </Pressable>
        ))}
      </View>

      {tab === 'udhaar' && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: theme.spacing(1), paddingHorizontal: theme.spacing(2), paddingBottom: theme.spacing(1) }}>
          {(['all', 'pending', 'overdue', 'paid'] as const).map((s) => (
            <Chip key={s} label={s === 'all' ? t('common.all') : t(`common.${s}` as any)} active={status === s} onPress={() => setStatus(s)} />
          ))}
        </ScrollView>
      )}

      <ScrollView contentContainerStyle={{ paddingHorizontal: theme.spacing(2), paddingBottom: theme.spacing(16), gap: theme.spacing(1) }}>
        {tab === 'udhaar' ? (
          filteredUdhaar.length === 0 ? (
            <EmptyState icon="people-outline" text={t('business.empty')} />
          ) : (
            filteredUdhaar.map((u) => (
              <Card key={u.id} style={{ gap: theme.spacing(1) }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
                  <IconCircle icon="person-outline" color={u.direction === 'given' ? theme.colors.success : theme.colors.info} />
                  <View style={{ flex: 1 }}>
                    <ThemedText variant="heading">{u.personName}</ThemedText>
                    <ThemedText variant="caption" color={theme.colors.textMuted}>
                      {u.direction === 'given' ? t('business.given') : t('business.received')}
                      {u.dueAt ? ` · ${relativeDay(u.dueAt, language)}` : ''}
                    </ThemedText>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <ThemedText variant="heading" color={u.direction === 'given' ? theme.colors.success : theme.colors.info}>{formatCurrency(u.amount)}</ThemedText>
                    <Pill text={t(`common.${u.status}` as any)} color={statusColor(u.status)} bg={withAlpha(statusColor(u.status), 0.16)} />
                  </View>
                </View>
                {u.note ? <ThemedText variant="caption" color={theme.colors.textMuted}>{u.note}</ThemedText> : null}
                <View style={{ flexDirection: 'row', gap: theme.spacing(1) }}>
                  {u.status !== 'paid' && (
                    <Button label={t('business.markPaid')} variant="secondary" icon="checkmark-done-outline" onPress={() => setUdhaarStatus(u.id, 'paid')} style={{ flex: 1, minHeight: 42 }} />
                  )}
                  <Button label={t('reminders.share')} variant="ghost" icon="logo-whatsapp" onPress={() => shareText(`${u.personName} - ${formatCurrency(u.amount)} ${t(`common.${u.status}` as any)}`, 'udhaar')} style={{ flex: 1, minHeight: 42 }} />
                  <Pressable onPress={() => deleteUdhaar(u.id)} hitSlop={8} style={{ padding: theme.spacing(1) }}>
                    <Ionicons name="trash-outline" size={20} color={theme.colors.textMuted} />
                  </Pressable>
                </View>
              </Card>
            ))
          )
        ) : notes.length === 0 ? (
          <EmptyState icon="document-text-outline" text={t('business.notesEmpty')} />
        ) : (
          notes.map((n) => (
            <Card key={n.id} style={{ flexDirection: 'row', gap: theme.spacing(1.5) }}>
              <IconCircle icon="document-text-outline" color={theme.colors.primary} />
              <View style={{ flex: 1 }}>
                <ThemedText variant="body">{n.title}</ThemedText>
                {n.body ? <ThemedText variant="caption" color={theme.colors.textMuted}>{n.body}</ThemedText> : null}
              </View>
              <Pressable onPress={() => deleteNote(n.id)} hitSlop={8} style={{ padding: 4 }}>
                <Ionicons name="trash-outline" size={20} color={theme.colors.textMuted} />
              </Pressable>
            </Card>
          ))
        )}
      </ScrollView>

      <Fab icon="add" onPress={() => navigation.navigate('AddEntry', { mode: tab === 'udhaar' ? 'udhaar' : 'note' })} />
    </SafeAreaView>
  );
}
