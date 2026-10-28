import { useState } from 'react';
import { Keyboard, Pressable, TextInput, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { colors, fonts } from '@/theme';
import { POST_TAGS, type PostTag } from '@/types/community';

export type PostComposerProps = {
  firstName: string; // 'Miguel'
  onPublish: (text: string, tag: PostTag) => void; // el padre crea la publicación
};

const DEFAULT_TAG: PostTag = '#Eventos';

export function PostComposer({ firstName, onPublish }: PostComposerProps) {
  const [text, setText] = useState('');
  const [tag, setTag] = useState<PostTag>(DEFAULT_TAG);
  const [focused, setFocused] = useState(false);
  const canPublish = text.trim().length > 0;
  const placeholder = `¿Qué quieres compartir con la comunidad, ${firstName}?`;

  const handlePublish = () => {
    if (!canPublish) return;
    onPublish(text.trim(), tag);
    setText('');
    setTag(DEFAULT_TAG);
    Keyboard.dismiss();
  };

  return (
    <View className="mb-4 rounded-card border border-udec-border bg-udec-background p-4">
      <TextInput
        accessibilityLabel={placeholder}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        value={text}
        onChangeText={setText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        multiline
        textAlignVertical="top"
        className={`min-h-[80px] rounded-control border px-3 py-2.5 text-sm text-udec-text ${
          focused ? 'border-udec-primary bg-udec-background' : 'border-udec-border bg-udec-field'
        }`}
        style={{ fontFamily: fonts.medium }}
      />

      <View className="mt-3 flex-row flex-wrap gap-2">
        {POST_TAGS.map((option) => {
          const selected = option === tag;
          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              accessibilityLabel={`Etiqueta ${option}`}
              onPress={() => setTag(option)}
              className={`h-11 items-center justify-center rounded-control border px-3.5 ${
                selected
                  ? 'border-udec-primary bg-udec-primary-soft'
                  : 'border-udec-border bg-udec-field active:bg-udec-border'
              }`}
            >
              <Text weight="semibold" className={`text-sm ${selected ? 'text-udec-primary' : 'text-udec-muted'}`}>
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !canPublish }}
        disabled={!canPublish}
        onPress={handlePublish}
        className={`mt-3 h-12 min-w-[120px] flex-row items-center justify-center self-end rounded-control bg-udec-primary px-5 active:bg-udec-primary-hover ${
          canPublish ? '' : 'opacity-50'
        }`}
      >
        <Text weight="semibold" className="text-sm text-white">
          Publicar
        </Text>
      </Pressable>
    </View>
  );
}
