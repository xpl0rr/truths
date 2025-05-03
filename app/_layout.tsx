// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/useColorScheme';

// ─────────────────────────────────────────────────────────
// Prevent the native splash screen from hiding until fonts
// and other async assets are loaded.
SplashScreen.preventAutoHideAsync();
// ─────────────────────────────────────────────────────────

export default function RootLayout() {
  /* 1️⃣  Detect the device colour scheme (light / dark) */
  const colorScheme = useColorScheme();

  /* 2️⃣  Load any custom fonts your app needs */
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  /* 3️⃣  Hide the splash screen as soon as all assets are ready */
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  /* 4️⃣  While assets are loading, keep the splash screen visible */
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