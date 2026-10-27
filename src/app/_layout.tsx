import '../global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { fontAssets } from '../theme';

export default function RootLayout() {
  const [loaded] = useFonts(fontAssets);
  if (!loaded) return null;
  return <Stack screenOptions={{ headerShown: false }} />;
}
