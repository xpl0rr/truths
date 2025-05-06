// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
// removed obsolete hydration hook

// Splash and font gating removed

export default function RootLayout() {
  /* 1️⃣  Detect the device colour scheme (light / dark) */
  const colorScheme = useColorScheme();

  /* 5️⃣  Root navigation tree */
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* Primary navigator: tabs group */}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>

      {/* System-status-bar style (light vs dark-content) */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}