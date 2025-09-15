import { Stack } from 'expo-router';

export default function AILayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="manual" options={{ headerShown: false }} />
      <Stack.Screen name="camera" options={{ headerShown: false }} />
    </Stack>
  );
}
