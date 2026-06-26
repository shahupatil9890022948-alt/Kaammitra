import React from 'react';
import { Pressable, ScrollView, Switch, View, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n';
import { useData } from '../state/DataContext';
import { Card, Chip, IconCircle, ThemedText } from '../components/ui';
import { TabHeader } from '../components/layout';
import { LanguageCode, ThemeMode } from '../models/types';
import { languageLabels } from '../i18n/translations';
import { requestNotificationPermission } from '../notifications/notifications';

const LANGS: LanguageCode[] = ['en', 'hi', 'mr'];
const THEMES: ThemeMode[] = ['system', 'light', 'dark'];

export default function ProfileScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const { settings, updateSettings, resetData } = useData();

  const onToggleNotif = async (value: boolean) => {
    if (value) {
      const granted = await requestNotificationPermission();
      await updateSettings({ notificationsEnabled: granted });
    } else {
      await updateSettings({ notificationsEnabled: false });
    }
  };

  const onReset = () => {
    if (Platform.OS === 'web') {
      resetData();
      return;
    }
    Alert.alert(t('profile.resetData'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.confirm'), style: 'destructive', onPress: () => resetData() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <TabHeader title={t('profile.title')} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing(2), gap: theme.spacing(2), paddingBottom: theme.spacing(14) }}>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(2) }}>
          <IconCircle icon="person-circle-outline" color={theme.colors.primary} size={56} />
          <View>
            <ThemedText variant="heading">{settings.userName || 'Mitra'}</ThemedText>
            <ThemedText variant="caption" color={theme.colors.textMuted}>{t('app.tagline')}</ThemedText>
          </View>
        </Card>

        {/* Language */}
        <View style={{ gap: theme.spacing(1) }}>
          <ThemedText variant="label" color={theme.colors.textMuted}>{t('profile.language').toUpperCase()}</ThemedText>
          <View style={{ flexDirection: 'row', gap: theme.spacing(1) }}>
            {LANGS.map((l) => (
              <Chip key={l} label={languageLabels[l]} active={settings.language === l} onPress={() => updateSettings({ language: l })} />
            ))}
          </View>
        </View>

        {/* Theme */}
        <View style={{ gap: theme.spacing(1) }}>
          <ThemedText variant="label" color={theme.colors.textMuted}>{t('profile.theme').toUpperCase()}</ThemedText>
          <View style={{ flexDirection: 'row', gap: theme.spacing(1) }}>
            {THEMES.map((m) => (
              <Chip
                key={m}
                label={t(`profile.theme.${m}` as any)}
                icon={m === 'system' ? 'phone-portrait-outline' : m === 'light' ? 'sunny-outline' : 'moon-outline'}
                active={settings.theme === m}
                onPress={() => updateSettings({ theme: m })}
              />
            ))}
          </View>
        </View>

        {/* Notifications */}
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
          <IconCircle icon="notifications-outline" color={theme.colors.info} />
          <ThemedText variant="body" style={{ flex: 1 }}>{t('profile.notifications')}</ThemedText>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={onToggleNotif}
            trackColor={{ true: theme.colors.primary, false: theme.colors.border }}
            thumbColor="#FFFFFF"
          />
        </Card>

        {/* Placeholders */}
        <Row icon="cloud-upload-outline" color={theme.colors.accent} title={t('profile.backup')} subtitle={t('profile.backupSoon')} />
        <Row icon="star-outline" color={theme.colors.warning} title={t('profile.premium')} subtitle={t('profile.premiumSoon')} badge="PRO" />
        <Row icon="briefcase-outline" color={theme.colors.primary} title={t('profile.businessPack')} subtitle={t('profile.businessPackSoon')} badge="PRO" />
        <Row icon="information-circle-outline" color={theme.colors.info} title={t('profile.help')} subtitle={t('profile.helpBody')} />

        <Pressable onPress={onReset}>
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
            <IconCircle icon="refresh-outline" color={theme.colors.danger} />
            <ThemedText variant="body" color={theme.colors.danger}>{t('profile.resetData')}</ThemedText>
          </Card>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  icon,
  color,
  title,
  subtitle,
  badge,
}: {
  icon: any;
  color: string;
  title: string;
  subtitle: string;
  badge?: string;
}) {
  const theme = useTheme();
  return (
    <Card style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
      <IconCircle icon={icon} color={color} />
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1) }}>
          <ThemedText variant="body">{title}</ThemedText>
          {badge && (
            <View style={{ backgroundColor: theme.colors.warning, borderRadius: 6, paddingHorizontal: 6, paddingVertical: 1 }}>
              <ThemedText variant="label" color="#FFFFFF">{badge}</ThemedText>
            </View>
          )}
        </View>
        <ThemedText variant="caption" color={theme.colors.textMuted}>{subtitle}</ThemedText>
      </View>
    </Card>
  );
}
