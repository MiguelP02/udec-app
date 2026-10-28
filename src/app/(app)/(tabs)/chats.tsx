import { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, TextInput, View, type ListRenderItemInfo } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../../components/ui/text';
import { MOCK_CHANNELS } from '../../../data/mock-chats';
import { colors, fonts } from '../../../theme';
import type { ChannelItem, ChannelKind } from '../../../types/chat';
import { formatListTime } from '../../../utils/time';

const FAB_SIZE = 56;
const FAB_MARGIN = 16;
const LIST_BOTTOM_PADDING = FAB_SIZE + FAB_MARGIN * 2; // 88: el FAB mide 56, está a 16 del borde y deja 16 libres
// El botón flotante no está en el plan; se conserva por pedido explícito. Para retirarlo, cambiar a false.
const SHOW_FAB = true;

type Filter = 'Todos' | 'Materias' | 'Grupos' | 'Oficiales';

const FILTERS: Filter[] = ['Todos', 'Materias', 'Grupos', 'Oficiales'];

const FILTER_KIND: Partial<Record<Filter, ChannelKind>> = {
  Materias: 'Materia',
  Grupos: 'Grupo',
  Oficiales: 'Oficial',
};

const PILL_BG: Record<ChannelKind, string> = {
  Materia: 'bg-udec-secondary-soft',
  Grupo: 'bg-udec-accent-soft',
  Oficial: 'bg-udec-primary-soft',
};

const PILL_TEXT: Record<ChannelKind, string> = {
  Materia: 'text-udec-secondary',
  Grupo: 'text-udec-on-accent',
  Oficial: 'text-udec-primary',
};

const SKELETON_ROWS = [0, 1, 2, 3, 4];

// TODO(fase 5): mover a src/utils/ junto con el resto de helpers de texto si hace falta reutilizarlo.
function normalize(value: string): string {
  return value.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function firstName(full: string): string {
  return full.trim().split(' ')[0];
}

function matchesFilter(kind: ChannelKind, filter: Filter): boolean {
  const wanted = FILTER_KIND[filter];
  return wanted === undefined || wanted === kind;
}

/** Fijados primero; dentro de cada grupo, el último mensaje más reciente primero. */
function sortChannels(channels: ChannelItem[]): ChannelItem[] {
  return [...channels].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return b.lastMessageAt.getTime() - a.lastMessageAt.getTime();
  });
}

function buildRowLabel(item: ChannelItem, preview: string, time: string): string {
  const parts = [item.name, item.kind];
  if (item.readOnly) parts.push('solo lectura');
  if (item.unread > 0) {
    parts.push(item.unread === 1 ? '1 mensaje sin leer' : `${item.unread} mensajes sin leer`);
  }
  if (preview) parts.push(preview);
  parts.push(time);
  return parts.join(', ');
}

type ChannelRowProps = {
  item: ChannelItem;
  onPress: (id: string) => void;
};

