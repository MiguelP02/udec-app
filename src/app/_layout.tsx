import '../global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { vars } from 'nativewind';
import { Platform, View } from 'react-native';
import { SessionProvider, useSession } from '../providers/demo-session-provider';
import { fontAssets } from '../theme';
import { ThemeProvider, useTheme } from '../theme/theme-context';

export default function RootLayout() {
  const [loaded] = useFonts(fontAssets);
  if (!loaded) return null;
  return (
    <ThemeProvider>
      <SessionProvider>
        <RootNavigator />
      </SessionProvider>
    </ThemeProvider>
  );
}

// Ancho de la app: en el teléfono ocupa toda la pantalla; en web se limita a 448 px y se centra.
// Las pantallas no deben poner max-w ni self-center: en iOS eso recortaba el contenido.
// Las variables del tema se aplican aquí y las heredan todas las pantallas y modales.
function RootNavigator() {
  const { status } = useSession();
  const { cssVars, palette, name } = useTheme();
  const isWeb = Platform.OS === 'web';
  return (
    <View
      style={{
        ...vars(cssVars),
        flex: 1,
        backgroundColor: palette.surface,
        alignItems: isWeb ? 'center' : 'stretch',
      }}
    >
      <StatusBar style={name === 'dark' ? 'light' : 'dark'} />
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
