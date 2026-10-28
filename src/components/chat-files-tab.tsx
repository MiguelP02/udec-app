import { memo, useCallback } from 'react';
import { FlatList, Linking, Pressable, View, type ListRenderItemInfo } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import type { ChatFile, FileColor } from '@/types/chat';
import { StateView } from './state-view';

export type ChatFilesStatus = 'loading' | 'error' | 'ready';

export type ChatFilesTabProps = {
  files: ChatFile[];
  status: ChatFilesStatus;
  /** Se llama al tocar "Reintentar". */
  onRetry: () => void;
  /** Se llama al tocar un archivo sin url; el host muestra el aviso. */
  onMissingUrl?: () => void;
};

const BADGE_BG: Partial<Record<FileColor, string>> = {
  red: 'bg-udec-red',
  blue: 'bg-udec-primary',
  green: 'bg-udec-secondary',
  purple: 'bg-udec-purple',
  rust: 'bg-udec-rust',
};

/** Tres primeras letras del tipo, en mayúsculas: "pdf" -> "PDF". */
function badgeLabel(type: string): string {
  return type.slice(0, 3).toUpperCase();
}

function Separator() {
  return <View className="mx-4 h-px bg-udec-border" />;
}

type FileRowProps = {
  file: ChatFile;
  onPress: (file: ChatFile) => void;
};

const FileRow = memo(function FileRow({ file, onPress }: FileRowProps) {
  return (
    <Pressable
      className="min-h-[64px] flex-row items-center gap-3.5 px-4 py-3 active:bg-udec-surface"
      accessibilityRole="button"
      accessibilityLabel={`${file.name}, ${file.size}, subido por ${file.uploadedBy}`}
      accessibilityHint="Abre el archivo"
      onPress={() => onPress(file)}
    >
      <View
        importantForAccessibility="no-hide-descendants"
        className={`h-11 w-11 items-center justify-center rounded-control ${BADGE_BG[file.color] ?? 'bg-udec-primary'}`}
      >
        <Text weight="bold" className="text-xs tracking-wider text-white">
          {badgeLabel(file.type)}
        </Text>
      </View>
      <View className="min-w-0 flex-1 justify-center">
        <Text weight="semibold" numberOfLines={1} className="text-[15px] leading-5 text-udec-text">
          {file.name}
        </Text>
        <Text numberOfLines={1} className="mt-0.5 text-xs leading-4 text-udec-muted">
          {`${file.size} · Subido por ${file.uploadedBy}`}
        </Text>
      </View>
    </Pressable>
  );
});

export function ChatFilesTab({ files, status, onRetry, onMissingUrl }: ChatFilesTabProps) {
  const insets = useSafeAreaInsets();

  const handlePress = useCallback(
    (file: ChatFile) => {
      if (!file.url) {
        onMissingUrl?.();
        return;
      }
      // STUB documentado: abre el archivo en el navegador del sistema.
      // TODO(fase 5): cambiar por WebBrowser.openBrowserAsync(file.url) al integrar Cloudinary.
      Linking.openURL(file.url).catch(() => undefined);
    },
    [onMissingUrl],
  );

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<ChatFile>) => <FileRow file={item} onPress={handlePress} />,
    [handlePress],
  );

  return (
    <View className="flex-1 bg-udec-background">
      {status === 'loading' ? <StateView variant="loading" title="Cargando…" rows={4} /> : null}

      {status === 'error' ? (
        <StateView
          variant="error"
          title="No pudimos cargar los archivos"
          message="Revisa tu conexión e intenta de nuevo."
          actionLabel="Reintentar"
          onAction={onRetry}
        />
      ) : null}

      {status === 'ready' && files.length === 0 ? (
        <StateView variant="empty" title="Todavía no hay archivos" message="Aún no hay archivos en este canal." />
      ) : null}

      {status === 'ready' && files.length > 0 ? (
        <FlatList
          className="flex-1"
          data={files}
          keyExtractor={(file) => file.id}
          renderItem={renderItem}
          ItemSeparatorComponent={Separator}
          contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </View>
  );
}
