import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
  type ScrollViewInstance,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../components/ui/text';
import { colors } from '../../theme';

type StepId = 'chats' | 'community' | 'forum';

type StepContent = {
  id: StepId;
  title: string;
  body: string;
};

type WelcomeGuideProps = {
  /** Se llama al tocar "Empezar" (último paso) o "Omitir". */
  onFinish: () => void;
  /** Ilustración por paso (SVG de unDraw que pone el equipo). Si falta, se ve el marco vacío. */
  illustrations?: Partial<Record<StepId, ReactNode>>;
};

const STEPS: readonly StepContent[] = [
  {
    id: 'chats',
    title: 'Chats por materia',
    body: 'Conversa con tus compañeros y docentes en cada materia y grupo.',
  },
  {
    id: 'community',
    title: 'Comunidad UdeC',
    body: 'Mira lo que comparte la comunidad: eventos, semilleros, deportes y más.',
  },
  {
    id: 'forum',
    title: 'Foro técnico',
    body: 'Haz preguntas de programación, comparte código y marca la respuesta que te sirvió.',
  },
];

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <WelcomeGuide
      onFinish={() => {
        // Fase 8: guardar udec:onboarding-seen y navegar a (tabs)
        router.replace('/chats' as Href);
      }}
    />
  );
}

function WelcomeGuide({ onFinish, illustrations }: WelcomeGuideProps) {
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const frameHeight = height < 700 ? 120 : 160;
  const [index, setIndex] = useState(0);
  const scrollRef = useRef<ScrollViewInstance>(null);
  const isFirstRender = useRef(true);
  const isLast = index === STEPS.length - 1;
  const step = STEPS[index];

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const current = STEPS[index];
    AccessibilityInfo.announceForAccessibility(`Paso ${index + 1} de ${STEPS.length}. ${current.title}`);
  }, [index]);

  const onPrimary = () => {
    if (isLast) {
      onFinish();
      return;
    }
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    setIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  return (
    <View className="flex-1 bg-udec-surface">
      <View className="flex-1 w-full bg-udec-surface">
        <View className="overflow-hidden bg-udec-primary" style={{ paddingTop: insets.top }}>
          <View pointerEvents="none" className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10" />
          <View pointerEvents="none" className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-udec-accent/15" />
          <View pointerEvents="none" className="absolute -top-8 left-1/3 h-24 w-24 rounded-full border border-white/10" />

          <View className="items-center px-6 pb-8 pt-4">
            <View
              accessible={false}
              className="h-14 w-14 items-center justify-center rounded-2xl border-2 border-white bg-udec-accent"
            >
              <Text weight="extrabold" className="text-[28px] text-udec-primary">
                U
              </Text>
            </View>
            <Text weight="extrabold" className="mt-2 text-2xl leading-7 text-white">
              UDEC APP
            </Text>
            <Text weight="medium" className="text-sm leading-5 text-white/90">
              Conecta. Colabora. Crece.
            </Text>
          </View>

          <View pointerEvents="none" className="absolute -bottom-1 left-0 right-0 h-4 rounded-t-3xl bg-udec-surface" />
        </View>

        <ScrollView ref={scrollRef} className="flex-1" contentContainerClassName="px-5 pb-4 pt-3">
          <View
            accessibilityLiveRegion="polite"
            className="rounded-card border border-udec-border bg-udec-background p-4"
          >
            <View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              className="w-full items-center justify-center rounded-control bg-udec-primary-soft"
              style={{ height: frameHeight }}
            >
              {illustrations?.[step.id]}
            </View>
            <Text weight="extrabold" accessibilityRole="header" className="mt-4 text-center text-2xl leading-8 text-udec-text">
              {step.title}
            </Text>
            <Text className="mt-2 text-center text-sm leading-6 text-udec-muted">{step.body}</Text>
          </View>

          <View className="mt-4 flex-row items-center justify-center gap-2">
            {STEPS.map((item, i) => (
              <View
                key={item.id}
                accessible
                accessibilityLabel={`Paso ${i + 1} de ${STEPS.length}`}
                accessibilityState={{ selected: index === i }}
                className={i === index ? 'h-2 w-6 rounded-pill bg-udec-primary' : 'h-2 w-2 rounded-pill bg-udec-muted'}
              />
            ))}
          </View>
        </ScrollView>

        <View className="bg-udec-surface px-5 pt-3" style={{ paddingBottom: insets.bottom + 8 }}>
          <Pressable
            accessibilityRole="button"
            onPress={onPrimary}
            className="h-12 flex-row items-center justify-center gap-2 rounded-control bg-udec-primary active:bg-udec-primary-hover"
          >
            <Text weight="semibold" className="text-sm text-white">
              {isLast ? 'Empezar' : 'Siguiente'}
            </Text>
            <MaterialIcons name={isLast ? 'check' : 'arrow-forward'} size={18} color={colors.background} />
          </Pressable>

          <View className="mt-1 h-11 items-center justify-center">
            {isLast ? null : (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Omitir guía de bienvenida"
                hitSlop={{ top: 4, bottom: 4, left: 8, right: 8 }}
                onPress={onFinish}
                className="h-11 items-center justify-center rounded-control px-6 active:bg-udec-primary-soft"
              >
                <Text weight="semibold" className="text-sm text-udec-primary">
                  Omitir
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
