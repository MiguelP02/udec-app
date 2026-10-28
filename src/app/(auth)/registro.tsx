import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../components/ui/text';
import { useSession } from '../../providers/demo-session-provider';
import { colors, fonts } from '../../theme';

type Field = 'fullName' | 'email' | 'password';
type BoxState = 'default' | 'focus' | 'error';
type ProgramOption = { id: string; label: string };
type PasswordRule = { id: 'length' | 'uppercase' | 'number'; label: string; test: (password: string) => boolean };
type RegisterFormData = { fullName: string; email: string; programId: string; password: string };

const INSTITUTIONAL_EMAIL = /^[^\s@]+@ucundinamarca\.edu\.co$/i;

const DOMAIN_ERROR = 'Usa tu correo institucional @ucundinamarca.edu.co. Los correos personales no tienen acceso.';

const PROGRAMS: ProgramOption[] = [{ id: 'ingenieria-de-software', label: 'Ingeniería de Software' }];

const PASSWORD_RULES: PasswordRule[] = [
  { id: 'length', label: 'Mínimo 8 caracteres', test: (p) => p.length >= 8 },
  { id: 'uppercase', label: 'Una mayúscula', test: (p) => /[A-Z]/.test(p) },
  { id: 'number', label: 'Un número', test: (p) => /[0-9]/.test(p) },
];

const FIELD_BOX: Record<BoxState, string> = {
  default: 'border-udec-border bg-udec-field',
  focus: 'border-udec-primary bg-udec-background',
  error: 'border-udec-red bg-udec-background',
};

/**
 * Stub de registro. Aún no hay Firebase.
 * Fase 4: reemplazar el cuerpo por createUserWithEmailAndPassword + guardar users/{uid}
 * + sendEmailVerification; la navegación a /verificar-correo la hará el guard de rutas, no esta función.
 * Si falla, debe lanzar un Error; la pantalla lo captura y llena submitError.
 */
