import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DataProvider, useData } from './src/state/DataContext';
import { ThemeProvider } from './src/theme/ThemeContext';
import { I18nProvider } from './src/i18n';
import RootNavigator from './src/navigation/RootNavigator';

/**
 * Providers read live settings (language + theme) from the data store so the
 * whole app re-themes / re-localizes instantly when the user changes them.
 */
function ThemedApp() {
  const { settings } = useData();
  return (
    <ThemeProvider mode={settings.theme}>
      <I18nProvider language={settings.language}>
        <StatusBar style={settings.theme === 'dark' ? 'light' : 'auto'} />
        <RootNavigator />
      </I18nProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <DataProvider>
        <ThemedApp />
      </DataProvider>
    </SafeAreaProvider>
  );
}
