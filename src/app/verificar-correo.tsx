import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../components/ui/text';
import { useSession } from '../providers/demo-session-provider';
import { colors } from '../theme';

const COOLDOWN_SECONDS = 30;

/** Correo de ejemplo, solo si la sesión no tiene correo. Fase 4: sale del usuario de Firebase Auth (user.email). */
const MOCK_EMAIL = 'nombre@ucundinamarca.edu.co';

type VerifyEmailScreenProps = {
  /** Ilustración de unDraw (verify-email.svg); se inyecta en la Fase 8. Sin ella el marco queda vacío con borde punteado. */
  illustration?: ReactNode;
};

type Notice = 'not-verified' | null;

/** Stub. Fase 4: sendEmailVerification(user). */
async function resendVerificationEmail(): Promise<void> {
  // TODO(fase 4): sendEmailVerification(user).
}

export default function VerifyEmailScreen({ illustration }: VerifyEmailScreenProps) {
  const insets = useSafeAreaInsets();
  const { email: sessionEmail, markVerified, signOut } = useSession();
  const [secondsLeft, setSecondsLeft] = useState(COOLDOWN_SECONDS);
  const [isChecking, setIsChecking] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const email = sessionEmail ?? MOCK_EMAIL;
  const canResend = secondsLeft === 0 && !isResending;

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  /**
   * Demo: markVerified() y devuelve true; el guard de rutas lleva a la app.
   * Fase 4: recargar el usuario (reload) y devolver user.emailVerified.
   */
  const refreshUser = async (): Promise<boolean> => {
    markVerified();
    return true;
  };

  const checkVerified = async () => {
    if (isChecking) return;
    setNotice(null);
    setIsChecking(true);
    try {
      const verified = await refreshUser();
      if (!verified) setNotice('not-verified');
    } finally {
      setIsChecking(false);
    }
  };

  const resend = async () => {
    if (!canResend) return;
    setIsResending(true);
    try {
      await resendVerificationEmail();
      setSecondsLeft(COOLDOWN_SECONDS);
    } catch {
      // Sin copy de error definido: no se muestra nada nuevo; finally restablece el estado de carga.
    } finally {
      setIsResending(false);
    }
  };

  const resendLabel = secondsLeft > 0 ? `Reenviar correo (${secondsLeft} s)` : 'Reenviar correo';

  return (
    <View className="flex-1 w-full max-w-md self-center bg-udec-background">
      <View
        className="bg-udec-primary overflow-hidden"
        style={{ paddingTop: insets.top }}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <View className="items-center overflow-hidden px-6 pb-9 pt-6">
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
        contentContainerClassName="px-5 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          className={`w-full max-w-[280px] self-center aspect-[4/3] items-center justify-center overflow-hidden rounded-card ${
            illustration ? '' : 'border border-dashed border-udec-border bg-udec-surface'
          }`}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {illustration}
        </View>

        <Text weight="extrabold" accessibilityRole="header" className="mt-6 text-center text-2xl tracking-tight text-udec-text">
          Verifica tu correo
        </Text>

        <Text className="mt-2 text-center text-sm leading-6 text-udec-muted">
          Te enviamos un enlace a{' '}
          <Text weight="bold" className="text-sm text-udec-text">
            {email}
          </Text>
          . Ábrelo y vuelve aquí.
        </Text>

        {notice === null ? (
          <Text className="mt-2 text-center text-sm leading-5 text-udec-muted">
            Si no lo ves, revisa la carpeta de spam.
          </Text>
        ) : null}

        {notice === 'not-verified' ? (
          <View accessibilityLiveRegion="polite" className="mt-3 flex-row items-start justify-center gap-1.5 px-2">
            <MaterialIcons name="info-outline" size={16} color={colors.muted} style={{ marginTop: 2 }} />
            <Text className="flex-1 text-sm leading-5 text-udec-muted">
              Aún no vemos la verificación. Revisa también la carpeta de spam.
            </Text>
          </View>
        ) : null}

        <View className="mt-6 gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ busy: isChecking, disabled: isChecking }}
            disabled={isChecking}
            onPress={checkVerified}
            className={`h-12 flex-row items-center justify-center gap-2 rounded-control bg-udec-primary active:bg-udec-primary-hover ${
              isChecking ? 'opacity-50' : ''
            }`}
          >
            {isChecking ? <ActivityIndicator size="small" color="#FFFFFF" /> : null}
            <Text weight="semibold" className="text-sm text-white">
              Ya verifiqué
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              secondsLeft > 0 ? `Reenviar correo, disponible en ${secondsLeft} segundos` : 'Reenviar correo'
            }
            accessibilityState={{ disabled: !canResend, busy: isResending }}
            disabled={!canResend}
            onPress={resend}
            className={`h-12 flex-row items-center justify-center gap-2 rounded-control border ${
              canResend
                ? 'border-udec-primary bg-udec-background active:bg-udec-primary-soft'
                : 'border-udec-border bg-udec-surface'
            }`}
          >
            {isResending ? <ActivityIndicator size="small" color={colors.primary} /> : null}
            <Text weight="semibold" className={`text-sm ${canResend ? 'text-udec-primary' : 'text-udec-muted'}`}>
              {resendLabel}
            </Text>
          </Pressable>
        </View>

        <Pressable
          accessibilityRole="link"
          onPress={() => signOut()}
          className="mt-3 min-h-[44px] items-center justify-center self-center px-4"
        >
          <Text weight="semibold" className="text-sm text-udec-primary">
            Cerrar sesión
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
