import { Tabs } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
            borderTopColor: colorScheme === 'dark' ? '#2a2a2a' : '#e5e5e5',
          },
        }}
      >
        {/* a hidden root redirect */}
        <Tabs.Screen
          name="index"
          options={{ href: null }}
        />

        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="map.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="forum"
          options={{
            title: 'Forum',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="bubble.left.and.bubble.right.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
