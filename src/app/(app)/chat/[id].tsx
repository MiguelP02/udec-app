import { memo, useCallback, useMemo, useRef, useState, type ComponentProps } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
  View,
  type ListRenderItemInfo,
  type TextInputInstance,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatFilesTab, type ChatFilesStatus } from '../../../components/chat-files-tab';
import { SegmentedControl } from '../../../components/segmented-control';
import { Text } from '../../../components/ui/text';
import { CHANNEL_INFO, MOCK_FILES, MOCK_MESSAGES } from '../../../data/mock-chats';
import { colors, fonts } from '../../../theme';
import type { AuthorRole, ChannelInfo, ChatFile, Message } from '../../../types/chat';
import { initialsFor } from '../../../utils/initials';
import { withDaySeparators, type ChatItem } from '../../../utils/day-separators';
import { formatClock } from '../../../utils/time';

type Tab = 'messages' | 'files';

type MessageRow = Message & { key: string };

const CURRENT_USER_ID = 'me';
const CURRENT_USER_NAME = 'Miguel Páez';
const CURRENT_USER_ROLE: AuthorRole = 'estudiante';

const SEGMENTS = [
  { key: 'messages', label: 'Mensajes' },
  { key: 'files', label: 'Archivos' },
];

const FILE_ICON: Partial<Record<string, ComponentProps<typeof MaterialIcons>['name']>> = {
  pdf: 'picture-as-pdf',
  doc: 'description',
  img: 'image',
  sql: 'storage',
};

