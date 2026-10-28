import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '../theme';
import { Text } from './ui/text';
import { SkeletonRow, useReducedMotion } from './skeleton-row';

export type StateViewVariant = 'loading' | 'empty' | 'error';

export type StateViewProps = {
  /** Qué estado mostrar. */
  variant: StateViewVariant;
  /** loading: texto de la línea de estado (p. ej. "Cargando…"). empty/error: título. */
  title?: string;
  /** Texto secundario. Se ignora en loading. */
  message?: string;
  /** Texto del botón. El botón solo se renderiza si también llega onAction. Se ignora en loading. */
  actionLabel?: string;
  /** Se llama al tocar el botón. */
  onAction?: () => void;
  /** Ilustración (SVG) que pone el equipo después. Se ignora en loading. Si falta, se muestra el marco vacío. */
  illustration?: ReactNode;
  /** Solo loading: cantidad de filas esqueleto. Por defecto 3; se limita a 1..8. */
  rows?: number;
};

export function StateView({ variant, title, message, actionLabel, onAction, illustration, rows = 3 }: StateViewProps) {
  const reducedMotion = useReducedMotion();

  if (variant === 'loading') {
    const count = Math.min(8, Math.max(1, Math.round(rows)));
    return (
      <View
        className="w-full px-4 py-4"
        accessible
        accessibilityLabel={title}
        accessibilityLiveRegion="polite"
        accessibilityState={{ busy: true }}
      >
        {title ? (
          <View className="mb-4 flex-row items-center gap-2 px-1">
            {reducedMotion ? null : <ActivityIndicator size="small" color={colors.primary} />}
            <Text weight="semibold" className="text-sm text-udec-muted">
              {title}
            </Text>
          </View>
        ) : null}
        <View className="gap-4">
          {Array.from({ length: count }, (_, index) => (
            <SkeletonRow key={index} />
          ))}
        </View>
      </View>
    );
  }

  const isError = variant === 'error';
  const groupLabel = [title, message].filter(Boolean).join('. ');
  const showAction = Boolean(actionLabel && onAction);

  return (
    <View className="w-full flex-1 items-center justify-center px-6 py-8">
      <View
        className="h-36 w-full max-w-[240px] items-center justify-center rounded-card bg-udec-surface"
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {illustration}
      </View>
      <View className="mt-4 items-center">
        {title || message ? (
          <View
            accessible={isError}
            accessibilityRole={isError ? 'alert' : undefined}
            accessibilityLabel={isError ? groupLabel : undefined}
            className="items-center"
          >
            {title ? (
              <Text weight="bold" accessibilityRole="header" className="text-center text-lg text-udec-text">
                {title}
              </Text>
            ) : null}
            {message ? (
              <Text className="mt-1 max-w-xs text-center text-sm leading-5 text-udec-muted">{message}</Text>
            ) : null}
          </View>
        ) : null}
      </View>
      {showAction ? (
        <Pressable
          accessibilityRole="button"
          onPress={onAction}
          className="mt-5 h-12 w-full max-w-xs flex-row items-center justify-center gap-2 rounded-control bg-udec-primary active:bg-udec-primary-hover"
        >
          {isError ? <MaterialIcons name="refresh" size={20} color="#FFFFFF" /> : null}
          <Text weight="semibold" className="text-sm text-white">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
