import '../global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { Platform, View } from 'react-native';
import { SessionProvider, useSession } from '../providers/demo-session-provider';
import { colors, fontAssets } from '../theme';

export default function RootLayout() {
  const [loaded] = useFonts(fontAssets);
  if (!loaded) return null;
  return (
    <SessionProvider>
      <RootNavigator />
    </SessionProvider>
  );
}

// Ancho de la app: en el teléfono ocupa toda la pantalla; en web se limita a 448 px y se centra.
// Las pantallas no deben poner max-w ni self-center: en iOS eso recortaba el contenido.
function RootNavigator() {
  const { status } = useSession();
  const isWeb = Platform.OS === 'web';
  return (
    <View style={{ flex: 1, backgroundColor: colors.surface, alignItems: isWeb ? 'center' : 'stretch' }}>
      <View style={{ flex: 1, width: '100%', maxWidth: isWeb ? 448 : undefined }}>
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
      </View>
    </View>
  );
}
