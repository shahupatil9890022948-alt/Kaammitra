import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n';
import { useData } from '../state/DataContext';
import { Button, IconCircle, ThemedText, withAlpha } from '../components/ui';
import { LanguageCode } from '../models/types';
import { languageLabels } from '../i18n/translations';
import { requestNotificationPermission } from '../notifications/notifications';

const LANGS: LanguageCode[] = ['en', 'hi', 'mr'];

export default function OnboardingScreen() {
  const theme = useTheme();
  const { t } = useI18n();
  const { settings, updateSettings, completeOnboarding } = useData();
  const [step, setStep] = useState(0);
  const [name, setName] = useState(settings.userName);

  const totalSteps = 5;

  const next = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const onAllowNotif = async () => {
    const granted = await requestNotificationPermission();
    await updateSettings({ notificationsEnabled: granted });
    next();
  };

  const onFinish = async () => {
    await completeOnboarding(name || 'Mitra');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ flex: 1, padding: theme.spacing(3) }}>
        {/* Progress dots */}
        <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', marginBottom: theme.spacing(3) }}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={{
                width: i === step ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: i <= step ? theme.colors.primary : theme.colors.border,
              }}
            />
          ))}
        </View>

        <View style={{ flex: 1, justifyContent: 'center', gap: theme.spacing(3) }}>
          {step === 0 && (
            <View style={{ gap: theme.spacing(2) }}>
              <ThemedText variant="title" style={{ textAlign: 'center' }}>{t('onboarding.chooseLanguage')}</ThemedText>
              <ThemedText variant="caption" color={theme.colors.textMuted} style={{ textAlign: 'center' }}>
                {t('onboarding.languageHint')}
              </ThemedText>
              <View style={{ gap: theme.spacing(1.5), marginTop: theme.spacing(1) }}>
                {LANGS.map((lang) => {
                  const active = settings.language === lang;
                  return (
                    <Pressable
                      key={lang}
                      onPress={() => updateSettings({ language: lang })}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: theme.spacing(2),
                        borderRadius: theme.radius.lg,
                        borderWidth: 2,
                        borderColor: active ? theme.colors.primary : theme.colors.border,
                        backgroundColor: active ? withAlpha(theme.colors.primary, 0.1) : theme.colors.surface,
                      }}
                    >
                      <ThemedText variant="heading">{languageLabels[lang]}</ThemedText>
                      {active && <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {step === 1 && (
            <Hero
              icon="rocket-outline"
              title={t('onboarding.purposeTitle')}
              body={t('onboarding.purposeBody')}
              tagline={t('app.tagline')}
            />
          )}

          {step === 2 && (
            <View style={{ gap: theme.spacing(2) }}>
              <Hero icon="mic-outline" title={t('onboarding.voiceTitle')} body={t('onboarding.voiceBody')} />
            </View>
          )}

          {step === 3 && (
            <View style={{ gap: theme.spacing(2) }}>
              <Hero icon="notifications-outline" title={t('onboarding.notifTitle')} body={t('onboarding.notifBody')} />
            </View>
          )}

          {step === 4 && (
            <View style={{ gap: theme.spacing(2) }}>
              <View style={{ alignItems: 'center' }}>
                <IconCircle icon="happy-outline" color={theme.colors.primary} size={88} />
              </View>
              <ThemedText variant="title" style={{ textAlign: 'center' }}>{t('onboarding.nameLabel')}</ThemedText>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder={t('onboarding.namePlaceholder')}
                placeholderTextColor={theme.colors.textMuted}
                style={{
                  backgroundColor: theme.colors.surface,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  borderRadius: theme.radius.md,
                  padding: theme.spacing(2),
                  fontSize: theme.font.lg,
                  color: theme.colors.text,
                  textAlign: 'center',
                }}
              />
            </View>
          )}
        </View>

        {/* Footer actions */}
        <View style={{ gap: theme.spacing(1) }}>
          {step === 3 ? (
            <Button label={t('onboarding.allowNotif')} icon="notifications-outline" onPress={onAllowNotif} />
          ) : step === 4 ? (
            <Button label={t('onboarding.getStarted')} icon="arrow-forward" onPress={onFinish} />
          ) : (
            <Button label={t('common.next')} icon="arrow-forward" onPress={next} />
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            {step > 0 ? (
              <Pressable onPress={back} hitSlop={10} style={{ padding: theme.spacing(1) }}>
                <ThemedText variant="caption" color={theme.colors.textMuted}>{t('common.back')}</ThemedText>
              </Pressable>
            ) : (
              <View />
            )}
            {step < 4 && (
              <Pressable onPress={() => setStep(4)} hitSlop={10} style={{ padding: theme.spacing(1) }}>
                <ThemedText variant="caption" color={theme.colors.textMuted}>{t('common.skip')}</ThemedText>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Hero({
  icon,
  title,
  body,
  tagline,
}: {
  icon: any;
  title: string;
  body: string;
  tagline?: string;
}) {
  const theme = useTheme();
  return (
    <View style={{ gap: theme.spacing(2), alignItems: 'center' }}>
      <IconCircle icon={icon} color={theme.colors.primary} size={96} />
      <ThemedText variant="title" style={{ textAlign: 'center' }}>{title}</ThemedText>
      <ThemedText variant="body" color={theme.colors.textMuted} style={{ textAlign: 'center', lineHeight: 24 }}>
        {body}
      </ThemedText>
      {tagline && (
        <View
          style={{
            backgroundColor: withAlpha(theme.colors.primary, 0.12),
            paddingHorizontal: theme.spacing(2),
            paddingVertical: theme.spacing(1),
            borderRadius: theme.radius.pill,
          }}
        >
          <ThemedText variant="caption" color={theme.colors.primary}>“{tagline}”</ThemedText>
        </View>
      )}
    </View>
  );
}
