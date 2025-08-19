import { Stack } from 'expo-router';

export default function AILayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="manual" />
      <Stack.Screen name="camera" />
    </Stack>
  );
}
