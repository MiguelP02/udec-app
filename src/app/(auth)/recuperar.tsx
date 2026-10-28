import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../components/ui/text';
import { colors, fonts } from '../../theme';

type BoxState = 'default' | 'focus' | 'error';

const INSTITUTIONAL_EMAIL = /^[^\s@]+@ucundinamarca\.edu\.co$/i;

const DOMAIN_ERROR = 'Usa tu correo institucional @ucundinamarca.edu.co. Los correos personales no tienen acceso.';

const FIELD_BOX: Record<BoxState, string> = {
  default: 'border-udec-border bg-udec-field',
  focus: 'border-udec-primary bg-udec-background',
  error: 'border-udec-red bg-udec-background',
};

/**
 * Stub. Aún no hay Firebase.
 * Fase 4: reemplazar el cuerpo por sendPasswordResetEmail(auth, email).
 * Firebase envía un ENLACE de restablecimiento (no un código). Si falla, debe lanzar un Error.
 */
async function sendPasswordResetLink(_email: string): Promise<void> {
  // TODO(fase 4): sendPasswordResetEmail(auth, email).
}

export default function RecoverPasswordScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [focused, setFocused] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sentEmail, setSentEmail] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const normalizedEmail = email.trim().toLowerCase();
  const emailValid = INSTITUTIONAL_EMAIL.test(normalizedEmail);
  const emailError = emailTouched && normalizedEmail.length > 0 && !emailValid;
  const alreadySent = sentEmail === normalizedEmail;
  const canSubmit = emailValid && !isSubmitting && !alreadySent;

  const boxState: BoxState = emailError ? 'error' : focused ? 'focus' : 'default';

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
    }
  };

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await sendPasswordResetLink(normalizedEmail);
      setSentEmail(normalizedEmail);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-udec-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 w-full max-w-md self-center bg-udec-background">
        <View className="bg-udec-primary overflow-hidden" style={{ paddingTop: insets.top }}>
          <View className="h-14 flex-row items-center px-4">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              onPress={goBack}
              className="h-11 w-11 items-center justify-center rounded-full active:bg-white/10"
            >
              <MaterialIcons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <View
            className="items-center overflow-hidden px-6 pb-9 pt-2"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
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

            <View pointerEvents="none" className="absolute -bottom-1 left-0 right-0 h-4 rounded-t-3xl bg-udec-background" />
          </View>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pt-3"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="rounded-card border border-udec-border bg-udec-background p-5">
            <View className="items-center">
              <View
                className="h-12 w-12 items-center justify-center rounded-control bg-udec-primary-soft"
                accessibilityElementsHidden
                importantForAccessibility="no-hide-descendants"
              >
                <MaterialIcons name="lock-reset" size={26} color={colors.primary} />
              </View>
              <Text weight="extrabold" accessibilityRole="header" className="mt-4 text-center text-xl tracking-tight text-udec-text">
                ¿Olvidaste tu contraseña?
              </Text>
              <Text className="mt-2 text-center text-sm leading-6 text-udec-muted">
                Escribe tu correo institucional y te enviaremos un enlace para restablecerla.
              </Text>
            </View>

            <View className="mt-5 gap-1.5">
              <Text weight="bold" className="text-[13px] text-udec-text">
                Correo institucional
              </Text>
              <View
                className={`min-h-[44px] flex-row items-center rounded-control border px-3.5 ${FIELD_BOX[boxState]}`}
              >
                <MaterialIcons name="mail-outline" size={20} color={colors.muted} />
                <TextInput
                  accessibilityLabel="Correo institucional"
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    setSubmitError(null);
                  }}
                  onFocus={() => setFocused(true)}
                  onBlur={() => {
                    setFocused(false);
                    setEmailTouched(true);
                  }}
                  onSubmitEditing={submit}
                  placeholder="nombre@ucundinamarca.edu.co"
                  placeholderTextColor={colors.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  returnKeyType="send"
                  className="ml-2.5 flex-1 py-3 text-sm text-udec-text"
                  style={{ fontFamily: fonts.medium }}
                />
              </View>
              {emailError ? (
                <View accessibilityLiveRegion="polite" className="flex-row items-start gap-1.5 pt-0.5">
                  <MaterialIcons name="error-outline" size={16} color={colors.red} style={{ marginTop: 1 }} />
                  <Text className="flex-1 text-xs leading-4 text-udec-red">{DOMAIN_ERROR}</Text>
                </View>
              ) : null}
              {alreadySent && sentEmail ? (
                <View accessibilityLiveRegion="polite" className="flex-row items-start gap-1.5 pt-1">
                  <MaterialIcons name="check-circle" size={18} color={colors.secondary} style={{ marginTop: 1 }} />
                  <Text className="flex-1 text-sm leading-5 text-udec-text">
                    Te enviamos un enlace a{' '}
                    <Text weight="bold" className="text-sm text-udec-text">
                      {sentEmail}
                    </Text>
                    . Revisa tu bandeja.
                  </Text>
                </View>
              ) : null}
            </View>

            {submitError ? (
              <View accessibilityLiveRegion="polite" className="mt-3 flex-row items-start gap-1.5">
                <MaterialIcons name="error-outline" size={16} color={colors.red} />
                <Text className="flex-1 text-xs leading-4 text-udec-red">{submitError}</Text>
              </View>
            ) : null}

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ disabled: !canSubmit, busy: isSubmitting }}
              disabled={!canSubmit}
              onPress={submit}
              className={`mt-5 h-12 flex-row items-center justify-center gap-2 rounded-control bg-udec-primary active:bg-udec-primary-hover ${
                canSubmit ? '' : 'opacity-50'
              }`}
            >
              <Text weight="semibold" className="text-sm text-white">
                Enviar enlace
              </Text>
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
              )}
            </Pressable>

            <Pressable
              accessibilityRole="link"
              onPress={goBack}
              className="mt-2 min-h-[44px] items-center justify-center"
            >
              <Text weight="semibold" className="text-sm text-udec-primary">
                Volver a iniciar sesión
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
