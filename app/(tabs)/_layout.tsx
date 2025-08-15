import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors : Colors;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabBar.iconSelected,
        tabBarInactiveTintColor: colors.tabBar.iconDefault,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.tabBar.background,
          borderTopColor: colors.tabBar.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          height: Platform.OS === 'ios' ? 85 : 65,
          ...Platform.select({ 
            ios: { 
              shadowColor: colors.shadow.medium,
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
            },
            android: {
              elevation: 10,
            },
            default: {} 
          }),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}>
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "home" : "home-outline"} 
              size={24} 
              color={color} 
            />
          )
        }} 
      />
      <Tabs.Screen 
        name="explore" 
        options={{ 
          title: 'Discover', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "search" : "search-outline"} 
              size={24} 
              color={color} 
            />
          )
        }} 
      />
      <Tabs.Screen 
        name="plan" 
        options={{ 
          title: 'Meal Plan', 
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons 
              name={focused ? "calendar-month" : "calendar-month-outline"} 
              size={24} 
              color={color} 
            />
          )
        }} 
      />
      <Tabs.Screen 
        name="profile" 
        options={{ 
          title: 'Profile', 
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={24} 
              color={color} 
            />
          )
        }} 
      />
      {/* Hidden tabs that still exist but not shown in tab bar */}
      <Tabs.Screen 
        name="ai" 
        options={{ 
          href: null,
        }} 
      />
      <Tabs.Screen 
        name="pantry" 
        options={{ 
          href: null,
        }} 
      />
      <Tabs.Screen 
        name="community" 
        options={{ 
          href: null,
        }} 
      />
    </Tabs>
  );
}
