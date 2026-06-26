import React from 'react';
import { Pressable, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { ThemedText } from './ui';

export function TabHeader({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing(2),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1.5),
      }}
    >
      <ThemedText variant="title">{title}</ThemedText>
      {right}
    </View>
  );
}

export function Fab({
  icon,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        position: 'absolute',
        right: theme.spacing(2.5),
        bottom: theme.spacing(3),
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: pressed ? 0.85 : 1,
        // Soft, non-flashy elevation appropriate for budget devices.
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
        elevation: 4,
      })}
    >
      <Ionicons name={icon} size={30} color="#FFFFFF" />
    </Pressable>
  );
}
