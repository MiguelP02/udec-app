import '../global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { SessionProvider, useSession } from '../providers/demo-session-provider';
import { fontAssets } from '../theme';

export default function RootLayout() {
  const [loaded] = useFonts(fontAssets);
  if (!loaded) return null;
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}

function RootNavigator() {
  const { status } = useSession();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={status === 'signed-out'}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={status === 'unverified'}>
        <Stack.Screen name="verificar-correo" />
      </Stack.Protected>
      <Stack.Protected guard={status === 'signed-in'}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}