/** 1.234 -> "1.234" (punto de miles). */
function formatMemberCount(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// TODO(fase 5): marcar canal como leído en users/{uid}/channelReads/{channelId}.
function markChannelRead(channelId: string): void {
  void channelId;
}

type ChatHeaderProps = {
  info: ChannelInfo;
  onBack: () => void;
};

function ChatHeader({ info, onBack }: ChatHeaderProps) {
  const insets = useSafeAreaInsets();
  return (
    <View className="bg-udec-primary" style={{ paddingTop: insets.top }}>
      <View className="h-16 flex-row items-center gap-1 pl-1 pr-4">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={onBack}
          className="h-11 w-11 items-center justify-center rounded-full active:bg-white/10"
        >
          <MaterialIcons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <View
          accessible={false}
          className="h-10 w-10 items-center justify-center rounded-control"
          style={{ backgroundColor: colors[info.color] }}
        >
          <Text weight="bold" className={`text-sm ${info.color === 'yellow' ? 'text-udec-on-accent' : 'text-white'}`}>
            {info.short}
          </Text>
        </View>
        <View className="ml-2 flex-1">
          <Text weight="bold" accessibilityRole="header" numberOfLines={1} className="text-base text-white">
            {info.name}
          </Text>
          <Text weight="medium" numberOfLines={1} className="text-xs text-udec-primary-soft">
            {`${formatMemberCount(info.memberCount)} integrantes · ${info.kind}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

type PinnedNoticeProps = {
  pinned: { by: string; text: string };
  expanded: boolean;
  onToggle: () => void;
};

function PinnedNotice({ pinned, expanded, onToggle }: PinnedNoticeProps) {
  return (
    <View className="bg-udec-accent-soft pl-4">
      <Pressable
        className="min-h-[44px] flex-row items-center gap-2"
        accessibilityRole="button"
        accessibilityLabel={expanded ? 'Ocultar aviso completo' : 'Mostrar aviso completo'}
        accessibilityState={{ expanded }}
        onPress={onToggle}
      >
        <MaterialIcons name="push-pin" size={18} color={colors['on-accent']} />
        <View className="flex-1 py-2.5">
          {expanded ? (
            <Text weight="extrabold" className="mb-0.5 text-xs text-udec-on-accent">
              {`FIJADO POR ${pinned.by.toUpperCase()} (DOCENTE)`}
            </Text>
          ) : null}
          <Text
            weight="medium"
            numberOfLines={expanded ? undefined : 1}
            className="text-sm text-udec-on-accent"
          >
            {pinned.text}
          </Text>
        </View>
        <View className="h-11 w-11 items-center justify-center">
          <MaterialIcons name={expanded ? 'expand-less' : 'expand-more'} size={24} color={colors['on-accent']} />
        </View>
      </Pressable>
    </View>
  );
}

function DayChip({ label }: { label: string }) {
  return (
    <View className="items-center pb-2 pt-1">
      <View className="h-7 justify-center rounded-pill border border-udec-border bg-udec-background px-3">
        <Text weight="semibold" className="text-xs text-udec-muted">
          {label}
        </Text>
      </View>
    </View>
  );
}

function RolePill({ role }: { role: 'docente' | 'oficial' }) {
  const oficial = role === 'oficial';
  return (
    <View className={`rounded-pill px-2 py-0.5 ${oficial ? 'bg-udec-primary-soft' : 'bg-udec-accent-soft'}`}>
      <Text weight="bold" className={`text-[11px] ${oficial ? 'text-udec-primary' : 'text-udec-on-accent'}`}>
        {oficial ? 'Oficial' : 'Docente'}
      </Text>
    </View>
  );
}

type AttachedFileProps = {
  file: ChatFile;
  onDownload: (file: ChatFile) => void;
};

function AttachedFile({ file, onDownload }: AttachedFileProps) {
  return (
    <View className="mt-2 flex-row items-center gap-2 border-t border-udec-border pt-2">
      <MaterialIcons name={FILE_ICON[file.type] ?? 'insert-drive-file'} size={28} color={colors[file.color]} />
      <View className="flex-1">
        <Text weight="semibold" numberOfLines={1} className="text-sm text-udec-text">
          {file.name}
        </Text>
        <Text className="text-xs text-udec-muted">{file.size}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Descargar ${file.name}`}
        onPress={() => onDownload(file)}
        className="h-11 w-11 items-center justify-center rounded-full active:bg-udec-primary-soft"
      >
        <MaterialIcons name="file-download" size={22} color={colors.primary} />
      </Pressable>
    </View>
  );
}

type MessageBubbleProps = {
  message: Message;
  onDownload: (file: ChatFile) => void;
};

const MessageBubble = memo(function MessageBubble({ message, onDownload }: MessageBubbleProps) {
  const time = formatClock(message.createdAt);

  if (message.authorId === CURRENT_USER_ID) {
    return (
      <View className="items-end pb-2">
        <View className="rounded-bubble bg-udec-primary px-3 py-2.5" style={{ maxWidth: '82%' }}>
          <Text className="text-[15px] leading-5 text-white">{message.text}</Text>
          <Text weight="medium" className="mt-1 self-end text-xs text-udec-primary-soft">
            {time}
          </Text>
        </View>
      </View>
    );
  }

  const docente = message.authorRole === 'docente';

  return (
    <View className="flex-row items-end gap-2 pb-2" style={{ maxWidth: '88%' }}>
      <View
        className={`h-8 w-8 items-center justify-center rounded-pill ${docente ? 'bg-udec-secondary' : 'bg-udec-primary-soft'}`}
      >
        <Text weight="bold" className={`text-xs ${docente ? 'text-white' : 'text-udec-primary'}`}>
          {initialsFor(message.authorName)}
        </Text>
      </View>
      <View className="flex-shrink gap-1">
        <View className="flex-row flex-wrap items-center gap-1.5 pl-1">
          <Text weight="bold" className="text-xs text-udec-text">
            {message.authorName}
          </Text>
          {message.authorRole === 'docente' || message.authorRole === 'oficial' ? (
            <RolePill role={message.authorRole} />
          ) : null}
        </View>
        <View className="rounded-bubble border border-udec-border bg-udec-background px-3 py-2.5">
          {message.text ? <Text className="text-[15px] leading-5 text-udec-text">{message.text}</Text> : null}
          {message.file ? <AttachedFile file={message.file} onDownload={onDownload} /> : null}
          <Text weight="medium" className="mt-1 self-end text-xs text-udec-muted">
            {time}
          </Text>
        </View>
      </View>
    </View>
  );
});

type ComposerProps = {
  draft: string;
  onChangeDraft: (text: string) => void;
  onSend: () => void;
  onAttach: () => void;
};

function Composer({ draft, onChangeDraft, onSend, onAttach }: ComposerProps) {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInputInstance>(null);
  const [focused, setFocused] = useState(false);
  const canSend = draft.trim().length > 0;

  const handleSendPress = () => {
    if (!canSend) return;
    onSend();
    inputRef.current?.focus();
  };

  return (
    <View
      className="flex-row items-end gap-1 border-t border-udec-border bg-udec-background px-2 pt-2"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Adjuntar archivo"
        onPress={onAttach}
        className="h-11 w-11 items-center justify-center rounded-full active:bg-udec-surface"
      >
        <MaterialIcons name="attach-file" size={24} color={colors.muted} />
      </Pressable>
      <View
        className={`min-h-[44px] flex-1 justify-center rounded-control border px-3.5 ${
          focused ? 'border-udec-primary bg-udec-background' : 'border-udec-border bg-udec-field'
        }`}
      >
        <TextInput
          ref={inputRef}
          accessibilityLabel="Escribe un mensaje"
          placeholder="Escribe un mensaje"
          placeholderTextColor={colors.muted}
          value={draft}
          onChangeText={onChangeDraft}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline
          style={{ fontFamily: fonts.medium, maxHeight: 120 }}
          className="py-2.5 text-[15px] text-udec-text"
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Enviar mensaje"
        accessibilityState={{ disabled: !canSend }}
        disabled={!canSend}
        onPress={handleSendPress}
        className={`h-11 w-11 items-center justify-center rounded-pill bg-udec-primary active:bg-udec-primary-hover ${
          canSend ? '' : 'opacity-50'
        }`}
      >
        <MaterialIcons name="send" size={20} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

function ReadOnlyNotice() {
  const insets = useSafeAreaInsets();
  return (
    <View className="border-t border-udec-border bg-udec-surface px-4 py-3" style={{ paddingBottom: insets.bottom + 12 }}>
      <Text weight="medium" className="text-center text-sm text-udec-muted">
        Solo las cuentas oficiales pueden publicar en este canal
      </Text>
    </View>
  );
}

export default function ChatDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const info = CHANNEL_INFO[id];

  const [tab, setTab] = useState<Tab>('messages');
  const [draft, setDraft] = useState('');
  const [pinnedExpanded, setPinnedExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => MOCK_MESSAGES[id] ?? []);
  // TODO(fase 5): sustituir por el estado de carga de los mensajes del canal.
  const isLoading = false;
  // TODO(fase 5): StateView variant="error" para los mensajes (el plan no define el texto).
  // TODO(fase 5): sustituir por el estado de carga de los archivos del canal.
  const filesStatus: ChatFilesStatus = 'ready';

  useFocusEffect(
    useCallback(() => {
      markChannelRead(id);
    }, [id]),
  );

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/chats' as Href);
    }
  }, [router]);

  const handleTabChange = useCallback((key: string) => {
    setTab(key === 'files' ? 'files' : 'messages');
  }, []);

  const togglePinned = useCallback(() => {
    setPinnedExpanded((value) => !value);
  }, []);

  const handleSend = useCallback(() => {
    const text = draft.trim();
    if (text.length === 0) return;
    // TODO(fase 5): sendMessage(channelId, text) escribe en Firestore y actualiza lastMessage.
    const message: Message = {
      id: `local-${Date.now()}`,
      authorId: CURRENT_USER_ID,
      authorName: CURRENT_USER_NAME,
      authorRole: CURRENT_USER_ROLE,
      text,
      file: null,
      createdAt: new Date(),
    };
    setMessages((previous) => [message, ...previous]);
    setDraft('');
  }, [draft]);

  const handleAttach = useCallback(() => {
    // TODO(fase 5): attachFile() sube a Cloudinary y muestra "Subiendo archivo…".
  }, []);

  const handleDownloadFile = useCallback((file: ChatFile) => {
    // TODO(fase 5): WebBrowser.openBrowserAsync(file.url) cuando el archivo tenga url.
    void file;
  }, []);

  const handleRetryFiles = useCallback(() => {
    // TODO Fase 5: volver a montar el hook de archivos.
  }, []);

  const handleMissingFileUrl = useCallback(() => {
    // TODO Fase 5: toast "Archivo de ejemplo (sin enlace)".
  }, []);

  const items = useMemo<ChatItem<MessageRow>[]>(
    () => withDaySeparators(messages.map((message) => ({ ...message, key: message.id })), new Date()),
    [messages],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ChatItem<MessageRow>>) => {
      if (item.kind === 'day') return <DayChip label={item.label} />;
      return <MessageBubble message={item.message} onDownload={handleDownloadFile} />;
    },
    [handleDownloadFile],
  );

  if (!info) return null;

  const canWrite = !info.readOnly || CURRENT_USER_ROLE === 'oficial';
  const files = MOCK_FILES[id] ?? [];

  return (
    <View className="flex-1 bg-udec-surface">
      <KeyboardAvoidingView
        className="flex-1 w-full bg-udec-background"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ChatHeader info={info} onBack={handleBack} />

        <View className="border-b border-udec-border bg-udec-background px-4 py-3">
          <SegmentedControl
            options={SEGMENTS}
            value={tab}
            onChange={handleTabChange}
            accessibilityLabel="Secciones del chat"
          />
        </View>

        {tab === 'messages' ? (
          isLoading ? null : (
            <>
              {info.pinned ? (
                <PinnedNotice pinned={info.pinned} expanded={pinnedExpanded} onToggle={togglePinned} />
              ) : null}
              <FlatList
                inverted
                data={items}
                keyExtractor={(item) => item.key}
                renderItem={renderItem}
                className="flex-1 bg-udec-surface"
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="interactive"
                initialNumToRender={12}
                windowSize={9}
              />
              {canWrite ? (
                <Composer
                  draft={draft}
                  onChangeDraft={setDraft}
                  onSend={handleSend}
                  onAttach={handleAttach}
                />
              ) : (
                <ReadOnlyNotice />
              )}
            </>
          )
        ) : (
          <View className="flex-1">
            <ChatFilesTab
              files={files}
              status={filesStatus}
              onRetry={handleRetryFiles}
              onMissingUrl={handleMissingFileUrl}
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}
