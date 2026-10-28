import { useRef, useState, type ComponentRef } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Stack, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { colors, fonts, monoFont } from '@/theme';

const HEADER_HEIGHT = 56;
const LANGUAGES = ['dart', 'java', 'python', 'sql', 'javascript'] as const;
type Language = (typeof LANGUAGES)[number];
type Field = 'title' | 'body' | 'code';

type NewQuestionInput = { title: string; body: string; code: string; lang: Language };

// STUB: sin Firebase todavía. Fase 7: createQuestion({ title, body, code, lang }, profile, uid) devuelve el id.
async function createQuestionStub(input: NewQuestionInput): Promise<string> {
  void input;
  return 'mock-question';
}

export default function NewQuestionScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const bodyRef = useRef<ComponentRef<typeof TextInput>>(null);
  const codeRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [code, setCode] = useState('');
  const [lang, setLang] = useState<Language>('dart');
  const [focused, setFocused] = useState<Field | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const canSubmit = title.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setSubmitError(false);
    try {
      await createQuestionStub({
        title: title.trim(),
        body: body.trim(),
        code: code.trim().length > 0 ? code.trimEnd() : '',
        lang,
      });
      // TODO Fase 7: router.replace('/foro/' + id) y toast "Pregunta publicada. Tus compañeros la verán en el foro".
      router.back();
    } catch {
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-udec-surface">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 w-full bg-udec-background">
        <View className="bg-udec-primary" style={{ paddingTop: insets.top }}>
          <View className="h-14 flex-row items-center gap-1 px-4">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              onPress={() => router.canGoBack() && router.back()}
              className="-ml-2 h-11 w-11 items-center justify-center rounded-pill active:bg-white/10"
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
            <Text weight="bold" accessibilityRole="header" numberOfLines={1} className="flex-1 text-lg tracking-tight text-white">
              Nueva pregunta
            </Text>
          </View>
        </View>

        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? HEADER_HEIGHT + insets.top : 0}
        >
          <ScrollView
            className="flex-1"
            contentContainerClassName="gap-5 px-4 pb-6 pt-4"
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-2">
              <Text weight="semibold" className="text-sm text-udec-text">
                Título
              </Text>
              <TextInput
                accessibilityLabel="Título"
                value={title}
                onChangeText={(value) => {
                  setTitle(value);
                  setSubmitError(false);
                }}
                onFocus={() => setFocused('title')}
                onBlur={() => setFocused(null)}
                returnKeyType="next"
                blurOnSubmit={false}
                onSubmitEditing={() => bodyRef.current?.focus()}
                autoCapitalize="sentences"
                className={`h-12 rounded-control border px-3 text-sm text-udec-text ${
                  focused === 'title' ? 'border-udec-primary bg-udec-background' : 'border-udec-border bg-udec-field'
                }`}
                style={{ fontFamily: fonts.medium }}
              />
            </View>

            <View className="gap-2">
              <Text weight="semibold" className="text-sm text-udec-text">
                Describe tu problema
              </Text>
              <TextInput
                ref={bodyRef}
                accessibilityLabel="Describe tu problema"
                value={body}
                onChangeText={setBody}
                onFocus={() => setFocused('body')}
                onBlur={() => setFocused(null)}
                multiline
                textAlignVertical="top"
                autoCapitalize="sentences"
                className={`min-h-[120px] rounded-control border px-3 py-3 text-sm text-udec-text ${
                  focused === 'body' ? 'border-udec-primary bg-udec-background' : 'border-udec-border bg-udec-field'
                }`}
                style={{ fontFamily: fonts.medium }}
              />
            </View>

            <View className="gap-2">
              <Text weight="semibold" className="text-sm text-udec-text">
                Código (opcional)
              </Text>
              <View
                accessibilityRole="radiogroup"
                accessibilityLabel="Lenguaje del código"
                className="flex-row flex-wrap gap-2"
              >
                {LANGUAGES.map((language) => {
                  const selected = lang === language;
                  return (
                    <Pressable
                      key={language}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: selected }}
                      accessibilityLabel={`Lenguaje ${language}`}
                      onPress={() => setLang(language)}
                      className={`h-11 items-center justify-center rounded-control border px-4 ${
                        selected
                          ? 'border-udec-primary bg-udec-primary'
                          : 'border-udec-border bg-udec-surface active:bg-udec-border'
                      }`}
                    >
                      <Text weight="medium" className={`text-sm ${selected ? 'text-white' : 'text-udec-text'}`}>
                        {language}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <TextInput
                ref={codeRef}
                accessibilityLabel="Código (opcional)"
                value={code}
                onChangeText={setCode}
                onFocus={() => setFocused('code')}
                onBlur={() => setFocused(null)}
                multiline
                textAlignVertical="top"
                autoCapitalize="none"
                autoCorrect={false}
                spellCheck={false}
                autoComplete="off"
                keyboardType="default"
                selectionColor={colors['code-string']}
                cursorColor={colors['code-string']}
                className={`min-h-[144px] rounded-control border p-3 text-sm leading-5 text-udec-code-text bg-udec-code-bg ${
                  focused === 'code' ? 'border-udec-code-number' : 'border-udec-code-bg'
                }`}
                style={{ fontFamily: monoFont }}
              />
            </View>
          </ScrollView>

          <View
            className="border-t border-udec-border bg-udec-background px-4 pt-3"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            {submitError ? (
              <View accessibilityRole="alert" className="mb-3 flex-row items-start gap-2">
                <MaterialIcons name="error-outline" size={18} color={colors.red} style={{ marginTop: 1 }} />
                <Text weight="medium" className="flex-1 text-sm text-udec-red">
                  No pudimos publicar tu pregunta. Intenta de nuevo.
                </Text>
              </View>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Publicar pregunta"
              accessibilityHint={title.trim().length === 0 ? 'Escribe un título para tu pregunta' : undefined}
              accessibilityState={{ disabled: !canSubmit, busy: submitting }}
              disabled={!canSubmit}
              onPress={handleSubmit}
              className={`h-12 w-full flex-row items-center justify-center gap-2 rounded-control bg-udec-accent active:opacity-90 ${
                canSubmit ? '' : 'opacity-50'
              }`}
            >
              {submitting ? <ActivityIndicator size="small" color={colors['on-accent']} /> : null}
              <Text weight="bold" className="text-sm text-udec-on-accent">
                Publicar pregunta
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
