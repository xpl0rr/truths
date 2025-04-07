import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { LessonProvider } from '../store/LessonStore';

export default function TabLayout() {
  return (
    <LessonProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors['light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Gramma Said',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="lightbulb.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="user-lessons"
          options={{
            title: 'Submissions',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="person.2.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: 'Add New',
            tabBarIcon: ({ color }) => <IconSymbol size={24} name="plus.circle.fill" color={color} />,
          }}
        />
      </Tabs>
    </LessonProvider>
  );
}
