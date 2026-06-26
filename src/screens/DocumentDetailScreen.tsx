import React, { useEffect, useRef } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n';
import { useData } from '../state/DataContext';
import { Card, IconCircle, ScreenModalHeader, ThemedText } from '../components/ui';
import { DOCUMENT_TEMPLATES } from '../db/documentTemplates';
import { track } from '../analytics/analytics';

export default function DocumentDetailScreen({ navigation, route }: any) {
  const templateId: string = route?.params?.templateId;
  const theme = useTheme();
  const { t, language } = useI18n();
  const { getDocProgress, setDocItem, setDocNote } = useData();

  const tpl = DOCUMENT_TEMPLATES.find((x) => x.id === templateId);
  const progress = getDocProgress(templateId);
  const completedRef = useRef(false);

  const done = tpl ? tpl.items.filter((i) => progress?.checked[i.key]).length : 0;
  const total = tpl?.items.length ?? 0;

  // Fire checklist_completed once when every item is checked.
  useEffect(() => {
    if (total > 0 && done === total && !completedRef.current) {
      completedRef.current = true;
      track('checklist_completed', { templateId });
    }
    if (done < total) completedRef.current = false;
  }, [done, total, templateId]);

  if (!tpl) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ScreenModalHeader title={t('documents.title')} onClose={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScreenModalHeader title={tpl.title[language]} onClose={() => navigation.goBack()} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: theme.spacing(2), gap: theme.spacing(1.5), paddingBottom: theme.spacing(6) }}>
        <Card style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
          <IconCircle icon={tpl.icon as any} color={theme.colors.accent} />
          <View style={{ flex: 1 }}>
            <ThemedText variant="heading">{tpl.title[language]}</ThemedText>
            <ThemedText variant="caption" color={done === total ? theme.colors.success : theme.colors.textMuted}>
              {done}/{total} {t('documents.itemsDone')}
            </ThemedText>
          </View>
        </Card>

        <View style={{ gap: theme.spacing(1) }}>
          {tpl.items.map((item) => {
            const checked = !!progress?.checked[item.key];
            return (
              <Pressable key={item.key} onPress={() => setDocItem(templateId, item.key, !checked)}>
                <Card style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing(1.5) }}>
                  <Ionicons
                    name={checked ? 'checkbox' : 'square-outline'}
                    size={26}
                    color={checked ? theme.colors.success : theme.colors.textMuted}
                  />
                  <ThemedText
                    variant="body"
                    style={{ flex: 1 }}
                    color={checked ? theme.colors.textMuted : theme.colors.text}
                  >
                    {item.label[language]}
                  </ThemedText>
                </Card>
              </Pressable>
            );
          })}
        </View>

        <ThemedText variant="label" color={theme.colors.textMuted} style={{ marginTop: theme.spacing(1) }}>
          {t('common.note').toUpperCase()}
        </ThemedText>
        <TextInput
          value={progress?.note ?? ''}
          onChangeText={(v) => setDocNote(templateId, v)}
          placeholder={t('documents.notePlaceholder')}
          placeholderTextColor={theme.colors.textMuted}
          multiline
          style={{
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.md,
            padding: theme.spacing(1.5),
            minHeight: 80,
            color: theme.colors.text,
            fontSize: theme.font.md,
            textAlignVertical: 'top',
          }}
        />
      </ScrollView>
    </View>
  );
}
