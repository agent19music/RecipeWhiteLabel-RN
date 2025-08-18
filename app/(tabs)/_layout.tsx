import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? Colors : Colors;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray[500],
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.gray[100],
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
      
      {/* Main 3 tabs only */}
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Home', 
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Entypo name="home" size={24} color={color} />
          )
        }} 
      />
      
      <Tabs.Screen 
        name="community/recipe-list" 
        options={{ 
          title: 'Recipes', 
          tabBarLabel: 'Recipes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "people" : "people-outline"} 
              size={26} 
              color={color} 
            />
          )
        }} 
      />
      
      <Tabs.Screen 
        name="pantry/index" 
        options={{ 
            title: 'Kitchen', 
          tabBarLabel: 'Pantry',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons name="kitchen" size={24} color={color} />
          )
        }} 
      />
      
      {/* Only declare screens that exist under (tabs) to avoid warnings */}
    </Tabs>
  );
}
