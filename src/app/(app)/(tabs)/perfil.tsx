import { useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { useSession } from '@/providers/demo-session-provider';
import { fonts } from '@/theme';
import { useTheme, useThemeColors, type ThemeChoice } from '@/theme/theme-context';

type UserRole = 'estudiante' | 'docente' | 'oficial';

type ProfileUser = {
  name: string;
  initials: string;
  email: string;
  program: string;
  role: UserRole;
};

type ProfileStats = { posts: number; questions: number; answers: number };

type ProfileOption = {
  id: 'notifications' | 'privacy' | 'campus' | 'password' | 'theme';
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  value: string;
  toastMessage: string;
};

const THEME_OPTIONS: { key: ThemeChoice; label: string }[] = [
  { key: 'claro', label: 'Claro' },
  { key: 'oscuro', label: 'Oscuro' },
  { key: 'sistema', label: 'Según el sistema' },
];

/** MOCK: en la Fase 4 saldrá del usuario autenticado de Firebase Auth (users/{uid}). */
const MOCK_USER: ProfileUser = {
  name: 'Miguel Páez',
  initials: 'MP',
  email: 'mantoniopaez@ucundinamarca.edu.co',
  program: 'Ingeniería de Software',
  role: 'estudiante',
};

/** MOCK: valores de ejemplo. En la Fase 8 vendrán de use-profile-stats() (getCountFromServer). */
// TODO(fase-8): use-profile-stats() devolverá { data, loading, error }. Mientras tanto, datos de ejemplo.
const MOCK_STATS: ProfileStats | null = { posts: 3, questions: 2, answers: 5 };

const OPTIONS: ProfileOption[] = [
  {
    id: 'notifications',
    icon: 'notifications-none',
    title: 'Notificaciones',
    value: 'Inteligentes',
    toastMessage: 'Solo menciones y avisos oficiales',
  },
  {
    id: 'privacy',
    icon: 'shield',
    title: 'Privacidad',
    value: 'Solo UdeC',
    toastMessage: 'Tu perfil solo es visible para la comunidad UdeC',
  },
  {
    id: 'campus',
    icon: 'location-on',
    title: 'Sede',
    value: 'Girardot',
    toastMessage: 'Sede Girardot · Facultad de Ingeniería',
  },
  {
    id: 'password',
    icon: 'lock-outline',
    title: 'Cambiar contraseña',
    value: 'Actualiza tu contraseña',
    toastMessage: '',
  },
  {
    id: 'theme',
    icon: 'dark-mode',
    title: 'Tema',
    value: 'Claro',
    toastMessage: '',
  },
];

const STAT_LABELS: { key: keyof ProfileStats; label: string }[] = [
  { key: 'posts', label: 'Publicaciones' },
  { key: 'questions', label: 'Preguntas' },
  { key: 'answers', label: 'Respuestas' },
];

function roleLabel(role: UserRole): string {
  if (role === 'docente') return 'Docente verificado';
  if (role === 'oficial') return 'Cuenta oficial';
  return 'Estudiante verificado';
}

export default function ProfileScreen() {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { signOut, changePassword } = useSession();
  const { choice: theme, setChoice } = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const user = MOCK_USER;
  const stats = MOCK_STATS;
  const themeLabel = THEME_OPTIONS.find((item) => item.key === theme)?.label ?? 'Claro';
  const options = OPTIONS.map((option) => (option.id === 'theme' ? { ...option, value: themeLabel } : option));

  const resetPasswordForm = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError(null);
  };

  const closePasswordModal = () => {
    resetPasswordForm();
    setPasswordOpen(false);
  };

  const handleOptionPress = (option: ProfileOption) => {
    if (option.id === 'password') {
      setNotice(null);
      setPasswordOpen(true);
      return;
    }
    if (option.id === 'theme') {
      setThemeOpen(true);
      return;
    }
    // TODO(fase-8): useToast().show(option.toastMessage)
    void option;
  };

  const handleSubmitPassword = () => {
    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas nuevas no coinciden.');
      return;
    }
    if (!changePassword(currentPassword, newPassword)) {
      setPasswordError(
        newPassword.length < 6
          ? 'La nueva contraseña debe tener al menos 6 caracteres.'
          : 'La contraseña actual no es correcta.',
      );
      return;
    }
    closePasswordModal();
    setNotice('Contraseña actualizada.');
  };

  const handleSelectTheme = (choice: (typeof THEME_OPTIONS)[number]) => {
    setChoice(choice.key);
    setThemeOpen(false);
  };

  const handleConfirmSignOut = () => {
    setConfirmOpen(false);
    // TODO(fase-4): await signOutUser() (src/services/auth.ts); el guard de autenticación redirige al login
    signOut();
  };

  return (
    <View className="flex-1 bg-udec-surface">
      <View className="flex-1 w-full bg-udec-surface">
        <View className="overflow-hidden bg-udec-primary" style={{ paddingTop: insets.top }}>
          <View pointerEvents="none" className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
          <View pointerEvents="none" className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/10" />
          <View pointerEvents="none" className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full border border-white/10" />

          <View className="h-16 flex-row items-center pl-4 pr-4">
            <View className="flex-1">
              <Text weight="extrabold" accessibilityRole="header" className="text-lg leading-6 text-white">
                Mi perfil
              </Text>
              <Text weight="medium" className="text-xs leading-4 text-white/90">
                Cuenta institucional
              </Text>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1" contentContainerClassName="gap-4 px-4 pb-8 pt-4">
          <View className="items-center rounded-card border border-udec-border bg-udec-background px-5 py-6">
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              className="h-24 w-24 items-center justify-center rounded-pill bg-udec-primary"
            >
              <Text weight="extrabold" className="text-3xl text-white">
                {user.initials}
              </Text>
            </View>
            <Text weight="bold" className="mt-3 text-center text-xl leading-7 text-udec-text">
              {user.name}
            </Text>
            <Text weight="medium" className="mt-0.5 text-center text-sm leading-5 text-udec-muted">
              {user.program}
            </Text>
            <View className="mt-2 flex-row items-center justify-center gap-1.5 px-2">
              <MaterialIcons name="mail-outline" size={16} color={colors.muted} />
              <Text weight="medium" selectable className="shrink text-center text-sm leading-5 text-udec-muted">
                {user.email}
              </Text>
            </View>
            <View className="mt-4 h-8 flex-row items-center gap-1.5 rounded-pill bg-udec-secondary-soft px-3.5">
              <MaterialIcons name="verified" size={16} color={colors.secondary} />
              <Text weight="semibold" className="text-[13px] text-udec-secondary">
                {roleLabel(user.role)}
              </Text>
            </View>
          </View>

          <View className="flex-row rounded-card border border-udec-border bg-udec-background">
            {STAT_LABELS.map((item, index) => {
              const value = stats ? String(stats[item.key]) : '–';
              return (
                <View
                  key={item.key}
                  accessible
                  accessibilityLabel={`${value} ${item.label}`}
                  className={
                    index > 0
                      ? 'flex-1 items-center border-l border-udec-border py-4'
                      : 'flex-1 items-center py-4'
                  }
                >
                  <Text weight="extrabold" className="text-2xl leading-8 text-udec-primary">
                    {value}
                  </Text>
                  <Text weight="medium" className="mt-0.5 text-xs leading-4 text-udec-muted">
                    {item.label}
                  </Text>
                </View>
              );
            })}
          </View>

          <View className="overflow-hidden rounded-card border border-udec-border bg-udec-background">
            {options.map((option, index) => (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                accessibilityLabel={`${option.title}, ${option.value}`}
                onPress={() => handleOptionPress(option)}
                className={
                  index > 0
                    ? 'min-h-[56px] flex-row items-center gap-3 border-t border-udec-border px-4 py-2 active:bg-udec-surface'
                    : 'min-h-[56px] flex-row items-center gap-3 px-4 py-2 active:bg-udec-surface'
                }
              >
                <MaterialIcons name={option.icon} size={22} color={colors.primary} />
                <View className="flex-1">
                  <Text weight="semibold" className="text-sm leading-5 text-udec-text">
                    {option.title}
                  </Text>
                  <Text weight="medium" className="text-xs leading-4 text-udec-muted">
                    {option.value}
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={22} color={colors.muted} />
              </Pressable>
            ))}
          </View>

          {notice ? (
            <Text accessibilityLiveRegion="polite" weight="semibold" className="text-center text-sm text-udec-secondary">
              {notice}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            onPress={() => setConfirmOpen(true)}
            className="h-12 flex-row items-center justify-center gap-2 rounded-control active:opacity-70"
          >
            <MaterialIcons name="logout" size={20} color={colors.red} />
            <Text weight="semibold" className="text-sm text-udec-red">
              Cerrar sesión
            </Text>
          </Pressable>
        </ScrollView>

        <Modal
          visible={confirmOpen}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setConfirmOpen(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/50 px-6">
            <Pressable
              accessible={false}
              className="absolute inset-0"
              onPress={() => setConfirmOpen(false)}
            />
            <View accessibilityViewIsModal className="w-full max-w-sm gap-4 rounded-card bg-udec-background p-5">
              <View className="gap-1">
                <Text weight="bold" accessibilityRole="header" className="text-lg text-udec-text">
                  Cerrar sesión
                </Text>
                <Text className="text-sm leading-5 text-udec-muted">
                  ¿Seguro que quieres cerrar sesión?
                </Text>
              </View>
              <View className="flex-row gap-3">
                <Pressable
                  accessibilityRole="button"
                  onPress={() => setConfirmOpen(false)}
                  className="h-12 flex-1 items-center justify-center rounded-control border border-udec-border bg-udec-background active:bg-udec-surface"
                >
                  <Text weight="semibold" className="text-sm text-udec-text">
                    Cancelar
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleConfirmSignOut}
                  className="h-12 flex-1 items-center justify-center rounded-control bg-udec-red active:opacity-90"
                >
                  <Text weight="semibold" className="text-sm text-white">
                    Cerrar sesión
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={passwordOpen}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={closePasswordModal}
        >
          <View className="flex-1 items-center justify-center bg-black/50 px-6">
            <Pressable accessible={false} className="absolute inset-0" onPress={closePasswordModal} />
            <View accessibilityViewIsModal className="w-full max-w-sm gap-4 rounded-card bg-udec-background p-5">
              <Text weight="bold" accessibilityRole="header" className="text-lg text-udec-text">
                Cambiar contraseña
              </Text>

              <View className="gap-1.5">
                <Text weight="bold" className="text-[13px] text-udec-text">
                  Contraseña actual
                </Text>
                <TextInput
                  accessibilityLabel="Contraseña actual"
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  className="min-h-[44px] rounded-control border border-udec-border bg-udec-field px-3.5 py-3 text-sm text-udec-text"
                  style={{ fontFamily: fonts.medium }}
                />
              </View>

              <View className="gap-1.5">
                <Text weight="bold" className="text-[13px] text-udec-text">
                  Contraseña nueva
                </Text>
                <TextInput
                  accessibilityLabel="Contraseña nueva"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  className="min-h-[44px] rounded-control border border-udec-border bg-udec-field px-3.5 py-3 text-sm text-udec-text"
                  style={{ fontFamily: fonts.medium }}
                />
              </View>

              <View className="gap-1.5">
                <Text weight="bold" className="text-[13px] text-udec-text">
                  Repite la contraseña nueva
                </Text>
                <TextInput
                  accessibilityLabel="Repite la contraseña nueva"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  className="min-h-[44px] rounded-control border border-udec-border bg-udec-field px-3.5 py-3 text-sm text-udec-text"
                  style={{ fontFamily: fonts.medium }}
                />
              </View>

              {passwordError ? (
                <Text accessibilityRole="alert" className="text-[13px] leading-5 text-udec-red">
                  {passwordError}
                </Text>
              ) : null}

              <View className="flex-row gap-3">
                <Pressable
                  accessibilityRole="button"
                  onPress={closePasswordModal}
                  className="h-12 flex-1 items-center justify-center rounded-control border border-udec-border bg-udec-background active:bg-udec-surface"
                >
                  <Text weight="semibold" className="text-sm text-udec-text">
                    Cancelar
                  </Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={handleSubmitPassword}
                  className="h-12 flex-1 items-center justify-center rounded-control bg-udec-primary active:bg-udec-primary-hover"
                >
                  <Text weight="semibold" className="text-sm text-white">
                    Guardar
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={themeOpen}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setThemeOpen(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/50 px-6">
            <Pressable accessible={false} className="absolute inset-0" onPress={() => setThemeOpen(false)} />
            <View accessibilityViewIsModal className="w-full max-w-sm gap-2 rounded-card bg-udec-background p-5">
              <Text weight="bold" accessibilityRole="header" className="mb-2 text-lg text-udec-text">
                Tema
              </Text>
              {THEME_OPTIONS.map((choice) => {
                const selected = choice.key === theme;
                return (
                  <Pressable
                    key={choice.key}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    onPress={() => handleSelectTheme(choice)}
                    className="min-h-[48px] flex-row items-center gap-3 rounded-control px-2 active:bg-udec-surface"
                  >
                    <MaterialIcons
                      name={selected ? 'radio-button-checked' : 'radio-button-unchecked'}
                      size={22}
                      color={selected ? colors.primary : colors.muted}
                    />
                    <Text weight={selected ? 'bold' : 'medium'} className="text-sm text-udec-text">
                      {choice.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}
