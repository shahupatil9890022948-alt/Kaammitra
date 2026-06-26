import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useI18n } from '../i18n';
import { useData } from '../state/DataContext';

import HomeScreen from '../screens/HomeScreen';
import RemindersScreen from '../screens/RemindersScreen';
import ExpensesScreen from '../screens/ExpensesScreen';
import BusinessScreen from '../screens/BusinessScreen';
import ProfileScreen from '../screens/ProfileScreen';
import VoiceScreen from '../screens/VoiceScreen';
import AddEntryScreen from '../screens/AddEntryScreen';
import DocumentsScreen from '../screens/DocumentsScreen';
import DocumentDetailScreen from '../screens/DocumentDetailScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICON: Record<string, { on: keyof typeof Ionicons.glyphMap; off: keyof typeof Ionicons.glyphMap }> = {
  Home: { on: 'home', off: 'home-outline' },
  Reminders: { on: 'alarm', off: 'alarm-outline' },
  Expenses: { on: 'wallet', off: 'wallet-outline' },
  Business: { on: 'briefcase', off: 'briefcase-outline' },
  Profile: { on: 'person', off: 'person-outline' },
};

function MainTabs() {
  const theme = useTheme();
  const { t } = useI18n();
  const labels: Record<string, string> = {
    Home: t('tab.home'),
    Reminders: t('tab.reminders'),
    Expenses: t('tab.expenses'),
    Business: t('tab.business'),
    Profile: t('tab.profile'),
  };
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.tabInactive,
        tabBarLabel: labels[route.name],
        tabBarStyle: {
          backgroundColor: theme.colors.tabBar,
          borderTopColor: theme.colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const icon = TAB_ICON[route.name];
          return <Ionicons name={focused ? icon.on : icon.off} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Reminders" component={RemindersScreen} />
      <Tab.Screen name="Expenses" component={ExpensesScreen} />
      <Tab.Screen name="Business" component={BusinessScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const theme = useTheme();
  const { ready, settings } = useData();

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator color={theme.colors.primary} size="large" />
      </View>
    );
  }

  const navTheme = theme.dark
    ? { ...DarkTheme, colors: { ...DarkTheme.colors, background: theme.colors.background, card: theme.colors.surface, primary: theme.colors.primary, text: theme.colors.text, border: theme.colors.border } }
    : { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: theme.colors.background, card: theme.colors.surface, primary: theme.colors.primary, text: theme.colors.text, border: theme.colors.border } };

  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!settings.onboardingCompleted ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Voice" component={VoiceScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="AddEntry" component={AddEntryScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="Documents" component={DocumentsScreen} options={{ presentation: 'modal' }} />
            <Stack.Screen name="DocumentDetail" component={DocumentDetailScreen} options={{ presentation: 'modal' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
