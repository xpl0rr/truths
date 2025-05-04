// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';
import { useHydrateLessons } from '@/store/lessonStore-persist';

// ─────────────────────────────────────────────────────────
// Remove manual splash control; let splash hide when fonts load
// ─────────────────────────────────────────────────────────

export default function RootLayout() {
  /* 1️⃣  Detect the device colour scheme (light / dark) */
  const colorScheme = useColorScheme();

  /* 1️⃣·5️⃣  Load persisted lessons before render */
  const hydrated = useHydrateLessons();

  /* 2️⃣  Load any custom fonts your app needs */
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  /* 3️⃣  Hide the splash screen once fonts load */
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  /* While fonts are loading, keep splash visible */
  if (!fontsLoaded) {
    return null;
  }

  /* 5️⃣  Root navigation tree */
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 👉 Your tab navigator lives inside this folder */}
        <Stack.Screen name="(tabs)" />
        {/* 👉 404 / catch-all screen */}
        <Stack.Screen name="+not-found" />
      </Stack>

      {/* System-status-bar style (light vs dark-content) */}
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}