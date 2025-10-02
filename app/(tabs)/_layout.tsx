import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@/theme';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';
import {BasketIcon,HouseSimpleIcon,CalendarDotsIcon,UsersIcon,MagicWandIcon} from 'phosphor-react-native'   

export default function TabLayout() {
  const { palette, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: isDark ? palette.subtext : Colors.gray[500],
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: palette.bg,
          borderTopColor: palette.border,
          borderTopWidth: 1,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          height: Platform.OS === 'ios' ? 85 : 65,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          letterSpacing: 0.2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}>
      
      {/* Home Tab */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <HouseSimpleIcon size={24} color={color} />
          )
        }} 
      />
      
      {/* Community Tab */}
      <Tabs.Screen 
        name="community/recipe-list" 
        options={{ 
          title: 'Community', 
          tabBarLabel: 'Community',
          tabBarIcon: ({ color, focused }) => (
            <UsersIcon size={24} color={color} />
          )
        }} 
      />
      
      {/* AI Recipe Tab - Centered with special styling */}
      <Tabs.Screen 
        name="ai"
        options={{ 
          title: 'AI Recipe', 
          tabBarLabel: 'AI Recipe',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: focused ? palette.primary : palette.primary + '90',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -12,
              shadowColor: palette.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 3,
              borderColor: palette.bg,
            }}>
              <MagicWandIcon size={28} color={Colors.white} />
            </View>
          ),
        }} 
      />
      
      {/* Pantry Tab */}
      <Tabs.Screen 
        name="pantry/pantry"
        options={{ 
          title: 'Pantry', 
          tabBarLabel: 'Pantry',
          tabBarIcon: ({ color, focused }) => (
            <BasketIcon size={24} color={color} />
          )
        }} 
      />
      
      {/* Meal Planner Tab */}
      <Tabs.Screen 
        name="plan/index" 
        options={{ 
          title: 'Meal Plan', 
          tabBarLabel: 'Meal Plan',
          tabBarIcon: ({ color, focused }) => (
            <CalendarDotsIcon size={24} color={color} />
          )
        }} 
      />
      
      {/* Hide the pantry sub-screens from navigation */}
      <Tabs.Screen 
        name="pantry/enhanced"
        options={{ 
          href: null,
        }} 
      />
      
      <Tabs.Screen 
        name="pantry/smart-shopping"
        options={{ 
          href: null,
        }} 
      />


      
    </Tabs>
  );
}