const ChannelRow = memo(function ChannelRow({ item, onPress }: ChannelRowProps) {
  const time = formatListTime(item.lastMessageAt, new Date());
  const author = item.lastMessage && item.lastMessage.authorName ? firstName(item.lastMessage.authorName) : '';
  const text = item.lastMessage ? item.lastMessage.text : '';
  const preview = author ? `${author}: ${text}` : text;
  const unread = item.unread;

  return (
    <Pressable
      className="min-h-[72px] flex-row items-center gap-3 px-4 py-3 active:bg-udec-surface"
      accessibilityRole="button"
      accessibilityLabel={buildRowLabel(item, preview, time)}
      onPress={() => onPress(item.id)}
    >
      <View
        className="h-12 w-12 items-center justify-center rounded-control"
        style={{ backgroundColor: colors[item.color] }}
      >
        <Text weight="bold" className={`text-sm ${item.color === 'yellow' ? 'text-udec-on-accent' : 'text-white'}`}>
          {item.short}
        </Text>
      </View>
      <View className="flex-1 gap-1">
        <View className="flex-row items-center gap-2">
          <Text weight="bold" numberOfLines={1} className="flex-1 text-base text-udec-text">
            {item.name}
          </Text>
          {item.pinned ? <MaterialIcons name="push-pin" size={14} color={colors.muted} /> : null}
          <Text weight={unread > 0 ? 'bold' : 'medium'} className={`text-xs ${unread > 0 ? 'text-udec-secondary' : 'text-udec-muted'}`}>
            {time}
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className={`h-6 justify-center rounded-pill px-2.5 ${PILL_BG[item.kind]}`}>
            <Text weight="semibold" className={`text-xs ${PILL_TEXT[item.kind]}`}>
              {item.kind}
            </Text>
          </View>
          {item.readOnly ? <MaterialIcons name="lock-outline" size={14} color={colors.muted} /> : null}
        </View>
        <View className="flex-row items-center gap-2">
          <Text numberOfLines={1} className="flex-1 text-sm text-udec-muted">
            {author ? (
              <Text weight="semibold" className="text-sm text-udec-text">
                {`${author}: `}
              </Text>
            ) : null}
            {text}
          </Text>
          {unread > 0 ? (
            <View className="h-[22px] min-w-[22px] items-center justify-center rounded-pill bg-udec-secondary px-1.5">
              <Text weight="bold" className="text-xs text-white">
                {unread > 99 ? '99+' : String(unread)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
});

function RowDivider() {
  return <View className="ml-[76px] h-px bg-udec-border" />;
}

function EmptyList() {
  return (
    <View className="items-center gap-3 px-8 py-12">
      <MaterialIcons name="search-off" size={40} color={colors.muted} />
      <Text weight="medium" className="text-center text-sm text-udec-muted">
        No hay canales con ese nombre.
      </Text>
    </View>
  );
}

function SkeletonList() {
  return (
    <View className="flex-1">
      {SKELETON_ROWS.map((row) => (
        <View key={row} className="min-h-[72px] flex-row items-center gap-3 px-4 py-3">
          <View className="h-12 w-12 rounded-control bg-udec-surface" />
          <View className="flex-1 gap-2">
            <View className="h-3 rounded-pill bg-udec-surface" style={{ width: '60%' }} />
            <View className="h-3 rounded-pill bg-udec-surface" style={{ width: '85%' }} />
          </View>
        </View>
      ))}
    </View>
  );
}

// TODO(fase 5): marcar canal como leído en users/{uid}/channelReads/{channelId}.
function markChannelRead(channelId: string): void {
  void channelId;
}

export default function ChatsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('Todos');
  const [searchFocused, setSearchFocused] = useState(false);
  // TODO(fase 5): sustituir por el estado de carga de useChannels().
  const isLoading = false;
  // TODO(fase 5): StateView variant="error" cuando falle la carga (el plan no define el texto).

  const visibleChannels = useMemo(() => {
    const needle = normalize(query.trim());
    const matching = MOCK_CHANNELS.filter(
      (item) => matchesFilter(item.kind, filter) && normalize(item.name).includes(needle),
    );
    return sortChannels(matching);
  }, [query, filter]);

  const handleOpenChannel = useCallback(
    (id: string) => {
      markChannelRead(id);
      router.push(('/chat/' + id) as Href);
    },
    [router],
  );

  const handleCreateChannel = useCallback(() => {
    // TODO: no hay flujo de creación en el plan; definir con el equipo
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ChannelItem>) => <ChannelRow item={item} onPress={handleOpenChannel} />,
    [handleOpenChannel],
  );

  return (
    <View className="flex-1 bg-udec-surface">
      <View className="flex-1 w-full bg-udec-background">
        <View className="overflow-hidden bg-udec-primary" style={{ paddingTop: insets.top }}>
          <View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/10"
          />
          <View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="absolute -right-8 -top-8 h-40 w-40 rounded-full border border-white/10"
          />
          <View
            pointerEvents="none"
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full border border-white/10"
          />
          <View className="h-[72px] flex-row items-center gap-3 px-4">
            <View
              accessible={false}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              className="h-10 w-10 items-center justify-center rounded-control bg-udec-accent"
            >
              <Text weight="extrabold" className="text-xl text-udec-primary">
                U
              </Text>
            </View>
            <View className="flex-1">
              <Text weight="extrabold" accessibilityRole="header" className="text-lg tracking-tight text-white">
                UDEC APP
              </Text>
              <Text weight="medium" className="text-xs text-udec-primary-soft">
                Chats por materia y grupo
              </Text>
            </View>
          </View>
        </View>

        <View className="border-b border-udec-border bg-udec-background px-4 pb-3 pt-3">
          <View
            className={`min-h-[44px] flex-row items-center rounded-control border pl-3.5 pr-1 ${
              searchFocused ? 'border-udec-primary bg-udec-background' : 'border-udec-border bg-udec-field'
            }`}
          >
            <MaterialIcons name="search" size={20} color={colors.muted} />
            <TextInput
              accessibilityLabel="Buscar materia o grupo"
              value={query}
              onChangeText={setQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar materia o grupo"
              placeholderTextColor={colors.muted}
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
                className="h-11 w-11 items-center justify-center rounded-full active:bg-udec-surface"
              >
                <MaterialIcons name="close" size={20} color={colors.muted} />
              </Pressable>
            ) : null}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            className="-mx-4 mt-3"
            contentContainerClassName="gap-2 px-4"
          >
            {FILTERS.map((option) => {
              const active = option === filter;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  accessibilityLabel={option}
                  accessibilityState={{ selected: active }}
                  onPress={() => setFilter(option)}
                  className={
                    active
                      ? 'h-11 items-center justify-center rounded-pill bg-udec-primary px-4'
                      : 'h-11 items-center justify-center rounded-pill border border-udec-border bg-udec-surface px-4 active:bg-udec-primary-soft'
                  }
                >
                  <Text weight="semibold" className={active ? 'text-sm text-white' : 'text-sm text-udec-text'}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View className="px-4 pb-2 pt-4">
          <Text weight="bold" className="text-xs tracking-wider text-udec-muted">
            TUS CANALES · SEMESTRE 2026-2
          </Text>
        </View>

        {isLoading ? (
          <SkeletonList />
        ) : (
          <FlatList
            data={visibleChannels}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={RowDivider}
            ListEmptyComponent={EmptyList}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            initialNumToRender={10}
            windowSize={7}
            removeClippedSubviews
            contentContainerStyle={{ paddingBottom: LIST_BOTTOM_PADDING }}
            className="flex-1"
          />
        )}

        {SHOW_FAB ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Crear nuevo mensaje o canal"
            onPress={handleCreateChannel}
            className="absolute bottom-4 right-4 h-14 w-14 items-center justify-center rounded-pill bg-udec-accent shadow-md active:opacity-90"
          >
            <MaterialIcons name="edit" size={24} color={colors['on-accent']} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