async function submitRegistration(_data: RegisterFormData): Promise<void> {
  // TODO(fase 4): createUserWithEmailAndPassword, users/{uid} y sendEmailVerification.
}

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signUp } = useSession();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [programId, setProgramId] = useState(PROGRAMS[0].id);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [programOpen, setProgramOpen] = useState(false);
  const [focused, setFocused] = useState<Field | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const emailValid = INSTITUTIONAL_EMAIL.test(email.trim());
  const emailError = emailTouched && email.trim().length > 0 && !emailValid;
  const canSubmit = fullName.trim().length > 0 && emailValid && PASSWORD_RULES.every((rule) => rule.test(password));
  const selectedProgram = PROGRAMS.find((option) => option.id === programId)?.label ?? '';

  const boxState = (field: Field, hasError: boolean): BoxState => {
    if (hasError) return 'error';
    return focused === field ? 'focus' : 'default';
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/login');
    }
  };

  const submit = async () => {
    if (!canSubmit || isSubmitting) return;
    const data: RegisterFormData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      programId,
      password,
    };
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await submitRegistration(data);
      signUp(data.email);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitDisabled = !canSubmit || isSubmitting;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-udec-surface"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 w-full max-w-md self-center bg-udec-background">
        <View className="bg-udec-primary overflow-hidden" style={{ paddingTop: insets.top }}>
          <View className="h-14 flex-row items-center justify-between px-4">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              onPress={goBack}
              className="h-11 w-11 items-center justify-center rounded-full active:bg-white/10"
            >
              <MaterialIcons name="arrow-back" size={22} color="#FFFFFF" />
            </Pressable>
            <Text weight="bold" accessibilityRole="header" className="text-lg tracking-wide text-white">
              Crear cuenta
            </Text>
            <View
              className="h-11 w-11"
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            />
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
            <View className="gap-4">
              <View className="gap-1.5">
                <Text weight="bold" className="text-[13px] text-udec-text">
                  Nombre completo
                </Text>
                <View
                  className={`min-h-[44px] flex-row items-center rounded-control border px-3.5 ${FIELD_BOX[boxState('fullName', false)]}`}
                >
                  <MaterialIcons name="person-outline" size={20} color={colors.muted} />
                  <TextInput
                    accessibilityLabel="Nombre completo"
                    value={fullName}
                    onChangeText={setFullName}
                    onFocus={() => setFocused('fullName')}
                    onBlur={() => setFocused(null)}
                    autoCapitalize="words"
                    autoComplete="name"
                    textContentType="name"
                    returnKeyType="next"
                    className="ml-2.5 flex-1 py-3 text-sm text-udec-text"
                    style={{ fontFamily: fonts.medium }}
                  />
                </View>
              </View>

              <View className="gap-1.5">
                <Text weight="bold" className="text-[13px] text-udec-text">
                  Correo institucional
                </Text>
                <View
                  className={`min-h-[44px] flex-row items-center rounded-control border px-3.5 ${FIELD_BOX[boxState('email', emailError)]}`}
                >
                  <MaterialIcons name="mail-outline" size={20} color={colors.muted} />
                  <TextInput
                    accessibilityLabel="Correo institucional"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocused('email')}
                    onBlur={() => {
                      setFocused(null);
                      setEmailTouched(true);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    textContentType="emailAddress"
                    placeholder="nombre@ucundinamarca.edu.co"
                    placeholderTextColor={colors.muted}
                    returnKeyType="next"
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
              </View>

              <View className="gap-1.5">
                <Text weight="bold" className="text-[13px] text-udec-text">
                  Programa
                </Text>
                <Pressable
                  accessibilityRole="combobox"
                  accessibilityLabel="Programa"
                  accessibilityValue={{ text: selectedProgram }}
                  accessibilityState={{ expanded: programOpen }}
                  onPress={() => setProgramOpen((value) => !value)}
                  className={`min-h-[44px] flex-row items-center rounded-control border px-3.5 py-3 ${
                    programOpen ? FIELD_BOX.focus : FIELD_BOX.default
                  }`}
                >
                  <MaterialIcons name="school" size={20} color={colors.muted} />
                  <Text weight="medium" className="ml-2.5 flex-1 text-sm text-udec-text">
                    {selectedProgram}
                  </Text>
                  <MaterialIcons name={programOpen ? 'expand-less' : 'expand-more'} size={22} color={colors.muted} />
                </Pressable>
                {programOpen ? (
                  <View className="overflow-hidden rounded-control border border-udec-border bg-udec-background">
                    {PROGRAMS.map((option) => {
                      const selected = option.id === programId;
                      return (
                        <Pressable
                          key={option.id}
                          accessibilityRole="button"
                          accessibilityLabel={option.label}
                          accessibilityState={{ selected }}
                          onPress={() => {
                            setProgramId(option.id);
                            setProgramOpen(false);
                          }}
                          className={`min-h-[44px] flex-row items-center justify-between px-3.5 active:bg-udec-surface ${
                            selected ? 'bg-udec-primary-soft' : ''
                          }`}
                        >
                          <Text weight="medium" className="text-sm text-udec-text">
                            {option.label}
                          </Text>
                          {selected ? <MaterialIcons name="check" size={20} color={colors.primary} /> : null}
                        </Pressable>
                      );
                    })}
                  </View>
                ) : null}
              </View>

              <View className="gap-1.5">
                <Text weight="bold" className="text-[13px] text-udec-text">
                  Contraseña
                </Text>
                <View
                  className={`min-h-[44px] flex-row items-center rounded-control border pl-3.5 pr-1 ${FIELD_BOX[boxState('password', false)]}`}
                >
                  <MaterialIcons name="lock-outline" size={20} color={colors.muted} />
                  <TextInput
                    accessibilityLabel="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    textContentType="newPassword"
                    returnKeyType="done"
                    className="ml-2.5 flex-1 py-3 text-sm text-udec-text"
                    style={{ fontFamily: fonts.medium }}
                  />
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onPress={() => setShowPassword((value) => !value)}
                    className="h-11 w-11 items-center justify-center rounded-full active:bg-udec-surface"
                  >
                    <MaterialIcons name={showPassword ? 'visibility-off' : 'visibility'} size={20} color={colors.muted} />
                  </Pressable>
                </View>

                <View className="gap-1.5 pt-1.5">
                  {PASSWORD_RULES.map((rule) => {
                    const met = rule.test(password);
                    return (
                      <View
                        key={rule.id}
                        accessible
                        accessibilityLabel={`${rule.label}, ${met ? 'cumplida' : 'pendiente'}`}
                        className="flex-row items-center gap-2"
                      >
                        <MaterialIcons
                          name={met ? 'check-circle' : 'radio-button-unchecked'}
                          size={18}
                          color={met ? colors.secondary : colors.muted}
                        />
                        <Text
                          weight={met ? 'semibold' : 'regular'}
                          className={met ? 'text-xs text-udec-secondary' : 'text-xs text-udec-muted'}
                        >
                          {rule.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>

              {submitError ? (
                <View accessibilityLiveRegion="polite" className="flex-row items-start gap-1.5">
                  <MaterialIcons name="error-outline" size={16} color={colors.red} />
                  <Text className="flex-1 text-xs leading-4 text-udec-red">{submitError}</Text>
                </View>
              ) : null}

              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: submitDisabled, busy: isSubmitting }}
                disabled={submitDisabled}
                onPress={submit}
                className={`mt-2 h-12 flex-row items-center justify-center gap-2 rounded-control bg-udec-primary active:bg-udec-primary-hover ${
                  submitDisabled ? 'opacity-50' : ''
                }`}
              >
                <Text weight="semibold" className="text-sm text-white">
                  Crear cuenta
                </Text>
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <MaterialIcons name="arrow-forward" size={18} color="#FFFFFF" />
                )}
              </Pressable>
            </View>
          </View>

          <Pressable accessibilityRole="link" onPress={goBack} className="min-h-[44px] items-center justify-center">
            <Text weight="semibold" className="text-sm text-udec-primary">
              Ya tengo cuenta
            </Text>
          </Pressable>

          <Text className="mt-4 px-3 text-center text-xs leading-5 text-udec-muted">
            Solo pueden ingresar estudiantes, docentes y administrativos con correo{' '}
            <Text weight="semibold" className="text-xs text-udec-text">
              @ucundinamarca.edu.co
            </Text>
            .
          </Text>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
