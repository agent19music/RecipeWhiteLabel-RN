import { Redirect } from 'expo-router';
import { useAppState } from '../context/AppState';

export default function Entry() {
  const { onboarded } = useAppState();
  if (!onboarded) return <Redirect href="/onboarding/start" />;
  return <Redirect href="/(tabs)" />;
}

