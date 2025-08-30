import { HapticTab } from '@/components/HapticTab';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray[500],
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: Colors.tabBar.background,
          borderTopColor: Colors.tabBar.border,
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
            <Entypo name="home" size={24} color={color} />
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
            <Ionicons 
              name={focused ? "people" : "people-outline"} 
              size={24} 
              color={color} 
            />
          )
        }} 
      />
      
      {/* AI Recipe Tab - Centered with special styling */}
      <Tabs.Screen 
        name="ai-camera" 
        options={{ 
          title: 'AI Recipe', 
          tabBarLabel: 'AI Recipe',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: focused ? Colors.primary : Colors.primary + '90',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: -12,
              shadowColor: Colors.primary,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
              borderWidth: 3,
              borderColor: Colors.white,
            }}>
              <MaterialIcons name="auto-awesome" size={28} color={Colors.white} />
            </View>
          ),
        }} 
      />
      
      {/* Pantry Tab */}
      <Tabs.Screen 
        name="pantry" 
        options={{ 
          title: 'Pantry', 
          tabBarLabel: 'Pantry',
          tabBarIcon: ({ color, focused }) => (
            <MaterialIcons 
              name={focused ? "shopping-basket" : "shopping-basket"} 
              size={24} 
              color={color} 
            />
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
            <Ionicons 
              name={focused ? "calendar" : "calendar-outline"} 
              size={24} 
              color={color} 
            />
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
