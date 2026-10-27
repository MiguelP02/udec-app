import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoogleMark } from '../../components/google-mark';
import { Text } from '../../components/ui/text';
import { colors, fonts } from '../../theme';

type Field = 'email' | 'password';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('test123');
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<Field | null>(null);
  const canSubmit = email.trim().length > 0 && password.length > 0;

  return (
    <KeyboardAvoidingView className="flex-1 bg-udec-surface" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View className="flex-1 w-full max-w-md self-center bg-udec-background">
        <View className="bg-udec-primary overflow-hidden" style={{ paddingTop: insets.top }}>
          <View className="h-14 flex-row items-center justify-between px-4">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              onPress={() => router.canGoBack() && router.back()}
              className="h-11 w-11 items-center justify-center rounded-full active:bg-white/10"
            >
              <MaterialIcons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <Text weight="bold" className="text-lg tracking-wide text-white">
              UDEC Móvil
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ayuda y soporte"
              className="h-11 w-11 items-center justify-center rounded-full active:bg-white/10"
            >
              <MaterialIcons name="help-outline" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <View className="items-center overflow-hidden px-6 pb-9 pt-5">
            <View pointerEvents="none" className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
            <View pointerEvents="none" className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/10" />
            <View pointerEvents="none" className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full border border-white/10" />

            <View className="mb-3.5">
              <View className="h-14 w-14 items-center justify-center rounded-2xl border-2 border-white bg-udec-accent">
                <Text weight="extrabold" className="text-[28px] text-udec-primary">
                  U
                </Text>
              </View>
              <View className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-udec-secondary" />
            </View>

            <View className="mb-2 flex-row items-center gap-2">
              <Text weight="extrabold" className="text-2xl tracking-tight text-white">
                UDEC APP
              </Text>
              <View className="rounded-full border border-white/20 bg-udec-secondary px-2.5 py-0.5">
                <Text weight="semibold" className="text-[11px] tracking-wide text-white">
                  Ingeniería de Software
                </Text>
              </View>
            </View>

            <Text weight="medium" className="max-w-xs text-center text-sm leading-6 text-white/90">
              Comunica, colabora y crece con tu comunidad UdeC.
            </Text>

            <View className="absolute -bottom-1 left-0 right-0 h-4 rounded-t-3xl bg-udec-background" />
          </View>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="px-5 pb-6 pt-3" keyboardShouldPersistTaps="handled">
          <View className="rounded-card border border-udec-border bg-udec-background p-5 shadow-sm">
            <View className="gap-4">
              <View className="gap-1.5">
                <Text weight="bold" className="text-[11px] uppercase tracking-wider text-udec-text">
                  Correo institucional
                </Text>
                <View
                  className={`min-h-[44px] flex-row items-center rounded-control border px-3.5 ${
                    focused === 'email' ? 'border-udec-primary bg-udec-background' : 'border-udec-border bg-udec-field'
                  }`}
                >
                  <MaterialIcons name="mail-outline" size={20} color={colors.muted} />
                  <TextInput
                    accessibilityLabel="Correo institucional"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    placeholder="nombre@ucundinamarca.edu.co"
                    placeholderTextColor={colors.muted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    textContentType="emailAddress"
                    className="ml-2.5 flex-1 py-3 text-sm text-udec-text"
                    style={{ fontFamily: fonts.medium }}
                  />
                </View>
                <View className="flex-row items-start gap-1.5 pt-0.5">
                  <MaterialIcons name="info-outline" size={14} color={colors.secondary} style={{ marginTop: 1 }} />
                  <Text className="flex-1 text-[11.5px] leading-4 text-udec-secondary">
                    Usa tu correo institucional{' '}
                    <Text weight="semibold" className="text-[11.5px] text-udec-secondary">
                      @ucundinamarca.edu.co
                    </Text>
                    . Los correos personales no tienen acceso.
                  </Text>
                </View>
              </View>

              <View className="gap-1.5">
                <Text weight="bold" className="text-[11px] uppercase tracking-wider text-udec-text">
                  Contraseña
                </Text>
                <View
                  className={`min-h-[44px] flex-row items-center rounded-control border pl-3.5 pr-1 ${
                    focused === 'password' ? 'border-udec-primary bg-udec-background' : 'border-udec-border bg-udec-field'
                  }`}
                >
                  <MaterialIcons name="lock-outline" size={20} color={colors.muted} />
                  <TextInput
                    accessibilityLabel="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    placeholder="Ingresa tu contraseña"
                    placeholderTextColor={colors.muted}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoComplete="password"
                    textContentType="password"
                    className="ml-2.5 flex-1 py-3 text-sm text-udec-text"
                    style={{ fontFamily: fonts.medium }}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onPress={() => setShowPassword((value) => !value)}
                    className="h-11 w-11 items-center justify-center rounded-lg active:bg-udec-surface"
                  >
                    <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color={colors.muted} />
                  </Pressable>
                </View>
              </View>

              <View className="gap-3 pt-2">
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ disabled: !canSubmit }}
                  disabled={!canSubmit}
                  className={`h-12 flex-row items-center justify-center gap-2 rounded-control bg-udec-primary shadow-sm active:bg-udec-primary-hover ${
                    canSubmit ? '' : 'opacity-50'
                  }`}
                >
                  <Text weight="semibold" className="text-sm text-white">
                    Iniciar sesión
                  </Text>
                  <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
                </Pressable>

                <View className="my-1.5 flex-row items-center">
                  <View className="h-px flex-1 bg-udec-border" />
                  <Text weight="medium" className="px-3 text-xs uppercase tracking-wider text-udec-muted">
                    o
                  </Text>
                  <View className="h-px flex-1 bg-udec-border" />
                </View>

                <Pressable
                  accessibilityRole="button"
                  className="h-12 flex-row items-center justify-center gap-3 rounded-control border border-udec-border bg-udec-background active:bg-udec-surface"
                >
                  <GoogleMark size={20} />
                  <Text weight="semibold" className="text-sm text-udec-text">
                    Continuar con Google
                  </Text>
                </Pressable>
              </View>

              <View className="flex-row items-center justify-between pt-1">
                <Pressable accessibilityRole="link" className="min-h-[44px] justify-center">
                  <Text weight="semibold" className="text-xs text-udec-primary">
                    ¿Olvidaste tu contraseña?
                  </Text>
                </Pressable>
                <Pressable accessibilityRole="link" className="min-h-[44px] justify-center">
                  <Text weight="semibold" className="text-xs text-udec-primary">
                    Crear cuenta
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <Text className="mt-4 px-3 text-center text-[11px] leading-5 text-udec-muted">
            Solo pueden ingresar estudiantes, docentes y administrativos con correo{' '}
            <Text weight="semibold" className="text-[11px] text-udec-text">
              @ucundinamarca.edu.co
            </Text>
            .
          </Text>
        </ScrollView>

        <View
          className="items-center gap-1.5 border-t border-udec-border bg-udec-surface px-4 pt-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <Text className="text-center text-xs text-udec-muted">© Universidad de Cundinamarca - Vigilada Mineducación</Text>
          <View className="flex-row items-center gap-3">
            <Pressable accessibilityRole="link" className="min-h-[44px] justify-center">
              <Text weight="medium" className="text-xs text-udec-primary">
                Términos de servicio
              </Text>
            </Pressable>
            <Text className="text-xs text-udec-muted">•</Text>
            <Pressable accessibilityRole="link" className="min-h-[44px] justify-center">
              <Text weight="medium" className="text-xs text-udec-primary">
                Soporte técnico
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
