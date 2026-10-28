import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, View } from 'react-native';

export type SkeletonRowProps = {
  /** Clases extra de NativeWind para la fila (márgenes, por ejemplo). */
  className?: string;
};

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let active = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (active) setReduced(value);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      active = false;
      subscription.remove();
    };
  }, []);
  return reduced;
}

export function SkeletonRow({ className = '' }: SkeletonRowProps) {
  const reducedMotion = useReducedMotion();
  const [pulse] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (reducedMotion) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reducedMotion]);

  return (
    <Animated.View
      className={`flex-row items-center gap-3 ${className}`}
      style={{ opacity: pulse }}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      <View className="h-12 w-12 rounded-pill bg-udec-border" />
      <View className="flex-1 gap-2">
        <View className="h-3.5 w-3/4 rounded-pill bg-udec-border" />
        <View className="h-3 w-1/2 rounded-pill bg-udec-border" />
      </View>
    </Animated.View>
  );
}
