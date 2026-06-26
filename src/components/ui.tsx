import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleProp,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { Theme } from '../theme/theme';

export function Screen({
  children,
  scroll = false,
  contentStyle,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}) {
  const theme = useTheme();
  const Body = scroll ? ScrollView : View;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <Body
        style={{ flex: 1 }}
        contentContainerStyle={
          scroll
            ? [{ padding: theme.spacing(2), paddingBottom: theme.spacing(12) }, contentStyle]
            : undefined
        }
      >
        {!scroll ? (
          <View style={[{ flex: 1, padding: theme.spacing(2) }, contentStyle]}>{children}</View>
        ) : (
          children
        )}
      </Body>
    </SafeAreaView>
  );
}

export function ThemedText({
  children,
  variant = 'body',
  color,
  style,
  numberOfLines,
}: {
  children: React.ReactNode;
  variant?: 'display' | 'title' | 'heading' | 'body' | 'caption' | 'label';
  color?: string;
  style?: StyleProp<TextStyle>;
  numberOfLines?: number;
}) {
  const theme = useTheme();
  const map: Record<string, TextStyle> = {
    display: { fontSize: theme.font.display, fontWeight: '800' },
    title: { fontSize: theme.font.xxl, fontWeight: '800' },
    heading: { fontSize: theme.font.lg, fontWeight: '700' },
    body: { fontSize: theme.font.md, fontWeight: '500' },
    caption: { fontSize: theme.font.sm, fontWeight: '500' },
    label: { fontSize: theme.font.xs, fontWeight: '700', letterSpacing: 0.5 },
  };
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{ color: color ?? theme.colors.text }, map[variant], style]}
    >
      {children}
    </Text>
  );
}

export function Card({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  const theme = useTheme();
  const base: ViewStyle = {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing(2),
  };
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [base, pressed && { opacity: 0.85 }, style]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled,
  style,
  loading,
}: {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  loading?: boolean;
}) {
  const theme = useTheme();
  const palette: Record<string, { bg: string; fg: string; border?: string }> = {
    primary: { bg: theme.colors.primary, fg: '#FFFFFF' },
    secondary: { bg: theme.colors.surfaceAlt, fg: theme.colors.text, border: theme.colors.border },
    ghost: { bg: 'transparent', fg: theme.colors.primary },
    danger: { bg: theme.colors.dangerSoft, fg: theme.colors.danger },
  };
  const p = palette[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        {
          backgroundColor: p.bg,
          borderColor: p.border ?? 'transparent',
          borderWidth: p.border ? 1 : 0,
          borderRadius: theme.radius.pill,
          paddingVertical: theme.spacing(1.75),
          paddingHorizontal: theme.spacing(3),
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing(1),
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          minHeight: 52,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={p.fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={20} color={p.fg} />}
          <Text style={{ color: p.fg, fontSize: theme.font.md, fontWeight: '700' }}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

export function Chip({
  label,
  active,
  onPress,
  icon,
  color,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
}) {
  const theme = useTheme();
  const accent = color ?? theme.colors.primary;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: active ? accent : theme.colors.surfaceAlt,
        borderColor: active ? accent : theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.pill,
        paddingVertical: theme.spacing(1),
        paddingHorizontal: theme.spacing(1.75),
        opacity: pressed ? 0.85 : 1,
        minHeight: 40,
      })}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={16}
          color={active ? '#FFFFFF' : theme.colors.textMuted}
        />
      )}
      <Text
        style={{
          color: active ? '#FFFFFF' : theme.colors.text,
          fontWeight: '600',
          fontSize: theme.font.sm,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function IconCircle({
  icon,
  color,
  size = 44,
  bg,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  size?: number;
  bg?: string;
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg ?? withAlpha(color, theme.dark ? 0.22 : 0.14),
      }}
    >
      <Ionicons name={icon} size={size * 0.5} color={color} />
    </View>
  );
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(2),
      }}
    >
      <ThemedText variant="heading">{title}</ThemedText>
      {actionLabel && onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={{ color: theme.colors.primary, fontWeight: '700' }}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

export function EmptyState({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  const theme = useTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: theme.spacing(5), gap: theme.spacing(1.5) }}>
      <IconCircle icon={icon} color={theme.colors.textMuted} size={64} />
      <ThemedText variant="body" color={theme.colors.textMuted} style={{ textAlign: 'center' }}>
        {text}
      </ThemedText>
    </View>
  );
}

export function ScreenModalHeader({ title, onClose }: { title: string; onClose: () => void }) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: theme.colors.background }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: theme.spacing(2),
          paddingVertical: theme.spacing(1.5),
          borderBottomWidth: 1,
          borderBottomColor: theme.colors.border,
        }}
      >
        <ThemedText variant="heading">{title}</ThemedText>
        <Pressable onPress={onClose} hitSlop={10}>
          <Ionicons name="close" size={26} color={theme.colors.text} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

export function Pill({ text, color, bg }: { text: string; color: string; bg: string }) {
  const theme = useTheme();
  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: theme.radius.pill,
        paddingVertical: 3,
        paddingHorizontal: theme.spacing(1),
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color, fontSize: theme.font.xs, fontWeight: '700' }}>{text}</Text>
    </View>
  );
}

/** Naive hex+alpha blend; inputs are always 6-digit hex from the theme. */
export function withAlpha(hex: string, alpha: number): string {
  const a = Math.round(alpha * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${a}`;
}

export function useThemed(): Theme {
  return useTheme();
}
