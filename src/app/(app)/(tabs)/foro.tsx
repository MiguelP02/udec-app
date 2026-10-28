import { memo, useCallback, useMemo, useState, type ReactNode } from 'react';
import { ActivityIndicator, FlatList, Pressable, ScrollView, TextInput, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { colors, fonts } from '@/theme';
import { mockQuestions, type Question } from '@/data/mock-forum';
import { formatRelative } from '@/utils/time';

const NEW_QUESTION_HREF = '/foro/nueva' as Href;
const questionHref = (id: string) => `/foro/${id}` as Href;

type FilterId = 'recent' | 'top' | 'unanswered' | 'solved';
type ForumStatus = 'loading' | 'ready' | 'error';

const FILTERS: { id: FilterId; label: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { id: 'recent', label: 'Recientes', icon: 'schedule' },
  { id: 'top', label: 'Más votadas', icon: 'whatshot' },
  { id: 'unanswered', label: 'Sin responder', icon: 'help-outline' },
  { id: 'solved', label: 'Resueltas', icon: 'check-circle' },
];

/** Minúsculas y sin tildes, para buscar sin distinguir acentos. */
const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

function RowSeparator() {
  return <View className="h-3" />;
}

type QuestionRowProps = {
  item: Question;
  voted: boolean;
  onToggleVote: (id: string) => void;
  onOpen: (id: string) => void;
};

const QuestionRow = memo(function QuestionRow({ item, voted, onToggleVote, onOpen }: QuestionRowProps) {
  const count = item.voteCount + (voted ? 1 : 0);
  const solved = item.solvedAnswerId !== null;
  const answerLabel =
    item.answerCount === 0 ? 'Sin respuestas' : item.answerCount === 1 ? '1 respuesta' : `${item.answerCount} respuestas`;
  const time = formatRelative(item.createdAt, new Date());

  return (
    <View className="flex-row gap-3 rounded-card border border-udec-border bg-udec-background p-4">
      <View className="w-11 items-center">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={voted ? 'Quitar voto' : 'Votar a favor'}
          accessibilityState={{ selected: voted }}
          onPress={() => onToggleVote(item.id)}
          className="h-11 w-11 items-center justify-center rounded-pill active:bg-udec-surface"
        >
          <MaterialIcons
            name={voted ? 'thumb-up' : 'thumb-up-off-alt'}
            size={22}
            color={voted ? colors.secondary : colors.muted}
          />
        </Pressable>
        <Text
          weight="bold"
          accessibilityLabel={`${count} votos`}
          className={`text-base leading-6 ${voted ? 'text-udec-secondary' : 'text-udec-text'}`}
        >
          {count}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${item.title}. ${answerLabel}. ${item.authorName}, ${time}`}
        onPress={() => onOpen(item.id)}
        className="flex-1 gap-2"
      >
        <Text weight="bold" numberOfLines={3} className="text-[15px] leading-5 text-udec-text">
          {item.title}
        </Text>
        <View className="flex-row flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <View
              key={tag}
              className="h-6 justify-center rounded-pill border border-udec-border bg-udec-field px-2.5"
            >
              <Text weight="semibold" className="text-xs text-udec-text">
                {tag}
              </Text>
            </View>
          ))}
        </View>
        <View className="flex-row flex-wrap items-center justify-between gap-x-2 gap-y-1.5">
          <Text weight="medium" className="shrink text-xs leading-4 text-udec-muted">
            {`${item.authorName} · ${time}`}
          </Text>
          <View
            className={`h-6 flex-row items-center gap-1 rounded-pill border px-2.5 ${
              solved ? 'border-udec-secondary bg-udec-secondary' : 'border-udec-border bg-udec-background'
            }`}
          >
            <MaterialIcons
              name={solved ? 'check' : 'chat-bubble-outline'}
              size={14}
              color={solved ? '#FFFFFF' : colors.muted}
            />
            <Text weight="semibold" className={`text-xs ${solved ? 'text-white' : 'text-udec-muted'}`}>
              {answerLabel}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
});

export default function ForumScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [filter, setFilter] = useState<FilterId>('recent');
  // TODO(fase-7): status vendrá de use-questions()
  const [status, setStatus] = useState<ForumStatus>('ready');
  const [myVotes, setMyVotes] = useState<Record<string, boolean>>({});

  const visibleQuestions = useMemo(() => {
    const needle = normalize(query.trim());
    let list = mockQuestions;
    if (needle.length > 0) {
      list = list.filter((question) =>
        normalize([question.title, question.body, question.authorName, ...question.tags].join(' ')).includes(needle),
      );
    }
    if (filter === 'unanswered') list = list.filter((question) => question.answerCount === 0);
    if (filter === 'solved') list = list.filter((question) => question.solvedAnswerId !== null);

    const sorted = [...list];
    if (filter === 'top') {
      sorted.sort((a, b) => b.voteCount - a.voteCount || b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    return sorted;
  }, [query, filter]);

  const handleToggleVote = useCallback((id: string) => {
    // TODO(fase-7): toggleQuestionVote(id, uid, voted) en src/services/forum.ts
    setMyVotes((previous) => ({ ...previous, [id]: !previous[id] }));
  }, []);

  const handleOpen = useCallback((id: string) => router.push(questionHref(id)), [router]);

  const handleNewQuestion = () => router.push(NEW_QUESTION_HREF);

  const handleRetry = () => {
    // TODO(fase-7): reintentar la suscripción de use-questions()
    setStatus('ready');
  };

  const hasSearchOrFilter = query.trim().length > 0 || filter !== 'recent';
  const emptyList = (
    <View className="flex-1 items-center justify-center px-6">
      <Text weight="bold" accessibilityRole="header" className="text-center text-lg text-udec-text">
        {hasSearchOrFilter ? 'No hay preguntas que coincidan' : 'Todavía no hay preguntas'}
      </Text>
      <Text className="mt-1 max-w-xs text-center text-sm leading-5 text-udec-muted">
        {hasSearchOrFilter
          ? 'Prueba con otra búsqueda o cambia el filtro.'
          : 'Toca + para hacer la primera.'}
      </Text>
    </View>
  );

  let content: ReactNode;
  if (status === 'loading') {
    content = (
      <View className="flex-1 items-center justify-center gap-3 px-6" accessibilityLiveRegion="polite">
        <ActivityIndicator size="small" color={colors.primary} />
        <Text weight="semibold" className="text-sm text-udec-muted">
          Cargando…
        </Text>
      </View>
    );
  } else if (status === 'error') {
    content = (
      <View className="flex-1 items-center justify-center px-6">
        <Text weight="bold" accessibilityRole="header" className="text-center text-lg text-udec-text">
          No pudimos cargar las preguntas
        </Text>
        <Text className="mt-1 max-w-xs text-center text-sm leading-5 text-udec-muted">
          Revisa tu conexión e intenta de nuevo.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={handleRetry}
          className="mt-5 h-12 w-full max-w-xs flex-row items-center justify-center gap-2 rounded-control bg-udec-primary active:bg-udec-primary-hover"
        >
          <MaterialIcons name="refresh" size={20} color="#FFFFFF" />
          <Text weight="semibold" className="text-sm text-white">
            Reintentar
          </Text>
        </Pressable>
      </View>
    );
  } else {
    content = (
      <FlatList
        className="flex-1"
        contentContainerClassName="grow px-4 pb-24 pt-3"
        keyboardShouldPersistTaps="handled"
        data={visibleQuestions}
        keyExtractor={(item) => item.id}
        extraData={myVotes}
        ItemSeparatorComponent={RowSeparator}
        ListEmptyComponent={emptyList}
        renderItem={({ item }) => (
          <QuestionRow
            item={item}
            voted={Boolean(myVotes[item.id])}
            onToggleVote={handleToggleVote}
            onOpen={handleOpen}
          />
        )}
      />
    );
  }

  return (
    <View className="flex-1 bg-udec-surface">
      <View className="flex-1 w-full bg-udec-surface">
        <View className="overflow-hidden bg-udec-primary" style={{ paddingTop: insets.top }}>
          <View pointerEvents="none" className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10" />
          <View pointerEvents="none" className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/10" />
          <View pointerEvents="none" className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full border border-white/10" />
          <View className="h-16 justify-center px-4">
            <Text weight="extrabold" accessibilityRole="header" className="text-lg leading-6 text-white">
              Foro técnico
            </Text>
            <Text weight="medium" className="text-xs leading-4 text-white/90">
              Preguntas de programación entre compañeros
            </Text>
          </View>
        </View>

        <View className="px-4 pt-4">
          <View
            className={`min-h-[44px] flex-row items-center rounded-control border pl-3.5 pr-1 ${
              focused ? 'border-udec-primary bg-udec-background' : 'border-udec-border bg-udec-field'
            }`}
          >
            <MaterialIcons name="search" size={20} color={colors.muted} />
            <TextInput
              accessibilityLabel="Buscar preguntas"
              placeholder="Buscar consultas, errores o temas…"
              placeholderTextColor={colors.muted}
              value={query}
              onChangeText={setQuery}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              returnKeyType="search"
              autoCapitalize="none"
              autoCorrect={false}
              className="ml-2.5 flex-1 py-3 text-sm text-udec-text"
              style={{ fontFamily: fonts.medium }}
            />
            {query.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Borrar búsqueda"
                onPress={() => setQuery('')}
                className="h-11 w-11 items-center justify-center rounded-pill active:bg-udec-surface"
              >
                <MaterialIcons name="close" size={20} color={colors.muted} />
              </Pressable>
            ) : null}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          className="mt-3 grow-0"
          contentContainerClassName="gap-2 px-4 py-1"
        >
          {FILTERS.map((option) => {
            const active = option.id === filter;
            return (
              <Pressable
                key={option.id}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                hitSlop={{ top: 4, bottom: 4 }}
                onPress={() => setFilter(option.id)}
                className={`h-9 flex-row items-center gap-1.5 rounded-pill border px-3.5 ${
                  active ? 'border-udec-primary bg-udec-primary' : 'border-udec-border bg-udec-background active:bg-udec-surface'
                }`}
              >
                <MaterialIcons name={option.icon} size={16} color={active ? '#FFFFFF' : colors.muted} />
                <Text weight="semibold" className={`text-xs ${active ? 'text-white' : 'text-udec-muted'}`}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {content}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Nueva pregunta"
          onPress={handleNewQuestion}
          className="absolute bottom-4 right-4 h-14 w-14 items-center justify-center rounded-pill bg-udec-accent shadow-lg active:opacity-90"
        >
          <MaterialIcons name="add" size={28} color={colors['on-accent']} />
        </Pressable>
      </View>
    </View>
  );
}
