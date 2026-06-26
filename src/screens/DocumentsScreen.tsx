import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n';
import { useData } from '../state/DataContext';
import { Card, IconCircle, ScreenModalHeader, ThemedText } from '../components/ui';
import { DOCUMENT_TEMPLATES } from '../db/documentTemplates';

export default function DocumentsScreen({ navigation }: any) {
  const theme = useTheme();
  const { t, language } = useI18n();
  const { getDocProgress } = useData();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScreenModalHeader title={t('documents.title')} onClose={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: theme.spacing(2), gap: theme.spacing(1.5), paddingBottom: theme.spacing(6) }}>
        <ThemedText variant="caption" color={theme.colors.textMuted}>{t('documents.subtitle')}</ThemedText>
        {DOCUMENT_TEMPLATES.map((tpl) => {
          const progress = getDocProgress(tpl.id);
          const done = progress ? Object.values(progress.checked).filter(Boolean).length : 0;
          const total = tpl.items.length;
          const pct = total ? done / total : 0;
          return (
            <Card key={tpl.id} onPress={() => navigation.navigate('DocumentDetail', { templateId: tpl.id })} style={{ gap: theme.spacing(1) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
                <IconCircle icon={tpl.icon as any} color={theme.colors.accent} />
                <View style={{ flex: 1 }}>
                  <ThemedText variant="heading">{tpl.title[language]}</ThemedText>
                  <ThemedText variant="caption" color={theme.colors.textMuted}>
                    {done}/{total} {t('documents.itemsDone')}
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward" size={22} color={theme.colors.textMuted} />
              </View>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.colors.surfaceAlt, overflow: 'hidden' }}>
                <View style={{ width: `${Math.round(pct * 100)}%`, height: 8, backgroundColor: done === total && total > 0 ? theme.colors.success : theme.colors.accent }} />
              </View>
            </Card>
          );
        })}
      </ScrollView>
    </View>
  );
}
