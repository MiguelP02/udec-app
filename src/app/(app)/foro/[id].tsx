import { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CodeBlock, MONO_FONT } from '@/components/code-block';
import { Text } from '@/components/ui/text';
import { colors, fonts } from '@/theme';
import {
  MOCK_CURRENT_USER_ID,
  mockAnswersByQuestion,
  mockQuestions,
  mockUsers,
  type Answer,
} from '@/data/mock-forum';

function AnswerSeparator() {
  return <View className="h-3" />;
}

type AnswerCardProps = {
  answer: Answer;
  isSolution: boolean;
  canMarkSolution: boolean;
  voted: boolean;
  roleLabel: boolean;
  onToggleVote: (id: string) => void;
  onMarkSolution: (id: string) => void;
};

const AnswerCard = memo(function AnswerCard({
  answer,
  isSolution,
  canMarkSolution,
  voted,
  roleLabel,
  onToggleVote,
  onMarkSolution,
}: AnswerCardProps) {
  return (
    <View className={`gap-2 rounded-card p-4 ${isSolution ? 'bg-udec-secondary-soft' : 'bg-udec-surface'}`}>
      <View className="flex-row items-center justify-between gap-2">
        <View className="flex-1 flex-row items-center gap-2">
          <Text weight="bold" numberOfLines={1} className="shrink text-sm text-udec-text">
            {answer.authorName}
          </Text>
          {roleLabel ? (
            <View className="h-5 justify-center rounded-pill bg-udec-primary px-2">
              <Text weight="semibold" className="text-xs text-white">
                Docente
              </Text>
            </View>
          ) : null}
        </View>
        {isSolution ? (
          <View className="flex-row items-center gap-1">
            <MaterialIcons name="check-circle" size={18} color={colors.secondary} />
            <Text weight="bold" className="text-xs text-udec-secondary">
              Solución aceptada
            </Text>
          </View>
        ) : null}
      </View>

      <View className="mt-1 flex-row items-start gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={voted ? 'Quitar voto de la respuesta' : 'Votar respuesta'}
          accessibilityState={{ selected: voted }}
          onPress={() => onToggleVote(answer.id)}
          className="min-h-[52px] w-11 items-center justify-center rounded-control active:bg-white/60"
        >
          <MaterialIcons
            name={voted ? 'thumb-up' : 'thumb-up-off-alt'}
            size={20}
            color={voted ? colors.secondary : colors.muted}
          />
          <Text weight="bold" className={`text-[13px] ${voted ? 'text-udec-secondary' : 'text-udec-muted'}`}>
            {answer.voteCount + (voted ? 1 : 0)}
          </Text>
        </Pressable>

        <View className="flex-1 gap-2">
          <Text className="pt-1 text-[13px] leading-5 text-udec-text">{answer.text}</Text>
          {answer.code ? <CodeBlock code={answer.code} lang={answer.lang} /> : null}
          {canMarkSolution ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => onMarkSolution(answer.id)}
              className="min-h-[44px] flex-row items-center gap-1.5 self-start active:opacity-70"
            >
              <MaterialIcons name="check" size={18} color={colors.secondary} />
              <Text weight="bold" className="text-[13px] text-udec-secondary">
                Marcar como solución
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
});

export default function QuestionDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const question = mockQuestions.find((item) => item.id === id) ?? null;

  const [answers, setAnswers] = useState<Answer[]>(() => mockAnswersByQuestion[id] ?? []);
  const [solvedAnswerId, setSolvedAnswerId] = useState<string | null>(question?.solvedAnswerId ?? null);
  const [questionVoted, setQuestionVoted] = useState(false);
  const [answerVotes, setAnswerVotes] = useState<Record<string, boolean>>({});
  const [replyText, setReplyText] = useState('');
  const [replyCode, setReplyCode] = useState('');
  const [codeOpen, setCodeOpen] = useState(false);
  const [focusedField, setFocusedField] = useState<'reply' | null>(null);

  const sortedAnswers = useMemo(
    () =>
      [...answers].sort(
        (a, b) =>
          (b.id === solvedAnswerId ? 1 : 0) - (a.id === solvedAnswerId ? 1 : 0) || b.voteCount - a.voteCount,
      ),
    [answers, solvedAnswerId],
  );

  const handleBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/foro' as Href);
  };

  const handleToggleAnswerVote = useCallback((answerId: string) => {
    // TODO(fase-7): toggleAnswerVote(qid, aid, uid, voted)
    setAnswerVotes((previous) => ({ ...previous, [answerId]: !previous[answerId] }));
  }, []);

  const handleMarkSolution = useCallback((answerId: string) => {
    // TODO(fase-7): markSolution(qid, aid) y toast "Marcaste la respuesta como solución"
    setSolvedAnswerId(answerId);
  }, []);

  if (!question) {
    return (
      <KeyboardAvoidingView className="flex-1 bg-udec-background" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="flex-1 w-full bg-udec-background">
          <View className="bg-udec-primary" style={{ paddingTop: insets.top }}>
            <View className="h-14 flex-row items-center gap-3 px-4">
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Volver"
                onPress={handleBack}
                className="h-11 w-11 items-center justify-center rounded-pill active:bg-white/10"
              >
                <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
              </Pressable>
              <Text weight="bold" accessibilityRole="header" className="text-lg text-white">
                Pregunta detalle
              </Text>
            </View>
          </View>
          <View className="flex-1 items-center justify-center px-6">
            <Text weight="bold" accessibilityRole="header" className="text-center text-lg text-udec-text">
              No encontramos esta pregunta
            </Text>
            <Text className="mt-1 text-center text-sm leading-5 text-udec-muted">Puede que ya no exista.</Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleBack}
              className="mt-5 h-12 w-full max-w-xs items-center justify-center rounded-control bg-udec-primary active:bg-udec-primary-hover"
            >
              <Text weight="semibold" className="text-sm text-white">
                Volver al foro
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  const canSubmit = replyText.trim().length > 0;
  const isAuthor = question.authorId === MOCK_CURRENT_USER_ID;

  const handleToggleQuestionVote = () => {
    // TODO(fase-7): toggleQuestionVote(qid, uid, voted) en src/services/forum.ts
    setQuestionVoted((value) => !value);
  };

  const handleSubmitReply = () => {
    const text = replyText.trim();
    if (text.length === 0) return;
    const createdAt = new Date();
    const answer: Answer = {
      id: `local-${createdAt.getTime()}`,
      authorId: MOCK_CURRENT_USER_ID,
      authorName: mockUsers[MOCK_CURRENT_USER_ID].name,
      text,
      code: replyCode.trim() === '' ? null : replyCode.trimEnd(),
      lang: question.lang,
      voteCount: 0,
      createdAt,
    };
    // TODO(fase-7): createAnswer(qid, text, code, lang, profile, uid) y toast "Respuesta publicada"
    setAnswers((previous) => [...previous, answer]);
    setReplyText('');
    setReplyCode('');
    setCodeOpen(false);
    Keyboard.dismiss();
  };

  const questionSection = (
    <View className="px-4 pt-4">
      <View className="gap-3">
        <Text weight="bold" accessibilityRole="header" className="text-xl leading-7 text-udec-text">
          {question.title}
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {question.tags.map((tag) => (
            <View key={tag} className="h-8 justify-center rounded-control border border-udec-border bg-udec-surface px-3">
              <Text weight="medium" className="text-xs text-udec-primary">
                {tag}
              </Text>
            </View>
          ))}
        </View>
        <Text className="text-sm leading-6 text-udec-text">{question.body || 'Sin descripción.'}</Text>
        {question.code ? <CodeBlock code={question.code} lang={question.lang} /> : null}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={questionVoted ? 'Quitar voto de la pregunta' : 'Votar pregunta'}
          accessibilityState={{ selected: questionVoted }}
          onPress={handleToggleQuestionVote}
          className={`min-h-[44px] flex-row items-center gap-2 self-start rounded-control border px-4 ${
            questionVoted
              ? 'border-udec-secondary bg-udec-secondary-soft'
              : 'border-udec-border bg-udec-surface active:bg-udec-field'
          }`}
        >
          <MaterialIcons
            name={questionVoted ? 'thumb-up' : 'thumb-up-off-alt'}
            size={20}
            color={questionVoted ? colors.secondary : colors.primary}
          />
          <Text weight="semibold" className="text-[13px] text-udec-text">
            {question.voteCount + (questionVoted ? 1 : 0)}
          </Text>
        </Pressable>
      </View>
      <View className="mb-4 mt-4 h-px bg-udec-border" />
    </View>
  );

  const emptyAnswers = (
    <Text className="px-4 py-6 text-center text-sm leading-5 text-udec-muted">
      Nadie ha respondido todavía. ¡Sé el primero en ayudar!
    </Text>
  );

  const replyForm = (
    <View className="gap-3 px-4 pb-8 pt-4">
      <View className="mb-1 h-px bg-udec-border" />
      <View className="gap-1.5">
        <Text weight="bold" className="text-[13px] text-udec-text">
          Tu respuesta
        </Text>
        <TextInput
          accessibilityLabel="Tu respuesta"
          value={replyText}
          onChangeText={setReplyText}
          onFocus={() => setFocusedField('reply')}
          onBlur={() => setFocusedField(null)}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          placeholder="Escribe tu solución…"
          placeholderTextColor={colors.muted}
          className={`min-h-[88px] rounded-control border px-3 py-3 text-[13px] text-udec-text ${
            focusedField === 'reply' ? 'border-udec-primary bg-udec-background' : 'border-udec-border bg-udec-background'
          }`}
          style={{ fontFamily: fonts.medium }}
        />
      </View>

      <View className="overflow-hidden rounded-control border border-udec-border bg-udec-background">
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: codeOpen }}
          onPress={() => setCodeOpen((value) => !value)}
          className="min-h-[44px] flex-row items-center justify-between px-3.5 active:bg-udec-surface"
        >
          <Text weight="semibold" className="text-[13px] text-udec-muted">
            Código corregido (opcional)
          </Text>
          <MaterialIcons name={codeOpen ? 'expand-less' : 'expand-more'} size={20} color={colors.muted} />
        </Pressable>
        {codeOpen ? (
          <View className="border-t border-udec-border">
            <TextInput
              accessibilityLabel="Código corregido (opcional)"
              value={replyCode}
              onChangeText={setReplyCode}
              multiline
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              className="min-h-[120px] bg-udec-field px-3.5 py-3 text-[13px] leading-5 text-udec-text"
              style={{ fontFamily: MONO_FONT }}
            />
          </View>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: !canSubmit }}
        disabled={!canSubmit}
        onPress={handleSubmitReply}
        className={`mt-1 h-12 flex-row items-center justify-center gap-2 rounded-control bg-udec-primary active:bg-udec-primary-hover ${
          canSubmit ? '' : 'opacity-50'
        }`}
      >
        <Text weight="bold" className="text-sm text-white">
          Responder
        </Text>
        <MaterialIcons name="send" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-udec-background"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 w-full bg-udec-background">
        <View className="bg-udec-primary" style={{ paddingTop: insets.top }}>
          <View className="h-14 flex-row items-center gap-3 px-4">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Volver"
              onPress={handleBack}
              className="h-11 w-11 items-center justify-center rounded-pill active:bg-white/10"
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </Pressable>
            <Text weight="bold" accessibilityRole="header" className="text-lg text-white">
              Pregunta detalle
            </Text>
          </View>
        </View>

        <FlatList
          className="flex-1"
          keyboardShouldPersistTaps="handled"
          data={sortedAnswers}
          keyExtractor={(item) => item.id}
          extraData={[answerVotes, solvedAnswerId]}
          ItemSeparatorComponent={AnswerSeparator}
          ListHeaderComponent={questionSection}
          ListEmptyComponent={emptyAnswers}
          ListFooterComponent={replyForm}
          renderItem={({ item }) => (
            <View className="px-4">
              <AnswerCard
                answer={item}
                isSolution={item.id === solvedAnswerId}
                canMarkSolution={isAuthor && item.id !== solvedAnswerId}
                voted={Boolean(answerVotes[item.id])}
                roleLabel={mockUsers[item.authorId]?.role === 'docente'}
                onToggleVote={handleToggleAnswerVote}
                onMarkSolution={handleMarkSolution}
              />
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  );
}
