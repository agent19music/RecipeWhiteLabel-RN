import { Stack } from 'expo-router';

export default function OnboardingLayout(){
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="start" />
      <Stack.Screen name="diet" />
      <Stack.Screen name="allergies" />
      <Stack.Screen name="goals" />
      <Stack.Screen name="units" />
      <Stack.Screen name="budget" />
      <Stack.Screen name="summary" />
    </Stack>
  );
}

