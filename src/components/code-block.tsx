import { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { monoFont } from '@/theme';
import { tokenize, type TokenKind } from '@/utils/highlight';

/** Fuente monoespaciada única del proyecto (definida en src/theme). */
export const MONO_FONT = monoFont;

const KIND_CLASS: Record<TokenKind, string> = {
  plain: 'text-udec-code-text',
  keyword: 'text-udec-accent',
  string: 'text-udec-code-string',
  number: 'text-udec-code-number',
  comment: 'text-udec-code-comment',
};

type CodeBlockProps = { code: string; lang: string };

export function CodeBlock({ code, lang }: CodeBlockProps) {
  const tokens = useMemo(() => tokenize(code), [code]);
  return (
    <View className="rounded-card bg-udec-code-bg">
      <View className="flex-row justify-end px-3 pt-2.5">
        <Text weight="bold" className="text-xs tracking-wider text-udec-accent" style={{ fontFamily: MONO_FONT }}>
          {lang.toUpperCase()}
        </Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="px-3 pb-3 pt-2">
        <Text selectable className="text-[13px] leading-5 text-udec-code-text" style={{ fontFamily: MONO_FONT }}>
          {tokens.map((token, index) => (
            <Text key={`${index}-${token.kind}`} className={KIND_CLASS[token.kind]} style={{ fontFamily: MONO_FONT }}>
              {token.text}
            </Text>
          ))}
        </Text>
      </ScrollView>
    </View>
  );
}
